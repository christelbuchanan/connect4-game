import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import { Trophy, RotateCcw } from 'lucide-react';

interface BoardProps {
  onGameEnd: (winner: number) => void;
  onReset: () => void;
  scores: { player1: number, player2: number };
  onScoreUpdate: (player: number) => void;
}

const Board: React.FC<BoardProps> = ({ onGameEnd, onReset, scores, onScoreUpdate }) => {
  const ROWS = 6;
  const COLS = 7;
  
  const [board, setBoard] = useState<Array<Array<number | null>>>(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState<number>(1);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<number | null>(null);
  const [hoverColumn, setHoverColumn] = useState<number | null>(null);
  const [winningCells, setWinningCells] = useState<Array<[number, number]>>([]);
  const [fallingDisc, setFallingDisc] = useState<{col: number, row: number, player: number} | null>(null);
  const [boardFilled, setBoardFilled] = useState<boolean>(false);
  
  const resetGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setCurrentPlayer(1);
    setGameOver(false);
    setWinner(null);
    setWinningCells([]);
    setFallingDisc(null);
    setBoardFilled(false);
    onReset();
  };
  
  const checkWinner = (row: number, col: number, player: number): boolean => {
    // Check directions: horizontal, vertical, diagonal up-right, diagonal up-left
    const directions = [
      [0, 1], [1, 0], [1, 1], [1, -1]
    ];
    
    for (const [dx, dy] of directions) {
      let count = 1;
      const winCells: Array<[number, number]> = [[row, col]];
      
      // Check in positive direction
      for (let i = 1; i < 4; i++) {
        const newRow = row + i * dx;
        const newCol = col + i * dy;
        
        if (
          newRow >= 0 && newRow < ROWS && 
          newCol >= 0 && newCol < COLS && 
          board[newRow][newCol] === player
        ) {
          count++;
          winCells.push([newRow, newCol]);
        } else {
          break;
        }
      }
      
      // Check in negative direction
      for (let i = 1; i < 4; i++) {
        const newRow = row - i * dx;
        const newCol = col - i * dy;
        
        if (
          newRow >= 0 && newRow < ROWS && 
          newCol >= 0 && newCol < COLS && 
          board[newRow][newCol] === player
        ) {
          count++;
          winCells.push([newRow, newCol]);
        } else {
          break;
        }
      }
      
      if (count >= 4) {
        setWinningCells(winCells);
        return true;
      }
    }
    
    return false;
  };

  const checkBoardFilled = (newBoard: Array<Array<number | null>>): boolean => {
    return newBoard.every(row => row.every(cell => cell !== null));
  };
  
  const animateDiscFall = (col: number, finalRow: number, player: number) => {
    // Start from the top row
    setFallingDisc({ col, row: 0, player });
    
    let currentRow = 0;
    const fallInterval = setInterval(() => {
      currentRow++;
      
      if (currentRow <= finalRow) {
        setFallingDisc({ col, row: currentRow, player });
      } else {
        clearInterval(fallInterval);
        setFallingDisc(null);
        
        // Update the actual board after animation completes
        const newBoard = board.map(row => [...row]);
        newBoard[finalRow][col] = player;
        setBoard(newBoard);
        
        // Check for winner
        if (checkWinner(finalRow, col, player)) {
          // Update score
          onScoreUpdate(player);
          
          // Show winner but continue game
          setWinner(player);
          onGameEnd(player);
          
          // Check if board is filled
          const isFilled = checkBoardFilled(newBoard);
          if (isFilled) {
            setBoardFilled(true);
            setGameOver(true);
          } else {
            // Continue game with next player after a short delay
            setTimeout(() => {
              setWinner(null);
              setWinningCells([]);
              setCurrentPlayer(player === 1 ? 2 : 1);
            }, 2000);
          }
          return;
        }
        
        // Check for board filled (draw)
        const isFilled = checkBoardFilled(newBoard);
        if (isFilled) {
          setBoardFilled(true);
          setGameOver(true);
          return;
        }
        
        // Switch player
        setCurrentPlayer(player === 1 ? 2 : 1);
      }
    }, 100); // Speed of falling animation
  };
  
  const dropDisc = (col: number) => {
    if (gameOver || fallingDisc || winner) return;
    
    // Find the lowest empty row in the selected column
    let row = -1;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r][col] === null) {
        row = r;
        break;
      }
    }
    
    // If column is full, do nothing
    if (row === -1) return;
    
    // Animate the disc falling
    animateDiscFall(col, row, currentPlayer);
  };
  
  const handleColumnHover = (col: number) => {
    setHoverColumn(col);
  };
  
  const handleColumnLeave = () => {
    setHoverColumn(null);
  };
  
  const isWinningCell = (row: number, col: number): boolean => {
    return winningCells.some(([r, c]) => r === row && c === col);
  };
  
  const getCellValue = (row: number, col: number): number | null => {
    // If there's a falling disc at this position, show it
    if (fallingDisc && fallingDisc.col === col && fallingDisc.row === row) {
      return fallingDisc.player;
    }
    // Otherwise show the actual board state
    return board[row][col];
  };

  // Create column drop indicators
  const renderColumnIndicators = () => {
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {Array(COLS).fill(null).map((_, colIndex) => (
          <div 
            key={`indicator-${colIndex}`}
            className={`flex justify-center items-center transition-all duration-300 h-6
                      ${hoverColumn === colIndex && !winner ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className={`w-0 h-0 
                           border-l-[10px] border-l-transparent
                           border-r-[10px] border-r-transparent
                           border-t-[12px] ${currentPlayer === 1 ? 'border-t-connect-red' : 'border-t-connect-yellow'}`}>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex items-center justify-between w-full">
        <div className={`flex items-center ${currentPlayer === 1 && !winner ? 'opacity-100' : 'opacity-70'}`}>
          <div className="w-8 h-8 bg-connect-red rounded-full mr-2"></div>
          <div>
            <span className="text-xl font-bold text-white">Player 1</span>
            <div className="text-white text-sm">Score: {scores.player1}</div>
          </div>
        </div>
        
        <button 
          onClick={resetGame}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-all"
        >
          <RotateCcw size={18} className="mr-2" />
          Reset
        </button>
        
        <div className={`flex items-center ${currentPlayer === 2 && !winner ? 'opacity-100' : 'opacity-70'}`}>
          <div>
            <span className="text-xl font-bold text-white">Player 2</span>
            <div className="text-white text-sm text-right">Score: {scores.player2}</div>
          </div>
          <div className="w-8 h-8 bg-connect-yellow rounded-full ml-2"></div>
        </div>
      </div>
      
      {renderColumnIndicators()}
      
      <div className="relative">
        {/* Board background */}
        <div 
          className="bg-connect-board p-4 rounded-xl shadow-2xl grid grid-cols-7 gap-2 relative z-10"
        >
          {board.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <div 
                key={`${rowIndex}-${colIndex}`}
                onMouseEnter={() => handleColumnHover(colIndex)}
                onMouseLeave={handleColumnLeave}
                className={`${isWinningCell(rowIndex, colIndex) ? 'animate-bounce-slow' : ''}`}
              >
                <Cell 
                  value={getCellValue(rowIndex, colIndex)} 
                  onClick={() => dropDisc(colIndex)}
                  columnHover={hoverColumn === colIndex && !winner}
                  isFalling={fallingDisc?.col === colIndex && fallingDisc?.row === rowIndex}
                />
              </div>
            ))
          ))}
        </div>
        
        {/* Clean grid overlay - just circles */}
        <div 
          className="absolute inset-0 p-4 grid grid-cols-7 gap-2 pointer-events-none z-20"
        >
          {board.map((row, rowIndex) => (
            row.map((_, colIndex) => (
              <div key={`grid-${rowIndex}-${colIndex}`} className="clean-grid-cell"></div>
            ))
          ))}
        </div>
      </div>
      
      {winner && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg flex items-center">
          <Trophy className={winner === 1 ? "text-connect-red" : "text-connect-yellow"} size={24} />
          <span className="ml-2 text-xl font-bold">
            Player {winner} wins!
          </span>
          {!gameOver && (
            <span className="ml-2 text-sm text-gray-600">
              Game continues in 2 seconds...
            </span>
          )}
        </div>
      )}
      
      {boardFilled && (
        <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
          <span className="text-xl font-bold">Board filled!</span>
          <div className="mt-2 text-gray-700">
            Final Score: Player 1: {scores.player1} - Player 2: {scores.player2}
          </div>
        </div>
      )}
    </div>
  );
};

export default Board;
