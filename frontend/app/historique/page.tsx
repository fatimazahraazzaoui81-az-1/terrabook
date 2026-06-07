'use client';

import React, { useEffect, useState } from 'react';
import { Reservation, getReservations } from '../../lib/api';
import HistoriqueTable from '../../components/HistoriqueTable';
import FicheModal from '../../components/FicheModal';

export default function HistoriquePage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservations();
      setReservations(data);
    } catch (err: any) {
      setError(err.message || "Impossible de charger l'historique.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleReservationUpdated = (updated: Reservation) => {
    setReservations((prev) => prev.map((r) => (r.id === updated.id ? { ...r, ...updated } : r)));
  };

  const handleReservationDeleted = (id: number) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-md">
        <div className="w-12 h-12 rounded-full border-4 border-[#ebefed] border-t-secondary animate-spin" />
        <p className="text-outline font-semibold font-sans">Chargement de l'historique...</p>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      {error && (
        <div className="p-md bg-[#FDF2F2] border-l-4 border-error rounded-md text-error text-label-sm font-semibold">
          {error}
        </div>
      )}

      <HistoriqueTable
        reservations={reservations}
        onViewFiche={(r) => setSelectedReservation(r)}
        onReservationUpdated={handleReservationUpdated}
        onReservationDeleted={handleReservationDeleted}
      />

      {selectedReservation && (
        <FicheModal
          reservation={selectedReservation}
          onClose={() => setSelectedReservation(null)}
        />
      )}
    </div>
  );
}
