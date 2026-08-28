'use client';
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative bg-card rounded-xl shadow-modal w-full max-w-md p-6 fade-in">
        <button onClick={onCancel} className="absolute top-4 right-4 p-1 rounded hover:bg-muted text-muted-foreground">
          <X size={16} />
        </button>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-danger/10' : 'bg-warning/10'}`}>
          <AlertTriangle size={20} className={variant === 'danger' ? 'text-danger' : 'text-warning'} />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md border border-border text-foreground hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium rounded-md text-white transition-all active:scale-95 ${
              variant === 'danger' ? 'bg-danger hover:bg-red-700' : 'bg-warning hover:bg-amber-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}