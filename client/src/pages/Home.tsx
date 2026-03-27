import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useKeyData } from '@/hooks/useKeyData';
import { copyToClipboard, showToast } from '@/lib/utils';
import Chart from '@/components/Chart';
import CreateKeyModal from '@/components/CreateKeyModal';
import { Bell, Settings, LogOut, Plus } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export default function Home({ onNavigate, onLogout }: HomeProps) {
  const { activeKey, keyLevel } = useAuth();
  const { t } = useLanguage();
  const { getMergedKeys, chartData, limitCount, packages } = useKeyData();
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const keys = getMergedKeys();
    setStats({
      total: keys.length,
      active: keys.filter((k) => k.used).length,
      pending: keys.filter((k) => !k.used).length,
    });
  }, [getMergedKeys]);

  const recentKeys = getMergedKeys().slice(0, 5);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center text-2xl font-bold text-amber-400">
              ✦
            </div>
            <div>
              <div className="font-bold text-lg">CentralAuth</div>
              <div className="text-xs text-blue-100">{keyLevel}</div>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="p-2 hover:bg-blue-500/50 rounded-lg transition"
            >
              <Plus size={20} />
            </button>
            <button className="p-2 hover:bg-blue-500/50 rounded-lg transition">
              <Bell size={20} />
            </button>
            <button
              onClick={onLogout}
              className="p-2 hover:bg-blue-500/50 rounded-lg transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Limit Bar */}
        <div className="bg-blue-500/30 rounded-xl p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
              Limite
            </span>
            <span className="text-sm font-bold text-white">{limitCount} / 5000</span>
          </div>
          <div className="w-full bg-blue-400/30 rounded-full h-1 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-500"
              style={{ width: `${Math.min((limitCount / 5000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Total
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.total}</div>
            <div className="text-xs text-gray-600">Keys geradas</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Ativas
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.active}</div>
            <div className="text-xs text-gray-600">Em uso</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Pendentes
            </div>
            <div className="text-3xl font-bold text-amber-600 mb-2">{stats.pending}</div>
            <div className="text-xs text-gray-600">Não usadas</div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Plano
            </div>
            <div className="text-3xl font-bold text-blue-600 mb-2">{keyLevel}</div>
            <div className="text-xs text-gray-600">Seu nível</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Últimos 7 dias</h3>
          <Chart data={chartData} />
        </div>

        {/* Recent Keys */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Últimas Keys</h3>
            <button
              onClick={() => onNavigate('keys')}
              className="text-xs text-blue-600 font-semibold hover:text-blue-700"
            >
              Ver todas →
            </button>
          </div>

          {recentKeys.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-2xl mb-2">🔑</div>
              <p className="text-sm text-gray-600">Nenhuma key gerada ainda</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm font-semibold text-gray-900 truncate">
                      {key.key}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {key.type} · {key._pkg || 'API'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        key.used
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {key.used ? 'Ativa' : 'Pendente'}
                    </span>
                    <button
                      onClick={() => copyToClipboard(key.key, 'Key copiada!')}
                      className="p-1 hover:bg-gray-200 rounded transition"
                    >
                      📋
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Key Modal */}
      <CreateKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        packages={packages}
      />
    </div>
  );
}
