import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchParkings } from '../store/parkings/parkingsThunks';
import type { Reservation } from '../types';
import { parseServerUtc } from '../utils/time';
import RentalRow from './RentalRow';
import StatCard from './StatCard';

function formatTimeAgo(isoDate: string): string {
  const diffMs = Date.now() - parseServerUtc(isoDate);
  const diffMin = Math.max(1, Math.floor(diffMs / 60000));
  if (diffMin < 60) return `לפני ${diffMin} דקות`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return diffHours === 1 ? 'לפני שעה' : `לפני ${diffHours} שעות`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'אתמול';
  return `לפני ${diffDays} ימים`;
}

function DashboardScreen() {
  const dispatch = useAppDispatch();
  const { items: spots } = useAppSelector((state) => state.parkings);
  const user = useAppSelector((state) => state.user);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchParkings());

    const loadReservations = async () => {
      try {
        setLoading(true);
        setError(null);
        const endpoint = user.role === 'Admin' ? '/Reservations' : '/Reservations/my';
        const data = await apiFetch<Reservation[]>(endpoint);
        setReservations(data);
      } catch {
        setError('לא ניתן היה לטעון את נתוני ההשכרות מהשרת.');
      } finally {
        setLoading(false);
      }
    };

    loadReservations();
  }, [dispatch, user.role]);

  const spotById = new Map(spots.map((s) => [s.spotId, s]));

  // חישוב נתונים אמיתיים לחודש הנוכחי
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlyPoints = reservations
    .filter((r) => {
      if (r.status !== 'Completed') return false;
      const d = new Date(parseServerUtc(r.startTime));
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, r) => sum + Number(r.totalPrice || 0), 0);

  const activeCount = reservations.filter((r) => r.status === 'Active').length;

  const recentReservations = [...reservations]
    .sort((a, b) => b.reservationID - a.reservationID)
    .slice(0, 10);

  if (loading && reservations.length === 0) {
    return <div style={{ padding: '24px', textAlign: 'center' }}>טוען נתוני לוח בקרה...</div>;
  }

  return (
    <div
      style={{
        maxWidth: '1024px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
    >
      {error !== null && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 700,
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <StatCard
          title={user.role === 'Admin' ? 'מחזור נקודות החודש' : 'הנקודות שלי החודש'}
          value={`${monthlyPoints.toFixed(1)} נק׳`}
          valueColor="#4f46e5"
        />
        <StatCard
          title="השכרות פעילות כרגע"
          value={`${activeCount} השכרות`}
          valueColor="#059669"
        />
      </div>

      <div
        style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          {user.role === 'Admin' ? 'השכרות אחרונות במערכת' : 'ההשכרות האחרונות שלי'} ({reservations.length})
        </h4>

        {recentReservations.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#64748b', margin: '8px 0 0 0' }}>
            עדיין אין השכרות להצגה.
          </p>
        ) : (
          recentReservations.map((res) => {
            const spot = spotById.get(res.spotID);
            const title = spot ? `${spot.address}, ${spot.city}` : `חניה #${res.spotID}`;
            const endMs =
              res.status === 'Active' ? Date.now() : parseServerUtc(res.endTime);
            const durationMin = Math.max(
              1,
              Math.round((endMs - parseServerUtc(res.startTime)) / 60000)
            );
            const isActive = res.status === 'Active';

            return (
              <RentalRow
                key={res.reservationID}
                plateNumber={title}
                timeAgo={formatTimeAgo(res.startTime)}
                durationMin={durationMin}
                type={spot?.evCharger ? 'כולל טעינה ⚡' : 'חניה רגילה'}
                totalEarnings={Number(res.totalPrice || 0).toFixed(1)}
                statusLabel={isActive ? 'פעילה כעת' : 'הושלמה'}
                isActive={isActive}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;