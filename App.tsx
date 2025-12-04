
import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

type ViewState = 'landing' | 'app';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage onLaunch={() => setCurrentView('app')} />
      ) : (
        <Dashboard onLogout={() => setCurrentView('landing')} />
      )}
    </>
  );
};

export default App;
