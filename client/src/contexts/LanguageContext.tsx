import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

const translations = {
  en: {
    keys_generated: 'Keys Generated',
    pending: 'Pending',
    active: 'Active',
    create_key: 'Create Key',
    copy_all: 'Copy All',
    profile: 'Profile',
    recent_activations: 'Recent Activations',
    keys_per_day: 'Keys generated per day',
    latest_keys: 'Latest Keys',
    see_all: 'See all →',
    logout: 'Logout',
    notifications: 'Notifications',
    group: 'Group',
    change_profile: 'Change profile info',
    change_password: 'Change password',
    key_alias: 'Key alias',
    login_session: 'Login session',
    twofa: '2FA setting',
    privacy: 'Privacy and policy',
    support: 'Support',
    language: 'Language',
    integration_code: 'Integration Code',
    clear_keys: 'Clear all keys',
    version: 'Version: 1.0.0 (Prod)',
    clear: 'Clear',
    nav_home: 'Home',
    nav_keys: 'Keys',
    nav_devices: 'Devices',
    nav_packages: 'Packages',
    nav_profile: 'Profile',
  },
  pt: {
    keys_generated: 'Keys Geradas',
    pending: 'Pendentes',
    active: 'Ativas',
    create_key: 'Criar Key',
    copy_all: 'Copiar All',
    profile: 'Perfil',
    recent_activations: 'Ativações Recentes',
    keys_per_day: 'Keys geradas por dia',
    latest_keys: 'Últimas Keys',
    see_all: 'Ver todas →',
    logout: 'Sair',
    notifications: 'Notificações',
    group: 'Grupo',
    change_profile: 'Alterar dados do perfil',
    change_password: 'Alterar senha',
    key_alias: 'Alias da key',
    login_session: 'Sessão de login',
    twofa: 'Configuração 2FA',
    privacy: 'Privacidade e política',
    support: 'Suporte',
    language: 'Idioma',
    integration_code: 'Código de Integração',
    clear_keys: 'Limpar todas as keys',
    version: 'Versão: 1.0.0 (Prod)',
    clear: 'Limpar',
    nav_home: 'Home',
    nav_keys: 'Keys',
    nav_devices: 'Devices',
    nav_packages: 'Pacotes',
    nav_profile: 'Perfil',
  },
  vi: {
    keys_generated: 'Keys Đã Tạo',
    pending: 'Chờ xử lý',
    active: 'Đang hoạt động',
    create_key: 'Tạo Key',
    copy_all: 'Sao chép tất cả',
    profile: 'Hồ sơ',
    recent_activations: 'Kích hoạt gần đây',
    keys_per_day: 'Keys được tạo mỗi ngày',
    latest_keys: 'Keys gần nhất',
    see_all: 'Xem tất cả →',
    logout: 'Đăng xuất',
    notifications: 'Thông báo',
    group: 'Nhóm',
    change_profile: 'Thay đổi thông tin',
    change_password: 'Đổi mật khẩu',
    key_alias: 'Bí danh key',
    login_session: 'Phiên đăng nhập',
    twofa: 'Cài đặt 2FA',
    privacy: 'Quyền riêng tư',
    support: 'Hỗ trợ',
    language: 'Ngôn ngữ',
    integration_code: 'Mã tích hợp',
    clear_keys: 'Xóa tất cả keys',
    version: 'Phiên bản: 1.0.0 (Sản xuất)',
    clear: 'Xóa',
    nav_home: 'Trang chủ',
    nav_keys: 'Keys',
    nav_devices: 'Thiết bị',
    nav_packages: 'Gói',
    nav_profile: 'Hồ sơ',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('ferrao_lang') as Language;
    return saved || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('ferrao_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage deve ser usado dentro de LanguageProvider');
  }
  return context;
};
