import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiMapPin, FiAlertTriangle } from 'react-icons/fi';

const EmergencyAlert = () => {
  const { t } = useTranslation();
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [sending, setSending] = useState(false);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      });
    }
  };

  const sendEmergencyAlert = async () => {
    if (!location) {
      alert('Please enable location services');
      return;
    }

    setSending(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/emergency/alert',
        { location, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Emergency alert sent!');
    } catch (error) {
      alert('Failed to send alert');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('emergency_alert')}</h1>

        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex items-center gap-2">
              <FiAlertTriangle className="text-red-600 text-2xl" />
              <p className="text-red-700 font-semibold">Use only in genuine emergencies</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('current_location')}</label>
              <button
                onClick={getLocation}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <FiMapPin /> {location ? 'Location Enabled' : 'Get Current Location'}
              </button>
              {location && (
                <p className="mt-2 text-sm text-green-600">✓ Location captured: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t('additional_info')}</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 outline-none focus:border-blue-500"
                rows="3"
                placeholder="Describe your location or situation..."
              />
            </div>

            <button
              onClick={sendEmergencyAlert}
              disabled={sending || !location}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? 'Sending...' : '🆘 SEND EMERGENCY ALERT'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlert;
