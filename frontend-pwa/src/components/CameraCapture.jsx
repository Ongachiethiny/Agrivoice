import React, { useRef } from 'react'
import Webcam from 'react-webcam'

export default function CameraCapture({ onCapture }) {
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot()
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      canvas.toBlob((blob) => {
        onCapture(blob)
      }, 'image/jpeg')
    }
    img.src = imageSrc
  }

  return (
    <div className="camera-container">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: 'environment' }}
        className="w-full rounded-lg"
      />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <button
        onClick={capturePhoto}
        className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold text-lg"
      >
        📸 Capture Photo
      </button>
    </div>
  )
}
