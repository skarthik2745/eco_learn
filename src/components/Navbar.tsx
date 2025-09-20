import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGame } from '../contexts/GameContext';
import { Leaf, Home, Book, Trophy, User, LogOut, GraduationCap, Users } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { userProgress } = useGame();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const studentNav = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const teacherNav = [
    { path: '/teacher', icon: GraduationCap, label: 'Dashboard' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  const navItems = user?.role === 'student' ? studentNav : teacherNav;

  return (
    <nav className="bg-white shadow-sm border-b border-green-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors">
              <div className="bg-green-100 p-2 rounded-lg">
                <Leaf className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">EcoLearn</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'bg-green-100 text-green-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:block">{label}</span>
              </Link>
            ))}
          </div>

          {/* User Info & Points */}
          <div className="flex items-center space-x-4">
            {user?.role === 'student' && (
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-1 rounded-full">
                <Trophy className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  {userProgress.points} pts
                </span>
                <span className="text-xs text-green-500">
                  Level {userProgress.level}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-600">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-sm text-gray-700">{user?.name}</span>
            </div>

            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}