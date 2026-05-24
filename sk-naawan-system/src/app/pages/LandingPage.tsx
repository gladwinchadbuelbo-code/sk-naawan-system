import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Users, Lock, TrendingUp, Calendar, FileText, Eye, UserCircle } from 'lucide-react';
import logoImage from 'figma:asset/c1c184dbafb09f96366bc3ee26a02e53e96d0e3e.png';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={logoImage} alt="SK Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg">SK Naawan IMS</h1>
                <p className="text-xs text-gray-500">Information Management System</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 mb-6">
            <img src={logoImage} alt="SK Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-4xl mb-4">
            Information Management System
          </h1>
          <h2 className="text-2xl text-gray-700 mb-2">
            for the Sangguniang Kabataan of Naawan
          </h2>
          <h3 className="text-xl text-gray-600 mb-6">
            Activities, Budget Transparency, and Reporting
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive platform for SK activities, budget transparency, and reporting.
            Access public information or login as staff to manage the system.
          </p>
        </div>

        {/* Main Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
          {/* Public Portal Card */}
          <Card className="p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-transparent hover:border-[#1BA160]"
                onClick={() => navigate('/public')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Eye className="w-8 h-8 text-[#1BA160]" />
              </div>
              <h2 className="text-2xl mb-4">Public Transparency Portal</h2>
              <p className="text-gray-600 mb-6">
                Access budget reports, activity accomplishments, event calendars, and public documents. 
                No login required.
              </p>

              {/* Features List */}
              <div className="space-y-3 mb-8 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm">View Budget Transparency</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm">Browse Activity Reports</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm">View Event Calendar</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm">Search Public Documents</span>
                </div>
              </div>

              <Button size="lg" className="w-full">
                Enter Public Portal
                <Eye className="w-5 h-5 ml-2" />
              </Button>
              
              <p className="text-xs text-gray-500 mt-4">
                <span className="inline-flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  No registration or login required
                </span>
              </p>
            </div>
          </Card>

          {/* Staff Login Card */}
          <Card className="p-8 hover:shadow-2xl transition-shadow cursor-pointer border-2 border-transparent hover:border-green-500"
                onClick={() => navigate('/login')}>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl mb-4">Staff Login</h2>
              <p className="text-gray-600 mb-8">
                Secure access for SK officials to manage activities, 
                budgets, proposals, and reports.
              </p>

              <Button size="lg" variant="outline" className="w-full border-2 border-green-600 text-green-600 hover:bg-green-50">
                Staff Login
                <UserCircle className="w-5 h-5 ml-2" />
              </Button>

              <p className="text-xs text-gray-500 mt-4">
                <span className="inline-flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Authorized personnel only
                </span>
              </p>
            </div>
          </Card>
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="text-center">
              <h3 className="text-xl mb-4">About This System</h3>
              <p className="text-gray-700 mb-6">
                The SK Integrated Digital Management System provides comprehensive tools for managing 
                Sangguniang Kabataan activities, maintaining budget transparency, and generating 
                COA-compliant reports. The system ensures accountability through a proposal-based 
                workflow and public transparency portal.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg">
                  <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Secure</p>
                  <p className="text-xs text-gray-500">Role-based access control</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <Eye className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Transparent</p>
                  <p className="text-xs text-gray-500">Public information access</p>
                </div>
                <div className="p-4 bg-white rounded-lg">
                  <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium">Compliant</p>
                  <p className="text-xs text-gray-500">COA & LYDO standards</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 Sangguniang Kabataan. All rights reserved.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Integrated Digital Management System for SK Activities, Budget Transparency, and Reporting
          </p>
        </div>
      </footer>
    </div>
  );
}