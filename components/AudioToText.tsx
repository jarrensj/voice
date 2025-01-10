'use client'

import { useState } from "react";


export default function AudioToText() {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>("");
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        
        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: audioBlob,
            headers: {
              'Content-Type': 'audio/webm',
            },
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const { text } = await response.json();
          setTranscript(text);
        } catch (error: unknown) {
          console.error('Transcription error:', error);
        }
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      alert('Failed to start recording');
      console.log(error)
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  return (
    <div>
      <button 
        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {transcript && <p>{transcript}</p>}
    </div>
  );
}
