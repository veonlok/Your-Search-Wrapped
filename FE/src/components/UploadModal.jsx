import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Trash2, Download, ShieldCheck, HelpCircle } from 'lucide-react';
import './UploadModal.css';

const UploadModal = ({ onClose, onSubmit }) => {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    droppedFiles.forEach(file => validateAndAddFile(file));
  };

  const handleFileInput = (e) => {
    const selectedFiles = Array.from(e.target.files);
    selectedFiles.forEach(file => validateAndAddFile(file));
  };

  const validateAndAddFile = (selectedFile) => {
    if (!selectedFile) return;

    const validFormats = ['.zip'];
    const fileExtension = '.' + selectedFile.name.split('.').pop().toLowerCase();
    const maxSize = 500 * 1024 * 1024; // 500MB

    if (!validFormats.includes(fileExtension)) {
      alert('Invalid file format. Please upload a .zip file.');
      return;
    }

    if (selectedFile.size > maxSize) {
      alert('File size exceeds 500MB limit.');
      return;
    }

    setFiles(prev => [...prev, selectedFile]);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(10);
    
    try {
      // Create FormData and upload to backend
      const formData = new FormData();
      formData.append('file', files[0]); // Backend expects single file with key 'file'

      setUploadProgress(30);

      const response = await fetch('http://localhost:8000/api/v1/search/search-history', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(70);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Upload failed');
      }

      const data = await response.json();
      setUploadProgress(100);

      // Call the onSubmit callback with the backend response
      if (onSubmit) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i)) + ' ' + sizes[i];
  };

  return (
    <motion.div 
      className="modal-overlay" 
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <button className="close-button" onClick={onClose}>
          <X size={20} />
        </button>
        
        <h2 className="modal-title">Upload your ChatGPT export</h2>
        <p className="modal-subtitle">
          Upload your ChatGPT data export (.zip file) to generate your AI Wrapped
        </p>

        {!isUploading ? (
          <>
            <div
              className={`dropzone ${isDragging ? 'dragging' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="dropzone-icon">
                <div className="doc-icon">
                  <FileText size={48} strokeWidth={1.5} />
                  <span className="doc-label">.ZIP</span>
                  <div className="download-badge">
                    <Download size={16} />
                  </div>
                </div>
              </div>
              <p className="dropzone-text">Drag & Drop</p>
              <p className="dropzone-subtext">
                or <button className="choose-file-btn" onClick={handleChooseFile}>choose a file</button>
              </p>
              <p className="dropzone-info">
                Maximum file size 500MB. • <span className="requirements-link">Export from ChatGPT Settings → Data Controls → Export</span>
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".zip"
                onChange={handleFileInput}
                style={{ display: 'none' }}
              />
            </div>

            {files.length > 0 && (
              <div className="files-preview-container">
                {files.map((file, index) => (
                  <div key={index} className="file-preview">
                    <div className="file-info">
                      <div className="file-icon-small">
                        <FileText size={20} strokeWidth={2} />
                      </div>
                      <div className="file-details">
                        <p className="file-name">{file.name}</p>
                        <p className="file-size">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <div className="file-actions">
                      <button className="icon-button" onClick={() => handleRemoveFile(index)} title="Remove file">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="upload-progress">
            <div className="progress-content">
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              <p className="progress-text">{uploadProgress}%</p>
              <p className="progress-label">Uploading...</p>
            </div>
          </div>
        )}

        <div className="modal-footer">
          <div className="button-group">
            <button className="cancel-button" onClick={onClose}>Cancel</button>
            <button 
              className="submit-button" 
              onClick={handleSubmit}
              disabled={files.length === 0 || isUploading}
            >
              Submit
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default UploadModal;
