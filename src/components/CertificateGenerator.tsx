import React from 'react';
import { Award, Download, Share2 } from 'lucide-react';

interface CertificateProps {
  studentName: string;
  moduleName: string;
  completionDate: string;
  points: number;
  onDownload?: () => void;
  onShare?: () => void;
}

export default function CertificateGenerator({ 
  studentName, 
  moduleName, 
  completionDate, 
  points,
  onDownload,
  onShare 
}: CertificateProps) {
  return (
    <div className="bg-white border-4 border-green-600 rounded-lg p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Award className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Certificate of Completion</h1>
        <div className="w-24 h-1 bg-green-600 mx-auto"></div>
      </div>

      {/* Content */}
      <div className="text-center space-y-6">
        <p className="text-lg text-gray-700">This is to certify that</p>
        
        <h2 className="text-4xl font-bold text-green-600 border-b-2 border-green-200 pb-2 inline-block">
          {studentName}
        </h2>
        
        <p className="text-lg text-gray-700">
          has successfully completed the
        </p>
        
        <h3 className="text-2xl font-semibold text-gray-900">
          {moduleName} Module
        </h3>
        
        <p className="text-lg text-gray-700">
          in the EcoLearn Sustainability Education Program
        </p>
        
        <div className="flex justify-center items-center gap-8 py-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Completion Date</p>
            <p className="text-lg font-semibold text-gray-900">{completionDate}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">EcoPoints Earned</p>
            <p className="text-lg font-semibold text-green-600">{points}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm text-gray-600">Certified by</p>
            <p className="font-semibold text-gray-900">EcoLearn Platform</p>
          </div>
          <div className="text-right">
            <div className="w-32 h-8 bg-green-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱 ECOLEARN</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          Download
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-2 px-6 py-3 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors"
        >
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>
    </div>
  );
}