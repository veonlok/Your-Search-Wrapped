import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import UploadModal from './components/UploadModal'
import SplashScreen from './components/SplashScreen'
import ResultPage from './components/ResultPage'

function HomePage() {
  const navigate = useNavigate()
  const [showSplash, setShowSplash] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  useEffect(() => {
    // Show splash for 2.5 seconds
    const timer = setTimeout(() => {
      setShowSplash(false)
      setIsModalOpen(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  const handleFileSubmit = async (files) => {
    console.log('Files submitted:', files)
    setUploadedFile(files)
    
    // Here you would typically send the files to your backend
    // For now, we'll just simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsModalOpen(false)
    // Navigate to result page with file count
    navigate('/result', { state: { fileCount: files.length } })
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <>
            {!isModalOpen && (
              <button 
                className="open-upload-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Upload Document
              </button>
            )}

            {isModalOpen && (
              <UploadModal
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFileSubmit}
              />
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  )
}

export default App
