import React, { useState, useRef } from 'react';
import { useLanguage } from '../../i18n/LanguageContext';
import { UploadCloud, FileAudio, AlertCircle, X } from 'lucide-react';
import { Button } from '../ui/button';

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
    <div className="space-y-4">
      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
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
          className={`py-6 px-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-neutral-900 bg-neutral-100/70'
              : 'border-neutral-200/90 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50'
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

          <div className="h-9 w-9 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-600 mb-2 shadow-2xs">
            <UploadCloud className="w-4 h-4 text-neutral-700" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-neutral-800">
            {t('upload_drag_hint')}
          </p>
          <p className="text-[11px] text-neutral-400 mt-1 font-mono">
            {t('upload_limit_hint')}
          </p>
        </div>
      ) : (
        <div className="p-4 rounded-2xl border border-neutral-200/90 bg-neutral-50/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 rounded-xl bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-600 flex-shrink-0">
              <FileAudio className="w-5 h-5 text-neutral-600" />
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-neutral-900 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-neutral-400 font-mono">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={isProcessing}
            className="h-8 w-8 rounded-lg text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
