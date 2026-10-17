import React, { useState, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { UploadCloud, FileAudio, CheckCircle, AlertCircle, X } from 'lucide-react';

interface AudioUploaderProps {
  onAudioReady: (file: File, audioUrl: string) => void;
  isProcessing?: boolean;
}

export const AudioUploader: React.FC<AudioUploaderProps> = ({
  onAudioReady,
  isProcessing = false,
}) => {
  const { t } = useLanguage();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const SUPPORTED_EXTENSIONS = ['.wav', '.mp3', '.m4a', '.ogg'];
  const MAX_FILE_SIZE_MB = 25;

  const validateAndHandleFile = (file: File) => {
    setErrorMessage(null);
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!SUPPORTED_EXTENSIONS.includes(ext) && !file.type.startsWith('audio/')) {
      setErrorMessage(`Format tidak didukung. Harap gunakan file: ${SUPPORTED_EXTENSIONS.join(', ')}`);
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Ukuran file melebihi batas ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    setSelectedFile(file);
    const audioUrl = URL.createObjectURL(file);
    onAudioReady(file, audioUrl);
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

  const handleClear = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`h-40 rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50/50 scale-[0.99]'
              : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80 bg-white'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".wav,.mp3,.m4a,.ogg,audio/*"
            onChange={handleFileChange}
            disabled={isProcessing}
            className="hidden"
          />

          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 mb-2.5">
            <UploadCloud className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold text-slate-800 mb-1">
            {t('upload_drag_hint')}
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            {t('upload_limit_hint')}
          </span>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2.5 rounded-lg bg-emerald-600 text-white flex-shrink-0">
              <FileAudio className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span className="font-semibold text-xs text-slate-900 truncate">
                  {selectedFile.name}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClear}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors flex-shrink-0"
            title="Hapus file ini"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
