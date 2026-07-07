import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiEye, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FiEye className="text-2xl" />
          <span className="text-xl font-bold">{t('app_title')}</span>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={i18n.language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
          >
            <option value="en">{t('english')}</option>
            <option value="hi">{t('hindi')}</option>
          </select>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded flex items-center gap-2"
            >
              <FiLogOut /> {t('logout')}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded"
            >
              {t('login')}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
