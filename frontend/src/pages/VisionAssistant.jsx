import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiCamera, FiPlay, FiPause } from 'react-icons/fi';

const VisionAssistant = () => {
  const { t } = useTranslation();
  const [isActive, setIsActive] = useState(false);
  const [detections, setDetections] = useState([]);
  const [voiceOutput, setVoiceOutput] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startVision = async () => {
    setIsActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      processFrames();
    } catch (error) {
      console.error('Camera access denied:', error);
    }
  };

  const processFrames = async () => {
    if (!isActive) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const frameBase64 = canvas.toDataURL('image/jpeg');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/vision/process-frame',
        { frameBase64 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDetections(response.data.detections);
      const voiceText = Object.values(response.data.voiceResponses).join('. ');
      setVoiceOutput(voiceText);

      // Text-to-Speech
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(voiceText);
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Processing error:', error);
    }

    setTimeout(processFrames, 1000);
  };

  const stopVision = () => {
    setIsActive(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('vision_assistant')}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-96 object-cover"
                />
              </div>
              <canvas ref={canvasRef} width={640} height={480} className="hidden" />

              <div className="flex gap-4">
                {!isActive ? (
                  <button
                    onClick={startVision}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiPlay /> {t('start_vision')}
                  </button>
                ) : (
                  <button
                    onClick={stopVision}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FiPause /> Stop
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">{t('recent_detections')}</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {detections.length > 0 ? (
                    detections.map((det, idx) => (
                      <div key={idx} className="bg-white p-3 rounded border-l-4 border-blue-500">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-gray-900">{det.objectName}</span>
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {(det.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        {det.distance && <p className="text-sm text-gray-600">{det.distance}m away</p>}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">{t('loading')}</p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Voice Output</h3>
                <div className="bg-white p-3 rounded text-gray-700 min-h-24 italic">
                  {voiceOutput || 'Start vision to receive voice guidance...'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionAssistant;
