import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { complete50LessonModules } from '../data/complete50Lessons';
import { ChevronDown, ChevronRight, CheckCircle, Play, Clock, Award } from 'lucide-react';

export default function ModulesView() {
  const { userProgress } = useGame();
  const [expandedModules, setExpandedModules] = useState<string[]>([]);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    const quizCompleted = localStorage.getItem(`quiz_completed_${lessonId}`) === 'true';
    const challengeCompleted = localStorage.getItem(`challenge_completed_${lessonId}`) === 'true';
    return quizCompleted && challengeCompleted;
  };

  const getModuleProgress = (moduleId: string) => {
    const module = complete50LessonModules.find(m => m.id === moduleId);
    if (!module) return 0;
    const completedCount = module.lessons.filter(lesson => isLessonCompleted(lesson.id)).length;
    return Math.round((completedCount / module.lessons.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">EcoLearn Modules</h1>
        <p className="text-gray-600">Complete all 50 lessons across 6 environmental modules</p>
      </div>

      <div className="space-y-4">
        {complete50LessonModules.map((module) => {
          const isExpanded = expandedModules.includes(module.id);
          const progress = getModuleProgress(module.id);
          const completedLessons = module.lessons.filter(lesson => isLessonCompleted(lesson.id)).length;

          return (
            <div key={module.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{module.icon}</span>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{module.title}</h2>
                      <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span>{module.lessons.length} lessons</span>
                        <span>{module.estimatedTime}h estimated</span>
                        <span className="text-green-600 font-medium">{completedLessons}/{module.lessons.length} completed</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600 mb-1">{progress}% Complete</div>
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full bg-gradient-to-r ${module.color} transition-all duration-300`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Lessons Grid */}
              {isExpanded && (
                <div className="px-6 pb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {module.lessons.map((lesson, index) => {
                      const completed = isLessonCompleted(lesson.id);
                      
                      return (
                        <div key={lesson.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-medium text-gray-500 bg-white px-2 py-1 rounded">
                                Lesson {index + 1}
                              </span>
                              {completed && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <Clock className="h-3 w-3" />
                              {lesson.duration}m
                            </div>
                          </div>

                          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                            {lesson.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {lesson.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-green-600">
                              <Award className="h-3 w-3" />
                              {lesson.points} pts
                            </div>
                            
                            <Link
                              to={`/lesson/${module.id}/${lesson.id}`}
                              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                completed
                                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                  : 'bg-blue-600 text-white hover:bg-blue-700'
                              }`}
                            >
                              {completed ? (
                                <>
                                  <CheckCircle className="h-3 w-3" />
                                  Review
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3" />
                                  Start
                                </>
                              )}
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-600">
              {complete50LessonModules.reduce((sum, module) => sum + module.lessons.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Lessons</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {complete50LessonModules.reduce((sum, module) => 
                sum + module.lessons.filter(lesson => isLessonCompleted(lesson.id)).length, 0
              )}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{userProgress.points}</div>
            <div className="text-sm text-gray-600">EcoPoints</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">{userProgress.level}</div>
            <div className="text-sm text-gray-600">Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}