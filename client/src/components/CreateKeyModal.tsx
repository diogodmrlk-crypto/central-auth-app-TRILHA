import React, { useState, useMemo } from 'react';
import { useKeyData } from '@/hooks/useKeyData';
import { showToast, copyToClipboard, generateKeyPreview } from '@/lib/utils';
import Modal from './Modal';
import { Package, KeyData } from '@/types';

interface CreateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  packages: Package[];
}

export default function CreateKeyModal({
  isOpen,
  onClose,
  packages,
}: CreateKeyModalProps) {
  const { addMultipleKeys } = useKeyData();
  const [quantity, setQuantity] = useState(1);
  const [type, setType] = useState<'weekly' | 'monthly' | 'lifetime'>('weekly');
  const [duration, setDuration] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState(
    packages[0]?.id || 'default'
  );
  const [generatedKeys, setGeneratedKeys] = useState<KeyData[]>([]);

  const preview = useMemo(() => {
    return generateKeyPreview(type, duration);
  }, [type, duration]);

  const handleGenerateKeys = () => {
    if (quantity < 1 || quantity > 100) {
      showToast('⚠️ Quantidade deve estar entre 1 e 100');
      return;
    }

    const newKeys: KeyData[] = [];
    for (let i = 0; i < quantity; i++) {
      const randomPart = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();
      const key: KeyData = {
        id: 'key-' + Date.now() + '-' + i,
        key: `GHOST-${type.toUpperCase()}-${randomPart}`,
        type,
        used: false,
        _pkg: selectedPackage,
        createdAt: Date.now() / 1000,
      };
      newKeys.push(key);
    }

    setGeneratedKeys(newKeys);
    addMultipleKeys(newKeys);
    showToast(`✦ ${quantity} key(s) gerada(s)!`);
  };

  const handleCopyAll = () => {
    const keys = generatedKeys.map((k) => k.key).join('\n');
    copyToClipboard(keys, `${generatedKeys.length} keys copiadas!`);
  };

  const handleClose = () => {
    setGeneratedKeys([]);
    setQuantity(1);
    setType('weekly');
    setDuration(1);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="✦ Gerar Key">
      <div className="space-y-4">
        {generatedKeys.length === 0 ? (
          <>
            {/* Quantidade */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Quantidade
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Tipo
              </label>
              <select
                value={type}
                onChange={(e) =>
                  setType(e.target.value as 'weekly' | 'monthly' | 'lifetime')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">1 Semana</option>
                <option value="monthly">1 Mês</option>
                <option value="lifetime">Lifetime</option>
              </select>
            </div>

            {/* Duração */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Duração (dias)
              </label>
              <input
                type="number"
                min="1"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Package */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Package
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => setSelectedPackage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="default">API (padrão)</option>
                {packages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Preview
              </label>
              <input
                type="text"
                value={preview}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 font-mono text-sm"
              />
            </div>

            {/* Button */}
            <button
              onClick={handleGenerateKeys}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              ✦ Gerar Keys
            </button>
          </>
        ) : (
          <>
            {/* Generated Keys List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900">Keys Geradas</h3>
                <button
                  onClick={handleCopyAll}
                  className="text-xs text-blue-600 font-semibold hover:text-blue-700"
                >
                  Copiar todas
                </button>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {generatedKeys.map((key) => (
                  <div
                    key={key.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200 font-mono text-xs"
                  >
                    <span className="truncate text-gray-900">{key.key}</span>
                    <button
                      onClick={() => copyToClipboard(key.key, 'Key copiada!')}
                      className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition flex-shrink-0"
                    >
                      📋
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition"
            >
              Fechar
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
