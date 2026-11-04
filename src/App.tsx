// App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeScreen from './components/HomeScreen';
import SearchMapScreen from './components/SearchMapScreen';
import DetailsScreen from './components/DetailsScreen';
import NavigationScreen from './components/NavigationScreen';
import AddParkingScreen from './components/AddParkingScreen';
import DashboardScreen from './components/DashboardScreen';
import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search" element={<SearchMapScreen />} />
        <Route path="/parking/:id" element={<DetailsScreen />} />
        <Route path="/navigation" element={<NavigationScreen />} />
        <Route path="/add-parking" element={<AddParkingScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;