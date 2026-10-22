import { useState } from 'react';
import type { Parking } from './types';
import HomeScreen from './components/HomeScreen';
import SearchMapScreen from './components/SearchMapScreen';
import DetailsScreen from './components/DetailsScreen';
import NavigationScreen from './components/NavigationScreen';
import AddParkingScreen from './components/AddParkingScreen';
import DashboardScreen from './components/DashboardScreen';
import AuthModal from './components/AuthModal';
import TabButton from './components/TabButton';
import { parkings, rentals, tabs } from './data';
import {
  SCREEN_HOME,
  SCREEN_SEARCH,
  SCREEN_DETAILS,
  SCREEN_NAVIGATION,
  SCREEN_ADD,
  SCREEN_DASHBOARD,
} from './constants';

function App() {
  // המסך הנוכחי
  const [currentTab, setCurrentTab] = useState<number>(SCREEN_HOME);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('driver@parking.co.il');
  // החניה שנבחרה במפה, מתחילים בראשונה כדי שתמיד יהיה ערך
  const [selectedParking, setSelectedParking] = useState<Parking>(parkings[0]);

  function handleSelectParking(parking: Parking) {
    setSelectedParking(parking);
    setCurrentTab(SCREEN_DETAILS);
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Heebo']">
      {/* סרגל ניווט עליון להחלפת מסכים */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-lg">חניה בקליק • פארקי</h1>

        <div className="flex gap-2">
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

      {/* תצוגה מותנית של המסך לפי ה-State */}
      <main className="p-6 flex-1 max-w-[1400px] w-full mx-auto bg-white my-4 rounded-2xl shadow-sm">
        {currentTab === SCREEN_HOME && (
          <HomeScreen
            onNavigate={setCurrentTab}
            userEmail={userEmail}
            onOpenAuth={() => setIsAuthOpen(true)}
          />
        )}
        {currentTab === SCREEN_SEARCH && (
          <SearchMapScreen parkings={parkings} onSelectParking={handleSelectParking} />
        )}
        {currentTab === SCREEN_DETAILS && (
          <DetailsScreen
            parking={selectedParking}
            onConfirm={() => setCurrentTab(SCREEN_NAVIGATION)}
            onBack={() => setCurrentTab(SCREEN_SEARCH)}
          />
        )}
        {currentTab === SCREEN_NAVIGATION && (
          <NavigationScreen onHome={() => setCurrentTab(SCREEN_HOME)} />
        )}
        {currentTab === SCREEN_ADD && (
          <AddParkingScreen onPublished={() => setCurrentTab(SCREEN_DASHBOARD)} />
        )}
        {currentTab === SCREEN_DASHBOARD && <DashboardScreen rentals={rentals} />}
      </main>

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={setUserEmail}
        />
      )}
    </div>
  );
}

export default App;