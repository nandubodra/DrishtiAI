import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

const Settings = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [settings, setSettings] = useState({});
  const [newContact, setNewContact] = useState({ name: '', phone: '', relation: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone) {
      alert('Please fill all fields');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/users/emergency-contact',
        newContact,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewContact({ name: '', phone: '', relation: '' });
      alert('Contact added successfully');
    } catch (error) {
      alert('Failed to add contact');
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/users/profile',
        { settings },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Settings saved successfully');
    } catch (error) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('settings')}</h1>

        <div className="space-y-6">
          {/* Voice Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Voice & Audio</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice Speed</label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={settings.voiceSpeed || 1}
                  onChange={(e) => handleSettingChange('voiceSpeed', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">{(settings.voiceSpeed || 1).toFixed(1)}x</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Volume Level</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={settings.volumeLevel || 1}
                  onChange={(e) => handleSettingChange('volumeLevel', parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">{Math.round((settings.volumeLevel || 1) * 100)}%</p>
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Notifications</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications !== false}
                onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Enable Notifications</span>
            </label>
          </div>

          {/* Display Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Display</h2>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.darkMode || false}
                onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-gray-700">Dark Mode</span>
            </label>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{t('emergency_contacts')}</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_name')}</label>
                <input
                  type="text"
                  value={newContact.name}
                  onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="e.g., Mother"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('contact_phone')}</label>
                <input
                  type="tel"
                  value={newContact.phone}
                  onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('relation')}</label>
                <input
                  type="text"
                  value={newContact.relation}
                  onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                  placeholder="e.g., Parent"
                />
              </div>
              <button
                onClick={handleAddContact}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg flex items-center justify-center gap-2"
              >
                <FiPlus /> {t('add_contact')}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FiSave /> {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
