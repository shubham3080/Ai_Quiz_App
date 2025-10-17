/* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"
// import React, { useState, useEffect } from 'react'
// import { jwtDecode } from 'jwt-decode'

// interface JwtPayload {
//   id: string;
//   name: string;
// }

// export default function APITester() {
//   const [userId, setUserId] = useState('')
//   const [userName, setUserName] = useState('')
//   const [requestBody, setRequestBody] = useState(`{
//   "userId": "",
//   "categoryTitle": "Chemistry",
//   "subcategoryTitle": "Organic Chemistry",
//   "questionsCount": 5
// }`)
//   const [response, setResponse] = useState('')
//   const [loading, setLoading] = useState(false)
//   const [endpoint, setEndpoint] = useState('/quiz/start')

//   useEffect(() => {
//     // Get user info from token
//     const token = localStorage.getItem('token')
//     if (token) {
//       try {
//         const decoded: JwtPayload = jwtDecode(token)
//         setUserId(decoded.id)
//         setUserName(decoded.name)

//         // Auto-fill userId in request body
//         setRequestBody(`{
//   "userId": "${decoded.id}",
//   "categoryTitle": "Chemistry",
//   "subcategoryTitle": "Organic Chemistry",
//   "questionsCount": 5
// }`)
//       } catch (error) {
//         console.error('Error decoding token:', error)
//       }
//     }
//   }, [])

//   const sendRequest = async () => {
//     setLoading(true)
//     try {
//       const token = localStorage.getItem('token')
//       const res = await fetch(`http://localhost:5000${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: requestBody
//       })

//       const data = await res.json()
//       setResponse(JSON.stringify(data, null, 2))
//     } catch (error: any) {
//       setResponse(`Error: ${error.message}`)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="p-8 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">API Tester</h1>

//       {/* User Info */}
//       <div className="bg-gray-100 p-4 rounded-lg mb-6">
//         <h2 className="text-lg font-semibold mb-2">User Info (from JWT):</h2>
//         <p><strong>Name:</strong> {userName}</p>
//         <p><strong>User ID:</strong> {userId}</p>
//         <p><strong>Token Present:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
//       </div>

//       {/* Endpoint Selector */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Endpoint:</label>
//         <select
//           value={endpoint}
//           onChange={(e) => setEndpoint(e.target.value)}
//           className="w-full p-2 border rounded"
//         >
//           <option value="/quiz/start">/quiz/start</option>
//           <option value="/quiz/submit-answer">/quiz/submit-answer</option>
//         </select>
//       </div>

//       {/* Request Body */}
//       <div className="mb-4">
//         <label className="block text-sm font-medium mb-2">Request Body:</label>
//         <textarea
//           value={requestBody}
//           onChange={(e) => setRequestBody(e.target.value)}
//           rows={10}
//           className="w-full p-3 border rounded font-mono text-sm"
//         />
//       </div>

//       {/* Send Button */}
//       <button
//         onClick={sendRequest}
//         disabled={loading}
//         className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-6"
//       >
//         {loading ? 'Sending...' : 'Send Request'}
//       </button>

//       {/* Response */}
//       <div>
//         <label className="block text-sm font-medium mb-2">Response:</label>
//         <pre className="bg-gray-100 p-4 rounded border overflow-auto text-sm">
//           {response || 'Response will appear here...'}
//         </pre>
//       </div>
//     </div>
//   )
// }

"use client";

import { useState, useRef, useEffect, use } from "react";
import Webcam from "react-webcam";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { MagicSearchLoader } from "@/app/_lib/MagicSearchLoader";

interface QuizLandingData {
  categoryTitle: string;
  subcategoryTitle: string;
}

interface AIQuestion {
  questionText: string;
  options: string[];
  questionType: "options" | "descriptive";
  difficultyLevel: number;
}

interface QuizSessionData {
  quizId: string;
  userId: string;
  categoryTitle: string;
  subcategoryTitle: string;
  totalQuestions: number;
}

export default function QuizPage({
  params,
}: {
  params: Promise<{ quizId: string }>;
}) {
  const { quizId } = use(params);
  const router = useRouter();

  const [currentQuestion, setCurrentQuestion] = useState<AIQuestion | null>(
    null
  );
  const [userAnswer, setUserAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [progress, setProgress] = useState({ current: 1, total: 3 });
  const [quizSession, setQuizSession] = useState<QuizSessionData | null>(null);
  const [fetchingResults, setFetchingResutls] = useState(false);
  const hasStartedQuiz = useRef(false);

  const {
    error,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    if (!results?.length) return;
    let transcript = "";
    if (typeof results[0] !== "string" && "transcript" in results[0]) {
      const speechResults = results as ResultType[];
      transcript = speechResults[speechResults.length - 1]?.transcript || "";
    } else {
      const stringResults = results as string[];
      transcript = stringResults[stringResults.length - 1] || "";
    }
    setUserAnswer(transcript);
  }, [results]);

  useEffect(() => {
    if (hasStartedQuiz.current) return;

    const startQuiz = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Not logged in");

        const decoded: { id: string } = jwtDecode(token);
        const storedData = localStorage.getItem(quizId);
        if (!storedData) throw new Error("Quiz data missing");

        const quizData: QuizLandingData = JSON.parse(storedData);
        hasStartedQuiz.current = true;

        const res = await fetch("http://localhost:5000/quiz/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: decoded.id,
            categoryTitle: quizData.categoryTitle,
            subcategoryTitle: quizData.subcategoryTitle,
            questionsCount: 3,
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to start quiz");
        }

        const data = await res.json();
        if (!data.question || !data.quizId) {
          throw new Error("Invalid quiz start response");
        }

        setCurrentQuestion(data.question);
        setQuizSession({
          quizId: data.quizId,
          userId: decoded.id,
          categoryTitle: quizData.categoryTitle,
          subcategoryTitle: quizData.subcategoryTitle,
          totalQuestions: 3,
        });
        setProgress({ current: 1, total: 3 });
      } catch (err: any) {
        console.error("Start quiz error:", err);
        alert(`Failed to start quiz: ${err.message}`);
        router.push("/categories");
      } finally {
        setIsLoading(false);
      }
    };

    startQuiz();
  }, [quizId, router]);

  const handleNext = async () => {
    if (isRecording) {
      stopSpeechToText();
      setRecordingComplete(true);
    }
    if (progress.current == progress.total) {
      setFetchingResutls(true);
    }
    if (!userAnswer.trim() || !currentQuestion || !quizSession) {
      alert("Please provide an answer.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        quizData: {
          quizId: quizSession.quizId,
          userId: quizSession.userId,
          categoryTitle: quizSession.categoryTitle,
          subcategoryTitle: quizSession.subcategoryTitle,
        },
        currentQuestion,
        userAnswer,
        progress,
      };

      const res = await fetch("http://localhost:5000/quiz/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Submission failed");
      }
      console.log(result);
      if (result.quizCompleted) {
        localStorage.setItem(
          quizSession.quizId,
          JSON.stringify({ ...quizSession, finalScore: result.finalScore })
        );
        router.push(`/results/${quizSession.quizId}`);
        return;
      } else {
        setCurrentQuestion(result.nextQuestion);
        setProgress(result.progress);
        setUserAnswer("");
        setResults([]);
        setRecordingComplete(false);
      }
    } catch (err: any) {
      console.error("Submit answer error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    setUserAnswer(option);
    setRecordingComplete(true);
    if (isRecording) stopSpeechToText();
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechToText();
      setRecordingComplete(true);
    } else {
      setResults([]);
      setUserAnswer("");
      setRecordingComplete(false);
      startSpeechToText();
    }
  };
  if (fetchingResults) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-500 to-black text-white overflow-auto pt-40">
        <MagicSearchLoader text="Loading Result.." />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black text-white overflow-auto">
      <div className="absolute inset-0 flex flex-col md:flex-row">
        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col bg-gray-900/80 backdrop-blur-sm">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              <span className="text-indigo-300 font-mono">
                AI QUIZ • QUESTION {progress.current} / {progress.total}
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-5">
                <div className="h-8 bg-gray-700/50 rounded w-4/5 animate-pulse"></div>
                <div className="h-6 bg-gray-700/30 rounded w-3/4 animate-pulse"></div>
              </div>
            ) : currentQuestion ? (
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">
                {currentQuestion.questionText}
              </h1>
            ) : (
              <p className="text-gray-400">No question loaded.</p>
            )}
          </div>

          {currentQuestion?.options &&
            currentQuestion?.options?.length > 0 &&
            !isLoading && (
              <div className="mb-8 space-y-4 flex-1">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    className={`p-5 w-full text-left rounded-xl border transition-all ${
                      userAnswer === option
                        ? "border-indigo-500 bg-indigo-500/10"
                        : "border-gray-700 hover:border-indigo-400 hover:bg-gray-800/50"
                    }`}
                  >
                    <div className="flex items-start">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full border border-indigo-400 flex items-center justify-center mr-4">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="text-lg">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

          <div className="mt-auto pt-6 border-t border-gray-800">
            {userAnswer && (
              <div className="mb-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                <p className="text-gray-300 italic">{userAnswer}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={toggleRecording}
                disabled={isLoading}
                className={`flex-1 flex items-center justify-center py-4 px-6 rounded-xl font-medium ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } disabled:opacity-50`}
              >
                {isRecording ? (
                  <>
                    <span className="w-3 h-3 bg-white rounded-full mr-3 animate-pulse"></span>
                    Stop Listening
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                    {recordingComplete ? "Re-record" : "Speak Answer"}
                  </>
                )}
              </button>

              <button
                onClick={handleNext}
                disabled={!userAnswer.trim() || isLoading}
                className="flex items-center justify-center py-4 px-6 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 font-medium rounded-xl disabled:opacity-50"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : progress.current === progress.total ? (
                  "Finish Quiz"
                ) : (
                  "Next Question →"
                )}
              </button>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-sm">
                🎤 Mic error: {error || "Enable microphone permissions"}
              </p>
            )}
          </div>
        </div>

        <div className="w-full md:w-2/5 relative bg-black">
          <Webcam
            audio={false}
            mirrored
            ref={webcamRef}
            className="w-full h-full object-cover"
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center">
            <div
              className={`w-3 h-3 rounded-full mb-2 ${
                isRecording ? "bg-red-500 animate-pulse" : "bg-green-500"
              }`}
            ></div>
            <div className="text-center px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full">
              {isRecording ? (
                <span className="text-red-400 font-medium">LISTENING...</span>
              ) : (
                <span className="text-gray-300">Camera Active</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
