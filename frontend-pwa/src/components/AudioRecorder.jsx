import React, { useRef, useState } from 'react'

export default function AudioRecorder({ onRecordComplete }) {
  const mediaRecorderRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      const audioChunks = []
      mediaRecorder.ondataavailable = (e) => audioChunks.push(e.data)
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
        onRecordComplete(audioBlob)
      }
      
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)
      
      // Timer
      const interval = setInterval(() => {
        setRecordingTime(t => t + 1)
      }, 1000)
      
      return () => clearInterval(interval)
    } catch (error) {
      console.error('Microphone access denied:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
      setIsRecording(false)
    }
  }

  return (
    <div className="audio-recorder">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full py-3 rounded-lg font-bold text-lg text-white ${
          isRecording ? 'bg-red-600' : 'bg-blue-600'
        }`}
      >
        {isRecording ? `🛑 Stop Recording (${recordingTime}s)` : '🎤 Start Recording'}
      </button>
    </div>
  )
}
