import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiActivity, FiEye, FiAlertCircle, FiHistory } from 'react-icons/fi';

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalDetections: 0, todayDetections: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const dashboardCards = [
    {
      title: t('vision_assistant'),
      description: 'Start real-time vision assistance',
      icon: <FiEye className="text-4xl" />,
      color: 'bg-blue-500',
      action: () => navigate('/vision')
    },
    {
      title: t('emergency_alert'),
      description: 'Send emergency alert to contacts',
      icon: <FiAlertCircle className="text-4xl" />,
      color: 'bg-red-500',
      action: () => navigate('/emergency')
    },
    {
      title: t('view_history'),
      description: 'View detection history',
      icon: <FiHistory className="text-4xl" />,
      color: 'bg-green-500',
      action: () => navigate('/history')
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('welcome')}, {user?.name}!</h1>
          <p className="text-gray-600">{t('welcome_msg')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dashboardCards.map((card, index) => (
            <div
              key={index}
              onClick={card.action}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
            >
              <div className={`${card.color} text-white w-16 h-16 rounded-lg flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-gray-600 text-sm">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiActivity /> {t('stats')}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('total_detections')}</span>
                <span className="text-2xl font-bold text-blue-600">{stats.totalDetections}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">{t('today')}</span>
                <span className="text-2xl font-bold text-green-600">{stats.todayDetections}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{t('quick_tips')}</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>✓ Keep your phone charged</li>
              <li>✓ Update emergency contacts</li>
              <li>✓ Check notification settings</li>
              <li>✓ Test voice output regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
