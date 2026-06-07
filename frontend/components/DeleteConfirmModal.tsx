'use client';

import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmModal({
  title = 'Confirmer la suppression',
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
  loading = false,
}: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md bg-charcoal/40 backdrop-blur-sm">
      <div className="bg-surface rounded-md shadow-card-hover w-full max-w-sm p-lg space-y-lg">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-md bg-[#FDF2F2] flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={20} className="text-error" />
            </div>
            <h3 className="font-sans text-[18px] font-bold text-charcoal">{title}</h3>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-[#ebefed] transition-colors"
          >
            <X size={16} className="text-outline" />
          </button>
        </div>

        <p className="text-body-md text-outline leading-relaxed">{message}</p>

        <div className="flex gap-sm">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-sm px-md bg-[#ebefed] hover:bg-[#d7dbd9] text-charcoal font-bold rounded-md transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-sm px-md bg-error hover:bg-[#93000a] text-white font-bold rounded-md transition-colors disabled:opacity-50 flex items-center justify-center gap-xs"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
