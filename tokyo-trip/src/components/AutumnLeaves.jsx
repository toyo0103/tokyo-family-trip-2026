import { useEffect, useState } from 'react';

const LEAF_SYMBOLS = ['🍁', '🍂', '🍁', '🍃', '🍁', '🍂']; 

export default function AutumnLeaves() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    // Generate static leaves to avoid hydration mismatch if doing SSR, 
    // but here it's SPA so it's fine.
    const newLeaves = Array.from({ length: 25 }).map((_, i) => {
      const left = Math.random() * 100; // 0 to 100%
      const animationDuration = 10 + Math.random() * 20; // 10 to 30s
      const animationDelay = Math.random() * 20; // 0 to 20s
      const size = 0.6 + Math.random() * 1.2; // 0.6 to 1.8 rem
      const opacity = 0.05 + Math.random() * 0.2; // 0.05 to 0.25 (Very subtle!)
      const symbol = LEAF_SYMBOLS[Math.floor(Math.random() * LEAF_SYMBOLS.length)];
      const isForeground = Math.random() > 0.5;
      
      return {
        id: i,
        left,
        animationDuration,
        animationDelay,
        size,
        opacity,
        symbol,
        isForeground
      };
    });
    setLeaves(newLeaves);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[0] overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute top-[-10%] animate-fall"
          style={{
            left: `${leaf.left}%`,
            fontSize: `${leaf.size}rem`,
            opacity: leaf.opacity,
            animationDuration: `${leaf.animationDuration}s`,
            animationDelay: `-${leaf.animationDelay}s`, // Negative delay so some start already on screen
            filter: leaf.isForeground ? 'blur(1px)' : 'blur(3px)', // Depth of field effect
          }}
        >
          <div className="animate-sway" style={{ animationDuration: `${leaf.animationDuration / 3}s` }}>
            {leaf.symbol}
          </div>
        </div>
      ))}
    </div>
  );
}
