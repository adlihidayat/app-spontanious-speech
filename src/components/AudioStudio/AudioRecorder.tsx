import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Mic, Square, RotateCcw, AlertTriangle } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (audioBlob: Blob, audioUrl: string) => void;
  isProcessing?: boolean;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioReady,
  isProcessing = false,
}) => {
  const { t } = useLanguage();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopStreamsAndAudioContext();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  const stopStreamsAndAudioContext = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const startWaveformVisualizer = (stream: MediaStream) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyserRef.current = analyser;
      analyser.fftSize = 256;

      const source = audioCtx.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!canvasRef.current || !analyserRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        animationFrameRef.current = requestAnimationFrame(draw);
        analyserRef.current.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.2;
        let barHeight: number;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * canvas.height * 0.9;

          // Gradient color from indigo to emerald
          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#4f46e5'); // Indigo-600
          gradient.addColorStop(1, '#10b981'); // Emerald-500

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          x += barWidth + 1.5;
        }
      };

      draw();
    } catch (e) {
      console.warn('Waveform visualizer setup failed, fallback to animation', e);
    }
  };

  const startRecording = async () => {
    setMicError(null);
    audioChunksRef.current = [];
    setRecordingSeconds(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      // Determine mime type
      const mimeTypes = ['audio/webm;codecs=opus', 'audio/webm', 'audio/ogg;codecs=opus', 'audio/mp4'];
      const supportedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || '';

      const recorder = new MediaRecorder(stream, supportedMime ? { mimeType: supportedMime } : undefined);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        onAudioReady(blob, url);
        setHasRecorded(true);
        stopStreamsAndAudioContext();
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      };

      recorder.start(100);
      setIsRecording(true);
      startWaveformVisualizer(stream);

      // Start timer
      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.error('Microphone access denied or error:', err);
      const message = err instanceof Error ? err.message : 'Izin mikrofon ditolak atau tidak ditemukan.';
      setMicError(`Gagal mengakses mikrofon: ${message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {micError && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {/* Visualizer Canvas & Status Box */}
      <div className="relative h-28 w-full rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center overflow-hidden shadow-inner p-4">
        {/* Canvas for real-time waveform */}
        <canvas
          ref={canvasRef}
          width={420}
          height={80}
          className={`w-full h-full transition-opacity duration-300 ${isRecording ? 'opacity-90' : 'opacity-20'}`}
        />

        {/* Center Overlay info */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {isRecording ? (
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="font-mono text-sm font-bold tracking-wider">
                  {formatTimer(recordingSeconds)}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium tracking-wide">
                {t('recording_active')}
              </span>
            </div>
          ) : (
            <div className="text-center text-slate-400 text-xs font-medium space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-slate-300">
                <Mic className="w-4 h-4 text-indigo-400" />
                <span>Mikrofon Siap</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Klik tombol di bawah dan baca kalimat dengan intonasi spontan/santai
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Recording Control Buttons */}
      <div className="flex items-center justify-center gap-3">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-200 hover:shadow-indigo-300 disabled:opacity-50 transition-all cursor-pointer"
          >
            <Mic className="w-4 h-4" />
            <span>{hasRecorded ? t('re_record') : t('record_btn')}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={stopRecording}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 animate-pulse transition-all cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>{t('stop_btn')} ({formatTimer(recordingSeconds)})</span>
          </button>
        )}

        {hasRecorded && !isRecording && (
          <button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            className="p-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-colors"
            title="Rekam Ulang Suara"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
