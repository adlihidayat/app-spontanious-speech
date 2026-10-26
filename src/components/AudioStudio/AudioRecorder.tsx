import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { Button } from '../ui/button';
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
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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

          const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
          gradient.addColorStop(0, '#18181b');
          gradient.addColorStop(1, '#71717a');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.roundRect(x, canvas.height - barHeight, barWidth, barHeight, [2, 2, 0, 0]);
          ctx.fill();

          x += barWidth + 1.5;
        }
      };

      draw();
    } catch (e) {
      console.warn('Waveform visualizer setup failed', e);
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

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 60) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Microphone error:', err);
      const isPermissionDenied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
      setMicError(
        isPermissionDenied
          ? 'Akses mikrofon ditolak oleh browser. Mohon izinkan izin mikrofon.'
          : 'Perangkat mikrofon tidak ditemukan atau tidak didukung.'
      );
      stopStreamsAndAudioContext();
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-3">
      {micError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{micError}</span>
        </div>
      )}

      {!isRecording ? (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/70">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-9 h-9 rounded-xl bg-white border border-neutral-200/80 shadow-2xs flex items-center justify-center text-neutral-800 flex-shrink-0">
              <Mic className="w-4 h-4 text-neutral-800" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-900 leading-none">
                {hasRecorded ? 'Audio Siap Ditranskripsi' : 'Mikrofon Siap'}
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                {hasRecorded
                  ? 'Putar rekaman di bawah atau rekam ulang jika perlu'
                  : 'Klik tombol rekam lalu ucapkan kalimat di atas'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={startRecording}
            disabled={isProcessing}
            size="default"
            className="w-full sm:w-auto h-10 px-5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 font-medium text-xs sm:text-sm shadow-xs gap-2 flex-shrink-0 cursor-pointer"
          >
            {hasRecorded ? (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t('re_record')}</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span>{t('record_btn')}</span>
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-red-50/40 border border-red-200/80">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-red-200 text-red-600 text-xs font-mono font-medium shadow-2xs flex-shrink-0">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>{formatTimer(recordingSeconds)}</span>
            </div>
            <canvas
              ref={canvasRef}
              width={240}
              height={32}
              className="h-8 w-36 sm:w-56"
            />
          </div>

          <Button
            type="button"
            onClick={stopRecording}
            variant="destructive"
            className="w-full sm:w-auto h-10 px-5 rounded-xl font-medium text-xs sm:text-sm gap-2 shadow-xs flex-shrink-0 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{t('stop_btn')} ({formatTimer(recordingSeconds)})</span>
          </Button>
        </div>
      )}
    </div>
  );
};
