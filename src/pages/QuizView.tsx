import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById, getModuleById } from '../data/complete50Lessons';
import { generateQuizQuestions } from '../services/geminiApi';
import { ArrowLeft, CheckCircle, X, Trophy, Brain, Loader, RotateCcw } from 'lucide-react';

export default function QuizView() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { addPoints, earnBadge } = useGame();
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);

  const lesson = getLessonById(lessonId!);
  const module = getModuleById(moduleId!);

  useEffect(() => {
    if (lesson) {
      loadQuizQuestions();
    }
  }, [lesson]);

  const loadQuizQuestions = async () => {
    if (!lesson) return;
    
    setIsLoadingQuestions(true);
    try {
      const generatedQuestions = await generateQuizQuestions(lesson.title);
      setQuestions(generatedQuestions.slice(0, 10)); // Ensure exactly 10 questions
    } catch (error) {
      console.error('Failed to load quiz questions:', error);
      // Fallback to static questions if available
      if (lesson.quiz) {
        setQuestions(lesson.quiz.questions);
      }
    } finally {
      setIsLoadingQuestions(false);
    }
  };

  const retryQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
    setAttemptCount(prev => prev + 1);
    loadQuizQuestions(); // Generate new questions
  };

  if (!lesson || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Quiz Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmitQuiz = () => {
    let correctAnswers = 0;
    const totalQuestions = questions.length;

    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      if (userAnswer === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round((correctAnswers / totalQuestions) * 100);
    setScore(finalScore);
    setShowResults(true);

    // Award points based on attempt and score
    let finalPoints = 0;
    if (finalScore >= 70) { // Passing score
      if (attemptCount === 0) {
        finalPoints = finalScore; // Full points for first attempt
      } else {
        finalPoints = Math.round(finalScore * 0.3); // 30% points for retries
      }
      addPoints(finalPoints);
      
      // Mark quiz as completed
      localStorage.setItem(`quiz_completed_${lessonId}`, 'true');
      
      if (finalScore === 100 && attemptCount === 0) {
        earnBadge('quiz-master');
      }
    }
  };

  const isQuestionCorrect = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    return question && selectedAnswers[questionId] === question.correctAnswer;
  };

  const allQuestionsAnswered = questions.every(q => selectedAnswers[q.id]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link 
          to={`/lesson/${moduleId}/${lessonId}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Brain className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-600">{module.title} • {lesson.title}</p>
            <h1 className="text-3xl font-bold text-gray-900">Knowledge Quiz</h1>
          </div>
        </div>

        {!showResults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-blue-700">
                {Object.keys(selectedAnswers).length} of {questions.length} questions answered
              </span>
              <div className="flex items-center gap-4">
                {attemptCount > 0 && (
                  <span className="text-orange-600">
                    Attempt #{attemptCount + 1} (50% points)
                  </span>
                )}
                <span className="text-blue-600">
                  Passing score: 70%
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-8">
          {isLoadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-3 text-gray-600">Generating quiz questions...</span>
            </div>
          ) : !showResults ? (
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-purple-600">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {question.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {question.options?.map((option, optionIndex) => (
                          <label 
                            key={optionIndex}
                            className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="radio"
                              name={`question-${question.id}`}
                              value={option}
                              onChange={() => handleAnswerSelect(question.id, option)}
                              className="w-4 h-4 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="ml-3 text-gray-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end pt-6">
                <button
                  onClick={handleSubmitQuiz}
                  disabled={!allQuestionsAnswered}
                  className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 ${
                score >= lesson.quiz.passingScore ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {score >= lesson.quiz.passingScore ? (
                  <Trophy className="h-8 w-8 text-green-600" />
                ) : (
                  <X className="h-8 w-8 text-red-600" />
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {score >= lesson.quiz.passingScore ? 'Congratulations!' : 'Keep Learning!'}
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                You scored {score}% ({questions.filter(q => isQuestionCorrect(q.id)).length}/{questions.length} correct)
              </p>

              {score >= 70 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    +{attemptCount === 0 ? score : Math.round(score * 0.3)} EcoPoints earned!
                  </p>
                  {attemptCount > 0 && (
                    <p className="text-orange-700 text-sm mt-1">
                      Retry attempt - reduced points (30% of score)
                    </p>
                  )}
                </div>
              )}

              {score < 70 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">
                    Score below passing grade (70%). Try again with new questions!
                  </p>
                </div>
              )}

              {/* Answer Review */}
              <div className="text-left space-y-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900">Answer Review</h3>
                {questions.map((question, index) => (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                        isQuestionCorrect(question.id) ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isQuestionCorrect(question.id) ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <X className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-2">{question.question}</p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Your answer:</span> {selectedAnswers[question.id]}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">Correct answer:</span> {question.correctAnswer}
                        </p>
                        <p className="text-sm text-gray-700">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center space-x-4">
                {score < 70 && (
                  <button
                    onClick={retryQuiz}
                    className="flex items-center gap-2 px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Retry Quiz
                  </button>
                )}
                <Link
                  to={`/lesson/${moduleId}/${lessonId}`}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Back to Lesson
                </Link>
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Continue Learning
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}