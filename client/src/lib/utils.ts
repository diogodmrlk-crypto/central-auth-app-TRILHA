import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const copyToClipboard = async (text: string, message = 'Copiado!'): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    showToast('📋 ' + message);
  } catch (error) {
    // Fallback para navegadores antigos
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast('📋 ' + message);
  }
};

export const showToast = (message: string, duration = 3400): void => {
  // Remove toasts anteriores
  const existingToasts = document.querySelectorAll('[data-toast]');
  existingToasts.forEach((toast) => toast.remove());

  // Cria novo toast
  const toast = document.createElement('div');
  toast.setAttribute('data-toast', 'true');
  toast.className =
    'fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-3 rounded-lg text-sm font-medium z-50 animate-in fade-in slide-in-from-bottom-4 duration-300';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, duration);
};

export const detectPlatform = (deviceName: string): string => {
  const d = deviceName.toLowerCase();
  if (d.includes('iphone') || d.includes('ipad') || d.includes('ipod')) return 'iOS';
  if (
    d.includes('android') ||
    d.includes('samsung') ||
    d.includes('xiaomi') ||
    d.includes('pixel') ||
    d.includes('huawei') ||
    d.includes('motorola') ||
    d.includes('oppo') ||
    d.includes('vivo')
  )
    return 'Android';
  if (d.includes('mac') || d.includes('darwin')) return 'macOS';
  if (d.includes('win') || d.includes('windows')) return 'Windows';
  if (d.includes('linux')) return 'Linux';
  return 'Unknown';
};

export const formatDate = (timestamp: number, locale = 'pt-BR'): string => {
  if (!timestamp || timestamp === 0) return '–';
  return new Date(timestamp * 1000).toLocaleString(locale);
};

export const generateKeyPreview = (type: string, duration: number): string => {
  return `GHOST-${type}-${'X'.repeat(10)}`;
};
