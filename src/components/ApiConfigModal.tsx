import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ApiConfig } from '../types';
import { testApiConnection, saveApiConfig } from '../services/api';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface ApiConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onUpdateConfig: (newConfig: ApiConfig) => void;
}

export const ApiConfigModal: React.FC<ApiConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const { t } = useLanguage();
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [isDemoMode, setIsDemoMode] = useState(config.isDemoMode);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'failed' | null>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const isAlive = await testApiConnection(baseUrl);
      setTestResult(isAlive ? 'success' : 'failed');
    } catch {
      setTestResult('failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    const updated: ApiConfig = {
      baseUrl: baseUrl.trim(),
      isDemoMode,
      isConnected: testResult === 'success',
      lastChecked: Date.now(),
    };
    saveApiConfig(updated);
    onUpdateConfig(updated);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-neutral-900">
            {t('api_settings_title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Demo Mode Toggle */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-neutral-200/80 bg-neutral-50/70">
            <div className="space-y-0.5">
              <label
                htmlFor="demo-toggle"
                className="text-xs font-semibold text-neutral-900 cursor-pointer block"
              >
                {t('api_demo_toggle')}
              </label>
              <p className="text-[11px] text-neutral-500 leading-relaxed">
                {t('api_demo_hint')}
              </p>
            </div>
            <input
              id="demo-toggle"
              type="checkbox"
              checked={isDemoMode}
              onChange={(e) => setIsDemoMode(e.target.checked)}
              className="h-4 w-4 rounded-md border-neutral-300 text-neutral-900 focus:ring-neutral-900 cursor-pointer"
            />
          </div>

          {/* Backend URL Input */}
          <div className={`space-y-1.5 ${isDemoMode ? 'opacity-40 pointer-events-none' : ''}`}>
            <label className="block text-xs font-medium text-neutral-700">
              {t('api_url_label')}
            </label>
            <Input
              type="url"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value);
                setTestResult(null);
              }}
              disabled={isDemoMode}
              placeholder="https://your-space.hf.space"
              className="font-mono text-xs rounded-xl"
            />
            <p className="text-[11px] text-neutral-400 font-sans">{t('api_url_hint')}</p>
          </div>

          {/* Test Connection Button & Result */}
          {!isDemoMode && (
            <div className="flex items-center justify-between pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleTestConnection}
                disabled={isTesting || !baseUrl.trim()}
                className="h-8 text-xs font-mono rounded-xl"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <span>{t('api_test_btn')}</span>
                )}
              </Button>

              {testResult === 'success' && (
                <div className="inline-flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('api_test_success')}</span>
                </div>
              )}

              {testResult === 'failed' && (
                <div className="inline-flex items-center gap-1.5 text-xs text-red-600 font-medium">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t('api_test_failed')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="h-9 text-xs rounded-xl"
          >
            {t('api_close_btn')}
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            className="h-9 text-xs rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
          >
            {t('api_save_btn')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
