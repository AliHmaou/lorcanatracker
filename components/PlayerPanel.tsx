import React from 'react';
import { Plus, Minus, Droplet, PlusCircle, Sparkles, Shield, Heart } from 'lucide-react';
import { Player, RepositoryCard } from '../types';
import AddCardForm from './AddCardForm';

interface PlayerPanelProps {
  player: Player;
  side: 'left' | 'right';
  isCurrentTurn: boolean;
  targetLore: number;
  showInk: boolean;
  editingPlayerId: number | null;
  addingCardToPlayerId: number | null;
  cardRepository: RepositoryCard[];
  onUpdateLore: (playerId: number, change: number) => void;
  onUpdateInk: (playerId: number, change: number) => void;
  onUpdateFieldLoreBonus: (playerId: number, change: number) => void;
  onShowAddCardForm: (playerId: number) => void;
  onSaveNewCard: (cardData: { name: string, strength: number, willpower: number }) => void;
  onCancelAddCard: () => void;
  onToggleCardActive: (playerId: number, cardId: number) => void;
  onUpdateDamage: (playerId: number, cardId: number, change: number) => void;
  onResurrectCard: (playerId: number, cardId: number) => void;
  onCopyCard: (playerId: number, cardId: number) => void;
  onRemoveCard: (playerId: number, cardId: number) => void;
  onSetEditingPlayer: (playerId: number | null) => void;
  onUpdatePlayerName: (playerId: number, name: string) => void;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  player,
  side,
  isCurrentTurn,
  targetLore,
  showInk,
  editingPlayerId,
  addingCardToPlayerId,
  cardRepository,
  onUpdateLore,
  onUpdateInk,
  onUpdateFieldLoreBonus,
  onShowAddCardForm,
  onSaveNewCard,
  onCancelAddCard,
  onToggleCardActive,
  onUpdateDamage,
  onResurrectCard,
  onCopyCard,
  onRemoveCard,
  onSetEditingPlayer,
  onUpdatePlayerName
}) => {
  const isLeft = side === 'left';
  const progress = Math.min((player.lore / targetLore) * 100, 100);

  return (
    <div className={`flex-1 p-4 md:p-6 flex flex-col ${isLeft ? 'items-start' : 'items-end'}`}>
      <div className={`w-full max-w-md h-full flex flex-col bg-black/20 backdrop-blur-md rounded-xl p-4 md:p-6 border-2 ${isCurrentTurn ? 'border-yellow-400 shadow-2xl shadow-yellow-500/40' : 'border-white/20'} hover:border-white/40 transition-all duration-300`}>
        {isCurrentTurn && (
          <div className="w-full mb-3">
            <div className="bg-yellow-400 text-yellow-900 font-bold py-1 px-3 rounded-lg text-center text-sm animate-pulse">
              ⭐ À TON TOUR ⭐
            </div>
          </div>
        )}
        <div className="w-full mb-4">
          {editingPlayerId === player.id ? (
            <input
              type="text"
              defaultValue={player.name}
              onBlur={(e) => onUpdatePlayerName(player.id, e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onUpdatePlayerName(player.id, e.currentTarget.value);
              }}
              autoFocus
              className={`bg-white/20 text-white px-3 py-1 rounded border border-white/30 text-2xl font-bold w-full ${isLeft ? 'text-left' : 'text-right'}`}
            />
          ) : (
            <h3
              onClick={() => onSetEditingPlayer(player.id)}
              className={`text-2xl font-bold text-white cursor-pointer hover:text-purple-200 transition ${isLeft ? 'text-left' : 'text-right'}`}
            >
              {player.name}
            </h3>
          )}
        </div>

        <div className="w-full mb-4">
          <div className={`bg-gradient-to-br ${player.color} rounded-lg p-4 md:p-6 mb-2 text-center shadow-lg`}>
            <div className="text-6xl font-bold text-white mb-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
              {player.lore}
            </div>
            <div className="text-white/80 text-sm">/ {targetLore} lore</div>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden mb-3">
            <div
              className={`bg-gradient-to-r ${player.color} h-full transition-all duration-500 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-3">
            <button onClick={() => onUpdateLore(player.id, -1)} className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition font-semibold text-lg"><Minus size={20} />-1</button>
            <button onClick={() => onUpdateLore(player.id, 1)} className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition font-semibold text-lg"><Plus size={20} />+1</button>
          </div>
        </div>

        {showInk && (
          <div className="w-full bg-cyan-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Droplet size={20} className="text-cyan-300" />
              <span className="text-2xl font-bold text-cyan-100">{player.inkAvailable} / 10</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onUpdateInk(player.id, -1)} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded transition text-sm">-1</button>
              <button onClick={() => onUpdateInk(player.id, 1)} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white py-1 px-3 rounded transition text-sm">+1</button>
            </div>
          </div>
        )}
        
        <div className="w-full bg-purple-500/20 rounded-lg p-3 mb-3">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles size={20} className="text-purple-300" />
              <span className="text-xl font-bold text-purple-100">Effet de Terrain: +{player.fieldLoreBonus} Lore</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onUpdateFieldLoreBonus(player.id, -1)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded transition text-sm">-1</button>
              <button onClick={() => onUpdateFieldLoreBonus(player.id, 1)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-3 rounded transition text-sm">+1</button>
            </div>
        </div>

        <div className="w-full bg-black/20 rounded-lg p-3 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h4 className="text-white font-bold text-base">Cartes en jeu</h4>
            <button 
              onClick={() => onShowAddCardForm(player.id)} 
              className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full transition disabled:bg-gray-500" 
              title="Ajouter une carte"
              disabled={addingCardToPlayerId === player.id}
            >
              <PlusCircle size={18} />
            </button>
          </div>

          { addingCardToPlayerId === player.id && (
             <AddCardForm onSave={onSaveNewCard} onCancel={onCancelAddCard} cardRepository={cardRepository} />
          ) }
          
          <div className="flex-1 space-y-2 overflow-y-auto pr-2">
            {player.cards.length === 0 && addingCardToPlayerId !== player.id ? (
              <p className="text-white/50 text-center text-xs py-2">Aucune carte en jeu</p>
            ) : (
              player.cards.map(card => {
                const remainingWillpower = card.willpower - card.damage;
                const healthPercentage = card.willpower > 0 ? (remainingWillpower / card.willpower) * 100 : 0;
                let willpowerColorClass = 'text-white';
                if (card.damage > 0) {
                  if (healthPercentage <= 50) {
                    willpowerColorClass = 'text-red-500 animate-pulse';
                  } else {
                    willpowerColorClass = 'text-yellow-400';
                  }
                }
                
                return (
                  <div key={card.id} className={`rounded-lg p-2 transition duration-300 ${card.active ? 'bg-gradient-to-r from-amber-500/80 to-orange-500/80' : 'bg-gray-700/50'}`}>
                    <div className="flex items-center justify-between">
                      <button onClick={() => onToggleCardActive(player.id, card.id)} className={`font-semibold flex-1 text-left text-sm truncate pr-2 ${card.active ? 'text-white' : 'text-gray-400'}`}>
                        {card.name}
                      </button>

                      {!card.active && (
                        <div className="flex items-center gap-3 font-mono text-sm font-semibold flex-shrink-0 ml-2">
                          <span className="flex items-center gap-1 text-gray-300" title="Force">
                            <Shield size={14} className="text-gray-400" />
                            {card.strength}
                          </span>
                          <span className={`flex items-center gap-1 font-bold ${willpowerColorClass}`} title={`Volonté: ${remainingWillpower}/${card.willpower}`}>
                            <Heart size={14} />
                            {remainingWillpower}
                          </span>
                        </div>
                      )}

                      <button onClick={() => onRemoveCard(player.id, card.id)} className="text-red-400 hover:text-red-300 text-xs ml-2 font-bold flex-shrink-0">✕</button>
                    </div>

                    {card.active && (
                      <div className="flex items-center justify-around gap-3 mt-3">
                        <div className="flex flex-col items-center justify-center text-center">
                          <Shield size={16} className="text-gray-400" />
                          <span className="text-4xl font-bold text-white mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                            {card.strength}
                          </span>
                        </div>
                
                        <div className="w-px h-12 bg-white/20"></div>
                
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <Heart size={16} className={willpowerColorClass} />
                          <div className="flex items-center justify-center gap-3 mt-1 w-full">
                            <button onClick={() => onUpdateDamage(player.id, card.id, -1)} className="w-10 h-10 flex items-center justify-center bg-gray-600/70 hover:bg-gray-700/70 text-white rounded-full transition font-bold text-2xl" aria-label="Retirer dégâts">-</button>
                            <span className={`text-4xl font-bold min-w-[40px] text-center ${willpowerColorClass}`} style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
                              {remainingWillpower}
                            </span>
                            <button onClick={() => onUpdateDamage(player.id, card.id, 1)} className="w-10 h-10 flex items-center justify-center bg-red-600/80 hover:bg-red-700/80 text-white rounded-full transition font-bold text-2xl" aria-label="Ajouter dégâts">+</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </div>

          {player.banishedCards.length > 0 && (
            <div className="mt-3 pt-3 border-t border-white/10 flex-shrink-0">
              <h5 className="text-white/70 font-bold text-sm mb-2">Cartes Bannies</h5>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-2">
                {player.banishedCards.map(bCard => (
                   <div key={bCard.id} className="bg-gray-800/60 p-1.5 rounded text-xs flex items-center justify-between">
                      <span className="text-gray-400 truncate flex-1" title={`${bCard.name} (${bCard.strength}/${bCard.willpower})`}>
                          {bCard.name}
                      </span>
                      <div className="flex gap-1.5 ml-2 flex-shrink-0">
                          <button 
                              onClick={() => onResurrectCard(player.id, bCard.id)} 
                              className="text-green-400 hover:text-green-300 font-bold text-lg leading-none" 
                              title="Ressusciter"
                          >
                              ↶
                          </button>
                          <button 
                              onClick={() => onCopyCard(player.id, bCard.id)} 
                              className="text-blue-400 hover:text-blue-300 font-bold text-lg leading-none" 
                              title="Copier"
                          >
                              ❐
                          </button>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerPanel;