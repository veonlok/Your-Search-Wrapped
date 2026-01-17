import { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import './App.css'
import UploadModal from './components/UploadModal'
import SplashScreen from './components/SplashScreen'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [result, setResult] = useState(null)

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
    
    // Simulate a result
    setResult({
      fileCount: files.length,
      message: 'Files processed successfully!'
    })
    
    setIsModalOpen(false)
  }

  return (
    <div className="app">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <>
            {!isModalOpen && !result && (
              <button 
                className="open-upload-btn"
                onClick={() => setIsModalOpen(true)}
              >
                Upload Document
              </button>
            )}

            {result && (
              <div className="result-container">
                <h2>✓ Success!</h2>
                <p>{result.fileCount} file{result.fileCount > 1 ? 's' : ''} processed successfully!</p>
                <button 
                  className="open-upload-btn"
                  onClick={() => {
                    setResult(null)
                    setUploadedFile(null)
                    setIsModalOpen(true)
                  }}
                >
                  Upload Another File
                </button>
              </div>
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

export default App
