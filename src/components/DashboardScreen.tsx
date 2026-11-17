import { useEffect, useState } from 'react';
import { apiFetch } from '../api/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchParkings } from '../store/parkings/parkingsThunks';
import type { ParkingSpot, Reservation } from '../types';
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

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [mySpotIds, setMySpotIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchParkings());

    const loadPersonalActivity = async () => {
      try {
        setLoading(true);
        setError(null);

        const [myReservations, myOwnedSpots] = await Promise.all([
          apiFetch<Reservation[]>('/Reservations/my'),
          apiFetch<ParkingSpot[]>('/ParkingSpots/my').catch(() => [] as ParkingSpot[]),
        ]);

        setReservations(myReservations);
        setMySpotIds(new Set(myOwnedSpots.map((s) => s.spotId)));
      } catch {
        setError('לא ניתן היה לטעון את נתוני ההשכרות מהשרת.');
      } finally {
        setLoading(false);
      }
    };

    loadPersonalActivity();
  }, [dispatch]);

  const spotById = new Map(spots.map((s) => [s.spotId, s]));

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // נקודות שנוספו החודש (כהכנסה מהשכרת חניות שלי)
  const earnedThisMonth = reservations
    .filter((r) => {
      if (r.status !== 'Completed' || !mySpotIds.has(r.spotID)) return false;
      const d = new Date(parseServerUtc(r.startTime));
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((sum, r) => sum + Number(r.totalPrice || 0), 0);

  // נקודות שירדו החודש (תשלום על חניה אצל אחרים)
  const spentThisMonth = reservations
    .filter((r) => {
      if (r.status !== 'Completed' || mySpotIds.has(r.spotID)) return false;
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <StatCard
          title="נקודות שנוספו לי החודש"
          value={`+${earnedThisMonth.toFixed(1)} נק׳`}
          valueColor="#059669"
        />
        <StatCard
          title="נקודות שירדו לי החודש"
          value={`-${spentThisMonth.toFixed(1)} נק׳`}
          valueColor="#dc2626"
        />
        <StatCard
          title="הזמנות פעילות כרגע"
          value={`${activeCount}`}
          valueColor="#0a6cf0"
        />
      </div>

      <div
        style={{
          background: '#f6faff',
          border: '1px solid #dfe8f3',
          borderRadius: '16px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0a2540', margin: 0 }}>
          הפעילות האחרונה שלי ({reservations.length})
        </h4>

        {recentReservations.length === 0 ? (
          <p style={{ fontSize: '13px', color: '#5a6b82', margin: '8px 0 0 0' }}>
            עדיין אין השכרות או חניות להצגה.
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
            const isIncome = mySpotIds.has(res.spotID);

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
                isIncome={isIncome}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default DashboardScreen;