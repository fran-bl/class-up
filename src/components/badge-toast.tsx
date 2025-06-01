import { useEffect, useState } from 'react';

interface BadgeToastProps {
    icon_url: string;
    message: string;
    isVisible: boolean;
    onClose: () => void;
    duration?: number;
}

const BadgeToast: React.FC<BadgeToastProps> = ({
    icon_url,
    message,
    isVisible,
    onClose,
    duration = 5000
}) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false);
    const [animationClass, setAnimationClass] = useState<string>('');
    const [showBadge, setShowBadge] = useState<boolean>(false);

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            setShowBadge(false);
            const enterTimer = setTimeout(() => setAnimationClass('animate-in'), 10);

            const badgeTimer = setTimeout(() => setShowBadge(true), 1000);

            const hideTimer = setTimeout(() => {
                handleClose();
            }, duration);

            return () => {
                clearTimeout(enterTimer);
                clearTimeout(badgeTimer);
                clearTimeout(hideTimer);
            };
        }
    }, [isVisible, duration]);

    const handleClose = (): void => {
        setAnimationClass('animate-out');
        setTimeout(() => {
            setShouldRender(false);
            setAnimationClass('');
            setShowBadge(false);
            onClose();
        }, 400);
    };

    if (!shouldRender) return null;

    return (
        <div className={`toast-overlay ${animationClass}`}>
            <div className="toast-backdrop" onClick={handleClose} />
            <div className="toast-content">
                <span className="toast-message">{message}</span>
                <div className={`badge-image-wrapper${showBadge ? " badge-pop-in" : ""}`}>
                    <img
                        src={icon_url}
                        alt="Badge Icon"
                        className="badge-image"
                    />
                </div>
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
          display: flex;
          flex-direction: column;
          align-items: center;
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
          margin-bottom: 16px;
        }

        .badge-image-wrapper {
          opacity: 0;
          transform: scale(0.7);
          transition: opacity 0.4s cubic-bezier(0.22, 1, 0.36, 1), transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: opacity, transform;
          display: flex;
          justify-content: center;
        }

        .badge-image-wrapper.badge-pop-in {
          opacity: 1;
          transform: scale(1.15);
          animation: badge-pop 0.4s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @keyframes badge-pop {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }
          70% {
            opacity: 1;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1.0);
          }
        }

        .badge-image {
          width: 150px;
          height: 150px;
          object-fit: contain;
          margin-top: 8px;
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

export default BadgeToast;