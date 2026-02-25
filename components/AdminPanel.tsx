import React, { useState, useRef } from 'react';
import { Upload, X, Trash2, Download } from 'lucide-react';

interface AdminPanelProps {
  show: boolean;
  onClose: () => void;
  onLoadRepository: (file: File) => void;
  onClearRepository: () => void;
  onFetchDefaultRepository: () => void;
  repositoryCardCount: number;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ show, onClose, onLoadRepository, onClearRepository, onFetchDefaultRepository, repositoryCardCount }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) {
    return null;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleLoadClick = () => {
    if (selectedFile) {
      onLoadRepository(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } else {
      alert('Veuillez d\'abord sélectionner un fichier JSON.');
    }
  };

  const handleClearClick = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider le référentiel ? Cette action est irréversible.")) {
        onClearRepository();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 md:p-8 max-w-lg w-full mx-4 border-2 border-purple-500 shadow-2xl shadow-purple-500/30 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition">
          <X size={24} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4 text-center">Panneau d'Administration</h2>
        <p className="text-gray-300 mb-6 text-center">
          Gérez le référentiel de cartes de l'application.
        </p>

        <div className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Mise à jour depuis le Web</h3>
                <p className="text-sm text-gray-400 mb-3">
                    Chargez la dernière liste de cartes depuis <a href="https://lorcanajson.org" target="_blank" rel="noopener noreferrer" className="text-purple-300 hover:underline">lorcanajson.org</a>.
                </p>
                <button
                    onClick={onFetchDefaultRepository}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition font-semibold flex items-center justify-center gap-2"
                >
                    <Download size={20} />
                    Mettre à jour
                </button>
            </div>

            <div className="bg-black/20 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-2">Charger un Fichier Local</h3>
                <p className="text-sm text-gray-400 mb-3">
                    Importez un fichier <code className="bg-purple-900/50 px-1 py-0.5 rounded text-purple-200">.json</code> personnalisé.
                </p>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                    id="file-upload"
                />
                <div className="flex gap-3">
                    <label
                        htmlFor="file-upload"
                        className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 px-4 rounded-lg transition font-semibold flex items-center justify-center gap-2 cursor-pointer truncate"
                    >
                        {selectedFile ? selectedFile.name : 'Choisir un fichier...'}
                    </label>
                    <button
                        onClick={handleLoadClick}
                        disabled={!selectedFile}
                        className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-4 rounded-lg transition font-semibold flex items-center justify-center gap-2 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    >
                        <Upload size={20} />
                        Charger
                    </button>
                </div>
            </div>

            <div className="bg-black/20 p-4 rounded-lg text-center">
                 <p className="text-gray-300">
                    Actuellement <span className="font-bold text-xl text-green-400">{repositoryCardCount}</span> cartes dans le référentiel.
                 </p>
            </div>

            <button
                onClick={handleClearClick}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-lg transition font-semibold flex items-center justify-center gap-2"
            >
                <Trash2 size={20} />
                Vider le référentiel
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
