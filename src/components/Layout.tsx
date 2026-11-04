// components/Layout.tsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

function Layout() {
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
        <nav style={{ display: 'flex', gap: '16px' }}>
          <NavLink
            to="/"
            style={({ isActive }) => ({
              color: isActive ? '#38bdf8' : 'white',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 400,
            })}
          >
            בית
          </NavLink>
          <NavLink
            to="/search"
            style={({ isActive }) => ({
              color: isActive ? '#38bdf8' : 'white',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 400,
            })}
          >
            חיפוש במפה
          </NavLink>
          <NavLink
            to="/add-parking"
            style={({ isActive }) => ({
              color: isActive ? '#38bdf8' : 'white',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 400,
            })}
          >
            הוספת חניה
          </NavLink>
          <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
              color: isActive ? '#38bdf8' : 'white',
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 400,
            })}
          >
            לוח בקרה
          </NavLink>
        </nav>
      </header>

      <main style={{ maxWidth: '1024px', margin: '24px auto', padding: '0 16px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;