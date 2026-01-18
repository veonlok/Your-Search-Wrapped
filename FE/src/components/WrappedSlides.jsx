/**
 * @fileoverview Wrapped Slides Components
 * A collection of animated slide components for displaying search history analytics
 * in a Spotify Wrapped-style presentation.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo, useRef } from 'react';
import {
  Search,
  TrendingUp,
  Clock,
  Zap,
  Coffee,
  Flame,
  Star,
  Target,
  Lightbulb,
  Glasses,
  PartyPopper,
  Brain,
  Moon,
  Sun,
  Calendar,
  Crown,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AnimatedClock from './AnimatedClock';
import { MBTI_DICTIONARY } from '../constants/mbtiDictionary';
import { KEYWORD_COLORS, FUN_STATS_COLORS, MOOD_COLORS, getBarColor } from '../constants/colors';
import { DETAIL_ICONS } from '../constants/icons';
import './WrappedSlides.css';

/**
 * Animated counter component that counts up from 0 to a target value
 * @param {Object} props - Component props
 * @param {number} props.value - Target value to count up to
 * @param {number} [props.duration=2] - Animation duration in seconds
 * @param {number} [props.delay=0.3] - Delay before animation starts in seconds
 */
const AnimatedCounter = ({ value, duration = 2, delay = 0.3 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const startTime = Date.now();
      const durationMs = duration * 1000;

      const updateValue = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.floor(value * eased));

        if (progress < 1) {
          requestAnimationFrame(updateValue);
        }
      };

      requestAnimationFrame(updateValue);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [value, duration, delay]);

  return <>{displayValue.toLocaleString()}</>;
};

// ===== 1. INTRO SLIDE =====
export const IntroSlide = () => {
  return (
    <div className="slide-container">
      <div className="animated-bg intro-bg" />
      
      {/* Spotify-style floating shapes */}
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.15) 0%, transparent 70%)',
          right: '-100px',
          top: '-100px',
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,0,0,0.1) 0%, transparent 70%)',
          left: '-50px',
          bottom: '-50px',
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, -15, 0],
          y: [0, -15, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />
      
      <motion.div 
        className="slide-content intro-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.p
          className="intro-label"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          Your
        </motion.p>
        
        <motion.h1
          className="intro-year"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 80 }}
        >
          2025
        </motion.h1>
        
        <motion.p
          className="intro-wrapped"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6, type: 'spring' }}
        >
          AI Wrapped
        </motion.p>
        
        <motion.div
          className="intro-accent-line"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          style={{
            width: '80px',
            height: '6px',
            background: '#000',
            borderRadius: '3px',
            marginTop: '1.5rem',
            transformOrigin: 'left',
          }}
        />
      </motion.div>
    </div>
  );
};

// ===== 2. TOTAL SEARCHES SLIDE =====
export const TotalSearchesSlide = ({ totalPrompts = 1247 }) => {
  const [phase, setPhase] = useState(0); // 0: intro, 1: number reveal, 2: full reveal
  const maxPhase = 2;
  
  const handleClick = (e) => {
    if (phase < maxPhase) {
      e.stopPropagation();
      setPhase(prev => prev + 1);
    }
  };

  // Pre-generate stable bubble configurations
  const bubbles = useMemo(() => 
    [...Array(8)].map((_, i) => ({
      size: 15 + (i * 5) % 25,
      left: 15 + (i * 11) % 70,
      top: 12 + (i * 13) % 76,
      yMove: 35 + (i * 7) % 25,
      duration: 4 + (i % 3),
    })), []
  );

  return (
    <div className="slide-container total-searches-slide" onClick={handleClick} style={{ cursor: phase < maxPhase ? 'pointer' : 'default' }}>
      <div className="animated-bg total-bg" />
      
      {/* Tap to continue hint */}
      {phase < maxPhase && (
        <motion.div
          className="tap-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.9rem',
            zIndex: 100,
          }}
        >
          Tap to continue
        </motion.div>
      )}
      
      {/* Spotify-style reverberating circles - appear on phase 1 */}
      <AnimatePresence>
        {phase >= 1 && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 180 + i * 120,
              height: 180 + i * 120,
              borderRadius: '50%',
              border: `3px solid rgba(255, 255, 255, ${0.5 - i * 0.08})`,
              left: '50%',
              top: '50%',
              marginLeft: -(90 + i * 60),
              marginTop: -(90 + i * 60),
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5 - i * 0.08, 0.8 - i * 0.12, 0.5 - i * 0.08],
            }}
            transition={{
              duration: 2 + i * 0.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.15,
            }}
          />
        ))}
      </AnimatePresence>
      
      {/* Center glow pulse - intensifies on reveal */}
      <motion.div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 60%)',
          left: '50%',
          top: '50%',
          marginLeft: -200,
          marginTop: -200,
        }}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: phase >= 1 ? [1, 1.4, 1] : 0.5,
          opacity: phase >= 1 ? [0.6, 0.2, 0.6] : 0,
        }}
        transition={{
          duration: 2.5,
          repeat: phase >= 1 ? Infinity : 0,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating bubbles - appear after full reveal */}
      {phase >= 2 && bubbles.map((bubble, i) => (
        <motion.div
          key={`bubble-${i}`}
          style={{
            position: 'absolute',
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            y: [0, -bubble.yMove, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [0.9, 1.2, 0.9],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: i * 0.2,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      <motion.div 
        className="slide-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {/* Phase 0: Teaser text */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="teaser"
              className="stat-intro-large"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              transition={{ duration: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
              >
                <Search size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.span 
                style={{ fontSize: '5rem', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Ready to see<br/>your number?
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: Main content */}
        {phase >= 1 && (
          <>
            <motion.div
              className="stat-intro-large"
              initial={{ y: -50, opacity: 0, filter: 'blur(10px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.div
                className="intro-icon-wrap"
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
                >
                  <Search size={28} strokeWidth={2.5} color="#fff" />
                </motion.div>
              </motion.div>
              <span>This year you made</span>
            </motion.div>
            
            <motion.div
              className="mega-number-container"
              initial={{ scale: 0, opacity: 0, rotateX: 90 }}
              animate={{ scale: 1, opacity: 1, rotateX: 0 }}
              transition={{ delay: 0.4, duration: 0.8, type: 'spring', stiffness: 80 }}
            >
              <motion.h1 
                className="mega-number glow-number"
                animate={phase >= 2 ? { 
                  textShadow: [
                    '0 0 40px rgba(255,255,255,0.5)',
                    '0 0 80px rgba(255,255,255,0.8)',
                    '0 0 40px rgba(255,255,255,0.5)',
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AnimatedCounter value={totalPrompts} duration={1.8} delay={0.6} />
              </motion.h1>
            </motion.div>
            
            <motion.p
              className="stat-label-large"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
            >
              searches
            </motion.p>
          </>
        )}
        
      </motion.div>
    </div>
  );
};

// ===== 3. PERSONALITY REVEAL SLIDE =====
export const PersonalitySlide = ({ personality = { code: 'ENTP' }}) => {
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  const IconComponent = mbti.icon;
  const [phase, setPhase] = useState(0); // 0: mystery, 1: icon reveal, 2: code reveal, 3: full reveal
  const maxPhase = 3;
  
  // Auto-progress through phases with 2-3 second delays
  useEffect(() => {
    const timers = [];
    
    if (phase === 0) {
      timers.push(setTimeout(() => setPhase(1), 2500));
    } else if (phase === 1) {
      timers.push(setTimeout(() => setPhase(2), 2500));
    } else if (phase === 2) {
      timers.push(setTimeout(() => setPhase(3), 2500));
    }
    
    return () => timers.forEach(t => clearTimeout(t));
  }, [phase]);
  
  return (
    <div className="slide-container">
      <motion.div 
        className="animated-bg personality-bg"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          background: `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)` 
        }}
        transition={{ duration: 1.5 }}
      />
      
      <motion.div
        className="personality-glow"
        style={{ background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: phase >= 1 ? 2.5 : 0, opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />
      
      <motion.div className="slide-content">
        {/* Phase 0: Mystery text */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="mystery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, type: 'spring', stiffness: 150 }}
              >
                <Brain size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.p
                style={{ fontSize: '5rem', color: 'white', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50, filter: 'blur(15px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                We found your<br/>AI personality
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: Eyebrow */}
        {phase >= 1 && (
          <motion.p
            className="slide-eyebrow"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            Your AI Personality Type
          </motion.p>
        )}
        
        {/* Phase 1+: Icon Ring */}
        {phase >= 1 && (
          <motion.div
            className="personality-icon-ring"
            style={{ borderColor: 'rgba(255,255,255,0.6)', boxShadow: `0 0 40px ${mbti.color[0]}50` }}
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 15 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ 
                scale: 1, 
                rotate: phase === 1 ? 360 : 0 
              }}
              transition={{ 
                scale: { delay: 0.3, type: 'spring' },
                rotate: phase === 1 ? { duration: 2, repeat: Infinity, ease: 'linear' } : { duration: 0.5 }
              }}
            >
              <IconComponent size={56} color="#fff" />
            </motion.div>
          </motion.div>
        )}
        
        {/* Phase 2+: Personality Card */}
        {phase >= 2 && (
          <motion.div
            className="personality-card-new"
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ y: 60, opacity: 0, scale: 0.8, rotateX: 45 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 80 }}
          >
            <motion.p 
              className="personality-code-big"
              initial={{ opacity: 0, letterSpacing: '0.5em' }}
              animate={{ opacity: 1, letterSpacing: '0.15em' }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {personality.code}
            </motion.p>
            <motion.h1 
              className="personality-type-name"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              {mbti.name}
            </motion.h1>
          </motion.div>
        )}
        
        {/* Phase 3: Traits and Description */}
        {phase >= 3 && (
          <>
            <div className="personality-traits-new">
              {mbti.traits.map((trait, i) => (
                <motion.span
                  key={trait}
                  className="trait-pill"
                  style={{ borderColor: 'white' }}
                  initial={{ scale: 0, y: 30, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.15, type: 'spring', stiffness: 200 }}
                >
                  {trait}
                </motion.span>
              ))}
            </div>
            
            <motion.p
              className="personality-desc-new"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              {mbti.description}
            </motion.p>
          </>
        )}
      </motion.div>
    </div>
  );
};

// ===== 4. PERSONALITY DEEP DIVE SLIDE =====
export const PersonalityDeepDiveSlide = ({ personality = { code: 'ENTP' }}) => {
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  const IconComponent = mbti.icon;
  
  return (
    <div className="slide-container">
      <motion.div 
        className="animated-bg"
        style={{ background: `linear-gradient(135deg, ${mbti.color[0]}20 0%, #0a0a0a 50%, ${mbti.color[1]}20 100%)` }}
      />
      
      <motion.div className="slide-content deep-dive-content">
        <motion.div
          className="deep-dive-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <IconComponent size={32} color={mbti.color[0]} />
          <span style={{ color: mbti.color[0] }}>{mbti.name}</span>
        </motion.div>
        
        <motion.h2
          className="deep-dive-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Deep Dive
        </motion.h2>
        
        <div className="deep-dive-cards">
          {Object.entries(mbti.details).map(([key, value], i) => {
            const DetailIcon = DETAIL_ICONS[key];
            return (
              <motion.div
                key={key}
                className="deep-dive-card"
                style={{ borderColor: mbti.color[i % 2] }}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
              >
                <div className="deep-dive-card-icon" style={{ background: mbti.color[i % 2] }}>
                  <DetailIcon size={24} color="white" />
                </div>
                <div className="deep-dive-card-content">
                  <span className="deep-dive-card-label">
                    {key === 'funFact' ? 'Fun Fact' : key.charAt(0).toUpperCase() + key.slice(1)}
                  </span>
                  <span className="deep-dive-card-value">{value}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <motion.div
          className="mbti-badge-row"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {personality.code.split('').map((letter, i) => (
            <motion.div
              key={i}
              className="mbti-letter-badge"
              style={{ background: mbti.color[i % 2] }}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.1 + i * 0.1, type: 'spring' }}
            >
              {letter}
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

// ===== 5. WORD CLOUD SLIDE - 3D SPHERE TO LIST =====
export const WordCloudSlide = ({ keywords = [
  { word: 'Python', count: 156 },
  { word: 'Machine Learning', count: 134 },
  { word: 'API', count: 98 },
  { word: 'React', count: 87 },
  { word: 'Data', count: 76 },
  { word: 'JavaScript', count: 72 },
  { word: 'Algorithm', count: 65 },
  { word: 'Database', count: 58 },
  { word: 'AI', count: 54 },
  { word: 'CSS', count: 48 }
]}) => {
  const [phase, setPhase] = useState('orbit'); // 'orbit' -> 'list'
  
  useEffect(() => {
    const timer = setTimeout(() => setPhase('list'), 4000);
    return () => clearTimeout(timer);
  }, []);

  const maxCount = Math.max(...keywords.map(k => typeof k === 'object' ? k.count : 50));

  return (
    <div className="slide-container">
      <motion.div 
        className="animated-bg word-cloud-bg"
        animate={{
          background: phase === 'list' 
            ? 'radial-gradient(circle at 50% 50%, #1a1a2e 0%, #0a0a0a 100%)'
            : 'radial-gradient(circle at 50% 50%, #8C52FF15 0%, #0a0a0a 60%, #1DB95410 100%)'
        }}
        transition={{ duration: 1 }}
      />
      
      <motion.div className="slide-content">
        <motion.p
          className="slide-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Most Used Keywords
        </motion.p>
        
        <motion.h2
          className="word-cloud-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          Your Vocabulary
        </motion.h2>
        
        <div className="keyword-stage">
          <AnimatePresence mode="wait">
            {phase === 'orbit' ? (
              <motion.div
                key="orbit"
                className="keyword-orbit-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5 }}
              >
                {keywords.slice(0, 10).map((item, i) => {
                  const word = typeof item === 'string' ? item : item.word;
                  const count = typeof item === 'object' ? item.count : 50;
                  const size = 2.5 + (count / maxCount) * 3.5; // MUCH bigger
                  const angle = (i / 10) * 360;
                  const radius = 220 + (i % 3) * 90; // MUCH bigger
                  const duration = 8 + i * 0.5;
                  
                  return (
                    <motion.span
                      key={`${word}-${i}`}
                      className="orbit-word"
                      style={{ 
                        fontSize: `${size}rem`,
                        color: KEYWORD_COLORS[i % KEYWORD_COLORS.length],
                      }}
                      initial={{ 
                        opacity: 0, 
                        scale: 0,
                        x: 0,
                        y: 0
                      }}
                      animate={{ 
                        opacity: [0.6, 1, 0.6],
                        scale: [0.9, 1.1, 0.9],
                        x: [
                          Math.cos((angle * Math.PI) / 180) * radius,
                          Math.cos(((angle + 120) * Math.PI) / 180) * radius,
                          Math.cos(((angle + 240) * Math.PI) / 180) * radius,
                          Math.cos((angle * Math.PI) / 180) * radius
                        ],
                        y: [
                          Math.sin((angle * Math.PI) / 180) * radius * 0.6,
                          Math.sin(((angle + 120) * Math.PI) / 180) * radius * 0.6,
                          Math.sin(((angle + 240) * Math.PI) / 180) * radius * 0.6,
                          Math.sin((angle * Math.PI) / 180) * radius * 0.6
                        ]
                      }}
                      transition={{ 
                        duration: duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: i * 0.1
                      }}
                    >
                      {word}
                    </motion.span>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                key="list"
                className="keyword-list"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {keywords.slice(0, 8).map((item, i) => {
                  const word = typeof item === 'string' ? item : item.word;
                  const count = typeof item === 'object' ? item.count : 50;
                  const percentage = Math.round((count / maxCount) * 100);
                  
                  return (
                    <motion.div
                      key={word}
                      className="keyword-row"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <span className="keyword-rank">#{i + 1}</span>
                      <span className="keyword-name" style={{ color: KEYWORD_COLORS[i % KEYWORD_COLORS.length] }}>
                        {word}
                      </span>
                      <div className="keyword-bar-container">
                        <motion.div
                          className="keyword-bar"
                          style={{ background: KEYWORD_COLORS[i % KEYWORD_COLORS.length] }}
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
                        />
                      </div>
                      <span className="keyword-count">{count}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <motion.div
          className="word-cloud-stat"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
        >
          <Brain size={20} />
          <span>{keywords.length * 12}+ unique terms used</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ===== 6. PEAK TIME SLIDE =====
export const PeakTimesSlide = ({ peakData = {
  time: '11:00 PM',
  period: 'Night Owl',
  isNight: true,
  avgSessionLength: '23 min',
  mostActiveDay: 'Wednesday',
  totalHours: 142
}}) => {
  const isNight = peakData.isNight;
  const [phase, setPhase] = useState(0); // 0: intro, 1: title + icon, 2: stats
  const maxPhase = 2;
  
  const handleClick = (e) => {
    if (phase < maxPhase) {
      e.stopPropagation();
      setPhase(prev => prev + 1);
    }
  };
  
  return (
    <div className={`slide-container peak-mega ${isNight ? 'night-mode' : 'day-mode'}`} onClick={handleClick} style={{ cursor: phase < maxPhase ? 'pointer' : 'default' }}>
      {/* Tap to continue hint */}
      {phase < maxPhase && (
        <motion.div
          className="tap-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          Tap to continue
        </motion.div>
      )}
      <motion.div 
        className="animated-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: isNight 
            ? 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            : 'linear-gradient(180deg, #f39c12 0%, #e74c3c 50%, #8e44ad 100%)'
        }}
      />
      
      {/* Animated Clock in Background - appears on phase 1 */}
      {phase >= 1 && <AnimatedClock isNight={isNight} peakHour={isNight ? 23 : 14} size={700} />}
      
      {/* Animated stars for night - fade in progressively */}
      {isNight && (
        <div className="peak-bg-elements">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              style={{
                left: `${10 + (i * 7) % 80}%`,
                top: `${5 + (i * 11) % 90}%`,
                width: 2,
                height: 2,
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '50%',
                position: 'absolute',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: phase >= 1 ? [0.2, 0.8, 0.2] : 0,
                scale: phase >= 1 ? [0.8, 1.5, 0.8] : 0,
              }}
              transition={{
                duration: 2 + (i % 3),
                repeat: Infinity,
                delay: phase >= 1 ? i * 0.1 : 0,
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div className="slide-content peak-mega-content">
        {/* Phase 0: Teaser */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="teaser"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 180 }}
              >
                <Clock size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.p
                style={{ fontSize: '5rem', color: 'white', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50, filter: 'blur(12px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                When do you<br/>search the most?
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: Eyebrow */}
        {phase >= 1 && (
          <motion.p
            className="slide-eyebrow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Your Prime Time
          </motion.p>
        )}
        
        {/* Phase 1+: Icon with dramatic entrance */}
        {phase >= 1 && (
          <motion.div
            className="peak-mega-icon"
            initial={{ scale: 0, rotate: isNight ? -90 : 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 12 }}
          >
            <motion.div
              animate={phase >= 2 ? { 
                scale: [1, 1.1, 1],
                filter: ['drop-shadow(0 0 20px rgba(255,255,255,0.3))', 'drop-shadow(0 0 40px rgba(255,255,255,0.6))', 'drop-shadow(0 0 20px rgba(255,255,255,0.3))']
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {isNight ? <Moon size={64} strokeWidth={1.5} /> : <Sun size={64} strokeWidth={1.5} />}
            </motion.div>
          </motion.div>
        )}
        
        {/* Phase 1+: Title with impact */}
        {phase >= 1 && (
          <motion.h1
            className="peak-mega-title"
            initial={{ scale: 2, opacity: 0, filter: 'blur(20px)' }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {peakData.period}
          </motion.h1>
        )}
        
        {/* Phase 1+: Time badge */}
        {phase >= 1 && (
          <motion.div
            className="peak-mega-time"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <Clock size={24} />
            </motion.div>
            <span>Peak at <strong>{peakData.time}</strong></span>
          </motion.div>
        )}
        
      </motion.div>
    </div>
  );
};

// ===== 7. MOOD TIMELINE SLIDE =====
export const MoodTimelineSlide = ({ moodData = [
  { month: 'Jan', value: 45 },
  { month: 'Feb', value: 52 },
  { month: 'Mar', value: 78 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 89 },
  { month: 'Jun', value: 72 },
  { month: 'Jul', value: 58 },
  { month: 'Aug', value: 94 },
  { month: 'Sep', value: 81 },
  { month: 'Oct', value: 76 },
  { month: 'Nov', value: 88 },
  { month: 'Dec', value: 92 }
]}) => {
  const maxValue = Math.max(...moodData.map(d => d.value));
  const peakMonth = moodData.findIndex(d => d.value === maxValue);
  const [phase, setPhase] = useState(0); // 0: intro, 1: bars animate, 2: peak reveal
  const maxPhase = 2;
  
  const handleClick = (e) => {
    if (phase < maxPhase) {
      e.stopPropagation();
      setPhase(prev => prev + 1);
    }
  };
  
  return (
    <div className="slide-container" onClick={handleClick} style={{ cursor: phase < maxPhase ? 'pointer' : 'default' }}>
      {/* Tap to continue hint */}
      {phase < maxPhase && (
        <motion.div
          className="tap-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          Tap to continue
        </motion.div>
      )}
      <div className="animated-bg mood-bg" style={{ background: MOOD_COLORS.BACKGROUND }} />
      
      <motion.div className="slide-content mood-content">
        {/* Phase 0: Teaser */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="teaser"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0, y: -30 }}
                animate={{ scale: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 10 }}
              >
                <TrendingUp size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.p
                style={{ fontSize: '5rem', color: 'white', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                How did your<br/>curiosity evolve?
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: Header */}
        {phase >= 1 && (
          <>
            <motion.p
              className="slide-eyebrow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Your Year in Searches
            </motion.p>
        
            <motion.h2
              className="mood-title"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              Activity Timeline
            </motion.h2>
          </>
        )}
        
        {/* Phase 1+: Chart container - separate and fixed height */}
        {phase >= 1 && (
          <div className="mood-chart-container">
            <div className="mood-chart-mega">
              {moodData.map((data, i) => (
                <motion.div
                  key={data.month}
                  className={`mood-bar-wrap${phase >= 2 && i === peakMonth ? ' peak' : ''}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.06, type: 'spring', stiffness: 120 }}
                  style={{ position: 'relative' }}
                >
                  {/* Phase 2: Peak crown reveal */}
                  {i === peakMonth && phase >= 2 && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 10,
                      }}
                      initial={{ opacity: 0, y: 20, scale: 0 }}
                      animate={{ opacity: 1, y: -40, scale: 1 }}
                      transition={{ duration: 0.5, type: 'spring', stiffness: 200 }}
                    >
                      <motion.div
                        animate={{ 
                          boxShadow: [
                            '0 0 25px rgba(29, 185, 84, 0.6)',
                            '0 0 50px rgba(29, 185, 84, 0.9)',
                            '0 0 25px rgba(29, 185, 84, 0.6)',
                          ],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        style={{
                          width: 34,
                          height: 34,
                          background: 'linear-gradient(135deg, #1DB954 0%, #1ed760 100%)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Crown size={16} color="#fff" />
                      </motion.div>
                    </motion.div>
                  )}
                  <div className="mood-bar-inner">
                    <motion.div
                      className="mood-bar-fill"
                      style={{ background: getBarColor(data.value, maxValue, i, peakMonth) }}
                      initial={{ height: 0 }}
                      animate={{ height: `${(data.value / maxValue) * 100}%` }}
                      transition={{ delay: 0.5 + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                  <motion.span 
                    className="mood-month-label"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 + i * 0.06 }}
                  >
                    {data.month}
                  </motion.span>
                </motion.div>
              ))}
            </div>
            
            {/* Phase 2: Insight - absolutely positioned below chart, inside chart container */}
            {phase >= 2 && (
              <motion.div
                className="mood-insight-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <motion.div
                  className="mood-insight-content"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.4, type: 'spring', stiffness: 200 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TrendingUp size={20} color="#4DB6AC" />
                  </motion.div>
                  <span><strong>{moodData[peakMonth].month}</strong> was your most curious month</span>
                </motion.div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ===== 8. TOP TOPIC EXPLOSION SLIDE =====
export const TopTopicSlide = ({ topTopic = 'Machine Learning', percentage = 34 }) => {
  const [phase, setPhase] = useState(0); // 0: buildup, 1: reveal, 2: stats
  const maxPhase = 2;
  
  const handleClick = (e) => {
    if (phase < maxPhase) {
      e.stopPropagation();
      setPhase(prev => prev + 1);
    }
  };

  return (
    <div className="slide-container" onClick={handleClick} style={{ cursor: phase < maxPhase ? 'pointer' : 'default' }}>
      {/* Tap to continue hint */}
      {phase < maxPhase && (
        <motion.div
          className="tap-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          Tap to continue
        </motion.div>
      )}
      <motion.div 
        className="animated-bg topic-explosion-bg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: phase >= 1 ? 1 : 0.5 }}
        transition={{ duration: 1 }}
      />
      
      {/* Subtle ambient glow - appears on reveal */}
      {phase >= 1 && (
        <motion.div
          style={{
            position: 'absolute',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,107,107,0.15) 0%, transparent 70%)',
            left: '10%',
            top: '10%',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      )}
      
      <motion.div className="slide-content topic-content">
        {/* Phase 0: Suspense buildup */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="buildup"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.5, filter: 'blur(30px)' }}
              transition={{ exit: { duration: 0.6 } }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: 360 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: 'spring', stiffness: 150 }}
              >
                <Target size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.p
                style={{ fontSize: '5rem', color: 'white', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50, filter: 'blur(20px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                What topic<br/>owned your year?
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: Topic Badge */}
        {phase >= 1 && (
          <motion.div
            className="topic-badge-big"
            initial={{ scale: 0, rotate: -20, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              <Target size={22} />
            </motion.div>
            <span>#1 Topic</span>
          </motion.div>
        )}
        
        {/* Phase 1+: Topic Title with dramatic entrance */}
        {phase >= 1 && (
          <motion.h1
            className="topic-title-huge"
            initial={{ scale: 3, opacity: 0, filter: 'blur(50px)', y: 50 }}
            animate={{ scale: 1, opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {topTopic}
          </motion.h1>
        )}

        {phase >= 1 && (
          <motion.div
            className="topic-glow-ring"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ delay: 0.8, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
        
        {/* Phase 2: Stats reveal */}
        {phase >= 2 && (
          <>
            <motion.div
              className="topic-percentage"
              initial={{ opacity: 0, y: 40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span 
                className="percentage-number"
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                {percentage}%
              </motion.span>
              <motion.span 
                className="percentage-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                of all your searches
              </motion.span>
            </motion.div>

            <motion.div
              className="topic-bar-container"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              style={{ transformOrigin: 'left' }}
            >
              <motion.div
                className="topic-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 0.8, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

// ===== 9. FUN STATS SLIDE =====
export const FunStatsSlide = ({ stats = {
  longestSession: '4h 23m',
  mostSearchesDay: 127,
  avgPerDay: 12,
  uniqueTopics: 89,
  curiosityScore: 94
}}) => {
  const [phase, setPhase] = useState(0); // 0: intro, 1: title, 2: cards reveal
  const maxPhase = 2;
  
  const handleClick = (e) => {
    if (phase < maxPhase) {
      e.stopPropagation();
      setPhase(prev => prev + 1);
    }
  };

  const statItems = [
    { label: 'Longest Session', value: stats.longestSession, icon: Flame, color: '#FF6B6B' },
    { label: 'Most in One Day', value: stats.mostSearchesDay, icon: Zap, color: '#FDCB6E' },
    { label: 'Daily Average', value: stats.avgPerDay, icon: Coffee, color: '#8C52FF' },
    { label: 'Unique Topics', value: stats.uniqueTopics, icon: Lightbulb, color: '#4ECDC4' },
    { label: 'Curiosity Score', value: `${stats.curiosityScore}%`, icon: Star, color: '#1DB954' },
  ];
  
  // Pre-generate stable bubble configurations
  const bubbles = useMemo(() => {
    return [...Array(10)].map((_, i) => ({
      color: FUN_STATS_COLORS[i % FUN_STATS_COLORS.length],
      size: 30 + (i * 7) % 40,
      left: 8 + (i * 9) % 80,
      top: 15 + (i * 17) % 70,
      yMove: 30 + (i * 5) % 20,
      xMove: ((i % 2) - 0.5) * 15,
      duration: 3.5 + (i % 4) * 0.5,
    }));
  }, []);
  
  return (
    <div className="slide-container" onClick={handleClick} style={{ cursor: phase < maxPhase ? 'pointer' : 'default' }}>
      {/* Tap to continue hint */}
      {phase < maxPhase && (
        <motion.div
          className="tap-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          Tap to continue
        </motion.div>
      )}
      <div className="animated-bg fun-stats-bg" />
      
      {/* Colorful floating bubbles - appear after phase 1 */}
      {phase >= 1 && bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: `radial-gradient(circle at 30% 30%, ${bubble.color}60, ${bubble.color}20)`,
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            boxShadow: `0 4px 20px ${bubble.color}40`,
          }}
          animate={{
            y: [0, -bubble.yMove, 0],
            x: [0, bubble.xMove, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [0.9, 1.15, 0.9],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: i * 0.35,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      <motion.div className="slide-content">
        {/* Phase 0: Teaser */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="teaser"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: [0, 1.2, 1], rotate: 0 }}
                transition={{ duration: 0.7, times: [0, 0.6, 1], type: 'spring', stiffness: 200 }}
              >
                <PartyPopper size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.p
                style={{ fontSize: '5rem', color: 'white', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35, duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
              >
                Let's look at<br/>your numbers
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Phase 1+: Title */}
        {phase >= 1 && (
          <>
            <motion.p
              className="slide-eyebrow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Fun Facts
            </motion.p>
            
          </>
        )}
        
        {/* Phase 2: Cards with dramatic stagger */}
        {phase >= 2 && (
          <div className="fun-stats-grid">
            {statItems.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="fun-stat-card"
                style={{ borderColor: stat.color }}
                initial={{ opacity: 0, scale: 0, y: 50, rotateY: 90 }}
                animate={{ opacity: 1, scale: 1, y: 0, rotateY: 0 }}
                transition={{ 
                  delay: i * 0.12, 
                  type: 'spring', 
                  stiffness: 120,
                  damping: 12
                }}
                whileHover={{ scale: 1.08, y: -8, boxShadow: `0 20px 40px ${stat.color}40` }}
              >
                <motion.div
                  initial={{ rotate: -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: i * 0.12 + 0.2, type: 'spring' }}
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3 }}
                  >
                    <stat.icon size={32} color={stat.color} />
                  </motion.div>
                </motion.div>
                <motion.span 
                  className="fun-stat-value"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.12 + 0.3 }}
                >
                  {stat.value}
                </motion.span>
                <motion.span 
                  className="fun-stat-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.12 + 0.4 }}
                >
                  {stat.label}
                </motion.span>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

// ===== 10. TOP LIST SLIDE =====
/**
 * Top 5 list slide showing the user's most searched topics
 * @param {Object} props - Component props
 * @param {string[]} props.topItems - Array of top 5 search items
 */
export const TopListSlide = ({ topItems = [
  'Python Programming',
  'Machine Learning',
  'React Development',
  'Data Analysis',
  'API Integration',
]}) => {
  // Pre-generate stable bubble configurations
  const bubbles = useMemo(() => 
    [...Array(12)].map((_, i) => ({
      size: 25 + (i * 6) % 35,
      left: 20 + (i * 7) % 60,
      top: 10 + (i * 11) % 80,
      yMove: 25 + (i * 5) % 30,
      xMove: ((i % 3) - 1) * 12,
      duration: 4 + (i % 4) * 0.7,
      colorType: i % 3,
    })), []
  );

  const getBackground = (type) => {
    if (type === 0) return 'radial-gradient(circle at 30% 30%, rgba(224,64,251,0.4), rgba(224,64,251,0.1))';
    if (type === 1) return 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3), rgba(255,255,255,0.05))';
    return 'radial-gradient(circle at 30% 30%, rgba(156,39,176,0.4), rgba(156,39,176,0.1))';
  };

  return (
    <div className="slide-container">
      <div className="animated-bg list-slide-bg" />
      
      {/* Ambient glow effect */}
      <motion.div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,64,251,0.3) 0%, transparent 60%)',
          left: '55%',
          top: '50%',
          marginLeft: -300,
          marginTop: -300,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Floating bubbles */}
      {bubbles.map((bubble, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: bubble.size,
            height: bubble.size,
            borderRadius: '50%',
            background: getBackground(bubble.colorType),
            left: `${bubble.left}%`,
            top: `${bubble.top}%`,
            boxShadow: '0 4px 20px rgba(224,64,251,0.2)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            y: [0, -bubble.yMove, 0],
            x: [0, bubble.xMove, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: i * 0.25,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div className="slide-content list-content">
        <motion.p
          className="list-eyebrow"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Your top searches
        </motion.p>

        <div className="list-items-clean">
          {topItems.map((item, index) => (
            <motion.div
              key={`${item}-${index}`}
              className="list-item-clean"
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.12, type: 'spring', stiffness: 100 }}
              whileHover={{ x: 10, transition: { duration: 0.2 } }}
            >
              <span className="list-number">{String(index + 1).padStart(2, '0')}</span>
              <motion.span 
                className="list-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 + index * 0.12 }}
              >
                {item}
              </motion.span>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="list-accent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          style={{
            width: '80px',
            height: '4px',
            background: 'linear-gradient(90deg, #E040FB 0%, rgba(255,255,255,0.4) 100%)',
            borderRadius: '2px',
            marginTop: '2.5rem',
            transformOrigin: 'left',
          }}
        />
      </motion.div>
    </div>
  );
};

// ===== 11. OUTRO SLIDE =====
export const OutroSlide = ({ onUploadMore, personality = { code: 'ENTP' }, wrappedData = {}, onShareClick }) => {
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  
  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShareClick) {
      onShareClick();
    }
  };
  
  return (
    <div className="slide-container">
      <motion.div 
        className="animated-bg outro-bg"
        style={{ background: `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)` }}
      />
      
      {/* Expanding celebration rings */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: '50%',
            border: '2px solid rgba(255,255,255,0.3)',
            left: '50%',
            top: '35%',
            marginLeft: -100,
            marginTop: -100,
          }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: [0.5, 2.5, 2.5],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: 'easeOut',
          }}
        />
      ))}
      
      {/* Confetti-like celebration particles */}
      <div className="outro-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 6 + Math.random() * 4,
              height: 6 + Math.random() * 4,
              borderRadius: i % 2 === 0 ? '50%' : '2px',
              background: i % 3 === 0 ? 'rgba(255, 255, 255, 0.8)' : i % 3 === 1 ? mbti.color[0] : 'rgba(255,255,255,0.5)',
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
            }}
            animate={{
              y: [0, -100 - Math.random() * 50, 0],
              x: [0, (Math.random() - 0.5) * 40, 0],
              opacity: [0, 0.9, 0],
              rotate: [0, 360, 720],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      <motion.div className="slide-content">
        <motion.div
          className="outro-emoji"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.3 }}
        >
          <PartyPopper size={80} color="#ffffff" strokeWidth={1.5} />
        </motion.div>
        
        <motion.h1
          className="outro-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          That's a wrap!
        </motion.h1>
        
        <motion.p
          className="outro-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          You're a true <strong>{mbti.name}</strong>.<br />
          Here's to more discoveries in 2026!
        </motion.p>
        
        <motion.button
          className="outro-cta"
          onClick={handleShareClick}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Share Your Wrapped
        </motion.button>
      </motion.div>
    </div>
  );
};

// ===== 12. SHARE MODAL =====
export const ShareModal = ({ isOpen, onClose, wrappedData = {} }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const cardRef = useRef(null);
  
  const personality = wrappedData.personality || { code: 'ENTP', type: 'Deep Diver' };
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  const topTopic = wrappedData.topTopic || 'Machine Learning';
  const totalPrompts = wrappedData.totalPrompts || 0;
  const peakData = wrappedData.peakData || { period: 'Night Owl', time: '11:00 PM' };
  
  // Card designs - different layouts with distinct colors
  const cardDesigns = [
    {
      id: 'classic',
      name: 'Classic',
      bgColor: `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)`,
      renderCard: (isExport = false) => (
        <div style={{
          width: isExport ? '1080px' : '100%',
          height: isExport ? '1080px' : 'auto',
          background: `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isExport ? '80px' : '2rem',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          borderRadius: isExport ? '0' : '20px',
        }}>
          <div style={{ fontSize: isExport ? '32px' : '1.5rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: isExport ? '20px' : '1rem', letterSpacing: '-0.02em' }}>
            Your Search Wrapped
          </div>
          <div style={{ fontSize: isExport ? '120px' : '4.5rem', fontWeight: 900, color: 'white', marginBottom: isExport ? '40px' : '0.5rem', lineHeight: 1 }}>
            {totalPrompts.toLocaleString()}
          </div>
          <div style={{ fontSize: isExport ? '28px' : '1.25rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: isExport ? '60px' : '2rem' }}>
            searches this year
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isExport ? '30px' : '1rem', width: '100%', maxWidth: isExport ? '800px' : '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isExport ? '30px' : '1.25rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: isExport ? '24px' : '1rem', color: 'rgba(255,255,255,0.8)' }}>Top Topic</div>
              <div style={{ fontSize: isExport ? '36px' : '1.5rem', fontWeight: 700, color: 'white' }}>{topTopic}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isExport ? '30px' : '1.25rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: isExport ? '24px' : '1rem', color: 'rgba(255,255,255,0.8)' }}>You're a</div>
              <div style={{ fontSize: isExport ? '36px' : '1.5rem', fontWeight: 700, color: 'white' }}>{mbti.name}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isExport ? '30px' : '1.25rem 1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.2)' }}>
              <div style={{ fontSize: isExport ? '24px' : '1rem', color: 'rgba(255,255,255,0.8)' }}>Peak Time</div>
              <div style={{ fontSize: isExport ? '36px' : '1.5rem', fontWeight: 700, color: 'white' }}>{peakData.period}</div>
            </div>
          </div>
          <div style={{ marginTop: isExport ? '60px' : '1rem', fontSize: isExport ? '20px' : '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            #SearchWrapped
          </div>
        </div>
      )
    },
    {
      id: 'minimal',
      name: 'Minimal',
      bgColor: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
      renderCard: (isExport = false) => (
        <div style={{
          width: isExport ? '1080px' : '100%',
          height: isExport ? '1080px' : 'auto',
          background: `linear-gradient(180deg, #667eea 0%, #764ba2 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isExport ? '100px' : '2.5rem',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          borderRadius: isExport ? '0' : '20px',
        }}>
          <div style={{ fontSize: isExport ? '28px' : '1.2rem', fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: isExport ? '60px' : '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Your Year in Searches
          </div>
          <div style={{ fontSize: isExport ? '140px' : '5.5rem', fontWeight: 900, color: 'white', marginBottom: isExport ? '30px' : '0.5rem', lineHeight: 1, letterSpacing: '-0.05em' }}>
            {totalPrompts.toLocaleString()}
          </div>
          <div style={{ fontSize: isExport ? '24px' : '1rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '80px' : '3rem' }}>
            searches
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isExport ? '40px' : '1rem', width: '100%', maxWidth: isExport ? '900px' : '100%' }}>
            <div style={{ textAlign: 'center', padding: isExport ? '40px' : '1.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: isExport ? '20px' : '0.5rem' }}>TOP TOPIC</div>
              <div style={{ fontSize: isExport ? '32px' : '1.3rem', fontWeight: 700, color: 'white' }}>{topTopic}</div>
            </div>
            <div style={{ textAlign: 'center', padding: isExport ? '40px' : '1.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: isExport ? '20px' : '0.5rem' }}>PERSONALITY</div>
              <div style={{ fontSize: isExport ? '32px' : '1.3rem', fontWeight: 700, color: 'white' }}>{mbti.name}</div>
            </div>
            <div style={{ textAlign: 'center', padding: isExport ? '40px' : '1.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: isExport ? '20px' : '0.5rem' }}>PEAK TIME</div>
              <div style={{ fontSize: isExport ? '32px' : '1.3rem', fontWeight: 700, color: 'white' }}>{peakData.period}</div>
            </div>
            <div style={{ textAlign: 'center', padding: isExport ? '40px' : '1.5rem', background: 'rgba(255,255,255,0.08)', borderRadius: '16px' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: isExport ? '20px' : '0.5rem' }}>YEAR</div>
              <div style={{ fontSize: isExport ? '32px' : '1.3rem', fontWeight: 700, color: 'white' }}>2024</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'bold',
      name: 'Bold',
      bgColor: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`,
      renderCard: (isExport = false) => (
        <div style={{
          width: isExport ? '1080px' : '100%',
          height: isExport ? '1080px' : 'auto',
          background: isExport ? mbti.color[0] : `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: isExport ? '100px' : '2.5rem',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          borderRadius: isExport ? '0' : '20px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: isExport ? '600px' : '50%', height: '100%', background: isExport ? `radial-gradient(circle, ${mbti.color[1]} 0%, transparent 70%)` : `radial-gradient(circle, #f5576c 0%, transparent 70%)`, opacity: 0.3 }} />
          <div style={{ fontSize: isExport ? '36px' : '1.8rem', fontWeight: 900, color: 'white', marginBottom: isExport ? '40px' : '1.5rem', lineHeight: 1.2, zIndex: 1 }}>
            {totalPrompts.toLocaleString()}<br />
            <span style={{ fontSize: isExport ? '28px' : '1.2rem', fontWeight: 600, opacity: 0.9 }}>searches</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isExport ? '35px' : '1.25rem', width: '100%', zIndex: 1 }}>
            <div style={{ padding: isExport ? '35px' : '1.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: isExport ? '22px' : '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '15px' : '0.5rem', fontWeight: 600 }}>TOP TOPIC</div>
              <div style={{ fontSize: isExport ? '40px' : '1.8rem', fontWeight: 800, color: 'white' }}>{topTopic}</div>
            </div>
            <div style={{ padding: isExport ? '35px' : '1.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: isExport ? '22px' : '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '15px' : '0.5rem', fontWeight: 600 }}>YOU'RE A</div>
              <div style={{ fontSize: isExport ? '40px' : '1.8rem', fontWeight: 800, color: 'white' }}>{mbti.name}</div>
            </div>
            <div style={{ padding: isExport ? '35px' : '1.5rem', background: 'rgba(255,255,255,0.15)', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontSize: isExport ? '22px' : '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '15px' : '0.5rem', fontWeight: 600 }}>PEAK TIME</div>
              <div style={{ fontSize: isExport ? '40px' : '1.8rem', fontWeight: 800, color: 'white' }}>{peakData.period}</div>
            </div>
          </div>
          <div style={{ position: 'absolute', bottom: isExport ? '60px' : '1.5rem', right: isExport ? '60px' : '1.5rem', fontSize: isExport ? '18px' : '0.85rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, zIndex: 1 }}>
            #SearchWrapped
          </div>
        </div>
      )
    },
    {
      id: 'centered',
      name: 'Centered',
      bgColor: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
      renderCard: (isExport = false) => (
        <div style={{
          width: isExport ? '1080px' : '100%',
          height: isExport ? '1080px' : 'auto',
          background: isExport ? `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 50%, ${mbti.color[0]} 100%)` : `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isExport ? '80px' : '2rem',
          boxSizing: 'border-box',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          borderRadius: isExport ? '0' : '20px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: isExport ? '30px' : '1.4rem', fontWeight: 700, color: 'rgba(255,255,255,0.95)', marginBottom: isExport ? '50px' : '2rem' }}>
            Your Search Wrapped
          </div>
          <div style={{ fontSize: isExport ? '150px' : '6rem', fontWeight: 900, color: 'white', marginBottom: isExport ? '50px' : '1rem', lineHeight: 1, letterSpacing: '-0.05em' }}>
            {totalPrompts.toLocaleString()}
          </div>
          <div style={{ fontSize: isExport ? '26px' : '1.1rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)', marginBottom: isExport ? '80px' : '3rem' }}>
            searches this year
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: isExport ? '25px' : '0.75rem', justifyContent: 'center', flexWrap: 'wrap', width: '100%', maxWidth: isExport ? '900px' : '100%' }}>
            <div style={{ padding: isExport ? '25px 40px' : '1rem 1.5rem', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '8px' : '0.25rem' }}>Topic</div>
              <div style={{ fontSize: isExport ? '28px' : '1.2rem', fontWeight: 700, color: 'white' }}>{topTopic}</div>
            </div>
            <div style={{ padding: isExport ? '25px 40px' : '1rem 1.5rem', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '8px' : '0.25rem' }}>Type</div>
              <div style={{ fontSize: isExport ? '28px' : '1.2rem', fontWeight: 700, color: 'white' }}>{mbti.name}</div>
            </div>
            <div style={{ padding: isExport ? '25px 40px' : '1rem 1.5rem', background: 'rgba(255,255,255,0.12)', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: isExport ? '20px' : '0.85rem', color: 'rgba(255,255,255,0.7)', marginBottom: isExport ? '8px' : '0.25rem' }}>Time</div>
              <div style={{ fontSize: isExport ? '28px' : '1.2rem', fontWeight: 700, color: 'white' }}>{peakData.period}</div>
            </div>
          </div>
          <div style={{ marginTop: isExport ? '70px' : '2rem', fontSize: isExport ? '22px' : '1rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>
            #SearchWrapped
          </div>
        </div>
      )
    }
  ];
  
  const handleShare = async (e) => {
    e.stopPropagation();
    setIsGenerating(true);
    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      if (!cardRef.current) {
        setIsGenerating(false);
        return;
      }
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        logging: false,
        useCORS: true,
        width: 1080,
        height: 1080,
      });
      
      // Convert to blob
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }
        
        const file = new File([blob], 'my-search-wrapped.png', { type: 'image/png' });
        
        // Try Web Share API first (supports file sharing)
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: 'My Search Wrapped',
              text: `I made ${totalPrompts.toLocaleString()} searches this year! Check out my Search Wrapped.`,
              files: [file],
            });
            setIsGenerating(false);
            return;
          } catch (shareError) {
            // User cancelled or error, fall through to download
            console.log('Share cancelled or failed:', shareError);
          }
        }
        
        // Fallback: download the image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'my-search-wrapped.png';
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        
        setIsGenerating(false);
      }, 'image/png');
    } catch (error) {
      console.error('Error generating share card:', error);
      setIsGenerating(false);
    }
  };
  
  const nextCard = () => {
    setSelectedCardIndex((prev) => (prev + 1) % cardDesigns.length);
  };
  
  const prevCard = () => {
    setSelectedCardIndex((prev) => (prev - 1 + cardDesigns.length) % cardDesigns.length);
  };
  
  if (!isOpen) return null;
  
  const currentCard = cardDesigns[selectedCardIndex];
  
  return (
    <AnimatePresence>
      <motion.div
        className="share-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
        }}
      >
        <motion.div
          className="share-modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '600px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative',
          }}
        >
          {/* Close button - positioned over card */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '-12px',
              right: '-12px',
              background: 'rgba(0, 0, 0, 0.7)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 10001,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.9)';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(0, 0, 0, 0.7)';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <X size={20} />
          </button>
          
          {/* Share Card - Hidden version for export */}
          <div 
            ref={cardRef}
            className="share-card-export"
            style={{
              width: '1080px',
              height: '1080px',
              position: 'absolute',
              left: '-9999px',
              top: '-9999px',
            }}
          >
            {currentCard.renderCard(true)}
          </div>
          
          {/* Visible Card Preview */}
          <motion.div
            key={selectedCardIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'relative' }}
          >
            {currentCard.renderCard(false)}
          </motion.div>
          
          {/* Card Carousel - Spotify Remember This style */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            marginTop: '1rem',
          }}>
            {/* Previous button */}
            <button
              onClick={prevCard}
              disabled={cardDesigns.length <= 1}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <ChevronLeft size={20} />
            </button>
            
            {/* Card previews */}
            <div 
              className="share-card-previews"
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'center',
                overflowX: 'auto',
              }}
            >
              {cardDesigns.map((design, index) => (
                <button
                  key={design.id}
                  onClick={() => setSelectedCardIndex(index)}
                  style={{
                    minWidth: '80px',
                    height: '100px',
                    borderRadius: '12px',
                    border: selectedCardIndex === index ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.5)',
                    background: design.bgColor || `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: selectedCardIndex === index ? 'scale(1.1)' : 'scale(1)',
                    opacity: selectedCardIndex === index ? 1 : 0.7,
                    overflow: 'hidden',
                    position: 'relative',
                    boxShadow: selectedCardIndex === index ? '0 4px 20px rgba(255, 255, 255, 0.3)' : '0 2px 10px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCardIndex !== index) {
                      e.target.style.opacity = '0.9';
                      e.target.style.transform = 'scale(1.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCardIndex !== index) {
                      e.target.style.opacity = '0.7';
                      e.target.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {/* Skeleton outline for preview */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    right: '8px',
                    height: '12px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '28px',
                    left: '8px',
                    right: '8px',
                    height: '20px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '54px',
                    left: '8px',
                    width: '30px',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    top: '54px',
                    right: '8px',
                    width: '20px',
                    height: '8px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '4px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '24px',
                    left: '8px',
                    right: '8px',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '3px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    right: '8px',
                    height: '6px',
                    background: 'rgba(255, 255, 255, 0.15)',
                    borderRadius: '3px',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                  }} />
                  
                  {/* Design name label */}
                  <div style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    right: '4px',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: 'white',
                    textAlign: 'center',
                    background: selectedCardIndex === index ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.4)',
                    borderRadius: '4px',
                    padding: '3px 4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                  }}>
                    {design.name}
                  </div>
                </button>
              ))}
            </div>
            
            {/* Next button */}
            <button
              onClick={nextCard}
              disabled={cardDesigns.length <= 1}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <ChevronRight size={20} />
            </button>
          </div>
          
          {/* Share Button */}
          <motion.button
            className="share-card-button"
            onClick={handleShare}
            disabled={isGenerating}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              cursor: isGenerating ? 'wait' : 'pointer',
              marginTop: '0.5rem',
              width: '100%',
              background: 'white',
              color: '#0a0a0a',
              border: 'none',
              borderRadius: '999px',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          >
            {isGenerating ? 'Generating...' : 'Share'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ===== ACTIVITY HEATMAP SLIDE =====
export const ActivityHeatmapSlide = ({ heatmapData = null }) => {
  const [phase, setPhase] = useState(0); // 0: teaser, 1: reveal heatmap
  const maxPhase = 1;
  
  const handleClick = (e) => {
    if (phase < maxPhase) {
      e.stopPropagation();
      setPhase(prev => prev + 1);
    }
  };
  
  // Default sample data based on the user's heatmap
  const defaultData = {
    Monday: [40, 35, 25, 15, 10, 8, 20, 45, 60, 75, 80, 85, 90, 85, 80, 75, 70, 65, 80, 90, 95, 85, 60, 45],
    Tuesday: [30, 45, 55, 35, 20, 15, 25, 50, 65, 80, 85, 90, 85, 80, 75, 70, 65, 75, 85, 90, 80, 70, 50, 35],
    Wednesday: [35, 40, 45, 30, 15, 10, 20, 40, 55, 70, 80, 85, 90, 85, 80, 75, 80, 85, 90, 85, 75, 65, 55, 40],
    Thursday: [25, 30, 35, 25, 15, 10, 15, 35, 50, 65, 75, 80, 85, 90, 85, 80, 85, 90, 100, 95, 85, 70, 55, 35],
    Friday: [20, 25, 30, 20, 12, 8, 15, 30, 45, 60, 70, 75, 80, 75, 70, 65, 70, 80, 75, 60, 50, 45, 40, 30],
    Saturday: [15, 20, 25, 18, 10, 5, 8, 15, 25, 40, 55, 70, 85, 75, 60, 50, 55, 120, 85, 60, 45, 35, 30, 25],
    Sunday: [50, 55, 45, 30, 20, 15, 10, 15, 25, 35, 50, 130, 85, 70, 80, 75, 85, 60, 55, 70, 125, 80, 55, 40],
  };
  
  const data = heatmapData || defaultData;
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const hours = Array.from({ length: 24 }, (_, i) => i);
  
  // Find max value for color scaling
  const allValues = Object.values(data).flat();
  const maxValue = Math.max(...allValues);
  const totalSearches = allValues.reduce((a, b) => a + b, 0);
  
  // Get color based on value intensity - Spotify green gradient
  const getHeatColor = (value) => {
    const intensity = value / maxValue;
    if (intensity < 0.15) return 'rgba(30, 215, 96, 0.1)';
    if (intensity < 0.3) return 'rgba(30, 215, 96, 0.25)';
    if (intensity < 0.45) return 'rgba(30, 215, 96, 0.4)';
    if (intensity < 0.6) return 'rgba(30, 215, 96, 0.55)';
    if (intensity < 0.75) return 'rgba(30, 215, 96, 0.7)';
    if (intensity < 0.9) return 'rgba(30, 215, 96, 0.85)';
    return 'rgba(30, 215, 96, 1)';
  };
  
  // Find peak time
  let peakDay = '';
  let peakHour = 0;
  let peakValue = 0;
  days.forEach(day => {
    data[day].forEach((val, hour) => {
      if (val > peakValue) {
        peakValue = val;
        peakDay = day;
        peakHour = hour;
      }
    });
  });
  
  // Calculate busiest day
  const dayTotals = days.map(day => ({
    day,
    total: data[day].reduce((a, b) => a + b, 0)
  }));
  const busiestDay = dayTotals.reduce((a, b) => a.total > b.total ? a : b);
  
  // Calculate weekend vs weekday
  const weekdayTotal = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    .reduce((sum, day) => sum + data[day].reduce((a, b) => a + b, 0), 0);
  const weekendTotal = ['Saturday', 'Sunday']
    .reduce((sum, day) => sum + data[day].reduce((a, b) => a + b, 0), 0);
  const weekendPercentage = Math.round((weekendTotal / totalSearches) * 100);
  
  return (
    <div className="slide-container" onClick={handleClick} style={{ cursor: phase < maxPhase ? 'pointer' : 'default' }}>
      {/* Tap to continue hint */}
      {phase < maxPhase && (
        <motion.div
          className="tap-hint"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            position: 'absolute',
            bottom: 50,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.7)',
            fontSize: '1.1rem',
            fontWeight: 500,
            zIndex: 100,
          }}
        >
          Tap to continue
        </motion.div>
      )}
      
      <motion.div 
        className="animated-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{
          background: 'linear-gradient(180deg, #1a1a1a 0%, #121212 100%)'
        }}
      />
      
      <motion.div className="slide-content" style={{ 
        padding: '60px 20px 30px', 
        maxWidth: '1100px', 
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        height: '100%',
        boxSizing: 'border-box',
        margin: '0 auto',
      }}>
        {/* Phase 0: Teaser */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="teaser"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -30, filter: 'blur(10px)' }}
              style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', flex: 1, justifyContent: 'center' }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 180 }}
              >
                <Calendar size={64} strokeWidth={1.5} color="rgba(255,255,255,0.7)" />
              </motion.div>
              <motion.p
                style={{ fontSize: '5rem', color: 'white', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}
                initial={{ opacity: 0, x: 50, filter: 'blur(12px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                Your weekly<br/>rhythm
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Phase 1: Heatmap */}
        {phase >= 1 && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ marginBottom: '20px' }}
            >
              <h2 style={{ 
                color: 'white', 
                fontSize: '1.8rem', 
                fontWeight: 800, 
                margin: 0,
                letterSpacing: '-0.02em',
              }}>
                Your Search Activity
              </h2>
              <p style={{ 
                color: 'rgba(255,255,255,0.5)', 
                fontSize: '0.9rem', 
                margin: '4px 0 0 0',
                fontWeight: 500,
              }}>
                Hour by hour, day by day
              </p>
            </motion.div>
            
            {/* Heatmap Container */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '16px',
                padding: '16px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {/* Hour labels */}
              <div style={{ 
                display: 'flex', 
                marginLeft: '40px',
                marginBottom: '8px',
              }}>
                {['12AM', '6AM', '12PM', '6PM'].map((label, i) => (
                  <div
                    key={label}
                    style={{
                      flex: 1,
                      fontSize: '0.7rem',
                      color: 'rgba(255,255,255,1)',
                      fontWeight: 600,
                      textAlign: i === 0 ? 'left' : 'center',
                    }}
                  >
                    {label}
                  </div>
                ))}
              </div>
              
              {/* Heatmap Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                {days.map((day, dayIndex) => (
                  <div key={day} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    {/* Day label */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + dayIndex * 0.05 }}
                      style={{
                        width: '32px',
                        fontSize: '0.7rem',
                        color: 'rgba(255,255,255,1)',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {day.slice(0, 3)}
                    </motion.div>
                    
                    {/* Cells row */}
                    <div style={{ display: 'flex', flex: 1, gap: '2px', height: '100%' }}>
                      {data[day].map((value, hour) => (
                        <motion.div
                          key={`cell-${day}-${hour}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 + dayIndex * 0.03 + hour * 0.005 }}
                          style={{
                            flex: 1,
                            borderRadius: '3px',
                            background: getHeatColor(value),
                            border: day === peakDay && hour === peakHour ? '2px solid #fff' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Legend */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: '6px',
                marginTop: '12px',
              }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 600 }}>LESS</span>
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((intensity, i) => (
                  <div
                    key={i}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '2px',
                      background: `rgba(30, 215, 96, ${intensity})`,
                    }}
                  />
                ))}
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', fontWeight: 600 }}>MORE</span>
              </div>
            </motion.div>
            
            {/* Insights Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              style={{
                marginTop: '20px',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '12px',
              }}
            >
              {/* Peak Time */}
              <div style={{
                background: 'rgba(30, 215, 96, 0.1)',
                borderRadius: '12px',
                padding: '14px 12px',
                textAlign: 'center',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Peak Time
                </div>
                <div style={{ color: '#1ed760', fontSize: '1.3rem', fontWeight: 800 }}>
                  {peakHour > 12 ? peakHour - 12 : peakHour || 12}{peakHour >= 12 ? 'PM' : 'AM'}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 500 }}>
                  {peakDay}
                </div>
              </div>
              
              {/* Busiest Day */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '14px 12px',
                textAlign: 'center',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Busiest Day
                </div>
                <div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800 }}>
                  {busiestDay.day.slice(0, 3)}
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 500 }}>
                  {Math.round((busiestDay.total / totalSearches) * 100)}% of searches
                </div>
              </div>
              
              {/* Weekend Activity */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '14px 12px',
                textAlign: 'center',
              }}>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                  Weekend
                </div>
                <div style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800 }}>
                  {weekendPercentage}%
                </div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', fontWeight: 500 }}>
                  of activity
                </div>
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};
