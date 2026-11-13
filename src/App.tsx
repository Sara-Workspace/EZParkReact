import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomeScreen from './components/HomeScreen';
import SearchMapScreen from './components/SearchMapScreen';
import DetailsScreen from './components/DetailsScreen';
import NavigationScreen from './components/NavigationScreen';
import AddParkingScreen from './components/AddParkingScreen';
import DashboardScreen from './components/DashboardScreen';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

function App() {
  return (
    <Routes>
     {/* מסך הכניסה והרשמה - פתוח לכולם וללא תפריט עליון */}
      <Route path="/login" element={<LoginScreen />} />

      {/* כל שאר המסכים מוגנים ומחייבים התחברות */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<HomeScreen />} />
        <Route path="/search" element={<SearchMapScreen />} />
        <Route path="/parking/:id" element={<DetailsScreen />} />
        <Route path="/navigation" element={<NavigationScreen />} />
        <Route path="/add-parking" element={<AddParkingScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;