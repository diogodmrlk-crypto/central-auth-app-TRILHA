import React, { useState, useMemo } from 'react';
import { useKeyData } from '@/hooks/useKeyData';
import { copyToClipboard, showToast } from '@/lib/utils';
import { Search, Copy, Trash2 } from 'lucide-react';

interface KeysProps {
  onBack: () => void;
}

export default function Keys({ onBack }: KeysProps) {
  const { getMergedKeys, selectedIds, setSelectedIds, deleteSelectedKeys } = useKeyData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const filteredKeys = useMemo(() => {
    const keys = getMergedKeys();
    if (!searchTerm) return keys;

    const term = searchTerm.toLowerCase();
    return keys.filter(
      (k) =>
        k.key.toLowerCase().includes(term) ||
        k.type.toLowerCase().includes(term)
    );
  }, [searchTerm, getMergedKeys]);

  const toggleSelect = (keyId: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(keyId)) {
      newSelected.delete(keyId);
    } else {
      newSelected.add(keyId);
    }
    setSelectedIds(newSelected);
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) {
      showToast('⚠️ Selecione keys primeiro');
      return;
    }

    if (confirm(`Tem certeza que deseja deletar ${selectedIds.size} key(s)?`)) {
      deleteSelectedKeys();
      showToast(`🗑️ ${selectedIds.size} key(s) removida(s)`);
    }
  };

  const handleCopyAll = () => {
    const keys = filteredKeys.map((k) => k.key).join('\n');
    copyToClipboard(keys, `${filteredKeys.length} keys copiadas!`);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-bold text-gray-900">Keys</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Search size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {showSearch && (
          <input
            type="text"
            placeholder="Buscar key..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {filteredKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-4xl mb-3">🔑</div>
            <p className="text-gray-600 font-medium">Nenhuma key encontrada</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredKeys.map((key) => (
              <div
                key={key.id}
                className={`p-4 flex items-center gap-3 cursor-pointer transition ${
                  selectedIds.has(key.id)
                    ? 'bg-blue-50'
                    : 'bg-white hover:bg-gray-50'
                }`}
                onClick={() => toggleSelect(key.id)}
              >
                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition ${
                    selectedIds.has(key.id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedIds.has(key.id) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-sm font-semibold text-gray-900 truncate">
                    {key.key}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {key.type} · {key._pkg || 'API'}
                  </div>
                </div>

                {/* Badge */}
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold flex-shrink-0 ${
                    key.used
                      ? 'bg-green-100 text-green-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {key.used ? 'Ativa' : 'Pendente'}
                </span>

                {/* Copy Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyToClipboard(key.key, 'Key copiada!');
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition flex-shrink-0"
                >
                  <Copy size={16} className="text-gray-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedIds.size > 0 && (
        <div className="bg-white border-t border-gray-200 p-4 flex gap-2 flex-shrink-0">
          <button
            onClick={handleCopyAll}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            📋 Copiar ({selectedIds.size})
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Deletar
          </button>
        </div>
      )}
    </div>
  );
}
