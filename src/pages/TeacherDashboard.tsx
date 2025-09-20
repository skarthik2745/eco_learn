import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, Clock, Users, Award, FileText, Camera, MessageSquare } from 'lucide-react';

interface ChallengeSubmission {
  id: string;
  studentName: string;
  challengeTitle: string;
  submissionDate: string;
  proofType: string;
  status: 'pending' | 'approved' | 'rejected';
  points: number;
  files?: string[];
  reflection: string;
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('submissions');

  const pendingSubmissions: ChallengeSubmission[] = [
    {
      id: '1',
      studentName: 'Alex Green',
      challengeTitle: 'Sustainability Diary Challenge',
      submissionDate: '2024-01-15',
      proofType: 'multiple',
      status: 'pending',
      points: 150,
      files: ['diary_week1.jpg', 'reusable_items.jpg'],
      reflection: 'This challenge made me realize how many single-use items I use daily. I successfully replaced plastic bags with cloth bags, disposable water bottles with a steel bottle, and plastic straws with bamboo straws. The hardest part was remembering to carry reusables, but it became a habit by day 4.'
    },
    {
      id: '2',
      studentName: 'Emma Earth',
      challengeTitle: 'Plant a Tree Challenge',
      submissionDate: '2024-01-14',
      proofType: 'photo',
      status: 'pending',
      points: 200,
      files: ['tree_planting.jpg', 'tree_after_week.jpg'],
      reflection: 'Planted a neem tree in our school compound. Learned about proper planting techniques and the importance of native species. The tree is showing good growth after one week of care.'
    },
    {
      id: '3',
      studentName: 'Sam Solar',
      challengeTitle: 'Energy Audit Challenge',
      submissionDate: '2024-01-13',
      proofType: 'text',
      status: 'pending',
      points: 175,
      reflection: 'Conducted a home energy audit and identified 5 areas for improvement: LED bulb replacement, unplugging devices, using natural light, efficient cooking methods, and solar water heating. Implemented LED replacement and saved 15% on electricity bill.'
    }
  ];

  const [submissions, setSubmissions] = useState(pendingSubmissions);

  const handleApprove = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'approved' as const } : sub
    ));
  };

  const handleReject = (submissionId: string) => {
    setSubmissions(prev => prev.map(sub => 
      sub.id === submissionId ? { ...sub, status: 'rejected' as const } : sub
    ));
  };

  const stats = {
    totalStudents: 156,
    activeSubmissions: submissions.filter(s => s.status === 'pending').length,
    approvedToday: 12,
    totalPointsAwarded: 15420
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome, {user?.name}! 👨‍🏫
        </h1>
        <p className="text-gray-600 mt-2">
          Manage student submissions and track eco-challenge progress
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalStudents}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-orange-600">{stats.activeSubmissions}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved Today</p>
              <p className="text-2xl font-bold text-green-600">{stats.approvedToday}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points Awarded</p>
              <p className="text-2xl font-bold text-purple-600">{stats.totalPointsAwarded.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Award className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('submissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'submissions'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Challenge Submissions
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analytics'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Analytics
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'submissions' && (
        <div className="space-y-6">
          {submissions.map((submission) => (
            <div key={submission.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{submission.challengeTitle}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {submission.status}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Submitted by <span className="font-medium">{submission.studentName}</span> on {submission.submissionDate}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Points: {submission.points} • Proof Type: {submission.proofType}
                  </p>
                </div>
              </div>

              {/* Files */}
              {submission.files && submission.files.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Camera className="h-4 w-4 mr-1" />
                    Submitted Files
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.files.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-700">{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reflection */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Student Reflection
                </h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed">{submission.reflection}</p>
                </div>
              </div>

              {/* Actions */}
              {submission.status === 'pending' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApprove(submission.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve & Award Points
                  </button>
                  <button
                    onClick={() => handleReject(submission.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-700 rounded-lg font-medium hover:bg-red-50 transition-colors"
                  >
                    Request Revision
                  </button>
                </div>
              )}

              {submission.status === 'approved' && (
                <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Approved - {submission.points} points awarded</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Student Progress Analytics</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Challenge Completion Rates</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sustainability Challenges</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Energy Challenges</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                </div>
              </div>
              
              <div className="space-y-3 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pollution Challenges</span>
                  <span className="text-sm font-medium">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-medium text-gray-700 mb-4">Top Performing Students</h4>
              <div className="space-y-3">
                {[
                  { name: 'Alex Green', points: 1250, challenges: 15 },
                  { name: 'Emma Earth', points: 1180, challenges: 14 },
                  { name: 'Sam Solar', points: 950, challenges: 12 },
                  { name: 'Luna Lake', points: 820, challenges: 10 },
                  { name: 'River Stone', points: 750, challenges: 9 }
                ].map((student, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-600">{student.challenges} challenges completed</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">{student.points}</p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}