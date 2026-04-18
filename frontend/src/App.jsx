import React, { useState, useEffect } from 'react';
import FrameManager from './components/FrameManager';
import AuthGateway from './frames/AuthGateway';
import ExecutiveDashboard from './frames/ExecutiveDashboard';
import ComplaintComposer from './frames/ComplaintComposer';
import AITheater from './frames/AITheater';
import ComplaintDetails from './frames/ComplaintDetails';
import QueueView from './frames/QueueView';
import QAAnalytics from './frames/QAAnalytics';
import ClassificationReview from './frames/ClassificationReview';
import ReportingStudio from './frames/ReportingStudio';
import ManagerOverview from './frames/ManagerOverview';
import SLAMonitor from './frames/SLAMonitor';
import ReportGenerator from './frames/ReportGenerator';
import BatchUpload from './frames/BatchUpload';
import UserSettings from './frames/UserSettings';
import NotificationCenter from './frames/NotificationCenter';
import PublicTracker from './frames/PublicTracker';
import EmailExtractor from './frames/EmailExtractor';
import JustificationModal from './frames/JustificationModal';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const frames = [
    { name: 'AuthGateway', component: AuthGateway },
    { name: 'ExecutiveDashboard', component: ExecutiveDashboard },
    { name: 'ComplaintComposer', component: ComplaintComposer },
    { name: 'AITheater', component: AITheater },
    { name: 'ComplaintDetails', component: ComplaintDetails },
    { name: 'QueueView', component: QueueView },
    { name: 'QAAnalytics', component: QAAnalytics },
    { name: 'ClassificationReview', component: ClassificationReview },
    { name: 'ReportingStudio', component: ReportingStudio },
    { name: 'ManagerOverview', component: ManagerOverview },
    { name: 'SLAMonitor', component: SLAMonitor },
    { name: 'ReportGenerator', component: ReportGenerator },
    { name: 'BatchUpload', component: BatchUpload },
    { name: 'UserSettings', component: UserSettings },
    { name: 'NotificationCenter', component: NotificationCenter },
    { name: 'PublicTracker', component: PublicTracker },
    { name: 'EmailExtractor', component: EmailExtractor },
    { name: 'JustificationModal', component: JustificationModal },
  ];

  return (
    <div className="App min-h-screen">
      <button 
        onClick={toggleTheme}
        className="fixed top-4 right-4 z-[1001] p-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md transition-all hover:scale-110"
        title="Toggle Theme"
      >
        {theme === 'light' ? <Moon size={20} className="text-slate-800" /> : <Sun size={20} className="text-amber-400" />}
      </button>

      <FrameManager frames={frames} theme={theme} />
    </div>
  );
}

export default App;
