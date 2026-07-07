import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiFilter } from 'react-icons/fi';

const History = () => {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [filter]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:5000/api/history?type=${filter === 'all' ? '' : filter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHistory(response.data.history);
    } catch (error) {
      console.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('history')}</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FiFilter /> Filter:
          </div>
          <div className="flex gap-2 flex-wrap">
            {['all', 'object', 'text', 'currency', 'traffic_signal', 'scene'].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full font-semibold transition ${
                  filter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {t(type)}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center text-gray-600">{t('loading')}</p>
          ) : history.length > 0 ? (
            history.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{item.data?.objectName || item.data?.textContent}</h3>
                    <p className="text-sm text-gray-600">{item.detectionType}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                    {(item.data?.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <p className="text-gray-700 mb-2">{item.voiceResponse?.en}</p>
                <p className="text-xs text-gray-500">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-600 py-12">No detection history found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
