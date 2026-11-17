import { useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { refreshPoints } from '../store/user/userThunks';
import { useAppDispatch, useAppSelector } from '../store/hooks'; // התאם לנתיב שלך
import { logout } from '../store/user/userSlice'; // התאם לנתיב של ה-Slice שלך
import { loadActiveReservation } from '../store/session/sessionThunks';
import ChatWidget from './ChatWidget';



function Layout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const location = useLocation();

  const hasActiveParking = useAppSelector((state) => state.session.reservation?.status === 'Active');

  // הנקודות בכותרת מתעדכנות מהשרת בכל מעבר בין מסכים
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
    navigate('/login');
  };

  const getNavLinkStyle = ({ isActive }: { isActive: boolean }) => ({
    color: isActive ? '#38bdf8' : 'white',
    textDecoration: 'none',
    fontWeight: isActive ? 700 : 400,
  });

  return (
    <div>
      <header
        style={{
          background: '#0f172a',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>
          חניה בקליק • פארקי
        </h1>
        <nav style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <NavLink to="/" style={getNavLinkStyle}>
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

          {showAdminLink && (
            <NavLink to="/admin" style={getNavLinkStyle}>
              לוח ניהול 🛡️
            </NavLink>
          )}

          {token !== null && (
            <span style={{ fontSize: '13px', color: '#cbd5e1' }}>
              👤 {user.firstName} • {user.points} נקודות
            </span>
          )}

          {token !== null ? (
            <button
              type="button"
              onClick={handleLogout}
              style={{
                background: '#334155',
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