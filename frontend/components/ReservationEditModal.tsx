'use client';

import React, { useState } from 'react';
import { Reservation, updateReservation, UpdateReservationInput } from '../lib/api';
import { X, Save, Loader2 } from 'lucide-react';

interface ReservationEditModalProps {
  reservation: Reservation;
  onClose: () => void;
  onSaved: (updated: Reservation) => void;
}

export default function ReservationEditModal({ reservation, onClose, onSaved }: ReservationEditModalProps) {
  const [nomClient, setNomClient] = useState(reservation.nom_client);
  const [telephone, setTelephone] = useState(reservation.telephone);
  const [date, setDate] = useState(reservation.date_reservation);
  const [moment, setMoment] = useState<'matin' | 'soir'>(reservation.moment);
  const [heure, setHeure] = useState(reservation.heure.substring(0, 5));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload: UpdateReservationInput = {
        nom_client: nomClient,
        telephone,
        date_reservation: date,
        moment,
        heure,
      };
      const updated = await updateReservation(reservation.id, payload);
      onSaved(updated);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-charcoal/40 backdrop-blur-sm">
      <div className="bg-surface rounded-md shadow-card-hover w-full max-w-md p-lg space-y-lg animate-in fade-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-sans text-[22px] font-bold text-primary tracking-tight">Modifier la réservation</h2>
            <p className="text-outline text-[13px] mt-[2px]">Réservation #{reservation.id}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-[#ebefed] transition-colors"
          >
            <X size={18} className="text-outline" />
          </button>
        </div>

        {error && (
          <div className="p-md bg-[#FDF2F2] border-l-4 border-error rounded-md text-error text-[13px] font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-md">
          <div>
            <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Nom complet</label>
            <input
              type="text"
              required
              value={nomClient}
              onChange={(e) => setNomClient(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
            />
          </div>

          <div>
            <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Téléphone</label>
            <input
              type="tel"
              required
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              />
            </div>
            <div>
              <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Heure</label>
              <input
                type="time"
                required
                value={heure}
                onChange={(e) => setHeure(e.target.value)}
                className="w-full bg-white border border-[#c1c9c1] rounded-md px-md py-sm text-body-md focus:outline-none focus:border-primary focus:ring-4 focus:ring-secondary/15 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-label-sm text-charcoal mb-[6px] font-semibold">Moment</label>
            <div className="flex gap-sm bg-[#F7FAF8] p-[4px] rounded-md border border-[#ebefed]">
              {(['matin', 'soir'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMoment(m)}
                  className={`flex-1 py-[8px] px-md rounded-md font-bold text-label-md transition-all duration-200 capitalize ${
                    moment === m ? 'bg-primary text-white shadow-sm' : 'text-charcoal hover:bg-[#ebefed]'
                  }`}
                >
                  {m === 'matin' ? '🌅 Matin' : '🌙 Soir'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-sm pt-sm">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-sm px-md bg-[#ebefed] hover:bg-[#d7dbd9] text-charcoal font-bold rounded-md transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-sm px-md bg-primary hover:bg-primary-dark text-white font-bold rounded-md transition-colors flex items-center justify-center gap-xs disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
