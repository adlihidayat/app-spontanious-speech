import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { ApiConfig } from '../types';
import { testApiConnection, saveApiConfig } from '../services/api';
import { X, Server, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

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

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-slate-900 text-base">
              {t('api_settings_title')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Demo Mode Toggle */}
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="space-y-0.5">
              <label
                htmlFor="demo-toggle"
                className="text-sm font-semibold text-slate-900 cursor-pointer"
              >
                {t('api_demo_toggle')}
              </label>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t('api_demo_hint')}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-0.5">
              <input
                id="demo-toggle"
                type="checkbox"
                checked={isDemoMode}
                onChange={(e) => setIsDemoMode(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {/* Backend URL Input */}
          <div className={`space-y-2 transition-opacity ${isDemoMode ? 'opacity-60' : 'opacity-100'}`}>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              {t('api_url_label')}
            </label>
            <div className="relative">
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => {
                  setBaseUrl(e.target.value);
                  setTestResult(null);
                }}
                disabled={isDemoMode}
                placeholder="https://your-space.hf.space"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 text-sm font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
            <p className="text-xs text-slate-500">{t('api_url_hint')}</p>
          </div>

          {/* Test Connection Button & Result */}
          {!isDemoMode && (
            <div className="pt-1 flex items-center justify-between">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting || !baseUrl.trim()}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400 disabled:opacity-50 transition-colors shadow-2xs"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <span>{t('api_test_btn')}</span>
                )}
              </button>

              {testResult === 'success' && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('api_test_success')}</span>
                </div>
              )}

              {testResult === 'failed' && (
                <div className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{t('api_test_failed')}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          >
            {t('api_close_btn')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs transition-colors"
          >
            {t('api_save_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
