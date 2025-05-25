import { useState } from 'react';

interface ToastState {
  isVisible: boolean;
  message: string;
  xp: number;
  duration: number;
}

interface UseToastReturn {
  toastState: ToastState;
  showToast: (message: string, xp: number, duration?: number) => void;
  hideToast: () => void;
}

export const useToast = (): UseToastReturn => {
  const [toastState, setToastState] = useState<ToastState>({
    isVisible: false,
    message: '',
    duration: 2000,
    xp: 0
  });

  const showToast = (message: string, xp: number, duration: number = 2000): void => {
    setToastState({
      isVisible: true,
      message,
      xp,
      duration
    });
  };

  const hideToast = (): void => {
    setToastState(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    toastState,
    showToast,
    hideToast
  };
};