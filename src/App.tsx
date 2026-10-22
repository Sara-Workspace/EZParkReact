import React from 'react';
import { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import SearchMapScreen from './components/SearchMapScreen';
import DetailsScreen from './components/DetailsScreen';
import NavigationScreen from './components/NavigationScreen';
import AddParkingScreen from './components/AddParkingScreen';
import DashboardScreen from './components/DashboardScreen';
import TabButton from './components/TabButton';

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: 'home', label: '1. בית' },
  { id: 'search', label: '2. מפה' },
  { id: 'details', label: '3. תשלום' },
  { id: 'navigation', label: '4. ניווט' },
  { id: 'add', label: '5. הוספה' },
  { id: 'dashboard', label: '6. ניהול' },
];

function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          background: '#0f172a',
          color: 'white',
          padding: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: '18px' }}>חניה בקליק • פארקי</h1>

        <div style={{ display: 'flex', gap: '8px' }}>
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              isActive={currentTab === tab.id}
              onClick={() => setCurrentTab(tab.id)}
            />
          ))}
        </div>
      </header>

      <main
        style={{
          padding: '24px',
          flex: 1,
          maxWidth: '1400px',
          width: '100%',
          margin: '16px auto',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        {currentTab === 'home' && <HomeScreen />}
        {currentTab === 'search' && <SearchMapScreen />}
        {currentTab === 'details' && <DetailsScreen />}
        {currentTab === 'navigation' && <NavigationScreen />}
        {currentTab === 'add' && <AddParkingScreen />}
        {currentTab === 'dashboard' && <DashboardScreen />}
      </main>
    </div>
  );
}

export default App;