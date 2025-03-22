import React, { useState } from 'react';
import { CircleOff, CircleDot } from 'lucide-react';
import Board from './components/Board';
import Particle from './components/Particle';

function App() {
  const [gameCount, setGameCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [winnerColor, setWinnerColor] = useState('rgba(231, 76, 60, 0.7)'); // Default red
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  const handleGameEnd = (winner: number) => {
    setShowConfetti(true);
    setWinnerColor(winner === 1 ? 'rgba(231, 76, 60, 0.7)' : 'rgba(241, 196, 15, 0.7)');
    
    // Confetti disappears after 3 seconds
    setTimeout(() => {
      setShowConfetti(false);
    }, 3000);
  };

  const handleReset = () => {
    setGameCount(prev => prev + 1);
    setShowConfetti(false);
  };

  const handleScoreUpdate = (player: number) => {
    setScores(prevScores => ({
      ...prevScores,
      [player === 1 ? 'player1' : 'player2']: prevScores[player === 1 ? 'player1' : 'player2'] + 1
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 font-nunito flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {showConfetti && <Particle color={winnerColor} />}
      
      <div className="text-center mb-8 z-10">
        <h1 className="text-5xl font-extrabold text-white mb-2 flex items-center justify-center">
          <CircleDot className="text-connect-red mr-2" />
          Connect 4
          <CircleOff className="text-connect-yellow ml-2" />
        </h1>
        <p className="text-blue-200 text-lg">Connect four discs in a row to win!</p>
      </div>
      
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-8 rounded-2xl shadow-2xl z-10">
        <Board 
          key={gameCount} 
          onGameEnd={handleGameEnd} 
          onReset={handleReset} 
          scores={scores}
          onScoreUpdate={handleScoreUpdate}
        />
      </div>
      
      <div className="mt-8 text-blue-200 text-sm z-10">
        Made with ❤️ using chatandbuild.com
      </div>
    </div>
  );
}

export default App;
