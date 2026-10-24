import React from 'react';
import HomeScreen from './components/HomeScreen';
import SearchMapScreen from './components/SearchMapScreen';
import DetailsScreen from './components/DetailsScreen';
import NavigationScreen from './components/NavigationScreen';
import AddParkingScreen from './components/AddParkingScreen';
import DashboardScreen from './components/DashboardScreen';
import ScreenSection from './components/ScreenSection';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <header
        style={{
          background: '#0f172a',
          color: 'white',
          padding: '16px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h1 style={{ fontWeight: 700, fontSize: '18px' }}>חניה בקליק • פארקי</h1>
      </header>

      <main
        style={{
          maxWidth: '1400px',
          margin: '16px auto',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        <ScreenSection title="1. מסך בית">
          <HomeScreen />
        </ScreenSection>

        <ScreenSection title="2. חיפוש חניה במפה">
          <SearchMapScreen />
        </ScreenSection>

        <ScreenSection title="3. פרטי חניה ותשלום">
          <DetailsScreen />
        </ScreenSection>

        <ScreenSection title="4. ניווט לחניה">
          <NavigationScreen />
        </ScreenSection>

        <ScreenSection title="5. הוספת חניה להשכרה">
          <AddParkingScreen />
        </ScreenSection>

        <ScreenSection title="6. לוח בקרה והכנסות">
          <DashboardScreen />
        </ScreenSection>
      </main>
    </div>
  );
}

export default App;