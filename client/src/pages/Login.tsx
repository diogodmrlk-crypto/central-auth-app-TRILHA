import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { showToast } from '@/lib/utils';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const { login, getHWID } = useAuth();
  const [keyInput, setKeyInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const trimmedKey = keyInput.trim().toUpperCase();
    if (!trimmedKey) {
      setError('Por favor, insira uma key.');
      setLoading(false);
      return;
    }

    try {
      const hwid = getHWID();
      const success = await login(trimmedKey, hwid);

      if (success) {
        showToast('✅ Login realizado com sucesso!');
        onLoginSuccess();
      } else {
        setError('Key inválida ou não encontrada!');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError('Erro ao validar key. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center p-6 z-50">
      <div className="w-full max-w-sm bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        {/* Logo */}
        <div className="text-5xl mb-6 text-center">✦</div>

        {/* Título */}
        <h1 className="text-2xl font-bold text-white mb-2 text-center">CentralAuth</h1>
        <p className="text-sm text-white/80 text-center mb-8">Insira sua chave de acesso</p>

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Sua chave aqui..."
            className="w-full px-4 py-3 rounded-xl bg-white text-gray-900 font-semibold text-center uppercase placeholder-gray-400 outline-none focus:ring-2 focus:ring-green-400 transition"
            autoFocus
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Validando...' : '✦ Entrar'}
          </button>
        </form>

        {/* Erro */}
        {error && (
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm font-medium text-center">
            {error}
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-white/60 text-center mt-6">
          Versão: 1.0.0 (TSX)
        </p>
      </div>
    </div>
  );
}
