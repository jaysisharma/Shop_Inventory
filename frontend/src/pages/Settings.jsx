import React from 'react';
import { useState } from 'react';

const SettingsPage = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [notification, setNotification] = useState(false);
  const [theme, setTheme] = useState('light');

  const handleSave = (e) => {
    e.preventDefault();
    // Implement save logic here (e.g., API call)
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-5">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-700 mb-5">Settings</h2>
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-600">User Name</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your user name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter your email address"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="notification"
              checked={notification}
              onChange={(e) => setNotification(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="notification" className="ml-2 text-sm text-gray-600">Enable Notifications</label>
          </div>

          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-600">Theme</label>
            <select
              id="theme"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
