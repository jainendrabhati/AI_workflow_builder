
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  const handleBookDemo = () => {
    // Handle book demo action
    console.log('Book demo clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">ai</span>
          </div>
          <span className="text-white font-semibold">planet</span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-white hover:text-green-400 transition-colors">Products</a>
          <a href="#" className="text-white hover:text-green-400 transition-colors">Models</a>
          <a href="#" className="text-white hover:text-green-400 transition-colors">Solutions</a>
          <a href="#" className="text-white hover:text-green-400 transition-colors">Community</a>
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            Contact Us
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Deploy <span className="text-yellow-400">GenAI Apps</span>
        </h1>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
          in minutes, not months.
        </h2>
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl">
          Integrate reliable, private and secure GenAI solutions within your enterprise environment
        </p>

        <div className="flex gap-4 mb-16">
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
          >
            Get Started
          </Button>
          <Button 
            onClick={handleBookDemo}
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 text-lg font-semibold"
          >
            Book Demo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          <div className="bg-teal-800/50 backdrop-blur-sm rounded-lg p-6 border border-teal-700">
            <div className="text-3xl font-bold text-white mb-2">20x</div>
            <div className="text-gray-300">Faster time to market</div>
          </div>
          <div className="bg-teal-800/50 backdrop-blur-sm rounded-lg p-6 border border-teal-700">
            <div className="text-3xl font-bold text-white mb-2">upto 30x</div>
            <div className="text-gray-300">Infra Cost Savings</div>
          </div>
          <div className="bg-teal-800/50 backdrop-blur-sm rounded-lg p-6 border border-teal-700">
            <div className="text-3xl font-bold text-white mb-2">10x</div>
            <div className="text-gray-300">Productivity Gains</div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center py-12">
        <p className="text-gray-300">
          Trusted by leading organizations and 300k+ global community
        </p>
      </div>
    </div>
  );
};

export default Landing;
