"use client";
import { useState, useEffect, useRef } from "react";

interface AnalyticsData {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  categoryProgress: Array<{
    category: string;
    scores: number[];
    dates: string[];
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  quizHistory: Array<{
    id: string;
    date: string;
    category: string;
    subcategory: string;
    score: number;
  }>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    highestScore: 0,
  });
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // Animate numbers on load
  useEffect(() => {
    if (analytics && !loading) {
      animateNumbers();
    }
  }, [analytics, loading]);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const decoded = JSON.parse(atob(token.split(".")[1]));
      const userId = decoded.id;

      const response = await fetch("http://localhost:5000/quiz/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const animateNumbers = () => {
    if (!analytics) return;

    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const increments = {
      totalQuizzes: analytics.totalQuizzes / steps,
      averageScore: analytics.averageScore / steps,
      highestScore: analytics.highestScore / steps,
    };

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      setAnimatedValues({
        totalQuizzes: Math.min(
          Math.floor(increments.totalQuizzes * currentStep),
          analytics.totalQuizzes
        ),
        averageScore: Math.min(
          increments.averageScore * currentStep,
          analytics.averageScore
        ),
        highestScore: Math.min(
          increments.highestScore * currentStep,
          analytics.highestScore
        ),
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedValues({
          totalQuizzes: analytics.totalQuizzes,
          averageScore: analytics.averageScore,
          highestScore: analytics.highestScore,
        });
      }
    }, stepDuration);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Learning Analytics
        </h1>
        <p className="text-gray-600">
          Track your quiz performance and progress
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Section - 60% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top Row - 50/50 Split */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overview Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overview
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-600">Total Quizzes</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {animatedValues.totalQuizzes}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-600">Average Score</span>
                  <span className="text-2xl font-bold text-green-600">
                    {animatedValues.averageScore.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-gray-600">Highest Score</span>
                  <span className="text-2xl font-bold text-purple-600">
                    {animatedValues.highestScore.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Category Distribution
              </h3>
              <div className="h-48 flex items-center justify-center">
                {analytics?.categoryDistribution.length ? (
                  <div className="relative w-32 h-32">
                    {/* Simple pie chart using conic gradients */}
                    <div
                      className="w-full h-full rounded-full border-4 border-white shadow-lg"
                      style={{
                        background: `conic-gradient(${analytics.categoryDistribution
                          .map((cat, index) => {
                            const colors = [
                              "#3B82F6",
                              "#10B981",
                              "#8B5CF6",
                              "#F59E0B",
                              "#EF4444",
                            ];
                            return `${colors[index % colors.length]} 0% ${
                              cat.percentage
                            }%`;
                          })
                          .join(", ")})`,
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {analytics.categoryDistribution.length} Categories
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <div className="text-4xl mb-2">📊</div>
                    <p>No category data</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quiz History
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 text-gray-600 font-medium">
                      Date
                    </th>
                    <th className="text-left py-3 text-gray-600 font-medium">
                      Category
                    </th>
                    <th className="text-left py-3 text-gray-600 font-medium">
                      Subcategory
                    </th>
                    <th className="text-left py-3 text-gray-600 font-medium">
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics?.quizHistory.map((quiz) => (
                    <tr
                      key={quiz.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 text-gray-600">{quiz.date}</td>
                      <td className="py-3">
                        <span className="font-medium text-gray-900">
                          {quiz.category}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{quiz.subcategory}</td>
                      <td className="py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            quiz.score >= 80
                              ? "bg-green-100 text-green-800"
                              : quiz.score >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {quiz.score}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!analytics?.quizHistory.length && (
                <div className="text-center py-8 text-gray-500">
                  No quiz history available
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - 40% */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Category Progress
          </h3>
          <div className="space-y-4">
            {analytics?.categoryDistribution.map((category) => {
              const progressData = analytics.categoryProgress.find(
                (p) => p.category === category.category
              );
              const isHovered = hoveredCategory === category.category;

              return (
                <div key={category.category}>
                  <div
                    className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer"
                    onMouseEnter={() => setHoveredCategory(category.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">
                        {category.category}
                      </span>
                      <span className="text-sm text-gray-600">
                        {category.percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>

                    {isHovered && progressData && (
                      <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg animate-in fade-in duration-300">
                        <div className="text-xs text-gray-600 mb-2">
                          Recent Performance
                        </div>
                        <div className="flex items-end justify-between h-12 space-x-1">
                          {progressData.scores.slice(-5).map((score, index) => (
                            <div
                              key={index}
                              className="flex-1 flex flex-col items-center"
                            >
                              <div
                                className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-500"
                                style={{ height: `${(score / 100) * 40}px` }}
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {score}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {!analytics?.categoryDistribution.length && (
              <div className="text-center py-8 text-gray-500">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
