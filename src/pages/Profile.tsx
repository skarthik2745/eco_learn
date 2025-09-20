import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { User, Trophy, Award, Download, Calendar, Star } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const { userProgress } = useGame();

  const earnedBadges = userProgress.badges.filter(badge => badge.earned);
  const unearnedBadges = userProgress.badges.filter(badge => !badge.earned);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-12 h-12 text-green-600" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{user?.name}</h1>
            <p className="text-gray-600 mb-4">{user?.email}</p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-gray-700">Level {userProgress.level}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-green-500" />
                <span className="text-gray-700">{userProgress.points} EcoPoints</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-purple-500" />
                <span className="text-gray-700">{earnedBadges.length} Badges</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-2">Joined</p>
            <p className="text-gray-700">December 2024</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Earned Badges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Earned Badges</h2>
            <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
              {earnedBadges.length}
            </span>
          </div>
          
          {earnedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-blue-50">
                  <div className="text-center mb-3">
                    <span className="text-3xl mb-2 block">{badge.icon}</span>
                    <h3 className="font-medium text-gray-900">{badge.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 text-center mb-2">{badge.description}</p>
                  <div className="flex items-center justify-center space-x-1 text-xs text-green-600">
                    <Calendar className="w-3 h-3" />
                    <span>{badge.earnedDate?.toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No badges earned yet</p>
              <p className="text-sm text-gray-400 mt-1">Complete lessons and challenges to earn badges!</p>
            </div>
          )}
        </div>

        {/* Progress Badges */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Badge Progress</h2>
            <span className="bg-gray-100 text-gray-800 text-sm font-medium px-3 py-1 rounded-full">
              {unearnedBadges.length} remaining
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {unearnedBadges.slice(0, 6).map((badge) => (
              <div key={badge.id} className="border border-gray-200 rounded-lg p-4 opacity-60">
                <div className="text-center mb-3">
                  <span className="text-3xl mb-2 block grayscale">{badge.icon}</span>
                  <h3 className="font-medium text-gray-700">{badge.name}</h3>
                </div>
                <p className="text-sm text-gray-500 text-center">{badge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificates */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Certificates</h2>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            {userProgress.certificates.length}
          </span>
        </div>
        
        {userProgress.certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProgress.certificates.map((certificate, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="flex items-center justify-between mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                  <button className="text-blue-600 hover:text-blue-700 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{certificate}</h3>
                <p className="text-sm text-gray-600 mb-3">Completed all requirements for this module</p>
                <p className="text-xs text-gray-500">Issued: December 2024</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Certificates Yet</h3>
            <p className="text-gray-500 mb-4">Complete learning modules to earn certificates</p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Start Learning
            </button>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{userProgress.points}</h3>
          <p className="text-gray-600">Total EcoPoints</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Star className="w-8 h-8 text-green-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{userProgress.completedLessons.length}</h3>
          <p className="text-gray-600">Lessons Completed</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <Award className="w-8 h-8 text-purple-500 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-gray-900">{userProgress.completedChallenges.length}</h3>
          <p className="text-gray-600">Challenges Done</p>
        </div>
      </div>
    </div>
  );
}