import React, { useState, useEffect, useRef } from 'react';
import { RepositoryCard } from '../types';

interface AddCardFormProps {
  onSave: (cardData: { name: string, strength: number, willpower: number }) => void;
  onCancel: () => void;
  cardRepository: RepositoryCard[];
}

const AddCardForm: React.FC<AddCardFormProps> = ({ onSave, onCancel, cardRepository }) => {
  const [name, setName] = useState('');
  const [strength, setStrength] = useState(0);
  const [willpower, setWillpower] = useState(1);
  const [suggestions, setSuggestions] = useState<RepositoryCard[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (value.length > 1 && cardRepository.length > 0) {
      const filteredSuggestions = cardRepository
        .filter(card => card.fullName.toLowerCase().includes(value.toLowerCase()))
        .slice(0, 5);
      setSuggestions(filteredSuggestions);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (card: RepositoryCard) => {
    setName(card.fullName);
    setStrength(card.strength || 0);
    setWillpower(card.willpower || 1);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && willpower > 0) {
      onSave({ name: name.trim(), strength, willpower });
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="p-2 bg-gray-900/50 rounded-lg mb-2 animate-fade-in">
      <div className="relative">
        <input
            ref={inputRef}
            type="text"
            value={name}
            onChange={handleNameChange}
            onFocus={() => name.length > 1 && suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Nom de la carte..."
            autoComplete="off"
            className="w-full bg-white/10 text-white px-2 py-1.5 rounded border border-white/30 text-sm mb-2 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none"
        />
        {showSuggestions && suggestions.length > 0 && (
            <ul className="absolute z-10 w-full bg-gray-800 border border-purple-500 rounded-lg mt-[-8px] max-h-40 overflow-y-auto">
            {suggestions.map((card, index) => (
                <li
                key={index}
                onClick={() => handleSuggestionClick(card)}
                className="px-3 py-2 text-sm text-white cursor-pointer hover:bg-purple-700"
                >
                {card.fullName} ({card.strength}/{card.willpower})
                </li>
            ))}
            </ul>
        )}
      </div>

      <div className="flex gap-2 mb-2">
        <div className="flex-1">
          <label className="text-xs text-white/70 block mb-1 text-center">Force</label>
          <div className="flex items-center justify-between bg-white/10 rounded border border-white/30">
            <button 
              type="button" 
              onClick={() => setStrength(s => Math.max(0, s - 1))}
              className="px-4 py-1.5 text-white/70 hover:bg-white/20 rounded-l transition font-bold text-lg"
              aria-label="Diminuer la force"
            >
              -
            </button>
            <span className="text-lg font-bold text-white w-8 text-center">{strength}</span>
            <button 
              type="button" 
              onClick={() => setStrength(s => s + 1)}
              className="px-4 py-1.5 text-white/70 hover:bg-white/20 rounded-r transition font-bold text-lg"
              aria-label="Augmenter la force"
            >
              +
            </button>
          </div>
        </div>
        <div className="flex-1">
          <label className="text-xs text-white/70 block mb-1 text-center">Volonté</label>
           <div className="flex items-center justify-between bg-white/10 rounded border border-white/30">
             <button 
              type="button" 
              onClick={() => setWillpower(w => Math.max(1, w - 1))}
              className="px-4 py-1.5 text-white/70 hover:bg-white/20 rounded-l transition font-bold text-lg"
              aria-label="Diminuer la volonté"
            >
              -
            </button>
            <span className="text-lg font-bold text-white w-8 text-center">{willpower}</span>
            <button 
              type="button" 
              onClick={() => setWillpower(w => w + 1)}
              className="px-4 py-1.5 text-white/70 hover:bg-white/20 rounded-r transition font-bold text-lg"
              aria-label="Augmenter la volonté"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1.5 rounded font-semibold transition">
          Ajouter
        </button>
        <button type="button" onClick={onCancel} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-xs py-1.5 rounded font-semibold transition">
          Annuler
        </button>
      </div>
    </form>
  );
};

export default AddCardForm;
