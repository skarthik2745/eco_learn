import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Trophy, Medal, Star, Crown, ChevronDown } from 'lucide-react';

export default function Leaderboard() {
  const { user } = useAuth();
  const { leaderboard } = useGame();
  const [timeframe, setTimeframe] = useState('all-time');

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-gray-500 font-bold">{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200';
      case 2:
        return 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200';
      case 3:
        return 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 border-4 border-white mb-4">
          <Trophy className="w-8 h-8 text-black" />
        </div>
        <h1 className="arcade-h1 mb-4">HIGH SCORES</h1>
        <p className="arcade-text arcade-text-yellow">TOP PLAYERS IN THE ECO ARCADE!</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="arcade-input pr-8 arcade-btn-secondary"
          >
            <option value="all-time">ALL TIME</option>
            <option value="monthly">THIS MONTH</option>
            <option value="weekly">THIS WEEK</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400 pointer-events-none" />
        </div>
      </div>

      {/* Top 3 Retro Podium */}
      <div className="flex justify-center items-end space-x-6 mb-12">
        {leaderboard.slice(0, 3).map((student, index) => {
          const rank = index + 1;
          const heights = ['h-32', 'h-40', 'h-28'];
          const orders = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
          const actualRank = orders[index] + 1;
          const actualStudent = leaderboard[orders[index]];
          
          return (
            <div key={actualStudent.id} className="text-center">
              {/* Floating Crown/Stars for 1st place */}
              {actualRank === 1 && (
                <div className="relative mb-4">
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <Crown className="w-8 h-8 text-yellow-400" style={{filter: 'drop-shadow(0 0 10px #ffe600)'}} />
                  </div>
                  <div className="absolute -top-6 -left-4 animate-pulse">
                    <Star className="w-4 h-4 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px #ffe600)'}} />
                  </div>
                  <div className="absolute -top-6 -right-4 animate-pulse" style={{animationDelay: '0.5s'}}>
                    <Star className="w-4 h-4 text-yellow-400" style={{filter: 'drop-shadow(0 0 5px #ffe600)'}} />
                  </div>
                </div>
              )}
              
              {/* Retro Podium */}
              <div className={`${heights[orders[index]]} w-28 relative ${
                actualRank === 1 ? 'arcade-card-yellow' :
                actualRank === 2 ? 'arcade-card-cyan' :
                'arcade-card-magenta'
              } flex flex-col items-center justify-end p-4`}
              style={{
                background: actualRank === 1 ? 
                  'linear-gradient(135deg, #ffe600 0%, #ffcc00 100%)' :
                  actualRank === 2 ?
                  'linear-gradient(135deg, #00fff7 0%, #00eaff 100%)' :
                  'linear-gradient(135deg, #ff00ff 0%, #ff00aa 100%)',
                boxShadow: actualRank === 1 ?
                  '0 0 30px #ffe600, 0 0 60px rgba(255, 230, 0, 0.4)' :
                  actualRank === 2 ?
                  '0 0 25px #00fff7, 0 0 50px rgba(0, 255, 247, 0.4)' :
                  '0 0 25px #ff00ff, 0 0 50px rgba(255, 0, 255, 0.4)'
              }}>
                {/* Player Avatar */}
                <div className="w-14 h-14 bg-black border-4 border-white flex items-center justify-center mb-3 shadow-lg">
                  <span className="arcade-text text-white text-lg">
                    {actualStudent.name.charAt(0)}
                  </span>
                </div>
                
                {/* Rank Icon */}
                <div className="text-black mb-2">
                  {actualRank === 1 && <Crown className="w-6 h-6 mx-auto" />}
                  {actualRank === 2 && <Trophy className="w-6 h-6 mx-auto" />}
                  {actualRank === 3 && <Medal className="w-6 h-6 mx-auto" />}
                </div>
                
                {/* Rank Number */}
                <div className="w-8 h-8 bg-black border-2 border-white flex items-center justify-center">
                  <span className="arcade-text text-white text-sm">{actualRank}</span>
                </div>
              </div>
              
              {/* Player Info */}
              <div className="mt-4">
                <p className="arcade-text arcade-text-neon-cyan text-sm">{actualStudent.name.toUpperCase()}</p>
                <p className="arcade-text arcade-text-neon-green text-xs">{actualStudent.points} PTS</p>
                <p className="arcade-text arcade-text-neon-yellow text-xs">LEVEL {actualStudent.level}</p>
                
                {/* Special Effects for 1st place */}
                {actualRank === 1 && (
                  <div className="mt-2 flex justify-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 animate-pulse" />
                    <span className="arcade-text arcade-text-neon-yellow text-xs">CHAMPION</span>
                    <Star className="w-3 h-3 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rankings</h3>
        </div>
        
        <div className="space-y-4">
          {leaderboard.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = user?.name === student.name;
            const borderColor = rank === 1 ? 'arcade-card-yellow' : rank === 2 ? 'arcade-card-cyan' : rank === 3 ? 'arcade-card-magenta' : 'arcade-card';
            
            return (
              <div
                key={student.id}
                className={`arcade-card ${borderColor} p-6 ${isCurrentUser ? 'flash' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 border-3 border-white flex items-center justify-center arcade-text relative ${
                        rank === 1 ? 'bg-yellow-400 text-black' :
                        rank === 2 ? 'bg-cyan-400 text-black' :
                        rank === 3 ? 'bg-magenta-400 text-black' :
                        'bg-gray-600 text-white'
                      }`}
                      style={{
                        boxShadow: rank <= 3 ? (
                          rank === 1 ? '0 0 20px #ffe600' :
                          rank === 2 ? '0 0 15px #00fff7' :
                          '0 0 15px #ff00ff'
                        ) : 'none'
                      }}>
                        {rank <= 3 && (
                          <div className="absolute -top-1 -right-1">
                            {rank === 1 && <Crown className="w-4 h-4 text-yellow-600" />}
                            {rank === 2 && <Trophy className="w-4 h-4 text-gray-600" />}
                            {rank === 3 && <Medal className="w-4 h-4 text-amber-700" />}
                          </div>
                        )}
                        {rank}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 border-2 border-white flex items-center justify-center arcade-text ${
                        isCurrentUser ? 'bg-green-400 text-black' : 'bg-gray-600 text-white'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`arcade-text ${isCurrentUser ? 'arcade-text-green' : 'text-white'}`}>
                          {student.name.toUpperCase()}
                          {isCurrentUser && <span className="ml-2 arcade-text-yellow text-xs">(YOU)</span>}
                        </p>
                        <p className="arcade-text arcade-text-cyan text-xs">LEVEL {student.level}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="arcade-h3 arcade-text-green">{student.points}</p>
                    <p className="arcade-text arcade-text-yellow text-xs">ECOPOINTS</p>
                  </div>
                </div>
                
                {rank <= 3 && (
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <span className="arcade-text arcade-text-yellow text-xs">
                      {rank === 1 ? 'ECO CHAMPION!' : rank === 2 ? 'ENVIRONMENTAL LEADER' : 'GREEN WARRIOR'}
                    </span>
                    <Star className="w-4 h-4 text-yellow-400 animate-pulse" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Showcase */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="arcade-card arcade-card-yellow p-6 text-center">
          <div className="w-12 h-12 bg-yellow-400 border-2 border-white flex items-center justify-center mx-auto mb-3">
            <Crown className="w-6 h-6 text-black" />
          </div>
          <h3 className="arcade-h3 mb-1">TOP PERFORMER</h3>
          <p className="arcade-text text-black text-xs">MOST POINTS THIS MONTH</p>
          <p className="arcade-h3 arcade-text-yellow mt-2">{leaderboard[0]?.name.toUpperCase()}</p>
        </div>

        <div className="arcade-card arcade-card-cyan p-6 text-center">
          <div className="w-12 h-12 bg-green-400 border-2 border-white flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-black" />
          </div>
          <h3 className="arcade-h3 mb-1">MOST IMPROVED</h3>
          <p className="arcade-text arcade-text-yellow text-xs">BIGGEST POINT INCREASE</p>
          <p className="arcade-h3 arcade-text-green mt-2">{leaderboard[1]?.name.toUpperCase()}</p>
        </div>

        <div className="arcade-card arcade-card-magenta p-6 text-center">
          <div className="w-12 h-12 bg-cyan-400 border-2 border-white flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-black" />
          </div>
          <h3 className="arcade-h3 mb-1">CHALLENGE MASTER</h3>
          <p className="arcade-text arcade-text-yellow text-xs">MOST MISSIONS COMPLETE</p>
          <p className="arcade-h3 arcade-text-cyan mt-2">{leaderboard[2]?.name.toUpperCase()}</p>
        </div>
      </div>
    </div>
  );
}