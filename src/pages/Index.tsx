
import React, { useState } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

const Index = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [userRole, setUserRole] = useState('user'); // 'user' or 'admin'

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    // In real app, this would be determined by backend response
    setUserRole(userData.email === 'admin@servicedesk.com' ? 'admin' : 'user');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUserRole('user');
  };

  if (currentUser) {
    return userRole === 'admin' ? (
      <AdminDashboard user={currentUser} onLogout={handleLogout} />
    ) : (
      <Dashboard user={currentUser} onLogout={handleLogout} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-9.75 9.75A9.75 9.75 0 0112 2.25z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Service Desk</h1>
          <p className="text-gray-600">Professional IT Support Platform</p>
        </div>

        {isRegistering ? (
          <RegisterForm 
            onRegister={handleLogin}
            onSwitchToLogin={() => setIsRegistering(false)}
          />
        ) : (
          <LoginForm 
            onLogin={handleLogin}
            onSwitchToRegister={() => setIsRegistering(true)}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
