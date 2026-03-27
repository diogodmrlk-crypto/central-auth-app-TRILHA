import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useKeyData } from '@/hooks/useKeyData';
import { showToast, copyToClipboard } from '@/lib/utils';
import { Globe, Code, Trash2 } from 'lucide-react';
import Modal from '@/components/Modal';

interface ProfileProps {
  onBack: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const { activeKey, keyLevel } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { clearAllKeys } = useKeyData();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);

  const languages = [
    { code: 'en' as const, flag: '🇺🇸', name: 'English' },
    { code: 'pt' as const, flag: '🇧🇷', name: 'Português (BR)' },
    { code: 'vi' as const, flag: '🇻🇳', name: 'Tiếng Việt' },
  ];

  const handleClearAllKeys = () => {
    if (
      confirm(
        'Tem certeza que deseja limpar TODAS as keys? Esta ação não pode ser desfeita.'
      )
    ) {
      clearAllKeys();
      showToast('🗑️ Todas as keys limpas');
    }
  };

  const jsCode = `// Fetch API Example
fetch("https://teste-api-mcok.vercel.app/keys")
  .then(res => res.json())
  .then(data => console.log(data));`;

  const luauCode = `-- Roblox Example
local res = game:GetService("HttpService"):GetAsync("https://teste-api-mcok.vercel.app/keys")
print(res)`;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <h1 className="text-lg font-bold text-gray-900">Perfil</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* User Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-2xl font-bold text-amber-400">
              ✦
            </div>
            <div>
              <div className="font-bold text-gray-900">CentralAuth</div>
              <div className="text-sm text-gray-600">{keyLevel}</div>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Chave Ativa:</span>
              <span className="font-mono font-semibold text-gray-900">{activeKey}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Nível:</span>
              <span className="font-semibold text-gray-900">{keyLevel}</span>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Language */}
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Globe size={20} className="text-blue-600" />
              <span className="font-semibold text-gray-900">Idioma</span>
            </div>
            <span className="text-gray-600">
              {languages.find((l) => l.code === language)?.name}
            </span>
          </button>

          {/* Integration */}
          <button
            onClick={() => setIsIntegrationModalOpen(true)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition border-b border-gray-100"
          >
            <div className="flex items-center gap-3">
              <Code size={20} className="text-green-600" />
              <span className="font-semibold text-gray-900">Integração</span>
            </div>
            <span className="text-gray-600">Ver código</span>
          </button>

          {/* Clear All Keys */}
          <button
            onClick={handleClearAllKeys}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-red-50 transition text-red-600"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={20} />
              <span className="font-semibold">Limpar todas as keys</span>
            </div>
          </button>
        </div>

        {/* Version */}
        <div className="text-center text-xs text-gray-600 mt-6">
          Versão: 1.0.0 (TSX)
        </div>
      </div>

      {/* Language Modal */}
      <Modal
        isOpen={isLangModalOpen}
        onClose={() => setIsLangModalOpen(false)}
        title="🌐 Language"
      >
        <div className="space-y-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsLangModalOpen(false);
                showToast('🌐 Language changed!');
              }}
              className={`w-full px-4 py-3 rounded-lg flex items-center justify-between transition ${
                language === lang.code
                  ? 'bg-blue-100 border-2 border-blue-600'
                  : 'bg-gray-100 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{lang.flag}</span>
                <span className="font-semibold text-gray-900">{lang.name}</span>
              </div>
              {language === lang.code && <span className="text-blue-600">✓</span>}
            </button>
          ))}
        </div>
      </Modal>

      {/* Integration Modal */}
      <Modal
        isOpen={isIntegrationModalOpen}
        onClose={() => setIsIntegrationModalOpen(false)}
        title="🔌 Integração"
      >
        <div className="space-y-4">
          <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              JavaScript/Fetch
            </div>
            <div
              onClick={() => copyToClipboard(jsCode, 'Código copiado!')}
              className="p-3 bg-gray-900 text-gray-100 rounded-lg font-mono text-xs leading-relaxed cursor-pointer hover:bg-gray-800 transition overflow-x-auto"
            >
              {jsCode}
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">
              Luau / Roblox
            </div>
            <div
              onClick={() => copyToClipboard(luauCode, 'Código copiado!')}
              className="p-3 bg-gray-900 text-gray-100 rounded-lg font-mono text-xs leading-relaxed cursor-pointer hover:bg-gray-800 transition overflow-x-auto"
            >
              {luauCode}
            </div>
          </div>

          <p className="text-xs text-gray-600 text-center">
            👆 Clique no código para copiar
          </p>
        </div>
      </Modal>
    </div>
  );
}
