import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}

interface UserProgress {
  userId: string;
  points: number;
  level: number;
  badges: Badge[];
  completedLessons: string[];
  completedChallenges: string[];
  certificates: string[];
}

interface GameContextType {
  userProgress: UserProgress;
  addPoints: (points: number) => void;
  completeLesson: (lessonId: string) => void;
  completeChallenge: (challengeId: string, points?: number) => void;
  earnBadge: (badgeId: string) => void;
  leaderboard: Array<{id: string; name: string; points: number; level: number}>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

const defaultBadges: Badge[] = [
  { id: 'first-lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🌱', earned: false },
  { id: 'quiz-master', name: 'Quiz Master', description: 'Score 100% on 5 quizzes', icon: '🧠', earned: false },
  { id: 'eco-warrior', name: 'Eco Warrior', description: 'Complete 10 eco-challenges', icon: '🌍', earned: false },
  { id: 'sustainability-champion', name: 'Sustainability Champion', icon: '🏆', description: 'Master of sustainability principles', earned: false },
  { id: 'energy-expert', name: 'Energy Expert', icon: '🔋', description: 'Leader in renewable energy', earned: false },
  { id: 'energy-analyst', name: 'Energy Analyst', icon: '📈', description: 'Expert in energy resource analysis', earned: false },
  { id: 'climate-defender', name: 'Climate Defender', icon: '🛡️', description: 'Guardian against climate change', earned: false },
  { id: 'pollution-fighter', name: 'Pollution Fighter', icon: '🛡️', description: 'Defender against environmental pollution', earned: false },
  { id: 'nature-guardian', name: 'Nature Guardian', icon: '🦋', description: 'Protector of natural ecosystems', earned: false },
  { id: 'tech-innovator', name: 'Tech Innovator', icon: '💡', description: 'Pioneer in green technology', earned: false },
  { id: 'lifestyle-champion', name: 'Lifestyle Champion', icon: '🌟', description: 'Leader in sustainable living', earned: false }
];

export function GameProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress>({
    userId: '',
    points: 0,
    level: 1,
    badges: defaultBadges,
    completedLessons: [],
    completedChallenges: [],
    certificates: []
  });

  const [leaderboard] = useState([
    { id: '1', name: 'Alex Green', points: 2450, level: 5 },
    { id: '2', name: 'Emma Earth', points: 1980, level: 4 },
    { id: '3', name: 'Sam Solar', points: 1750, level: 4 },
    { id: '4', name: 'Luna Lake', points: 1420, level: 3 },
    { id: '5', name: 'River Stone', points: 1180, level: 3 },
    { id: '6', name: 'Maya Forest', points: 950, level: 2 },
    { id: '7', name: 'Ocean Blue', points: 820, level: 2 },
    { id: '8', name: 'Sky Walker', points: 680, level: 2 },
    { id: '9', name: 'Earth Angel', points: 540, level: 2 },
    { id: '10', name: 'Green Leaf', points: 420, level: 1 }
  ]);

  useEffect(() => {
    if (user) {
      const savedProgress = localStorage.getItem(`progress_${user.id}`);
      if (savedProgress) {
        setUserProgress(JSON.parse(savedProgress));
      } else {
        setUserProgress(prev => ({ ...prev, userId: user.id }));
      }
    }
  }, [user]);

  const saveProgress = (newProgress: UserProgress) => {
    setUserProgress(newProgress);
    if (user) {
      localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));
    }
  };

  const addPoints = (points: number) => {
    setUserProgress(prev => {
      const newProgress = { ...prev };
      newProgress.points += points;
      newProgress.level = Math.floor(newProgress.points / 500) + 1;
      if (user) {
        localStorage.setItem(`progress_${user.id}`, JSON.stringify(newProgress));
      }
      return newProgress;
    });
  };

  const completeLesson = (lessonId: string) => {
    if (!userProgress.completedLessons.includes(lessonId)) {
      const newProgress = { ...userProgress };
      newProgress.completedLessons.push(lessonId);
      newProgress.points += 50;
      newProgress.level = Math.floor(newProgress.points / 500) + 1;
      saveProgress(newProgress);
    }
  };

  const completeChallenge = (challengeId: string, points: number = 100) => {
    if (!userProgress.completedChallenges.includes(challengeId)) {
      const newProgress = { ...userProgress };
      newProgress.completedChallenges.push(challengeId);
      newProgress.points += points;
      newProgress.level = Math.floor(newProgress.points / 500) + 1;
      saveProgress(newProgress);
    }
  };

  const earnBadge = (badgeId: string) => {
    const newProgress = { ...userProgress };
    const badge = newProgress.badges.find(b => b.id === badgeId);
    if (badge && !badge.earned) {
      badge.earned = true;
      badge.earnedDate = new Date();
      saveProgress(newProgress);
      addPoints(200);
    }
  };

  const value = {
    userProgress,
    addPoints,
    completeLesson,
    completeChallenge,
    earnBadge,
    leaderboard
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}