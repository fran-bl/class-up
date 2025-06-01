import { useState } from 'react';

interface XpToastState {
  isVisible: boolean;
  message: string;
  xp: number;
  duration: number;
}

interface UseToastReturn {
  xpToastState: XpToastState;
  showXpToast: (message: string, xp: number, duration?: number) => void;
  hideXpToast: () => void;
}

export const useXpToast = (): UseToastReturn => {
  const [xpToastState, setXpToastState] = useState<XpToastState>({
    isVisible: false,
    message: '',
    duration: 2000,
    xp: 0
  });

  const showXpToast = (message: string, xp: number, duration: number = 2000): void => {
    setXpToastState({
      isVisible: true,
      message,
      xp,
      duration
    });
  };

  const hideXpToast = (): void => {
    setXpToastState(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    xpToastState,
    showXpToast,
    hideXpToast
  };
};