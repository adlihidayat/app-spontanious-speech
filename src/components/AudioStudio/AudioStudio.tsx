import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { AppMode, PromptItem } from "../../types";
import { PromptTeleprompter } from "./PromptTeleprompter";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import {
  Plus,
  Mic,
  Square,
  ArrowUp,
  Loader2,
  Play,
  Pause,
  X,
  AlertCircle,
  FileAudio,
  Sparkles,
} from "lucide-react";

interface AudioStudioProps {
  mode: AppMode;
  currentPrompt: PromptItem;
  groundTruth: string;
  onSelectPrompt: (prompt: PromptItem) => void;
  onChangeGroundTruth: (text: string) => void;
  onRunComparison: (audio: Blob | File, duration?: number) => void;
  isAnalyzing: boolean;
}

export const AudioStudio: React.FC<AudioStudioProps> = ({
  mode,
  currentPrompt,
  groundTruth,
  onSelectPrompt,
  onChangeGroundTruth,
  onRunComparison,
  isAnalyzing,
}) => {
  const { t } = useLanguage();

  // Audio source state
  const [audioSource, setAudioSource] = useState<{
    blob: Blob | File;
    url: string;
    name: string;
  } | null>(null);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);

  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const SUPPORTED_EXTENSIONS = [".wav", ".mp3", ".m4a", ".ogg"];
  const MAX_FILE_SIZE_MB = 25;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopStreamsAndAudioContext();
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Reset audio playback when source changes
  useEffect(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [audioSource?.url]);

  const stopStreamsAndAudioContext = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  // Audio waveform visualizer while recording
  useEffect(() => {
    if (!isRecording) return;

    let animId: number;
    let localAudioCtx: AudioContext | null = null;
    let localSource: MediaStreamAudioSourceNode | null = null;

    const stream = streamRef.current;
    if (!stream) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;

      if (AudioCtx) {
        const audioCtx = new AudioCtx();
        localAudioCtx = audioCtx;
        audioContextRef.current = audioCtx;

        if (audioCtx.state === "suspended") {
          audioCtx.resume().catch(() => {});
        }

        const analyser = audioCtx.createAnalyser();
        analyserRef.current = analyser;
        analyser.fftSize = 128; // 64 frequency bins
        analyser.smoothingTimeConstant = 0.75;
        analyser.minDecibels = -85;
        analyser.maxDecibels = -15;

        const source = audioCtx.createMediaStreamSource(stream);
        localSource = source;
        sourceRef.current = source;
        source.connect(analyser);

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const numBars = 16;
        const barWidth = 5;
        const minHeight = 4;
        let frameCount = 0;

        const draw = () => {
          animId = requestAnimationFrame(draw);
          animationFrameRef.current = animId;
          frameCount++;

          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          analyser.getByteFrequencyData(dataArray);

          ctx.clearRect(0, 0, canvas.width, canvas.height);

          const totalWidth = canvas.width;
          const totalHeight = canvas.height;
          const spacing = (totalWidth - numBars * barWidth) / (numBars + 1);

          for (let i = 0; i < numBars; i++) {
            // Sample speech frequency bins (bins 1 to 24 cover formants ~150Hz to 4kHz)
            const binIndex = Math.min(
              Math.floor(1 + Math.pow(i / (numBars - 1), 1.2) * 22),
              bufferLength - 2,
            );
            const rawVal = Math.max(
              dataArray[binIndex] || 0,
              dataArray[binIndex + 1] || 0,
            );

            // Responsive normalization
            const signal = Math.min(1, Math.max(0, (rawVal - 15) / 120));

            // Subtle idle ripple when quiet so visualizer always indicates microphone is live
            const idleRipple = Math.sin(frameCount * 0.12 + i * 0.5) * 1.0;
            const currentMin = Math.max(3, minHeight + idleRipple);

            const dynamicHeight = signal * (totalHeight - 4);
            const barHeight = Math.min(
              totalHeight - 4,
              Math.max(currentMin, dynamicHeight),
            );

            const x = spacing + i * (barWidth + spacing);
            const y = (totalHeight - barHeight) / 2;

            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, "#f87171");
            gradient.addColorStop(1, "#dc2626");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            if (typeof ctx.roundRect === "function") {
              ctx.roundRect(x, y, barWidth, barHeight, 2.5);
            } else {
              ctx.rect(x, y, barWidth, barHeight);
            }
            ctx.fill();
          }
        };

        draw();
      }
    } catch (e) {
      console.warn("Waveform visualizer setup failed", e);
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (localSource) {
        try {
          localSource.disconnect();
        } catch {
          // ignore
        }
      }
      if (localAudioCtx && localAudioCtx.state !== "closed") {
        localAudioCtx.close().catch(() => {});
      }
    };
  }, [isRecording]);

  const startRecording = async () => {
    setErrorMessage(null);
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

      const mimeTypes = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];
      const supportedMime =
        mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || "";

      const recorder = new MediaRecorder(
        stream,
        supportedMime ? { mimeType: supportedMime } : undefined,
      );
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setAudioSource({
          blob,
          url,
          name: t("voice_recording_name"),
        });
        stopStreamsAndAudioContext();
        if (animationFrameRef.current)
          cancelAnimationFrame(animationFrameRef.current);
      };

      recorder.start(100);
      setIsRecording(true);

      timerIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 14) {
            stopRecording();
            return 15;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error("Microphone error:", err);
      const isPermissionDenied =
        err instanceof DOMException &&
        (err.name === "NotAllowedError" ||
          err.name === "PermissionDeniedError");
      setErrorMessage(
        isPermissionDenied ? t("mic_error_denied") : t("mic_error_not_found"),
      );
      stopStreamsAndAudioContext();
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingSeconds > 0) {
      setAudioDuration(recordingSeconds);
    }
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  const validateAndHandleFile = (file: File) => {
    setErrorMessage(null);
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (
      !SUPPORTED_EXTENSIONS.includes(ext) &&
      !file.type.startsWith("audio/")
    ) {
      setErrorMessage(
        t("upload_format_error", { formats: SUPPORTED_EXTENSIONS.join(", ") }),
      );
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(t("upload_size_error", { max: MAX_FILE_SIZE_MB }));
      return;
    }

    const audioUrl = URL.createObjectURL(file);
    setAudioSource({
      blob: file,
      url: audioUrl,
      name: file.name,
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndHandleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndHandleFile(e.target.files[0]);
    }
  };

  const handleClearAudio = () => {
    setAudioSource(null);
    setAudioDuration(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyzeClick = () => {
    if (!audioSource || isAnalyzing || isRecording) return;
    onRunComparison(audioSource.blob, audioDuration || undefined);
  };

  // Inline Player Helpers
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <Card
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`rounded-3xl border transition-all bg-white overflow-hidden shadow-sm ${
        isDragging
          ? "border-neutral-900 ring-2 ring-neutral-900/10 bg-neutral-50/50"
          : "border-neutral-200/70"
      }`}
    >
      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Top Area: Prompt Teleprompter (Benchmark) or Free-Form with H1/H2 Title and Inside Bubble */}
        {mode === "benchmark" ? (
          <PromptTeleprompter
            currentPrompt={currentPrompt}
            groundTruth={groundTruth}
            onSelectPrompt={(prompt) => {
              onSelectPrompt(prompt);
            }}
            onChangeGroundTruth={onChangeGroundTruth}
          />
        ) : (
          <div className="space-y-3 mb-6">
            {/* Top Header: H1 Title and H2 Subtitle */}
            <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
              <div>
                <h1 className="text-base font-medium tracking-tight text-neutral-900 leading-tight">
                  {t("mode_freeform_title")}
                </h1>
                <h2 className="text-xs sm:text-sm text-neutral-600 font-normal mt-0.5">
                  {t("mode_freeform_subtitle")}
                </h2>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="text-red-500 hover:text-red-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Hidden Audio Element for playback */}
        <audio
          ref={audioRef}
          src={audioSource?.url}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={(e) => {
            const dur = e.currentTarget.duration;
            if (dur && isFinite(dur) && dur > 0) {
              setAudioDuration(dur);
            }
          }}
          preload="metadata"
        />

        {/* Bottom Action Bar: Upload (+) & Start (Mic) on the Left; Model Name & Send on the Right */}
        <div className="flex items-center justify-between pt-1 flex-wrap gap-2">
          {/* Left: Upload (+), Mic, Audio Wave / File Badge, and Status Text */}
          <div className="flex items-center gap-2 flex-wrap">
            <input
              ref={fileInputRef}
              type="file"
              accept=".wav,.mp3,.m4a,.ogg,audio/*"
              onChange={handleFileChange}
              disabled={isAnalyzing || isRecording}
              className="hidden"
            />
            {/* Upload Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => fileInputRef.current?.click()}
              disabled={isAnalyzing || isRecording}
              title={t("upload_btn")}
              className="h-9 w-9 rounded-xl border border-neutral-200/90 text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-50 shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </Button>

            {/* Start / Stop Recording (Mic) Button */}
            <Button
              type="button"
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isAnalyzing}
              title={isRecording ? t("stop_btn") : t("record_btn")}
              className={`h-9 w-9 rounded-xl transition-all cursor-pointer shadow-2xs ${
                isRecording
                  ? "border border-neutral-200/90 text-red-500 hover:text-neutral-900 bg-white hover:bg-neutral-50"
                  : "border border-neutral-200/90 text-neutral-500 hover:text-neutral-900 bg-white hover:bg-neutral-50"
              }`}
            >
              {isRecording ? (
                <Square className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </Button>

            {/* On Recording: simple audio wave beside mic with record time max 15s */}
            {isRecording && (
              <div className="inline-flex items-center gap-2 h-9 px-2.5 rounded-xl bg-red-50/80 border border-red-200/80 text-red-600 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping flex-shrink-0" />
                <span className="font-mono text-xs font-semibold whitespace-nowrap">
                  {recordingSeconds}s / 15s
                </span>
                <canvas
                  ref={canvasRef}
                  width={160}
                  height={32}
                  className="h-4.5 w-20 sm:w-24"
                />
              </div>
            )}

            {/* After finished or file uploaded: file badge with grey color and x button between mic and audio attached */}
            {audioSource && !isRecording && (
              <div className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg bg-neutral-100 border border-neutral-200/90 text-xs text-neutral-700 shadow-2xs max-w-[260px] sm:max-w-[320px]">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="p-0.5 hover:text-neutral-900 rounded cursor-pointer transition-colors"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3 fill-current text-neutral-800" />
                  ) : (
                    <Play className="w-3 h-3 fill-current text-neutral-800 ml-0.5" />
                  )}
                </button>
                <FileAudio className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                <span className="truncate font-medium max-w-[120px] sm:max-w-[160px]">
                  {audioSource.name}
                </span>
                <button
                  type="button"
                  onClick={handleClearAudio}
                  disabled={isAnalyzing}
                  className="p-0.5 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer transition-colors ml-0.5 flex-shrink-0"
                  title={t("clear_audio_btn")}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <span className="text-xs text-neutral-400 hidden sm:inline ml-1">
              {audioSource
                ? t("audio_attached")
                : !isRecording
                  ? t("audio_hint_empty")
                  : null}
            </span>
          </div>

          {/* Right: Model Name Badge & Circular Send Button */}
          <div className="flex items-center gap-2">
            {/* Model Name Badge */}
            <div className="flex items-center gap-1.5 h-9 px-3 rounded-full  text-stone-600 text-sm font-medium shadow-2xs select-none">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              <span>Whisper Small</span>
            </div>

            {/* Send / Transcribe Button (Circular ArrowUp, disabled when no audio) */}
            <Button
              type="button"
              size="icon"
              onClick={handleAnalyzeClick}
              disabled={!audioSource || isAnalyzing || isRecording}
              title={
                !audioSource
                  ? t("audio_record_or_upload_first")
                  : isAnalyzing
                    ? t("analyzing_btn")
                    : t("analyze_btn")
              }
              className={`h-9 w-9 rounded-full transition-all cursor-pointer ${
                !audioSource || isRecording
                  ? "bg-blue-100 text-blue-300 border border-blue-200/60 cursor-not-allowed hover:bg-blue-100"
                  : isAnalyzing
                    ? "bg-[#0070f3] text-white cursor-wait"
                    : "bg-[#0070f3] text-white hover:bg-[#0060df] shadow-xs active:scale-95"
              }`}
            >
              {isAnalyzing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
