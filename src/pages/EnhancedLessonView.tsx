import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById, getModuleById } from '../data/complete50Lessons';
import { generateLessonContent, generateLessonContentLegacy } from '../services/geminiApi';
import TextToSpeech from '../components/TextToSpeech';
import { ArrowLeft, CheckCircle, Play, Target, Brain, Clock, Award } from 'lucide-react';

export default function EnhancedLessonView() {
  const { moduleId, lessonId } = useParams();
  const navigate = useNavigate();
  const { userProgress, addPoints } = useGame();
  const [dynamicContent, setDynamicContent] = useState<any>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const lesson = getLessonById(lessonId!);
  const module = getModuleById(moduleId!);

  useEffect(() => {
    if (lesson) {
      const cachedContent = localStorage.getItem(`lesson_content_${lesson.id}`);
      if (cachedContent) {
        try {
          setDynamicContent(JSON.parse(cachedContent));
        } catch {
          setDynamicContent(null);
          loadDynamicContent();
        }
      } else {
        loadDynamicContent();
      }
      
      // Check completion status
      const quizKey = `quiz_completed_${lesson.id}`;
      const challengeKey = `challenge_completed_${lesson.id}`;
      setQuizCompleted(localStorage.getItem(quizKey) === 'true');
      setChallengeCompleted(localStorage.getItem(challengeKey) === 'true');
    }
  }, [lesson]);

  const loadDynamicContent = async () => {
    if (!lesson) return;
    
    setIsLoadingContent(true);
    try {
      const content = await generateLessonContent(lesson.title);
      setDynamicContent(content);
      localStorage.setItem(`lesson_content_${lesson.id}`, JSON.stringify(content));
    } catch (error) {
      setDynamicContent({ content_html: lesson.content, tts_text: lesson.content });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const renderContentCards = (content: string) => {
    const sections = content.split('\n\n').filter(section => section.trim());
    
    return sections.map((section, index) => {
      if (section.startsWith('##')) {
        return (
          <div key={index} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-bold">{section.replace('##', '').trim()}</h2>
          </div>
        );
      } else if (section.startsWith('#')) {
        return (
          <div key={index} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-md mb-4">
            <h3 className="text-lg font-semibold">{section.replace('#', '').trim()}</h3>
          </div>
        );
      } else {
        return (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">
            <div className="prose prose-gray max-w-none">
              {section.split('\n').map((line, lineIndex) => {
                if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
                  return (
                    <li key={lineIndex} className="text-gray-700 mb-2 ml-4 list-disc">
                      {line.replace(/^[•-]\s*/, '')}
                    </li>
                  );
                }
                return line.trim() ? (
                  <p key={lineIndex} className="text-gray-700 mb-3 leading-relaxed">
                    {line}
                  </p>
                ) : null;
              })}
            </div>
          </div>
        );
      }
    });
  };

  const isLessonComplete = quizCompleted && challengeCompleted;
  const progressPercentage = ((quizCompleted ? 1 : 0) + (challengeCompleted ? 1 : 0)) / 2 * 100;

  if (!lesson || !module) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{module.icon}</span>
                <div>
                  <p className="text-sm text-gray-600 font-medium">{module.title}</p>
                  <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {lesson.duration} minutes
                </div>
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  {lesson.points} points
                </div>
              </div>
            </div>
            
            {isLessonComplete && (
              <div className="flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="font-medium">Completed</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Lesson Progress</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Text-to-Speech */}
      <div className="mb-6">
        <TextToSpeech text={
          dynamicContent ? 
            `${lesson.title}. ${(dynamicContent.content_html || '').replace(/<[^>]*>/g, '')} ${dynamicContent.key_takeaways ? 'Key Takeaways: ' + dynamicContent.key_takeaways.join('. ') : ''} ${dynamicContent.case_study ? 'Case Study: ' + dynamicContent.case_study.title + '. ' + dynamicContent.case_study.text : ''} ${dynamicContent.faqs ? 'Frequently Asked Questions: ' + dynamicContent.faqs.map(faq => faq.q + ' ' + faq.a).join('. ') : ''}` :
            `${lesson.title}. ${lesson.description}. ${lesson.content}`
        } />
      </div>

      {/* Lesson Content Cards */}
      <div className="mb-8">
        {isLoadingContent ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Generating personalized content...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: dynamicContent?.content_html || `<h1>${lesson.title}</h1><p>${lesson.description}</p><div>${lesson.content}</div>` 
                }}
              />
            </div>
            
            {/* Key Takeaways */}
            {dynamicContent?.key_takeaways && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl shadow-lg border border-green-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-green-500 rounded-full p-2 mr-4">
                    <CheckCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800">Key Takeaways</h3>
                </div>
                <div className="grid gap-4">
                  {dynamicContent.key_takeaways.map((takeaway: string, index: number) => (
                    <div key={index} className="flex items-start bg-white rounded-lg p-4 shadow-sm border border-green-100">
                      <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-green-800 font-medium">{takeaway}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Case Study */}
            {dynamicContent?.case_study && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-lg border border-blue-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-blue-500 rounded-full p-2 mr-4">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-blue-800">Case Study</h3>
                </div>
                <div className="bg-white rounded-lg p-6 shadow-sm border border-blue-100">
                  <h4 className="text-xl font-semibold text-blue-800 mb-4">{dynamicContent.case_study.title}</h4>
                  <p className="text-blue-700 leading-relaxed">{dynamicContent.case_study.text}</p>
                </div>
              </div>
            )}
            
            {/* FAQs */}
            {dynamicContent?.faqs && dynamicContent.faqs.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl shadow-lg border border-purple-200 p-8">
                <div className="flex items-center mb-6">
                  <div className="bg-purple-500 rounded-full p-2 mr-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-purple-800">Frequently Asked Questions</h3>
                </div>
                <div className="space-y-4">
                  {dynamicContent.faqs.map((faq: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-purple-100">
                      <h4 className="text-lg font-semibold text-purple-800 mb-3">{faq.q}</h4>
                      <p className="text-purple-700 leading-relaxed">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Take Quiz */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Take Quiz</h3>
            <p className="text-gray-600 text-sm mb-4">Test your knowledge with 10 questions</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {quizCompleted ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Not started</span>
              )}
            </div>
            <button
              onClick={() => navigate(`/quiz/${moduleId}/${lessonId}`)}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              {quizCompleted ? 'Retake Quiz' : 'Start Quiz'}
            </button>
          </div>
        </div>

        {/* Eco Challenge */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Target className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Eco Challenge</h3>
            <p className="text-gray-600 text-sm mb-4">Complete real-world environmental action</p>
            <div className="flex items-center justify-center gap-2 mb-4">
              {challengeCompleted ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500">Not started</span>
              )}
            </div>
            <button
              onClick={() => navigate(`/eco-challenge/${lessonId}`)}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              {challengeCompleted ? 'View Challenge' : 'Start Challenge'}
            </button>
          </div>
        </div>

        {/* Mark Complete */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete Lesson</h3>
            <p className="text-gray-600 text-sm mb-4">Finish quiz and challenge to complete</p>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Requirements:</div>
              <div className="space-y-1">
                <div className={`flex items-center text-xs ${quizCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Quiz completed
                </div>
                <div className={`flex items-center text-xs ${challengeCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Challenge completed
                </div>
              </div>
            </div>
            <button
              disabled={!isLessonComplete}
              className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                isLessonComplete 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLessonComplete ? 'Lesson Complete!' : 'Complete Requirements'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}