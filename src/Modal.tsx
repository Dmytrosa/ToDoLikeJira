import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface FadeInWindowProps {
  children: React.ReactNode;
  onClose: () => void;
}

const FadeInWindow: React.FC<FadeInWindowProps> = ({ children, onClose }) => {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timeout = setTimeout(() => {
      setIsVisible(false);
      onClose()
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className={`fade-in-window ${isVisible ? 'visible' : 'hidden'}`} ref={modalRef}>
      <p className="alertText">{children}</p>
    </div>
  );
};

export default FadeInWindow;
