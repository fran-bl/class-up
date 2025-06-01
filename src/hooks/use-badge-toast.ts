import { useState } from 'react';

interface BadgeToastState {
  isVisible: boolean;
  message: string;
  iconUrl: string;
  duration: number;
}

interface UseToastReturn {
  badgeToastState: BadgeToastState;
  showBadgeToast: (message: string, iconUrl: string, duration?: number) => void;
  hideBadgeToast: () => void;
}

export const useBadgeToast = (): UseToastReturn => {
  const [badgeToastState, setBadgeToastState] = useState<BadgeToastState>({
    isVisible: false,
    message: '',
    duration: 2000,
    iconUrl: ""
  });

  const showBadgeToast = (message: string, iconUrl: string, duration: number = 2000): void => {
    setBadgeToastState({
      isVisible: true,
      message,
      iconUrl,
      duration
    });
  };

  const hideBadgeToast = (): void => {
    setBadgeToastState(prev => ({
      ...prev,
      isVisible: false
    }));
  };

  return {
    badgeToastState,
    showBadgeToast,
    hideBadgeToast
  };
};