import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext, AppProvider } from './context/AppContext';
import NavigationLayout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Overview from './pages/Overview';
import Projects from './pages/Projects';
import Team from './pages/Team';
import TimeTracking from './pages/TimeTracking';
import ResourceAllocation from './pages/ResourceAllocation';
import ApplicationHealthDashboard from './pages/ApplicationHealthDashboard';
import TimeAnalysis from './pages/TimeAnalysis';
import Home from './pages/Home';
import AppAnalyticsDemo from './pages/AppAnalyticsDemo';
import EnhancedSaturationDemo from './pages/EnhancedSaturationDemo';
// import SaturationDemo from './pages/SaturationDemo';
import TransferDemo from './pages/TransferDemo';
import MemberDetail from './pages/MemberDetail';
import PersonalWorkloadAssessmentDemo from './components/PersonalWorkloadAssessmentDemo';
import './App.css';

// 受保护的路由组件
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useContext(AppContext);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children;
};

// 主应用组件
const AppContent = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <Home />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/overview"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <Overview />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <Dashboard />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <Projects />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <Team />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-tracking"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <TimeTracking />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/resource-allocation"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <ResourceAllocation />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/applications"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <ApplicationHealthDashboard />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/time-analysis"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <TimeAnalysis />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/app-analytics"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <AppAnalyticsDemo />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/enhanced-saturation-demo"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <EnhancedSaturationDemo />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/member/:id"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <MemberDetail />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transfer-demo"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <TransferDemo />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-workload"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <PersonalWorkloadAssessmentDemo />
              </NavigationLayout>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/saturation-demo"
          element={
            <ProtectedRoute>
              <NavigationLayout>
                <SaturationDemo />
              </NavigationLayout>
            </ProtectedRoute>
          }
        /> */}
        {/* 404页面 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

// 包装在AppProvider中的应用
function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
