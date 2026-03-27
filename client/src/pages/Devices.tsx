import React, { useMemo, useState } from 'react';
import { useKeyData } from '@/hooks/useKeyData';
import { detectPlatform, formatDate, showToast, copyToClipboard } from '@/lib/utils';
import { Search } from 'lucide-react';

interface DevicesProps {
  onBack: () => void;
}

export default function Devices({ onBack }: DevicesProps) {
  const { getMergedKeys, resetKeyDevice, revokeKey } = useKeyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [activeDeviceKey, setActiveDeviceKey] = useState<string | null>(null);

  const filteredKeys = useMemo(() => {
    const keys = getMergedKeys().filter((k) => k.used && k.device);

    if (!searchTerm) return keys;

    const term = searchTerm.toLowerCase();
    return keys.filter(
      (k) =>
        k.device?.toLowerCase().includes(term) ||
        k.key.toLowerCase().includes(term)
    );
  }, [searchTerm, getMergedKeys]);

  const groupedDevices = useMemo(() => {
    const grouped: Record<string, typeof filteredKeys> = {};

    filteredKeys.forEach((key) => {
      const device = key.device || '(desconhecido)';
      if (!grouped[device]) {
        grouped[device] = [];
      }
      grouped[device].push(key);
    });

    return Object.entries(grouped).sort(
      ([, a], [, b]) =>
        (b[0]?.activatedAt || 0) - (a[0]?.activatedAt || 0)
    );
  }, [filteredKeys]);

  const handleReset = (keyId: string) => {
    if (confirm('Tem certeza que deseja resetar este device?')) {
      resetKeyDevice(keyId);
      showToast('✅ Device resetado! Key disponível.');
      setActiveDeviceKey(null);
    }
  };

  const handleRevoke = (keyId: string) => {
    if (confirm('Tem certeza que deseja revogar esta key permanentemente?')) {
      revokeKey(keyId);
      showToast('🚫 Device revogado e key excluída.');
      setActiveDeviceKey(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-900">Devices</h1>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <Search size={20} className="text-gray-700" />
          </button>
        </div>

        {showSearch && (
          <input
            type="text"
            placeholder="Buscar device..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {groupedDevices.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-4xl mb-3">📱</div>
            <p className="text-gray-600 font-medium">Nenhum device conectado</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {groupedDevices.map(([deviceName, keys]) => {
              const firstKey = keys[0];
              const isExpired =
                firstKey.expiresAt &&
                firstKey.expiresAt > 0 &&
                firstKey.expiresAt < Date.now() / 1000;
              const platform = detectPlatform(deviceName);
              const platformEmoji =
                platform === 'iOS'
                  ? '📱'
                  : platform === 'Android'
                    ? '🤖'
                    : platform === 'Windows'
                      ? '💻'
                      : '🖥️';

              return (
                <div key={deviceName} className="p-4 bg-white">
                  {/* Device Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3 flex-1">
                      <span className="text-2xl">{platformEmoji}</span>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {deviceName}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          Ativado:{' '}
                          {formatDate(firstKey.activatedAt || 0)} · {keys.length}{' '}
                          key(s)
                        </div>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                        isExpired
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isExpired ? 'Expirado' : 'Online'}
                    </span>
                  </div>

                  {/* Keys List */}
                  <div className="space-y-2 mb-3">
                    {keys.map((key) => {
                      const keyExpired =
                        key.expiresAt &&
                        key.expiresAt > 0 &&
                        key.expiresAt < Date.now() / 1000;

                      return (
                        <div
                          key={key.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-xs font-semibold text-gray-900 truncate">
                              {key.key}
                            </div>
                          </div>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold flex-shrink-0 ml-2 ${
                              keyExpired
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {keyExpired ? 'Expirada' : 'Ativa'}
                          </span>
                          <button
                            onClick={() => copyToClipboard(key.key, 'Key copiada!')}
                            className="p-1 hover:bg-gray-200 rounded transition ml-2 flex-shrink-0"
                          >
                            📋
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReset(firstKey.id)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-semibold text-sm hover:bg-blue-200 transition"
                    >
                      ↻ Resetar
                    </button>
                    <button
                      onClick={() => handleRevoke(firstKey.id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg font-semibold text-sm hover:bg-red-200 transition"
                    >
                      ✕ Revogar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
