'use client';

import React from 'react';
import { Reservation } from '../lib/api';
import { Check, Printer, X } from 'lucide-react';

interface FicheModalProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export default function FicheModal({ reservation, onClose }: FicheModalProps) {
  if (!reservation) return null;

  const handlePrint = () => {
    window.print();
  };

  // Format date nicely (french locale)
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div id="print-overlay" className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      {/* Print styles stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all page content except this modal */
          body > * {
            display: none !important;
          }
          #print-overlay {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            height: auto !important;
            background: white !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .modal-container {
            box-shadow: none !important;
            border: 1px solid #ebefed !important;
            max-width: 100% !important;
            width: 100% !important;
            margin: 0 !important;
            border-radius: 0 !important;
          }
          .print-hide {
            display: none !important;
          }
        }
      `}} />

      {/* Modal Container */}
      <div className="modal-container bg-surface rounded-md shadow-[0px_8px_32px_rgba(26,71,49,0.15)] overflow-hidden max-w-[480px] w-full flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button (top right of container, hidden during print) */}
        <button
          onClick={onClose}
          className="print-hide absolute top-4 right-4 text-white hover:text-white/80 transition-colors z-10"
        >
          <X size={20} />
        </button>

        {/* Green Header Banner */}
        <div className="bg-primary text-white p-lg flex flex-col items-center justify-center text-center gap-xs">
          <div className="w-[48px] h-[48px] rounded-full bg-secondary flex items-center justify-center text-white shadow-sm mb-xs">
            <Check size={28} className="stroke-[3]" />
          </div>
          <h3 className="font-sans text-[20px] font-bold tracking-tight">Réservation Confirmée</h3>
          <p className="text-white/80 text-[14px]">Votre terrain a été bloqué avec succès !</p>
        </div>

        {/* Reservation Receipt Body */}
        <div className="p-lg space-y-md">
          <div className="text-center pb-sm border-b border-[#ebefed]">
            <p className="text-label-sm text-outline uppercase tracking-wider">Reçu de Réservation</p>
            <p className="text-[20px] font-bold text-primary font-sans mt-xs">
              Fiche N° {reservation.id}
            </p>
          </div>

          <div className="space-y-sm">
            {/* Client Name */}
            <div className="flex justify-between items-center text-body-md py-[4px]">
              <span className="text-outline font-semibold">Client</span>
              <span className="text-charcoal font-bold">{reservation.nom_client}</span>
            </div>

            {/* Telephone */}
            <div className="flex justify-between items-center text-body-md py-[4px]">
              <span className="text-outline font-semibold">Téléphone</span>
              <span className="text-charcoal font-bold">{reservation.telephone}</span>
            </div>

            {/* Terrain */}
            <div className="flex justify-between items-center text-body-md py-[4px]">
              <span className="text-outline font-semibold">Terrain</span>
              <span className="text-primary font-bold">{reservation.terrain?.nom || `Terrain #${reservation.terrain_id}`}</span>
            </div>

            {/* Date */}
            <div className="flex justify-between items-center text-body-md py-[4px]">
              <span className="text-outline font-semibold">Date</span>
              <span className="text-charcoal font-bold capitalize">{formatDate(reservation.date_reservation)}</span>
            </div>

            {/* Time slot / Horaire */}
            <div className="flex justify-between items-center text-body-md py-[4px]">
              <span className="text-outline font-semibold">Horaire</span>
              <span className="text-charcoal font-bold">
                {reservation.heure.substring(0, 5)} ({reservation.moment === 'matin' ? 'Matin' : 'Soir'})
              </span>
            </div>

            {/* Separator */}
            <hr className="border-[#ebefed] my-sm" />

            {/* Price Total */}
            <div className="flex justify-between items-center text-body-md py-[4px]">
              <span className="text-primary font-bold text-[16px]">Montant Total</span>
              <span className="text-secondary font-extrabold text-[22px]">
                {Number(reservation.prix_total).toFixed(2)} €
              </span>
            </div>
          </div>
        </div>

        {/* Buttons (Hidden during print) */}
        <div className="print-hide p-lg bg-[#F7FAF8] border-t border-[#ebefed] flex gap-md">
          <button
            onClick={onClose}
            className="flex-1 bg-white border border-[#c1c9c1] text-charcoal font-bold py-sm px-md rounded-md hover:bg-[#ebefed] transition-colors"
          >
            Fermer
          </button>
          
          <button
            onClick={handlePrint}
            className="flex-1 bg-secondary hover:bg-[#27ae60] text-white font-bold py-sm px-md rounded-md flex items-center justify-center gap-xs shadow-sm transition-colors"
          >
            <Printer size={18} />
            <span>Imprimer la fiche</span>
          </button>
        </div>
      </div>
    </div>
  );
}
