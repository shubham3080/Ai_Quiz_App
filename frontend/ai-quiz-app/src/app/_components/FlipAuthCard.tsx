'use client';

import { useState } from 'react';
import { cn } from "../_lib/utils";


export default function FlipAuthCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-80 perspective-1000">
      <div
        className={cn(
          "relative w-80 h-[28rem] transition-transform duration-700 transform-style-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        <div className="absolute inset-0 backface-hidden bg-white rounded-xl shadow-2xl p-6 border border-gray-200 flex flex-col justify-center"> {/* Center content vertically */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Welcome Back</h2>
            <p className="text-gray-600 mb-8 text-center">Continue your knowledge journey</p> {/* Increased margin */}
          </div>
          
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="enter@quizora.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-4">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Launch Quizora
            </button>
            
            <button
              onClick={() => setIsFlipped(true)}
              className="text-cyan-600 hover:text-cyan-700 text-sm font-medium transition-colors w-full text-center"
            >
              Don't have an account? Sign up
            </button>
          </div>
        </div>

        <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white rounded-xl shadow-2xl p-4 border border-gray-200 flex flex-col justify-center"> {/* Reduced padding */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Begin Journey</h2> 
            <p className="text-gray-600 mb-4 text-sm text-center">Join the evolution of learning</p> 
          </div>
          
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="Alex Johnson"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="enter@quizora.com"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity text-sm">
              Create Account
            </button>
            
            <button
              onClick={() => setIsFlipped(false)}
              className="text-cyan-600 hover:text-cyan-700 text-xs font-medium transition-colors w-full text-center"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}