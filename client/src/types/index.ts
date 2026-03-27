// Types para a aplicação CentralAuthapp

export interface KeyData {
  id: string;
  key: string;
  type: string; // 'weekly', 'monthly', 'lifetime'
  used: boolean;
  device?: string;
  activatedAt?: number;
  expiresAt?: number;
  _pkg?: string;
  createdAt?: number;
}

export interface Package {
  id: string;
  name: string;
  url: string;
  desc?: string;
  enabled: boolean;
  sent: number;
}

export interface Session {
  device: string;
  platform: 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Unknown';
  activatedAt: number;
  expiresAt: number;
  ip: string;
  version: string;
  keyCount: number;
}

export interface ChartData {
  [date: string]: number;
}

export interface AuthState {
  loggedIn: boolean;
  activeKey: string;
  keyLevel: 'BASIC' | 'PRO' | 'DEV';
  keyLimit: number;
}

export type Language = 'en' | 'pt' | 'vi';

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
