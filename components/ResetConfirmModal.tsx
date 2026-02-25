
import React from 'react';

interface ResetConfirmModalProps {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({ show, onConfirm, onCancel }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8 max-w-md mx-4 border-2 border-red-500 shadow-2xl animate-fade-in">
        <h2 className="text-2xl font-bold text-white mb-4 text-center">⚠️ Nouvelle Partie</h2>
        <p className="text-gray-300 mb-6 text-center">
          Êtes-vous sûr de vouloir recommencer ? Toutes les données de la partie en cours seront perdues.
        </p>
        <div className="flex gap-4">
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg transition font-semibold"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition font-semibold"
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmModal;
