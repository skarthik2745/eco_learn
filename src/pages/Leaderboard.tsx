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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Leaderboard</h1>
        <p className="text-gray-600">See how you stack up against other eco-warriors!</p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex justify-center mb-8">
        <div className="relative">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all-time">All Time</option>
            <option value="monthly">This Month</option>
            <option value="weekly">This Week</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="flex justify-center items-end space-x-4 mb-12">
        {leaderboard.slice(0, 3).map((student, index) => {
          const rank = index + 1;
          const heights = ['h-32', 'h-40', 'h-28'];
          
          return (
            <div key={student.id} className="text-center">
              <div className={`${heights[index]} w-24 bg-gradient-to-t ${
                rank === 1 ? 'from-yellow-400 to-yellow-300' :
                rank === 2 ? 'from-gray-300 to-gray-200' :
                'from-amber-400 to-amber-300'
              } rounded-t-lg flex flex-col items-center justify-end p-4 shadow-lg`}>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-2 shadow-md">
                  <span className="text-lg font-bold text-gray-700">
                    {student.name.charAt(0)}
                  </span>
                </div>
                <div className="text-white">
                  {getRankIcon(rank)}
                  <p className="font-bold text-sm">{rank}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="font-medium text-gray-900">{student.name}</p>
                <p className="text-sm text-green-600 font-bold">{student.points} pts</p>
                <p className="text-xs text-gray-500">Level {student.level}</p>
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
        
        <div className="divide-y divide-gray-200">
          {leaderboard.map((student, index) => {
            const rank = index + 1;
            const isCurrentUser = user?.name === student.name;
            
            return (
              <div
                key={student.id}
                className={`p-6 transition-colors ${getRankColor(rank)} ${
                  isCurrentUser ? 'ring-2 ring-green-400' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {getRankIcon(rank)}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-medium ${
                        isCurrentUser ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className={`font-medium ${isCurrentUser ? 'text-green-900' : 'text-gray-900'}`}>
                          {student.name}
                          {isCurrentUser && <span className="ml-2 text-green-600 text-sm">(You)</span>}
                        </p>
                        <p className="text-sm text-gray-500">Level {student.level}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{student.points}</p>
                    <p className="text-sm text-gray-500">EcoPoints</p>
                  </div>
                </div>
                
                {rank <= 3 && (
                  <div className="mt-3 flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {rank === 1 ? 'Eco Champion!' : rank === 2 ? 'Environmental Leader' : 'Green Warrior'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Showcase */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Crown className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Top Performer</h3>
          <p className="text-sm text-gray-600">Most points this month</p>
          <p className="text-lg font-bold text-yellow-600 mt-2">{leaderboard[0]?.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Star className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Most Improved</h3>
          <p className="text-sm text-gray-600">Biggest point increase</p>
          <p className="text-lg font-bold text-green-600 mt-2">{leaderboard[1]?.name}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Trophy className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Challenge Master</h3>
          <p className="text-sm text-gray-600">Most challenges completed</p>
          <p className="text-lg font-bold text-blue-600 mt-2">{leaderboard[2]?.name}</p>
        </div>
      </div>
    </div>
  );
}