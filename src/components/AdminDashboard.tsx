import { useEffect, useState, type CSSProperties } from 'react';
import { apiFetch } from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchParkings, updateParking, deleteParking } from '../store/parkings/parkingsThunks';
import type { ParkingSpot } from '../store/parkings/parkingsState';
import type { Reservation } from '../types';
import { parseServerUtc } from '../utils/time';
import ScreenSection from './ScreenSection';
import StatCard from './StatCard';
import Button from './Button';
import AdminSpotCheck from './AdminSpotCheck'; // 👑 מצלמה מדומה + בדיקת רכב (AI)

interface DriverItem {
  driverID?: number;
  driverId?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  creditBalance: number;
  points?: number;
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

function AdminDashboard() {
  const dispatch = useAppDispatch();

  // חניות - מגיעות מה-Store המרכזי
  const { items: spots, loading: spotsLoading, error: spotsError } = useAppSelector(
    (state) => state.parkings
  );

  // נהגים ובעלים - עדיין state מקומי (בהמשך אפשר להעביר גם אותם ל-Slice)
  const [drivers, setDrivers] = useState<DriverItem[]>([]);
  const [owners, setOwners] = useState<OwnerItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchParkings());

    const fetchUsers = async () => {
      try {
               const [driversData, ownersData, reservationsData] = await Promise.all([
          apiFetch<DriverItem[]>('/Drivers'),
          apiFetch<OwnerItem[]>('/Owners'),
          apiFetch<Reservation[]>('/Reservations'),
        ]);
        setDrivers(driversData);
        setOwners(ownersData);
        setReservations(reservationsData);
      } catch {
        setUsersError('שגיאה בטעינת נתוני הניהול. ודא שהנך מחובר כמנהל (Admin).');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [dispatch]);

  const loading = usersLoading || spotsLoading;
  const error = usersError ?? spotsError;

  const handleDeleteSpot = async (spotId: number) => {
    const isConfirmed = window.confirm(`האם למחוק לצמיתות את חניה #${spotId}?`);
    if (!isConfirmed) return;

    try {
      setActionError(null);
      await dispatch(deleteParking(spotId)).unwrap();
     } catch (err) {
      const message = (err as { message?: string }).message ?? 'שגיאה לא ידועה';
      setActionError(`מחיקת החניה נכשלה: ${message}`);
    }
  };

  const handleToggleActive = async (spot: ParkingSpot) => {
    try {
          const hasActiveReservation = reservations.some(
      (r) => r.spotID === spot.spotId && r.status === 'Active'
    );
    if (hasActiveReservation && !window.confirm('יש הזמנה פעילה על החניה הזו. שינוי הזמינות לא יסגור אותה. להמשיך?')) {
      return;
    }
      setActionError(null);
      await dispatch(updateParking({ ...spot, isActive: !spot.isActive })).unwrap();
    } catch (err) {
      const message = (err as { message?: string }).message ?? 'שגיאה לא ידועה';
      setActionError(`עדכון הזמינות נכשל: ${message}`);
    }
  };

  // מציגים "טוען" רק בטעינה הראשונה. אחרת, ריענון אחרי בדיקת רכב היה מוחק את התוצאה מהמסך
  if (loading && spots.length === 0) {
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
    const sortedReservations = [...reservations].sort((a, b) => b.reservationID - a.reservationID);

      // חיפוש מהיר לפי מזהה: כך מציגים שמות וכתובות במקום מספרים
  const spotById = new Map(spots.map((s) => [s.spotId, s]));
  const driverNameById = new Map(
    drivers.map((d) => [d.driverID ?? d.driverId ?? 0, `${d.firstName} ${d.lastName}`])
  );
  const ownerNameById = new Map(
    owners.map((o) => [o.ownerID ?? o.ownerId ?? 0, `${o.firstName} ${o.lastName}`])
  );

  const statusLabels: Record<string, string> = {
    Active: 'פעילה',
    Completed: 'הסתיימה',
    Pending: 'ממתינה',
  };

  const formatDateTime = (value: string): string =>
    new Date(parseServerUtc(value)).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });

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

      {actionError !== null && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 700 }}>
          {actionError}
        </div>
      )}

      <ScreenSection title={`ניהול כלל החניות במערכת (${spots.length})`}>
        {spots.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>מזהה</th>
                  <th style={thStyle}>כתובת ועיר</th>
                  <th style={thStyle}>בעלת החניה</th>
                  <th style={thStyle}>מחיר לשעה</th>
                  <th style={thStyle}>טעינה</th>
                  <th style={thStyle}>זמינות</th>
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
                    <td style={tdStyle}>{ownerNameById.get(spot.ownerId) ?? `#${spot.ownerId}`}</td>
                    <td style={tdStyle}>₪{spot.basePricePerHour}</td>
                    <td style={tdStyle}>{spot.evCharger ? '⚡' : '—'}</td>
                    <td style={tdStyle}>
                      <Button
                        label={spot.isActive ? 'סמן כלא זמינה' : 'סמן כזמינה'}
                        onClick={() => handleToggleActive(spot)}
                        background="#e0e7ff"
                        color="#4338ca"
                      />
                    </td>
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


      {/* 👑 מצלמות ובדיקה: שורה לכל חניה (AdminSpotCheck) */}
      <ScreenSection title="מצלמות ובדיקת רכבים בחניות 📷">
        <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 8px 0' }}>
          העלאת תמונה = מה שהמצלמה בחניה רואה עכשיו (רק נשמר). בדיקה = ה-AI קורא את הלוחית ומחליט אם הרכב משלם.
        </p>
        {spots.map((spot) => (
          <AdminSpotCheck
            key={spot.spotId}
            spotId={spot.spotId}
            title={`${spot.address}, ${spot.city}`}
            onChecked={() => dispatch(fetchParkings())}
          />
        ))}
      </ScreenSection>

      <ScreenSection title={`כלל ההזמנות במערכת (${reservations.length})`}>
        {sortedReservations.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={tableStyle}>
                            <thead>
                <tr>
                  <th style={thStyle}>מזהה</th>
                  <th style={thStyle}>חניה</th>
                  <th style={thStyle}>בעלת החניה</th>
                  <th style={thStyle}>נהגת</th>
                  <th style={thStyle}>התחלה</th>
                  <th style={thStyle}>סיום</th>
                  <th style={thStyle}>עלות (נק')</th>
                  <th style={thStyle}>סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {sortedReservations.map((reservation) => (
                  <tr key={reservation.reservationID}>
                    <td style={tdStyle}>#{reservation.reservationID}</td>
                                        <td style={tdStyle}>
                      {spotById.get(reservation.spotID) !== undefined
                        ? `${spotById.get(reservation.spotID)!.address}, ${spotById.get(reservation.spotID)!.city}`
                        : `#${reservation.spotID}`}
                    </td>
                    <td style={tdStyle}>
                      {(() => {
                        const ownerId = spotById.get(reservation.spotID)?.ownerId;
                        return ownerId !== undefined ? ownerNameById.get(ownerId) ?? `#${ownerId}` : '—';
                      })()}
                    </td>
                    <td style={tdStyle}>
                      {driverNameById.get(reservation.driverID) ?? `#${reservation.driverID}`}
                    </td>
                    <td style={tdStyle}>{formatDateTime(reservation.startTime)}</td>
                    <td style={tdStyle}>
                      {reservation.status === 'Active' ? '—' : formatDateTime(reservation.endTime)}
                    </td>
                    <td style={tdStyle}>{reservation.totalPrice}</td>
                    <td
                      style={{
                        ...tdStyle,
                        fontWeight: 700,
                        color: reservation.status === 'Active' ? '#d97706' : '#059669',
                      }}
                    >
                      {statusLabels[reservation.status] ?? reservation.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>אין הזמנות במערכת.</p>
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
                      <td style={tdStyle}>{driver.points ?? driver.creditBalance ?? 0} נק׳</td>
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