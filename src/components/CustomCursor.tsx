import { useEffect, useRef, useState } from 'react';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<HTMLDivElement[]>([]);
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const trailPositions = useRef(Array.from({ length: 5 }, () => ({ x: -100, y: -100 })));
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect touch devices — hide custom cursor on mobile
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, [data-cursor-hover]');
      setIsHovering(!!interactive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseover', handleMouseOver);

    // Animation loop
    let animationId: number;
    const animate = () => {
      // Dot follows exactly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
      }

      // Ring follows with delay
      ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
      ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }

      // Trail particles follow with cascading delay
      for (let i = 0; i < trailPositions.current.length; i++) {
        const target = i === 0 ? mousePos.current : trailPositions.current[i - 1];
        const speed = 0.08 - i * 0.012;
        trailPositions.current[i].x += (target.x - trailPositions.current[i].x) * speed;
        trailPositions.current[i].y += (target.y - trailPositions.current[i].y) * speed;
        if (trailRefs.current[i]) {
          trailRefs.current[i].style.transform = `translate(${trailPositions.current[i].x}px, ${trailPositions.current[i].y}px)`;
        }
      }

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('resize', checkMobile);
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Don't render on mobile / touch devices
  if (isMobile) return null;

  return (
    <>
      {/* Hide default cursor globally */}
      <style>{`
        *, *::before, *::after {
          cursor: none !important;
        }
      `}</style>

      {/* Trail particles */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`trail-${i}`}
          ref={(el) => { if (el) trailRefs.current[i] = el; }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: `${3 - i * 0.4}px`,
            height: `${3 - i * 0.4}px`,
            marginLeft: `${-(3 - i * 0.4) / 2}px`,
            marginTop: `${-(3 - i * 0.4) / 2}px`,
            borderRadius: '50%',
            backgroundColor: `rgba(0, 212, 255, ${0.3 - i * 0.05})`,
            pointerEvents: 'none',
            zIndex: 9997,
            willChange: 'transform',
          }}
        />
      ))}

      {/* Outer ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '48px' : '32px',
          height: isHovering ? '48px' : '32px',
          marginLeft: isHovering ? '-24px' : '-16px',
          marginTop: isHovering ? '-24px' : '-16px',
          borderRadius: '50%',
          border: `1.5px solid rgba(0, 212, 255, ${isHovering ? 0.7 : 0.35})`,
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'width 0.3s ease, height 0.3s ease, margin 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          willChange: 'transform',
          boxShadow: isHovering
            ? '0 0 20px rgba(0, 212, 255, 0.25), inset 0 0 20px rgba(0, 212, 255, 0.08)'
            : '0 0 8px rgba(0, 212, 255, 0.1)',
          backdropFilter: isHovering ? 'blur(1px)' : 'none',
        }}
      >
        {/* Crosshair lines inside ring */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: isHovering ? '4px' : '3px',
          right: isHovering ? '4px' : '3px',
          height: '1px',
          background: `rgba(0, 212, 255, ${isHovering ? 0.3 : 0.15})`,
          transition: 'all 0.3s ease',
        }} />
        <div style={{
          position: 'absolute',
          left: '50%',
          top: isHovering ? '4px' : '3px',
          bottom: isHovering ? '4px' : '3px',
          width: '1px',
          background: `rgba(0, 212, 255, ${isHovering ? 0.3 : 0.15})`,
          transition: 'all 0.3s ease',
        }} />
      </div>

      {/* Inner dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isClicking ? '4px' : isHovering ? '6px' : '5px',
          height: isClicking ? '4px' : isHovering ? '6px' : '5px',
          marginLeft: isClicking ? '-2px' : isHovering ? '-3px' : '-2.5px',
          marginTop: isClicking ? '-2px' : isHovering ? '-3px' : '-2.5px',
          borderRadius: '50%',
          backgroundColor: '#00D4FF',
          pointerEvents: 'none',
          zIndex: 9999,
          transition: 'width 0.15s ease, height 0.15s ease, margin 0.15s ease, box-shadow 0.15s ease',
          willChange: 'transform',
          boxShadow: `0 0 ${isHovering ? '12px' : '6px'} rgba(0, 212, 255, ${isHovering ? 0.8 : 0.6}), 0 0 ${isHovering ? '24px' : '12px'} rgba(0, 212, 255, ${isHovering ? 0.3 : 0.15})`,
        }}
      />
    </>
  );
}
