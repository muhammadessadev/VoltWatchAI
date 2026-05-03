import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './UserContext';
import { Welcome, LocationSetup, ProviderSetup, ApplianceSetup } from './Onboarding';
import { DashboardLayout } from './DashboardLayout';
import { Home } from './Home';
import { Planner } from './Planner';
import { Chat } from './Chat';
import { Map } from './Map';
import { Tracker } from './Tracker';
import { Reports } from './Reports';
import { Profile } from './Profile';

// Guard component to ensure user has completed onboarding
const RequireProfile = ({ children }: { children: JSX.Element }) => {
  const { profile } = useUser();
  // Fixed: Only check if appliances array exists, allowing empty selections
  if (!profile || !Array.isArray(profile.appliances)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { profile } = useUser();
  
  // Fixed: Check if profile exists and appliances array is initialized
  const isProfileComplete = profile && Array.isArray(profile.appliances);

  return (
    <Routes>
      {/* Onboarding Flow */}
      <Route path="/" element={isProfileComplete ? <Navigate to="/dashboard" replace /> : <Welcome />} />
      <Route path="/location" element={<LocationSetup />} />
      <Route path="/provider" element={<ProviderSetup />} />
      <Route path="/appliances" element={<ApplianceSetup />} />

      {/* Dashboard Flow */}
      <Route path="/dashboard" element={<RequireProfile><DashboardLayout /></RequireProfile>}>
        <Route index element={<Home />} />
        <Route path="planner" element={<Planner />} />
        <Route path="chat" element={<Chat />} />
        <Route path="map" element={<Map />} />
        <Route path="tracker" element={<Tracker />} />
        <Route path="reports" element={<Reports />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default function App() {
  return (
    <UserProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </UserProvider>
  );
}
