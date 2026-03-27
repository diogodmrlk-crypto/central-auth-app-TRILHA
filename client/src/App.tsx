import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Keys from '@/pages/Keys';
import Devices from '@/pages/Devices';
import Packages from '@/pages/Packages';
import Profile from '@/pages/Profile';

type PageType = 'home' | 'keys' | 'devices' | 'packages' | 'profile';

function AppContent() {
  const { loggedIn, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageType>('home');

  if (!loggedIn) {
    return (
      <Login
        onLoginSuccess={() => {
          setCurrentPage('home');
        }}
      />
    );
  }

  const handleNavigate = (page: string) => {
    if (['home', 'keys', 'devices', 'packages', 'profile'].includes(page)) {
      setCurrentPage(page as PageType);
    }
  };

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      logout();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 relative">
      {/* Pages */}
      <div className="flex-1 overflow-hidden">
        {currentPage === 'home' && (
          <Home onNavigate={handleNavigate} onLogout={handleLogout} />
        )}
        {currentPage === 'keys' && <Keys onBack={() => setCurrentPage('home')} />}
        {currentPage === 'devices' && (
          <Devices onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'packages' && (
          <Packages onBack={() => setCurrentPage('home')} />
        )}
        {currentPage === 'profile' && (
          <Profile onBack={() => setCurrentPage('home')} />
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-gray-200 flex items-center justify-around p-2 flex-shrink-0">
        <NavButton
          icon="🏠"
          label="Home"
          active={currentPage === 'home'}
          onClick={() => handleNavigate('home')}
        />
        <NavButton
          icon="🔑"
          label="Keys"
          active={currentPage === 'keys'}
          onClick={() => handleNavigate('keys')}
        />
        <NavButton
          icon="📱"
          label="Devices"
          active={currentPage === 'devices'}
          onClick={() => handleNavigate('devices')}
        />
        <NavButton
          icon="📦"
          label="Pacotes"
          active={currentPage === 'packages'}
          onClick={() => handleNavigate('packages')}
        />
        <NavButton
          icon="👤"
          label="Perfil"
          active={currentPage === 'profile'}
          onClick={() => handleNavigate('profile')}
        />
      </nav>
    </div>
  );
}

interface NavButtonProps {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-4 py-2 rounded-lg transition ${
        active
          ? 'text-blue-600'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-semibold">{label}</span>
    </button>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <AppContent />
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
