'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === '/login';

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-4xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/60">
        <div className="flex flex-col md:flex-row min-h-[600px]">
          <div className="md:w-1/2 bg-gradient-to-br from-blue-500 to-cyan-600 p-8 text-white flex flex-col justify-center">
            <div className="text-center md:text-left">
              <div className="flex justify-center md:justify-start items-center mb-6">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-bold">Q</span>
                </div>
                <span className="ml-3 text-2xl font-bold">Quizo</span>
              </div>
              
              <h2 className="text-3xl font-bold mb-4">
                {isLogin ? 'Welcome Back!' : 'Get Started!'}
              </h2>
              <p className="text-blue-100 text-lg leading-relaxed">
                {isLogin 
                  ? 'Continue your learning journey with personalized AI-powered quizzes.'
                  : 'Join thousands of learners and master any subject with adaptive quizzes.'
                }
              </p>
              
              <div className="mt-8 flex justify-center md:justify-start">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-1 flex">
                  <Link
                    href="/login"
                    className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                      isLogin 
                        ? 'bg-white text-blue-600 shadow-lg' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className={`px-6 py-2 rounded-xl transition-all duration-300 ${
                      !isLogin 
                        ? 'bg-white text-blue-600 shadow-lg' 
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="md:w-1/2 p-8 flex items-center justify-center">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}