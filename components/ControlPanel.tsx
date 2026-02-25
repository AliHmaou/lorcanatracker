import React from 'react';
import { RotateCcw, Droplet, Settings } from 'lucide-react';
import { Player } from '../types';

interface ControlPanelProps {
  turnNumber: number;
  currentPlayerName: string;
  currentPlayerId: number;
  winner: Player | undefined;
  isMusicPlaying: boolean;
  targetLore: number;
  showInk: boolean;
  onToggleMusic: () => void;
  onEndTurn: () => void;
  onSetTargetLore: (lore: number) => void;
  onToggleShowInk: () => void;
  onConfirmReset: () => void;
  onToggleAdminPanel: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  turnNumber,
  currentPlayerName,
  currentPlayerId,
  winner,
  isMusicPlaying,
  targetLore,
  showInk,
  onToggleMusic,
  onEndTurn,
  onSetTargetLore,
  onToggleShowInk,
  onConfirmReset,
  onToggleAdminPanel
}) => {
  return (
    <div className="w-80 bg-black/30 backdrop-blur-md p-6 flex flex-col items-center justify-between">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Disney Lorcana</h1>
        <p className="text-purple-200 text-sm">Gestionnaire de Partie</p>
        <button
          onClick={onToggleMusic}
          className={`mt-3 px-4 py-2 rounded-lg transition ${
            isMusicPlaying 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-500 hover:bg-gray-600'
          } text-white text-sm font-semibold`}
        >
          {isMusicPlaying ? '🎵 Musique ON' : '🔇 Musique OFF'}
        </button>
      </div>

      <div className="w-full mb-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 text-center">
          <div className="text-white/70 text-sm mb-1">Tour n°</div>
          <div className="text-4xl font-bold text-white mb-3">{turnNumber}</div>
          <div className="text-white/70 text-sm mb-2">C'est au tour de</div>
          <div className={`text-2xl font-bold mb-4 ${currentPlayerId === 1 ? 'text-blue-300' : 'text-purple-300'}`}>
            {currentPlayerName}
          </div>
          <button
            onClick={onEndTurn}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-6 rounded-lg transition font-semibold text-lg shadow-lg"
          >
            Terminer le tour ➔
          </button>
        </div>
      </div>

      {winner && (
        <div className="bg-yellow-400 text-yellow-900 rounded-lg p-6 text-center animate-pulse w-full mb-4">
          <h2 className="text-2xl font-bold mb-2">🎉 Victoire ! 🎉</h2>
          <p className="text-lg">{winner.name} remporte la partie !</p>
        </div>
      )}

      <div className="w-full space-y-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <label className="text-white text-sm font-medium block mb-2 text-center">
            Lore pour gagner
          </label>
          <input
            type="number"
            value={targetLore}
            onChange={(e) => onSetTargetLore(Math.max(1, parseInt(e.target.value) || 20))}
            className="w-full px-3 py-2 bg-white/20 rounded border border-white/30 text-center text-white text-xl font-bold"
            min="1"
          />
        </div>
        <button
          onClick={onToggleShowInk}
          className={`w-full flex items-center justify-center gap-2 px-4 py-3 ${showInk ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-gray-500 hover:bg-gray-600'} rounded-lg transition text-white font-semibold`}
        >
          <Droplet size={20} />
          {showInk ? "Cacher l'encre" : "Afficher l'encre"}
        </button>
        <button
          onClick={onConfirmReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 rounded-lg transition text-white font-semibold"
        >
          <RotateCcw size={20} />
          Nouvelle partie
        </button>
        <button
          onClick={onToggleAdminPanel}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 hover:bg-gray-700 rounded-lg transition text-white font-semibold"
        >
          <Settings size={20} />
          Administration
        </button>
      </div>

      <div className="text-purple-300 text-xs text-center mt-4">
        Cliquez sur les noms pour les modifier
      </div>
    </div>
  );
};

export default ControlPanel;
