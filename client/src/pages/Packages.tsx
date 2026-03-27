import React, { useState } from 'react';
import { useKeyData } from '@/hooks/useKeyData';
import { showToast } from '@/lib/utils';
import { Plus, Trash2, Lock } from 'lucide-react';
import Modal from '@/components/Modal';
import { Package } from '@/types';

interface PackagesProps {
  onBack: () => void;
}

export default function Packages({ onBack }: PackagesProps) {
  const { packages, addPackage, removePackage, togglePackage } = useKeyData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    desc: '',
  });

  const handleAddPackage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showToast('⚠️ Informe o nome do package');
      return;
    }

    if (!formData.url.trim() || !formData.url.startsWith('http')) {
      showToast('⚠️ URL inválida');
      return;
    }

    const newPackage: Package = {
      id: 'pkg-' + Date.now(),
      name: formData.name,
      url: formData.url,
      desc: formData.desc || undefined,
      enabled: true,
      sent: 0,
    };

    addPackage(newPackage);
    showToast(`📦 Package "${formData.name}" adicionado!`);
    setFormData({ name: '', url: '', desc: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex-shrink-0 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Packages</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Plus size={20} className="text-gray-700" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {packages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-gray-600 font-medium mb-4">Nenhum package ainda</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              + Adicionar Package
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {packages.map((pkg) => (
              <div key={pkg.id} className="p-4 bg-white flex items-start gap-3">
                {/* Icon */}
                <div className="text-2xl flex-shrink-0">📦</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900">{pkg.name}</div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-600">
                    <Lock size={12} />
                    <span>URL protegida</span>
                  </div>
                  {pkg.desc && (
                    <p className="text-xs text-gray-600 mt-2">{pkg.desc}</p>
                  )}
                  <div className="text-xs text-gray-600 mt-2">
                    ✦ {pkg.sent} keys enviadas
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => togglePackage(pkg.id)}
                    className={`px-3 py-1 rounded text-xs font-semibold transition ${
                      pkg.enabled
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pkg.enabled ? '✓ Ativo' : '○ Inativo'}
                  </button>
                  <button
                    onClick={() => {
                      removePackage(pkg.id);
                      showToast(`📦 Package "${pkg.name}" removido`);
                    }}
                    className="p-1 hover:bg-red-100 rounded transition text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="📦 Novo Package"
      >
        <form onSubmit={handleAddPackage} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Nome do Package <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              placeholder="Ex: api, loja1, scripts..."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              URL da API <span className="text-red-600">*</span>
            </label>
            <input
              type="url"
              placeholder="https://sua-api.com/keys"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-600 mt-1">
              As keys serão enviadas via POST para essa URL (URL ficará oculta)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Descrição (opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: API do sistema de scripts..."
              value={formData.desc}
              onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            + Adicionar Package
          </button>
        </form>
      </Modal>
    </div>
  );
}
