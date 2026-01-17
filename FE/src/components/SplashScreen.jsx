import { motion } from 'framer-motion';
import logo from '../assets/logo.png';
import './SplashScreen.css';

const SplashScreen = ({ onComplete }) => {
  return (
    <motion.div 
      className="splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="splash-content">
        <motion.div 
          className="splash-logo"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut"
          }}
        >
          <img src={logo} alt="Logo" className="splash-logo-img" />
        </motion.div>
        
        <motion.h1
          className="splash-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Your Search Wrapped
        </motion.h1>
        
        <motion.div 
          className="loading-dots"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <motion.span
            className="dot"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
          />
          <motion.span
            className="dot"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
          />
          <motion.span
            className="dot"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
