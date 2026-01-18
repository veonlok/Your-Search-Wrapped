import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { 
  IntroSlide, 
  TotalSearchesSlide, 
  PersonalitySlide,
  PersonalityDeepDiveSlide,
  WordCloudSlide,
  MoodTimelineSlide,
  PeakTimesSlide, 
  TopTopicSlide, 
  FunStatsSlide,
  TopListSlide, 
  OutroSlide,
  ActivityHeatmapSlide
} from './WrappedSlides';
import './ResultPage.css';

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileCount = location.state?.fileCount || 1;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const handleUploadMore = () => {
    navigate('/');
  };

  // Sample data - in real app this would come from backend
  const wrappedData = {
    totalPrompts: fileCount * 415,
    personality: {
      type: 'Deep Diver',
      code: 'ENTP',
      traits: ['Curious', 'Analytical', 'Creative'],
      description: 'You dig deep into topics, asking follow-up questions until you truly understand.'
    },
    keywords: [
      { word: 'Python', count: 156 },
      { word: 'Machine Learning', count: 134 },
      { word: 'API', count: 98 },
      { word: 'React', count: 87 },
      { word: 'Data', count: 76 },
      { word: 'JavaScript', count: 72 },
      { word: 'Algorithm', count: 65 },
      { word: 'Database', count: 58 },
      { word: 'AI', count: 54 },
      { word: 'CSS', count: 48 },
      { word: 'Code', count: 45 },
      { word: 'Function', count: 42 },
      { word: 'Error', count: 38 },
      { word: 'Debug', count: 35 },
      { word: 'Deploy', count: 32 },
      { word: 'Server', count: 28 },
      { word: 'Frontend', count: 25 },
      { word: 'Backend', count: 23 },
      { word: 'Testing', count: 20 },
      { word: 'Docker', count: 18 }
    ],
    moodData: [
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
    ],
    peakData: {
      time: '11:00 PM',
      period: 'Night Owl',
      isNight: true,
      avgSessionLength: '23 min',
      mostActiveDay: 'Wednesday',
      totalHours: 347
    },
    topTopic: 'Machine Learning',
    topicPercentage: 34,
    funStats: {
      longestSession: '4h 23m',
      mostSearchesDay: 127,
      avgPerDay: 12,
      uniqueTopics: 89,
      curiosityScore: 94
    },
    topItems: [
      'Python Programming',
      'Machine Learning',
      'React Development', 
      'Data Analysis',
      'API Integration'
    ]
  };

  const slides = [
    { id: 'intro', component: <IntroSlide /> },
    { id: 'total', component: <TotalSearchesSlide totalPrompts={wrappedData.totalPrompts} /> },
    { id: 'topic', component: <TopTopicSlide topTopic={wrappedData.topTopic} percentage={wrappedData.topicPercentage} /> },
    { id: 'list', component: <TopListSlide topItems={wrappedData.topItems} /> },
    { id: 'wordcloud', component: <WordCloudSlide keywords={wrappedData.keywords} /> },
    { id: 'mood', component: <MoodTimelineSlide moodData={wrappedData.moodData} /> },
    { id: 'peak', component: <PeakTimesSlide peakData={wrappedData.peakData} /> },
    { id: 'heatmap', component: <ActivityHeatmapSlide /> },
    { id: 'personality', component: <PersonalitySlide personality={wrappedData.personality} /> },
    { id: 'personality-deep', component: <PersonalityDeepDiveSlide personality={wrappedData.personality} /> },
    { id: 'funstats', component: <FunStatsSlide stats={wrappedData.funStats} /> },
    { id: 'outro', component: <OutroSlide onUploadMore={handleUploadMore} personality={wrappedData.personality} /> },
  ];

  const goToSlide = useCallback((index) => {
    if (index >= 0 && index < slides.length && index !== currentSlide) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
    }
  }, [currentSlide, slides.length]);

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
    }
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
    }
  }, [currentSlide]);

  // Handle click to advance (Spotify Wrapped style)
  const handleClick = (e) => {
    // Don't navigate if clicking on a button
    if (e.target.tagName === 'BUTTON') return;
    
    const screenWidth = window.innerWidth;
    const clickX = e.clientX;
    
    // Click on left 30% goes back, right 70% goes forward
    if (clickX < screenWidth * 0.3) {
      prevSlide();
    } else {
      nextSlide();
    }
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  // Touch/swipe handling
  const [touchStart, setTouchStart] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
    setTouchStart(null);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div 
      className="result-page"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress indicators - Instagram Stories style */}
      <div className="progress-bar-container">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={(e) => {
              e.stopPropagation();
              goToSlide(index);
            }}
            className={`progress-segment ${index === currentSlide ? 'active' : ''} ${index < currentSlide ? 'completed' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Slides */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ 
            duration: 0.4, 
            ease: [0.32, 0.72, 0, 1]
          }}
          className="slide-wrapper"
        >
          {slides[currentSlide].component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ResultPage;
