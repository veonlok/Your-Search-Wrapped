import {
  Cpu,
  Puzzle,
  Crown,
  MessageCircle,
  Heart,
  Wand2,
  Users,
  Rocket,
  BookOpen,
  Gem,
  Target,
  Coffee,
  Microscope,
  Compass,
  Zap,
  Star,
} from 'lucide-react';

/**
 * MBTI personality type dictionary for AI interaction styles
 * Maps MBTI codes to personality descriptions, traits, and visual styling
 */
export const MBTI_DICTIONARY = {
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
