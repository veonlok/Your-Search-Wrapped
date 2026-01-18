import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { MBTI_DICTIONARY } from '../constants/mbtiDictionary';
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
  const apiData = location.state?.wrappedData;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  // Redirect to home if no data
  useEffect(() => {
    if (!apiData) {
      navigate('/');
    }
  }, [apiData, navigate]);

  const handleUploadMore = () => {
    navigate('/');
  };

  // Helper function to convert month number to name
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Get MBTI info from dictionary, fallback to defaults
  const mbtiInfo = apiData ? (MBTI_DICTIONARY[apiData.mbti] || {
    name: apiData.mbti,
    traits: ['Curious', 'Analytical', 'Creative'],
    description: `Your AI interaction style reflects a ${apiData.mbti} personality.`,
    details: {
      strength: 'Versatile problem solving',
      style: 'Adaptive & thoughtful',
      funFact: 'You have a unique approach to AI'
    }
  }) : null;

  // Transform backend data to match frontend expected format
  const wrappedData = apiData ? {
    totalPrompts: apiData.total_searches_past_year,
    personality: {
      type: mbtiInfo.name || apiData.mbti,
      code: apiData.mbti,
      traits: mbtiInfo.traits || ['Curious', 'Analytical', 'Creative'],
      description: mbtiInfo.description || `Your AI interaction style reflects a ${apiData.mbti} personality.`,
      details: mbtiInfo.details
    },
    keywords: apiData.top_keywords.map(kw => ({
      word: kw.keyword,
      count: kw.frequency
    })),
    moodData: apiData.searches_by_month.map(m => ({
      month: monthNames[m.month_number - 1],
      value: m.frequency
    })),
    peakData: {
      time: (() => {
        const peakHour = apiData.searches_by_hour.indexOf(Math.max(...apiData.searches_by_hour));
        const hour12 = peakHour % 12 || 12;
        const ampm = peakHour < 12 ? 'AM' : 'PM';
        return `${hour12}:00 ${ampm}`;
      })(),
      period: (() => {
        const peakHour = apiData.searches_by_hour.indexOf(Math.max(...apiData.searches_by_hour));
        return (peakHour >= 6 && peakHour < 18) ? 'Early Bird' : 'Night Owl';
      })(),
      isNight: (() => {
        const peakHour = apiData.searches_by_hour.indexOf(Math.max(...apiData.searches_by_hour));
        return peakHour < 6 || peakHour >= 18;
      })(),
      avgSessionLength: 'N/A',
      mostActiveDay: 'N/A',
      totalHours: Math.round(apiData.total_searches_past_year * 2 / 60) // Estimate: 2 min per search
    },
    topTopic: apiData.top_topic,
    topicPercentage: 34, // Backend doesn't provide this, using placeholder
    funStats: {
      longestSession: 'N/A',
      mostSearchesDay: Math.max(...apiData.searches_by_month.map(m => m.frequency)),
      avgPerDay: Math.round(apiData.total_searches_past_year / 365),
      uniqueTopics: apiData.unique_keywords,
      curiosityScore: Math.min(99, Math.round(apiData.unique_keywords / 100))
    },
    topItems: apiData.top_searches.slice(0, 5)
  } : null;

  if (!wrappedData) {
    return null; // Will redirect via useEffect
  }

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
