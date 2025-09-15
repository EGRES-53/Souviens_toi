import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';

// Pages
import HomePage from './pages/HomePage';
import TimelinePage from './pages/TimelinePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            {/* Navigation Simple */}
            <nav className="bg-white shadow-sm border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold text-primary-600">
                      SOUVIENS_TOI
                    </Link>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Link to="/timeline" className="text-gray-700 hover:text-primary-600">
                      Chronologie
                    </Link>
                    <Link to="/login" className="text-gray-700 hover:text-primary-600">
                      Connexion
                    </Link>
                    <Link to="/register" className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">
                      Inscription
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Routes */}
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/timeline" element={<TimelinePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

}

export default App;
