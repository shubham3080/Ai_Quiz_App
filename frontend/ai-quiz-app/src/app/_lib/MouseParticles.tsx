'use client';

import { useEffect, useState } from 'react';

export default function MouseParticles() {
  const [particles, setParticles] = useState<Array<{x: number, y: number, id: number}>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const centerContainer = document.querySelector('.center-container');
      if (centerContainer && centerContainer.contains(e.target as Node)) {
        return;
      }

      const newParticle = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };

      setParticles(prev => [...prev.slice(-30), newParticle]); 

      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-ping"
          style={{
            left: particle.x - 8,
            top: particle.y - 8,
          }}
        />
      ))}
    </div>
  );
}