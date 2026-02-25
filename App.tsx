import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Player, Card, RepositoryCard } from './types';
import PlayerPanel from './components/PlayerPanel';
import ControlPanel from './components/ControlPanel';
import ResetConfirmModal from './components/ResetConfirmModal';
import AdminPanel from './components/AdminPanel';

const initialPlayers: Player[] = [
  { id: 1, name: 'Joueur 1', lore: 0, color: 'from-blue-500 to-blue-600', inkAvailable: 0, cards: [], banishedCards: [], fieldLoreBonus: 0 },
  { id: 2, name: 'Joueur 2', lore: 0, color: 'from-purple-500 to-purple-600', inkAvailable: 0, cards: [], banishedCards: [], fieldLoreBonus: 0 }
];

const LORCANA_REPO_KEY = 'lorcanaCardRepository';
const LORCANA_DEFAULT_URL = 'https://lorcanajson.org/files/current/fr/allCards.json';
const PROXY_URL = 'https://api.allorigins.win/raw?url=';

export default function App() {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [targetLore, setTargetLore] = useState(20);
  const [editingPlayerId, setEditingPlayerId] = useState<number | null>(null);
  const [addingCardToPlayerId, setAddingCardToPlayerId] = useState<number | null>(null);
  const [showInk, setShowInk] = useState(true);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState(1);
  const [turnNumber, setTurnNumber] = useState(1);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [cardRepository, setCardRepository] = useState<RepositoryCard[]>([]);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleFetchDefaultRepository = useCallback(async (showAlerts = true) => {
    if (showAlerts && !window.confirm("Ceci remplacera votre référentiel actuel par la dernière version de lorcanajson.org. Continuer ?")) {
        return;
    }

    try {
        const response = await fetch(`${PROXY_URL}${encodeURIComponent(LORCANA_DEFAULT_URL)}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json: any[] = await response.json();

        if (!Array.isArray(json)) {
            throw new Error("Invalid data format from URL: expected an array of cards.");
        }

        const formattedCards: RepositoryCard[] = json
            .filter(card => card.Name && card.Willpower != null && card.Strength != null)
            .map(card => ({
                name: card.Name,
                version: card.Subtitle,
                fullName: card.Subtitle ? `${card.Name} - ${card.Subtitle}` : card.Name,
                strength: card.Strength,
                willpower: card.Willpower,
            }));
        
        const uniqueCards = Array.from(new Map(formattedCards.map(card => [card.fullName, card])).values());

        localStorage.setItem(LORCANA_REPO_KEY, JSON.stringify(uniqueCards));
        setCardRepository(uniqueCards);
        if (showAlerts) {
            alert(`${uniqueCards.length} cartes chargées avec succès depuis le web !`);
        }
    } catch (error) {
        console.error("Failed to fetch repository from web:", error);
        if (showAlerts) {
            alert(`Erreur lors du chargement depuis le web : ${error instanceof Error ? error.message : "Erreur inconnue"}`);
        }
    }
  }, []);

  useEffect(() => {
    const loadInitialRepository = async () => {
        try {
            const storedRepo = localStorage.getItem(LORCANA_REPO_KEY);
            if (storedRepo) {
                const parsedRepo: RepositoryCard[] = JSON.parse(storedRepo);
                setCardRepository(parsedRepo);
            } else {
                await handleFetchDefaultRepository(false);
            }
        } catch (error) {
            console.error("Failed to load initial card repository:", error);
            localStorage.removeItem(LORCANA_REPO_KEY);
        }
    };
    loadInitialRepository();
  }, [handleFetchDefaultRepository]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleLoadRepository = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') throw new Error("File content is not text.");
        
        const json = JSON.parse(text);
        const cardsArray = Array.isArray(json) ? json : json.cards;

        if (!cardsArray || !Array.isArray(cardsArray)) {
            throw new Error("Invalid JSON format: 'cards' array not found or file is not a card array.");
        }
        
        const formattedCards: RepositoryCard[] = cardsArray
            .map(card => {
                const isLorcanaJsonFormat = card.Name && card.Strength != null && card.Willpower != null;
                const isCustomFormat = card.name && card.strength != null && card.willpower != null;

                if (isLorcanaJsonFormat) {
                    return {
                        name: card.Name,
                        version: card.Subtitle,
                        fullName: card.Subtitle ? `${card.Name} - ${card.Subtitle}` : card.Name,
                        strength: card.Strength,
                        willpower: card.Willpower,
                    };
                } else if (isCustomFormat) {
                    return {
                        name: card.name,
                        version: card.version,
                        fullName: card.version ? `${card.name} - ${card.version}` : card.name,
                        strength: card.strength,
                        willpower: card.willpower,
                    };
                }
                return null;
            })
            .filter((card): card is RepositoryCard => card !== null);
        
        const uniqueCards = Array.from(new Map(formattedCards.map(card => [card.fullName, card])).values());

        localStorage.setItem(LORCANA_REPO_KEY, JSON.stringify(uniqueCards));
        setCardRepository(uniqueCards);
        alert(`${uniqueCards.length} cartes chargées avec succès depuis le fichier !`);
      } catch (error) {
        console.error("Failed to parse repository file:", error);
        alert(`Erreur lors du chargement du fichier: ${error instanceof Error ? error.message : "Erreur inconnue"}`);
      }
    };
    reader.onerror = () => alert("Failed to read the file.");
    reader.readAsText(file);
  }, []);

  const handleClearRepository = useCallback(() => {
    localStorage.removeItem(LORCANA_REPO_KEY);
    setCardRepository([]);
  }, []);
  
  const toggleAdminPanel = useCallback(() => setShowAdminPanel(prev => !prev), []);


  const toggleMusic = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio('https://cdn.pixabay.com/audio/2022/03/10/audio_4a505b7110.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      audioRef.current = audio;
    }

    if (isMusicPlaying) {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsMusicPlaying(true))
        .catch(e => {
          console.error('Audio playback error:', e);
          setIsMusicPlaying(false);
        });
    }
  }, [isMusicPlaying]);

  const updateLore = useCallback((id: number, change: number) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === id ? { ...p, lore: Math.max(0, p.lore + change) } : p
    ));
  }, []);

  const updateInk = useCallback((id: number, change: number) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === id ? { ...p, inkAvailable: Math.max(0, Math.min(10, p.inkAvailable + change)) } : p
    ));
  }, []);
  
  const updateFieldLoreBonus = useCallback((id: number, change: number) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === id ? { ...p, fieldLoreBonus: Math.max(0, p.fieldLoreBonus + change) } : p
    ));
  }, []);


  const resetGame = useCallback(() => {
    setPlayers(JSON.parse(JSON.stringify(initialPlayers)));
    setCurrentTurnPlayerId(1);
    setTurnNumber(1);
    setShowResetConfirm(false);
    setEditingPlayerId(null);
    setAddingCardToPlayerId(null);
  }, []);

  const showAddCardForm = useCallback((playerId: number) => {
    setAddingCardToPlayerId(playerId);
  }, []);

  const saveNewCard = useCallback((cardData: { name: string; strength: number; willpower: number; }) => {
    if (addingCardToPlayerId) {
      const newCard: Card = {
        id: Date.now(),
        name: cardData.name,
        strength: cardData.strength,
        willpower: cardData.willpower,
        active: true,
        damage: 0
      };
      setPlayers(prevPlayers => prevPlayers.map(p =>
        p.id === addingCardToPlayerId
          ? { ...p, cards: [...p.cards, newCard] }
          : p
      ));
    }
    setAddingCardToPlayerId(null);
  }, [addingCardToPlayerId]);

  const cancelAddCard = useCallback(() => {
    setAddingCardToPlayerId(null);
  }, []);


  const toggleCardActive = useCallback((playerId: number, cardId: number) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === playerId 
        ? { ...p, cards: p.cards.map(c => c.id === cardId ? { ...c, active: !c.active } : c) }
        : p
    ));
  }, []);

  const updateDamage = useCallback((playerId: number, cardId: number, change: number) => {
    setPlayers(prevPlayers => {
        const newPlayers = JSON.parse(JSON.stringify(prevPlayers));
        const player = newPlayers.find((p: Player) => p.id === playerId);
        if (!player) return prevPlayers;

        const cardIndex = player.cards.findIndex((c: Card) => c.id === cardId);
        if (cardIndex === -1) return prevPlayers;

        const card = player.cards[cardIndex];
        if (!card.active && change > 0) return prevPlayers;

        const newDamage = Math.max(0, card.damage + change);

        if (newDamage >= card.willpower) {
            const banishedCard = { ...card, damage: newDamage };
            player.cards.splice(cardIndex, 1);
            player.banishedCards.push(banishedCard);
        } else {
            card.damage = newDamage;
        }
        return newPlayers;
    });
  }, []);

  const resurrectCard = useCallback((playerId: number, cardId: number) => {
    setPlayers(prevPlayers => {
        const newPlayers = JSON.parse(JSON.stringify(prevPlayers));
        const player = newPlayers.find((p: Player) => p.id === playerId);
        if (!player) return prevPlayers;

        const banishedCardIndex = player.banishedCards.findIndex((c: Card) => c.id === cardId);
        if (banishedCardIndex === -1) return prevPlayers;

        const [cardToResurrect] = player.banishedCards.splice(banishedCardIndex, 1);
        
        cardToResurrect.damage = 0;
        cardToResurrect.active = true;
        player.cards.push(cardToResurrect);

        return newPlayers;
    });
  }, []);

  const copyCard = useCallback((playerId: number, cardId: number) => {
    setPlayers(prevPlayers => {
        const newPlayers = JSON.parse(JSON.stringify(prevPlayers));
        const player = newPlayers.find((p: Player) => p.id === playerId);
        if (!player) return prevPlayers;
        
        const cardToCopy = player.banishedCards.find((c: Card) => c.id === cardId);
        if (!cardToCopy) return prevPlayers;

        const newCard: Card = {
            ...cardToCopy,
            id: Date.now(),
            damage: 0,
            active: true,
        };
        player.cards.push(newCard);

        return newPlayers;
    });
  }, []);

  const removeCard = useCallback((playerId: number, cardId: number) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === playerId 
        ? { ...p, cards: p.cards.filter(c => c.id !== cardId) }
        : p
    ));
  }, []);

  const endTurn = useCallback(() => {
    const nextPlayerId = currentTurnPlayerId === 1 ? 2 : 1;

    setPlayers(prevPlayers => {
        const nextPlayer = prevPlayers.find(p => p.id === nextPlayerId);
        const loreToAddFromField = nextPlayer ? nextPlayer.fieldLoreBonus : 0;

        return prevPlayers.map(p => {
            if (p.id === nextPlayerId) {
                return {
                    ...p,
                    lore: p.lore + loreToAddFromField,
                    cards: p.cards.map(c => ({ ...c, active: true }))
                };
            }
            return p;
        });
    });

    setCurrentTurnPlayerId(nextPlayerId);
    if (nextPlayerId === 1) {
        setTurnNumber(prev => prev + 1);
    }
    setAddingCardToPlayerId(null);
  }, [currentTurnPlayerId]);


  const updatePlayerName = useCallback((id: number, name: string) => {
    setPlayers(prevPlayers => prevPlayers.map(p => 
      p.id === id ? { ...p, name: name || `Joueur ${id}` } : p
    ));
    setEditingPlayerId(null);
  }, []);
  
  const winner = players.find(p => p.lore >= targetLore);
  const currentPlayer = players.find(p => p.id === currentTurnPlayerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white flex flex-col md:flex-row">
      <ResetConfirmModal 
        show={showResetConfirm}
        onConfirm={resetGame}
        onCancel={() => setShowResetConfirm(false)}
      />
      <AdminPanel 
        show={showAdminPanel}
        onClose={toggleAdminPanel}
        onLoadRepository={handleLoadRepository}
        onClearRepository={handleClearRepository}
        onFetchDefaultRepository={handleFetchDefaultRepository}
        repositoryCardCount={cardRepository.length}
      />
      
      <PlayerPanel
        player={players[0]}
        side="left"
        isCurrentTurn={currentTurnPlayerId === players[0].id && !winner}
        targetLore={targetLore}
        showInk={showInk}
        editingPlayerId={editingPlayerId}
        addingCardToPlayerId={addingCardToPlayerId}
        cardRepository={cardRepository}
        onUpdateLore={updateLore}
        onUpdateInk={updateInk}
        onUpdateFieldLoreBonus={updateFieldLoreBonus}
        onShowAddCardForm={showAddCardForm}
        onSaveNewCard={saveNewCard}
        onCancelAddCard={cancelAddCard}
        onToggleCardActive={toggleCardActive}
        onUpdateDamage={updateDamage}
        onResurrectCard={resurrectCard}
        onCopyCard={copyCard}
        onRemoveCard={removeCard}
        onSetEditingPlayer={setEditingPlayerId}
        onUpdatePlayerName={updatePlayerName}
      />
      
      <ControlPanel
        turnNumber={turnNumber}
        currentPlayerName={currentPlayer?.name || ''}
        currentPlayerId={currentTurnPlayerId}
        winner={winner}
        isMusicPlaying={isMusicPlaying}
        targetLore={targetLore}
        showInk={showInk}
        onToggleMusic={toggleMusic}
        onEndTurn={endTurn}
        onSetTargetLore={setTargetLore}
        onToggleShowInk={() => setShowInk(prev => !prev)}
        onConfirmReset={() => setShowResetConfirm(true)}
        onToggleAdminPanel={toggleAdminPanel}
      />
      
      <PlayerPanel
        player={players[1]}
        side="right"
        isCurrentTurn={currentTurnPlayerId === players[1].id && !winner}
        targetLore={targetLore}
        showInk={showInk}
        editingPlayerId={editingPlayerId}
        addingCardToPlayerId={addingCardToPlayerId}
        cardRepository={cardRepository}
        onUpdateLore={updateLore}
        onUpdateInk={updateInk}
        onUpdateFieldLoreBonus={updateFieldLoreBonus}
        onShowAddCardForm={showAddCardForm}
        onSaveNewCard={saveNewCard}
        onCancelAddCard={cancelAddCard}
        onToggleCardActive={toggleCardActive}
        onUpdateDamage={updateDamage}
        onResurrectCard={resurrectCard}
        onCopyCard={copyCard}
        onRemoveCard={removeCard}
        onSetEditingPlayer={setEditingPlayerId}
        onUpdatePlayerName={updatePlayerName}
      />
    </div>
  );
}