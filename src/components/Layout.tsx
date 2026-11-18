import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { refreshPoints } from '../store/user/userThunks';
import { useAppDispatch, useAppSelector } from '../store/hooks'; // התאם לנתיב שלך
import { logout } from '../store/user/userSlice'; // התאם לנתיב של ה-Slice שלך
import { loadActiveReservation } from '../store/session/sessionThunks';
import ChatWidget from './ChatWidget';
import { formatMoney } from '../utils/money';



function Layout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const location = useLocation();

  const hasActiveParking = useAppSelector((state) => state.session.reservation?.status === 'Active');

  // יתרת הארנק בכותרת מתעדכנת מהשרת בכל מעבר בין מסכים
   useEffect(() => {
    if (localStorage.getItem('token') !== null) {
      dispatch(refreshPoints());
      dispatch(loadActiveReservation());
    }
  }, [dispatch, location.pathname]);

  const token = localStorage.getItem('token');
  const isAdmin = JSON.parse(localStorage.getItem('isAdmin') || 'false') as boolean;
  const role = localStorage.getItem('role');
  const showAdminLink = Boolean(isAdmin || role === 'Admin');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userId');
    dispatch(logout());
    navigate('/');
  };

  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#7cc0ff' : 'white',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
  });

  return (
    <div>
      <header
        style={{
          background: '#0a2540',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
          EZPark • חניה בקליק
        </h1>
        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <NavLink to="/home" style={getNavLinkStyle}>
            בית
          </NavLink>
          <NavLink to="/license-plate" style={getNavLinkStyle}>
            חפש חניה
          </NavLink>
          {hasActiveParking && (
            <NavLink to="/parking-session" style={getNavLinkStyle}>
              ⏱️ חניה פעילה
            </NavLink>
          )}
          <NavLink to="/add-parking" style={getNavLinkStyle}>
            הוספת חניה
          </NavLink>
          
            <NavLink to="/my-spots" style={getNavLinkStyle}>
              החניות שלי
            </NavLink>
          
          <NavLink to="/dashboard" style={getNavLinkStyle}>
            לוח בקרה
          </NavLink>

          {/* 👛 הארנק: היתרה בשקלים, לחיצה פותחת את מסך הארנק */}
          {token !== null && (
            <NavLink to="/wallet" style={getNavLinkStyle}>
              👛 {formatMoney(user.points)}
            </NavLink>
          )}

          {showAdminLink && (
            <NavLink to="/admin" style={getNavLinkStyle}>
              לוח ניהול 🛡️
            </NavLink>
          )}

          {token !== null && (
            <NavLink
              to="/profile"
              style={({ isActive }) => ({
                fontSize: '13px',
                color: isActive ? '#7cc0ff' : '#cfdbea',
                textDecoration: 'none',
                fontWeight: 700,
              })}
              title="עדכון פרטי פרופיל"
            >
              👤 {user.firstName}
            </NavLink>
          )}

          {token !== null ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: '#2a3b52',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              התנתק
            </button>
          ) : (
            <NavLink to="/login" style={getNavLinkStyle}>
              התחברות
            </NavLink>
          )}
        </nav>
      </header>

      <main style={{ maxWidth: '1024px', margin: '24px auto', padding: '0 16px' }}>
        <Outlet />
      </main>

      {/* 💬 עוזר ה-AI: כפתור צ'אט בפינת המסך, בכל המסכים של משתמש מחובר */}
      <ChatWidget />
    </div>
  );
}

export default Layout;