import React from 'react';
import { motion } from 'framer-motion';

const AnimatedClock = ({ isNight = true, peakHour = 23, size = 300 }) => {
  const hour12 = peakHour % 12;
  const hourDegrees = (hour12 / 12) * 360 - 90; // -90 to start at 12 o'clock
  
  const primaryColor = isNight ? '#8C52FF' : '#FDCB6E';
  const secondaryColor = isNight ? '#6B3FA0' : '#F39C12';
  const glowColor = isNight ? 'rgba(140, 82, 255, 0.5)' : 'rgba(253, 203, 110, 0.5)';
  
  return (
    <div 
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: size,
        height: size,
        opacity: 0.35,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Outer glow ring */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          border: `3px solid ${primaryColor}`,
          boxShadow: `0 0 30px ${glowColor}, 0 0 60px ${glowColor}`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Clock face */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: size,
          height: size,
          borderRadius: '50%',
          border: `4px solid rgba(255, 255, 255, 0.8)`,
          background: `radial-gradient(circle at center, ${isNight ? 'rgba(48, 43, 99, 0.4)' : 'rgba(231, 76, 60, 0.2)'} 0%, transparent 70%)`,
          boxShadow: `inset 0 0 30px ${glowColor}`,
        }}
      >
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => {
          const angle = (i / 12) * 360;
          const isMain = i % 3 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: isMain ? 4 : 2,
                height: isMain ? 20 : 12,
                background: isMain ? '#ffffff' : 'rgba(255, 255, 255, 0.6)',
                borderRadius: 2,
                transformOrigin: 'center center',
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${size / 2 - 20}px)`,
              }}
            />
          );
        })}
        
        {/* Hour hand */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 8,
            height: size * 0.25,
            background: 'linear-gradient(to top, #ffffff, rgba(255,255,255,0.8))',
            borderRadius: 4,
            transformOrigin: 'center bottom',
            transform: `translate(-50%, -100%) rotate(${hourDegrees}deg)`,
            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
          }}
          animate={{
            filter: ['drop-shadow(0 0 5px rgba(255,255,255,0.3))', 'drop-shadow(0 0 15px rgba(255,255,255,0.6))', 'drop-shadow(0 0 5px rgba(255,255,255,0.3))'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Minute hand */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4,
            height: size * 0.35,
            background: 'linear-gradient(to top, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
            borderRadius: 2,
            transformOrigin: 'center bottom',
            transform: 'translate(-50%, -100%) rotate(0deg)',
          }}
        />
        
        {/* Second hand - animated */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 2,
            height: size * 0.4,
            background: primaryColor,
            borderRadius: 1,
            transformOrigin: 'center bottom',
            boxShadow: `0 0 10px ${primaryColor}`,
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: 'linear',
          }}
          initial={{
            x: '-50%',
            y: '-100%',
          }}
        />
        
        {/* Center dot */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: primaryColor,
            boxShadow: `0 0 20px ${primaryColor}`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            boxShadow: [
              `0 0 20px ${primaryColor}`,
              `0 0 40px ${primaryColor}`,
              `0 0 20px ${primaryColor}`,
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
      
      {/* Floating particles around clock */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 4 + Math.random() * 4,
            height: 4 + Math.random() * 4,
            borderRadius: '50%',
            background: primaryColor,
            boxShadow: `0 0 10px ${primaryColor}`,
          }}
          animate={{
            x: [
              Math.cos((i / 8) * Math.PI * 2) * (size * 0.6),
              Math.cos((i / 8) * Math.PI * 2 + 0.5) * (size * 0.7),
              Math.cos((i / 8) * Math.PI * 2) * (size * 0.6),
            ],
            y: [
              Math.sin((i / 8) * Math.PI * 2) * (size * 0.6),
              Math.sin((i / 8) * Math.PI * 2 + 0.5) * (size * 0.7),
              Math.sin((i / 8) * Math.PI * 2) * (size * 0.6),
            ],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.3,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedClock;
