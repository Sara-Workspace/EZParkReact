import { useEffect, useState, type CSSProperties } from 'react';
import { apiFetch } from '../api/api'; 
import ScreenSection from './ScreenSection';
import StatCard from './StatCard';
import Button from './Button';

interface DriverItem {
  driverID?: number;
  driverId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  creditBalance: number;
  isAdmin: boolean;
}

interface OwnerItem {
  ownerID?: number;
  ownerId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isAdmin: boolean;
}

interface ParkingSpotItem {
  spotId: number;
  ownerId: number;
  address: string;
  city: string;
  basePricePerHour: number;
  evCharger: boolean;
  isActive: boolean;
}

function AdminDashboard() {
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [owners, setOwners] = useState<OwnerItem[]>([]);
  const [spots, setSpots] = useState<ParkingSpotItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [driversData, ownersData, spotsData] = await Promise.all([
          apiFetch<DriverItem[]>('/Drivers'),
          apiFetch<OwnerItem[]>('/Owners'),
          apiFetch<ParkingSpotItem[]>('/ParkingSpots'),
        ]);
        setDrivers(driversData);
        setOwners(ownersData);
        setSpots(spotsData);
      } catch {
        setError('שגיאה בטעינת נתוני הניהול. ודא שהנך מחובר כמנהל (Admin).');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleDeleteSpot = async (spotId: number) => {
    const isConfirmed = window.confirm(`האם למחוק לצמיתות את חניה #${spotId}?`);
    if (!isConfirmed) return;

    try {
      await apiFetch<void>(`/ParkingSpots/${spotId}`, { method: 'DELETE' });
      // עדכון מערך החניות ללא מוטציה (Immutability)
      setSpots((prevSpots) => prevSpots.filter((spot) => spot.spotId !== spotId));
    } catch {
      setError('מחיקת החניה נכשלה');
    }
  };

  if (loading) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>טוען נתוני ניהול...</div>;
  }

  if (error !== null) {
    return <div style={{ padding: '24px', color: '#dc2626', textAlign: 'center' }}>{error}</div>;
  }

  const tableStyle: CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '13px',
    textAlign: 'right',
  };

  const thStyle: CSSProperties = {
    padding: '10px 12px',
    borderBottom: '2px solid #e2e8f0',
    color: '#475569',
    fontWeight: 700,
  };

  const tdStyle: CSSProperties = {
    padding: '10px 12px',
    borderBottom: '1px solid #f1f5f9',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
        לוח ניהול מערכת (Admin) 🛡️
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <StatCard title="סה״כ נהגים רשומים" value={`${drivers.length}`} valueColor="#4f46e5" />
        <StatCard title="סה״כ בעלי חניות" value={`${owners.length}`} valueColor="#059669" />
        <StatCard title="חניות במערכת" value={`${spots.length}`} valueColor="#0f172a" />
      </div>

      <ScreenSection title={`ניהול כלל החניות במערכת (${spots.length})`}>
        {spots.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>מזהה</th>
                  <th style={thStyle}>כתובת ועיר</th>
                  <th style={thStyle}>מזהה בעלים</th>
                  <th style={thStyle}>מחיר לשעה</th>
                  <th style={thStyle}>טעינה</th>
                  <th style={thStyle}>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {spots.map((spot) => (
                  <tr key={spot.spotId}>
                    <td style={tdStyle}>#{spot.spotId}</td>
                    <td style={tdStyle}>
                      {spot.address}, {spot.city}
                    </td>
                    <td style={tdStyle}>{spot.ownerId}</td>
                    <td style={tdStyle}>₪{spot.basePricePerHour}</td>
                    <td style={tdStyle}>{spot.evCharger ? '⚡' : '—'}</td>
                    <td style={tdStyle}>
                      <Button
                        label="מחק חניה"
                        onClick={() => handleDeleteSpot(spot.spotId)}
                        background="#fee2e2"
                        color="#dc2626"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>אין חניות רשומות במערכת.</p>
        )}
      </ScreenSection>

      <ScreenSection title={`רשימת בעלי חניות (${owners.length})`}>
        {owners.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>מזהה</th>
                  <th style={thStyle}>שם מלא</th>
                  <th style={thStyle}>אימייל</th>
                  <th style={thStyle}>טלפון</th>
                  <th style={thStyle}>תפקיד</th>
                </tr>
              </thead>
              <tbody>
                {owners.map((owner) => {
                  const id = owner.ownerID ?? owner.ownerId ?? 0;
                  return (
                    <tr key={id}>
                      <td style={tdStyle}>#{id}</td>
                      <td style={tdStyle}>
                        {owner.firstName} {owner.lastName}
                      </td>
                      <td style={tdStyle}>{owner.email}</td>
                      <td style={tdStyle}>{owner.phone}</td>
                      <td style={tdStyle}>{owner.isAdmin ? 'מנהל + בעלים' : 'בעל חניה'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>אין בעלי חניות רשומים.</p>
        )}
      </ScreenSection>

      <ScreenSection title={`רשימת נהגים (${drivers.length})`}>
        {drivers.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>מזהה</th>
                  <th style={thStyle}>שם מלא</th>
                  <th style={thStyle}>אימייל</th>
                  <th style={thStyle}>טלפון</th>
                  <th style={thStyle}>יתרה</th>
                  <th style={thStyle}>תפקיד</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => {
                  const id = driver.driverID ?? driver.driverId ?? 0;
                  return (
                    <tr key={id}>
                      <td style={tdStyle}>#{id}</td>
                      <td style={tdStyle}>
                        {driver.firstName} {driver.lastName}
                      </td>
                      <td style={tdStyle}>{driver.email}</td>
                      <td style={tdStyle}>{driver.phone}</td>
                      <td style={tdStyle}>₪{driver.creditBalance}</td>
                      <td style={tdStyle}>{driver.isAdmin ? 'מנהל + נהג' : 'נהג'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>אין נהגים רשומים.</p>
        )}
      </ScreenSection>
    </div>
  );
}

export default AdminDashboard;