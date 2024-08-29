import React, { useState, useEffect, useRef } from 'react';
import './ShareButton.css'; // Import the updated CSS file

const ShareButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 20, left: 0 });
  const navRef = useRef(null);
  const startYRef = useRef(0);
  const isDraggingRef = useRef(false);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };

  const handleMouseDown = (e) => {
    startYRef.current = e.clientY;
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;

    const movementY = e.clientY - startYRef.current;
    setPosition(prev => {
      const nav = navRef.current;
      if (nav) {
        const navHeight = parseInt(window.getComputedStyle(nav).height, 10);
        const newTop = Math.max(1, Math.min(window.innerHeight - navHeight, prev.top + movementY));
        return { ...prev, top: newTop };
      }
      return prev;
    });
    startYRef.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  useEffect(() => {
    const handleMouseLeave = () => {
      isDraggingRef.current = false;
    };

    const nav = navRef.current;
    if (nav) {
      nav.addEventListener('mousedown', handleMouseDown);
    }

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (nav) {
        nav.removeEventListener('mousedown', handleMouseDown);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
      className={`draggable-nav ${isOpen ? 'open' : ''}`}
    >
      <div className="nav-content">
        <div className="toggle-btn" onClick={handleToggle}>
          <i className='bx bxs-share-alt'></i>
        </div>
      </div>
      <div className="nav-content">
        <span style={{ '--i': 1 }}>
          <a href="#"><i className='bx bxl-whatsapp-square'></i></a>
        </span>
        <span style={{ '--i': 2 }}>
          <a href="#"><i className='bx bxl-instagram-alt'></i></a>
        </span>
        <span style={{ '--i': 3 }}>
          <a href="#"><i className='bx bxl-twitter'></i></a>
        </span>
        <span style={{ '--i': 4 }}>
          <a href="#"><i className='bx bxs-map'></i></a>
        </span>
        <span style={{ '--i': 5 }}>
          <a href="#"><i className='bx bxs-cog'></i></a>
        </span>
      </div>
    </nav>
  );
};

export default ShareButton;
