// components/Toast.tsx
import { useEffect, useState } from 'react';

interface ToastProps {
    xp: number;
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const XpToast: React.FC<ToastProps> = ({
    xp,
    message,
    isVisible,
    onClose,
    duration = 3000
}) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [animationClass, setAnimationClass] = useState<string>('');

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            const enterTimer = setTimeout(() => setAnimationClass('animate-in'), 10);

            const hideTimer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => {
                clearTimeout(enterTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isVisible, duration]);

    const handleClose = (): void => {
        setAnimationClass('animate-out');
        setTimeout(() => {
            setShouldRender(false);
            setAnimationClass('');
            onClose();
        }, 400);
    };

    if (!shouldRender) return null;

    return (
        <div className={`toast-overlay ${animationClass}`}>
            <div className="toast-backdrop" onClick={handleClose} />
            <div className="toast-content">
                <div className="confetti-container">
                    <img
                        src="/confetti.gif"
                        className="confetti-animation"
                    />
                </div>
                <p style={{ fontFamily: "var(--font-gta-medium)" }}>+{xp} XP!</p>
                <span className="toast-message">{message}</span>
            </div>

            <style jsx>{`
        .toast-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
        }

        .toast-overlay.animate-in {
          opacity: 1;
        }

        .toast-overlay.animate-out {
          opacity: 0;
          transform: translateY(-100vh);
          transition: transform 0.4s ease-in-out, opacity 0.5s ease-in-out;
        }

        .toast-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          transition: opacity 0.2s ease-in-out;
        }

        .toast-overlay.animate-out .toast-backdrop {
          opacity: 0;
        }

        .toast-content {
          position: relative;
          padding: 24px 32px;
          border-radius: 12px;
          max-width: 500px;
          min-width: 300px;
          text-align: center;
          transition: transform 0.4s ease-in-out;
        }

        .toast-overlay.animate-out .toast-content .toast-message {
          transform: translateY(-100vh);
        }

        .toast-content p {
          margin: 0;
          font-size: 68px;
          color:rgb(13, 170, 13);
        }

        .toast-message {
          font-size: 32px;
          color:rgb(255, 255, 255);
          transition: transform 0.4s ease-in-out;
        }

        .toast-close {
          position: absolute;
          top: 8px;
          right: 12px;
          background: none;
          border: none;
          font-size: 24px;
          color: #9CA3AF;
          cursor: pointer;
          padding: 4px;
          line-height: 1;
          transition: color 0.2s ease;
        }

        .toast-close:hover {
          color: #374151;
        }

        .confetti-container {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 1;
        }

        .confetti-animation {
          width: 400px;
          height: 400px;
          object-fit: contain;
          opacity: 0;
          animation: confetti-entrance 0.3s ease-out 0.1s forwards;
        }

        @keyframes confetti-entrance {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 0.9;
            transform: scale(1);
          }
        }

        @media (max-width: 480px) {
          .toast-content {
            margin: 20px;
            min-width: auto;
            max-width: calc(100vw - 40px);
          }
        }
      `}</style>
        </div>
    );
};

export default XpToast;