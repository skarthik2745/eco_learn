import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { getLessonById } from '../data/complete50Lessons';
import { generateEcoChallenges } from '../services/geminiApi';
import { ArrowLeft, Upload, Camera, FileText, CheckCircle, Target, Clock, Award, MapPin, Calendar, Zap, TrendingUp, Star } from 'lucide-react';

export default function EcoChallengeView() {
  const { lessonId } = useParams();
  const { completeChallenge, addPoints } = useGame();
  const [selectedChallenge, setSelectedChallenge] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [reflection, setReflection] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [gpsLocation, setGpsLocation] = useState('');
  const [dateStamp, setDateStamp] = useState(new Date().toISOString().split('T')[0]);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const lesson = getLessonById(lessonId!);

  useEffect(() => {
    const loadChallenges = async () => {
      if (lesson) {
        setLoading(true);
        try {
          const generatedChallenges = await generateEcoChallenges(lesson.title, lessonId);
          const challengesWithIds = generatedChallenges.map((challenge, index) => ({
            ...challenge,
            id: `${lessonId}-${challenge.difficulty}`,
            originalId: challenge.id
          }));
          setChallenges(challengesWithIds);
        } catch (error) {
          console.error('Failed to load challenges:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    loadChallenges();
  }, [lesson, lessonId]);

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson Not Found</h1>
          <Link to="/dashboard" className="text-green-600 hover:text-green-700">Return to Modules</Link>
        </div>
      </div>
    );
  }

  const currentChallenge = challenges[selectedChallenge];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if (reflection.length >= 50 && uploadedFiles.length > 0) {
      completeChallenge(currentChallenge.id, currentChallenge.points);
      localStorage.setItem(`challenge_completed_${lessonId}_${currentChallenge.difficulty}`, 'true');
      setSubmitted(true);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return <Zap className="h-4 w-4" />;
      case 'medium': return <TrendingUp className="h-4 w-4" />;
      case 'hard': return <Star className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Eco Challenges...</h2>
          <p className="text-gray-600">Generating personalized action-based challenges for {lesson?.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to={`/lesson/${lesson.id.split('-')[0]}/${lessonId}`} className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lesson
        </Link>
        
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-green-100 rounded-xl">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Eco Challenges</h1>
              <p className="text-gray-600 mb-4">Complete real-world environmental actions for {lesson.title}</p>
              <div className="text-sm text-gray-500">
                Choose one of the three action-based challenges below to complete
              </div>
            </div>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Challenge Selection */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Available Challenges</h2>
            
            {challenges.map((challenge, index) => (
              <div 
                key={challenge.id}
                className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                  selectedChallenge === index 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300'
                }`}
                onClick={() => setSelectedChallenge(index)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 ${
                      selectedChallenge === index 
                        ? 'border-green-500 bg-green-500' 
                        : 'border-gray-300'
                    }`}>
                      {selectedChallenge === index && (
                        <CheckCircle className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getDifficultyColor(challenge.difficulty)}`}>
                      {getDifficultyIcon(challenge.difficulty)}
                      {challenge.difficulty}
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{challenge.description}</p>

                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {challenge.timeframe || '1-7 days'}
                  </div>
                  <div className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    {challenge.points} points
                  </div>
                  <div className="flex items-center">
                    <Camera className="h-4 w-4 mr-2" />
                    {challenge.proofType === 'multiple' ? 'Photo/Video' : 'Photo'} proof
                  </div>
                  <div className="flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    {challenge.category || 'action'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Challenge Details & Submission */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Challenge Instructions</h3>
              
              <div className="space-y-3 mb-6">
                {currentChallenge.instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">{index + 1}</span>
                    </div>
                    <p className="text-gray-700">{instruction}</p>
                  </div>
                ))}
              </div>

              {/* Materials Required */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials Required
                </label>
                <div className="bg-blue-50 rounded-lg p-3">
                  <ul className="text-sm text-blue-800 space-y-1">
                    {currentChallenge.materials.map((material, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                        {material}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Submit Your Proof</h4>
                
                {/* File Upload */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Evidence (Photos/Videos) *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Click to upload files</p>
                      <p className="text-sm text-gray-500">Images, Videos up to 10MB each</p>
                    </label>
                  </div>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {file.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Example Display */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💡 Example Ideas
                  </label>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 text-sm font-medium mb-2">How other students completed this:</p>
                    <div className="text-blue-700 text-sm space-y-3">
                      <div>
                        <p className="text-blue-800 font-medium mb-2">💡 Example Ideas:</p>
                        <ul className="space-y-1 text-blue-600">
                          {currentChallenge?.exampleIdeas?.map((idea, index) => (
                            <li key={index}>• {idea}</li>
                          )) || [
                            'Start small and document your progress with photos',
                            'Involve friends or family members to make it more fun',
                            'Measure the impact of your actions with simple tools',
                            'Share your experience to inspire others'
                          ].map((idea, index) => (
                            <li key={index}>• {idea}</li>
                          ))}
                        </ul>
                      </div>
                      
                      {currentChallenge?.example && (
                        <div className="pt-3 border-t border-blue-200">
                          <p className="text-blue-800 font-medium mb-2">Success Story:</p>
                          <p className="text-blue-600">{currentChallenge.example}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reflection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What did you learn? (50+ words) *
                  </label>
                  <textarea
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe what you did, what you learned, and how it impacted you..."
                  />
                  <div className="mt-1 text-sm text-gray-500">
                    {reflection.length} characters (minimum 50 required)
                  </div>
                </div>

                {/* Optional Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={gpsLocation}
                      onChange={(e) => setGpsLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Where did you complete this?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      Date Completed
                    </label>
                    <input
                      type="date"
                      value={dateStamp}
                      onChange={(e) => setDateStamp(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={reflection.length < 50 || uploadedFiles.length === 0}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Challenge (+{currentChallenge.points} EcoPoints)
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Success State */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Challenge Completed!</h2>
          <p className="text-gray-600 mb-6">
            Congratulations! You've earned {currentChallenge.points} EcoPoints for completing "{currentChallenge.title}".
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              +{currentChallenge.points} EcoPoints added to your account!
            </p>
          </div>

          <div className="flex justify-center space-x-4">
            <Link
              to={`/lesson/${lesson.id.split('-')[0]}/${lessonId}`}
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
  );
}