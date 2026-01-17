/**
 * @fileoverview Wrapped Slides Components
 * A collection of animated slide components for displaying search history analytics
 * in a Spotify Wrapped-style presentation.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import {
  Search,
  TrendingUp,
  Clock,
  Zap,
  Coffee,
  Flame,
  Heart,
  Star,
  Target,
  Lightbulb,
  Compass,
  Rocket,
  Puzzle,
  Glasses,
  Microscope,
  BookOpen,
  Cpu,
  Wand2,
  MessageCircle,
  Users,
  Crown,
  Gem,
  PartyPopper,
  Sparkles,
  Brain,
  Moon,
  Sun,
  Calendar,
} from 'lucide-react';
import AnimatedClock from './AnimatedClock';
import './WrappedSlides.css';

// ===== MBTI DICTIONARY =====
const MBTI_DICTIONARY = {
  'INTJ': {
    name: 'The Architect',
    icon: Cpu,
    color: ['#667eea', '#764ba2'],
    traits: ['Strategic', 'Independent', 'Logical'],
    description: 'You approach AI like a master strategist, always thinking 3 steps ahead.',
    details: {
      strength: 'Complex problem decomposition',
      style: 'Systematic & thorough',
      funFact: 'You rarely ask the same question twice'
    }
  },
  'INTP': {
    name: 'The Logician',
    icon: Puzzle,
    color: ['#4ECDC4', '#44B09E'],
    traits: ['Analytical', 'Objective', 'Inventive'],
    description: 'Your curiosity knows no bounds. You explore ideas just to understand them.',
    details: {
      strength: 'Finding unconventional solutions',
      style: 'Exploratory & theoretical',
      funFact: 'Your follow-up questions are legendary'
    }
  },
  'ENTJ': {
    name: 'The Commander',
    icon: Crown,
    color: ['#FF6B6B', '#ee5253'],
    traits: ['Decisive', 'Ambitious', 'Efficient'],
    description: 'You use AI like a CEO uses advisors - direct, purposeful, results-driven.',
    details: {
      strength: 'Getting actionable answers fast',
      style: 'Direct & goal-oriented',
      funFact: 'You have the shortest avg. prompt length'
    }
  },
  'ENTP': {
    name: 'The Debater',
    icon: MessageCircle,
    color: ['#8C52FF', '#FF52A8'],
    traits: ['Curious', 'Clever', 'Creative'],
    description: 'You dig deep into topics, asking follow-up questions until you truly understand.',
    details: {
      strength: 'Challenging assumptions',
      style: 'Playful & provocative',
      funFact: 'You love testing AI\'s limits'
    }
  },
  'INFJ': {
    name: 'The Advocate',
    icon: Heart,
    color: ['#a29bfe', '#6c5ce7'],
    traits: ['Insightful', 'Principled', 'Passionate'],
    description: 'You seek deeper meaning and use AI to explore ideas that matter.',
    details: {
      strength: 'Connecting abstract concepts',
      style: 'Thoughtful & values-driven',
      funFact: 'Your prompts are surprisingly poetic'
    }
  },
  'INFP': {
    name: 'The Mediator',
    icon: Wand2,
    color: ['#fd79a8', '#e84393'],
    traits: ['Idealistic', 'Creative', 'Empathetic'],
    description: 'You treat AI conversations like collaborative creative journeys.',
    details: {
      strength: 'Creative problem framing',
      style: 'Imaginative & open-ended',
      funFact: 'You say "please" and "thank you" to AI'
    }
  },
  'ENFJ': {
    name: 'The Protagonist',
    icon: Users,
    color: ['#00b894', '#00cec9'],
    traits: ['Charismatic', 'Inspiring', 'Altruistic'],
    description: 'You often search for ways to help others or explain things better.',
    details: {
      strength: 'Finding ways to teach & share',
      style: 'Collaborative & supportive',
      funFact: 'Most of your searches help someone else'
    }
  },
  'ENFP': {
    name: 'The Campaigner',
    icon: Rocket,
    color: ['#FDCB6E', '#f39c12'],
    traits: ['Enthusiastic', 'Creative', 'Sociable'],
    description: 'Your AI journey is an adventure - jumping between exciting topics!',
    details: {
      strength: 'Making unexpected connections',
      style: 'Spontaneous & energetic',
      funFact: 'You explore 3x more unique topics than average'
    }
  },
  'ISTJ': {
    name: 'The Logistician',
    icon: BookOpen,
    color: ['#636e72', '#2d3436'],
    traits: ['Practical', 'Reliable', 'Thorough'],
    description: 'You approach AI methodically, building knowledge step by step.',
    details: {
      strength: 'Comprehensive research',
      style: 'Structured & factual',
      funFact: 'You always verify AI answers'
    }
  },
  'ISFJ': {
    name: 'The Defender',
    icon: Gem,
    color: ['#81ecec', '#74b9ff'],
    traits: ['Supportive', 'Patient', 'Observant'],
    description: 'You use AI to master skills that help your community.',
    details: {
      strength: 'Practical application',
      style: 'Careful & considerate',
      funFact: 'Your searches often end with "best practices"'
    }
  },
  'ESTJ': {
    name: 'The Executive',
    icon: Target,
    color: ['#ff7675', '#d63031'],
    traits: ['Organized', 'Logical', 'Assertive'],
    description: 'Efficiency is your game. You get what you need and move on.',
    details: {
      strength: 'Clear, actionable requests',
      style: 'No-nonsense & efficient',
      funFact: 'Fastest average response satisfaction rate'
    }
  },
  'ESFJ': {
    name: 'The Consul',
    icon: Coffee,
    color: ['#fab1a0', '#e17055'],
    traits: ['Caring', 'Social', 'Loyal'],
    description: 'You love learning things you can share with friends and family.',
    details: {
      strength: 'Finding shareable knowledge',
      style: 'Warm & conversational',
      funFact: 'You share AI answers more than anyone'
    }
  },
  'ISTP': {
    name: 'The Virtuoso',
    icon: Microscope,
    color: ['#00b5ad', '#009c95'],
    traits: ['Observant', 'Practical', 'Creative'],
    description: 'Hands-on learning is your style. You search to build and fix things.',
    details: {
      strength: 'Technical troubleshooting',
      style: 'Pragmatic & experimental',
      funFact: 'Most of your searches include "how to"'
    }
  },
  'ISFP': {
    name: 'The Adventurer',
    icon: Compass,
    color: ['#a55eea', '#8854d0'],
    traits: ['Artistic', 'Sensitive', 'Curious'],
    description: 'You explore AI with artistic curiosity, finding beauty in knowledge.',
    details: {
      strength: 'Creative exploration',
      style: 'Aesthetic & intuitive',
      funFact: 'Your searches have a creative flair'
    }
  },
  'ESTP': {
    name: 'The Entrepreneur',
    icon: Zap,
    color: ['#ffeaa7', '#fdcb6e'],
    traits: ['Energetic', 'Perceptive', 'Bold'],
    description: 'Fast answers for fast action. You search on-the-go.',
    details: {
      strength: 'Quick information retrieval',
      style: 'Bold & direct',
      funFact: 'Highest mobile search percentage'
    }
  },
  'ESFP': {
    name: 'The Entertainer',
    icon: Star,
    color: ['#ff9ff3', '#f368e0'],
    traits: ['Spontaneous', 'Energetic', 'Enthusiastic'],
    description: 'AI is your playground! You explore with joy and share the fun.',
    details: {
      strength: 'Making learning fun',
      style: 'Playful & engaging',
      funFact: 'You use more emojis in prompts than anyone'
    }
  }
};

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
  return (
    <div className="slide-container total-searches-slide">
      <div className="animated-bg total-bg" />
      
      {/* Subtle pulsing ring behind number */}
      <motion.div
        style={{
          position: 'absolute',
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: '3px solid rgba(29, 185, 84, 0.3)',
          left: '50%',
          top: '50%',
          marginLeft: -150,
          marginTop: -150,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      <motion.div 
        className="slide-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          className="stat-intro-large"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="intro-icon-wrap"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Search size={28} strokeWidth={2.5} color="#fff" />
          </motion.div>
          <span>This year you made</span>
        </motion.div>
        
        <motion.div
          className="mega-number-container"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 80 }}
        >
          <motion.h1 
            className="mega-number glow-number"
          >
            <AnimatedCounter value={totalPrompts} duration={2} delay={0.8} />
          </motion.h1>
        </motion.div>
        
        <motion.p
          className="stat-label-large"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
        >
          searches
        </motion.p>
        
        <motion.div
          className="comparison-badge-new"
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: 1.4, type: 'spring' }}
        >
          <div className="badge-icon">
            <TrendingUp size={20} />
          </div>
          <span>Top <strong>22%</strong> of all users</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ===== 3. PERSONALITY REVEAL SLIDE =====
export const PersonalitySlide = ({ personality = { code: 'ENTP' }}) => {
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  const IconComponent = mbti.icon;
  
  return (
    <div className="slide-container">
      <motion.div 
        className="animated-bg personality-bg"
        style={{ 
          background: `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)` 
        }}
      />
      
      <motion.div
        className="personality-glow"
        style={{ background: `radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)` }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 2, opacity: 1 }}
        transition={{ duration: 1.2 }}
      />
      
      <motion.div className="slide-content">
        <motion.p
          className="slide-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Your AI Personality Type
        </motion.p>
        
        <motion.div
          className="personality-icon-ring"
          style={{ borderColor: 'rgba(255,255,255,0.3)' }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <IconComponent size={56} color="#fff" />
          </motion.div>
        </motion.div>
        
        <motion.div
          className="personality-card-new"
          style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(20px)',
          }}
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
        >
          <p className="personality-code-big">{personality.code}</p>
          <h1 className="personality-type-name">{mbti.name}</h1>
        </motion.div>
        
        <div className="personality-traits-new">
          {mbti.traits.map((trait, i) => (
            <motion.span
              key={trait}
              className="trait-pill"
              style={{ borderColor: mbti.color[0] }}
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.1 }}
            >
              {trait}
            </motion.span>
          ))}
        </div>
        
        <motion.p
          className="personality-desc-new"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          {mbti.description}
        </motion.p>
      </motion.div>
    </div>
  );
};

// ===== 4. PERSONALITY DEEP DIVE SLIDE =====
export const PersonalityDeepDiveSlide = ({ personality = { code: 'ENTP' }}) => {
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  const IconComponent = mbti.icon;
  
  const detailIcons = {
    strength: Zap,
    style: Glasses,
    funFact: Lightbulb
  };
  
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
            const DetailIcon = detailIcons[key];
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

  const colors = ['#1DB954', '#8C52FF', '#FF6B6B', '#4ECDC4', '#FDCB6E', '#FF52A8', '#667eea', '#00b894'];
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
                  const size = 1 + (count / maxCount) * 1.2;
                  const angle = (i / 10) * 360;
                  const radius = 100 + (i % 3) * 40;
                  const duration = 8 + i * 0.5;
                  
                  return (
                    <motion.span
                      key={`${word}-${i}`}
                      className="orbit-word"
                      style={{ 
                        fontSize: `${size}rem`,
                        color: colors[i % colors.length],
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
                      <span className="keyword-name" style={{ color: colors[i % colors.length] }}>
                        {word}
                      </span>
                      <div className="keyword-bar-container">
                        <motion.div
                          className="keyword-bar"
                          style={{ background: colors[i % colors.length] }}
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
  
  return (
    <div className={`slide-container peak-mega ${isNight ? 'night-mode' : 'day-mode'}`}>
      <motion.div 
        className="animated-bg"
        style={{
          background: isNight 
            ? 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)'
            : 'linear-gradient(180deg, #f39c12 0%, #e74c3c 50%, #8e44ad 100%)'
        }}
      />
      
      {/* Animated Clock in Background */}
      <AnimatedClock isNight={isNight} peakHour={isNight ? 23 : 14} size={700} />
      
      {/* Animated stars for night */}
      {isNight && (
        <div className="peak-bg-elements">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 2,
                height: 2,
                background: 'rgba(255,255,255,0.6)',
                borderRadius: '50%',
                position: 'absolute',
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
      
      <motion.div className="slide-content peak-mega-content">
        <motion.p
          className="slide-eyebrow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Your Prime Time
        </motion.p>
        
        <motion.div
          className="peak-mega-icon"
          initial={{ scale: 0, rotate: isNight ? 0 : -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.3, stiffness: 80 }}
        >
          {isNight ? <Moon size={64} strokeWidth={1.5} /> : <Sun size={64} strokeWidth={1.5} />}
        </motion.div>
        
        <motion.h1
          className="peak-mega-title"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
        >
          {peakData.period}
        </motion.h1>
        
        <motion.div
          className="peak-mega-time"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Clock size={24} />
          <span>Peak at <strong>{peakData.time}</strong></span>
        </motion.div>
        
        <motion.div
          className="peak-stats-mega"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <div className="peak-stat-box">
            <Flame size={28} color="#FF6B6B" />
            <span className="peak-stat-value">{peakData.totalHours}h</span>
            <span className="peak-stat-label">Total Hours</span>
          </div>
          <div className="peak-stat-box">
            <Clock size={28} color="#4ECDC4" />
            <span className="peak-stat-value">{peakData.avgSessionLength}</span>
            <span className="peak-stat-label">Avg Session</span>
          </div>
          <div className="peak-stat-box">
            <Calendar size={28} color="#FDCB6E" />
            <span className="peak-stat-value">{peakData.mostActiveDay}</span>
            <span className="peak-stat-label">Best Day</span>
          </div>
        </motion.div>
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
  
  // Teal color scheme matching background
  const getBarColor = (value, index) => {
    if (index === peakMonth) return '#1DB954';
    const ratio = value / maxValue;
    if (ratio > 0.7) return '#4DB6AC';
    if (ratio > 0.4) return '#26A69A';
    return 'rgba(255, 255, 255, 0.2)';
  };
  
  return (
    <div className="slide-container">
      <div className="animated-bg mood-bg" style={{ background: '#00897B' }} />
      
      <motion.div className="slide-content mood-content">
        <motion.p
          className="slide-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Your Year in Searches
        </motion.p>
        
        <motion.h2
          className="mood-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: 'spring' }}
        >
          Activity Timeline
        </motion.h2>
        
        <div className="mood-chart-mega">
          {moodData.map((data, i) => (
            <motion.div
              key={data.month}
              className={`mood-bar-wrap ${i === peakMonth ? 'peak' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.05, type: 'spring', stiffness: 100 }}
              style={{ position: 'relative' }}
            >
              {i === peakMonth && (
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
                  transition={{ delay: 2, duration: 0.5, type: 'spring' }}
                >
                  <motion.div
                    animate={{ 
                      boxShadow: [
                        '0 0 25px rgba(29, 185, 84, 0.6)',
                        '0 0 40px rgba(29, 185, 84, 0.8)',
                        '0 0 25px rgba(29, 185, 84, 0.6)',
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
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
                  style={{ background: getBarColor(data.value, i) }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.value / maxValue) * 100}%` }}
                  transition={{ delay: 0.8 + i * 0.05, duration: 0.6, ease: 'easeOut' }}
                />
              </div>
              <span className="mood-month-label">{data.month}</span>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          className="mood-insight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
        >
          <TrendingUp size={20} color="#1DB954" />
          <span><strong>{moodData[peakMonth].month}</strong> was your most curious month</span>
        </motion.div>
      </motion.div>
    </div>
  );
};

// ===== 8. TOP TOPIC EXPLOSION SLIDE =====
export const TopTopicSlide = ({ topTopic = 'Machine Learning', percentage = 34 }) => {
  return (
    <div className="slide-container">
      <div className="animated-bg topic-explosion-bg" />
      
      {/* Animated background rays */}
      <motion.div
        className="explosion-rays"
        initial={{ rotate: 0, scale: 0 }}
        animate={{ rotate: 360, scale: 1 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        {[...Array(16)].map((_, i) => (
          <div
            key={i}
            className="ray"
            style={{ transform: `rotate(${i * 22.5}deg)` }}
          />
        ))}
      </motion.div>

      {/* Floating particles */}
      <div className="topic-particles">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="topic-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      
      <motion.div className="slide-content topic-content">
        <motion.div
          className="topic-badge-big"
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', delay: 0.3, stiffness: 200 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          >
            <Target size={22} />
          </motion.div>
          <span>#1 Topic</span>
        </motion.div>
        
        <motion.h1
          className="topic-title-huge"
          initial={{ scale: 2.5, opacity: 0, filter: 'blur(40px)' }}
          animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {topTopic}
        </motion.h1>

        <motion.div
          className="topic-glow-ring"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
          transition={{ delay: 1.5, duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        
        <motion.div
          className="topic-percentage"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.span 
            className="percentage-number"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.4, type: 'spring', stiffness: 200 }}
          >
            {percentage}%
          </motion.span>
          <span className="percentage-label">of all your searches</span>
        </motion.div>

        <motion.div
          className="topic-bar-container"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: '100%' }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.div
            className="topic-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ delay: 2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
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
  const statItems = [
    { label: 'Longest Session', value: stats.longestSession, icon: Flame, color: '#FF6B6B' },
    { label: 'Most in One Day', value: stats.mostSearchesDay, icon: Zap, color: '#FDCB6E' },
    { label: 'Daily Average', value: stats.avgPerDay, icon: Coffee, color: '#8C52FF' },
    { label: 'Unique Topics', value: stats.uniqueTopics, icon: Lightbulb, color: '#4ECDC4' },
    { label: 'Curiosity Score', value: `${stats.curiosityScore}%`, icon: Star, color: '#1DB954' },
  ];
  
  return (
    <div className="slide-container">
      <div className="animated-bg fun-stats-bg" />
      
      <motion.div className="slide-content">
        <motion.p
          className="slide-eyebrow"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Fun Facts
        </motion.p>
        
        <motion.h2
          className="fun-stats-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          By The Numbers
        </motion.h2>
        
        <div className="fun-stats-grid">
          {statItems.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="fun-stat-card"
              style={{ borderColor: stat.color }}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              >
                <stat.icon size={32} color={stat.color} />
              </motion.div>
              <span className="fun-stat-value">{stat.value}</span>
              <span className="fun-stat-label">{stat.label}</span>
            </motion.div>
          ))}
        </div>
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
  return (
    <div className="slide-container">
      <div className="animated-bg list-slide-bg" />

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
            width: '60px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '2px',
            marginTop: '2rem',
            transformOrigin: 'left',
          }}
        />
      </motion.div>
    </div>
  );
};

// ===== 11. OUTRO SLIDE =====
export const OutroSlide = ({ onUploadMore, personality = { code: 'ENTP' } }) => {
  const mbti = MBTI_DICTIONARY[personality.code] || MBTI_DICTIONARY['ENTP'];
  
  return (
    <div className="slide-container">
      <motion.div 
        className="animated-bg outro-bg"
        style={{ background: `linear-gradient(135deg, ${mbti.color[0]} 0%, ${mbti.color[1]} 100%)` }}
      />
      
      {/* Confetti-like celebration particles - small and subtle */}
      <div className="outro-particles">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.6)',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
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
          onClick={onUploadMore}
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
