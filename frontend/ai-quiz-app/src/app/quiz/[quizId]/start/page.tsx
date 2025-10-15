"use client"
import React, { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

interface JwtPayload {
  id: string;
  name: string;
}

export default function APITester() {
  const [userId, setUserId] = useState('')
  const [userName, setUserName] = useState('')
  const [requestBody, setRequestBody] = useState(`{
  "userId": "",
  "categoryTitle": "Chemistry",
  "subcategoryTitle": "Organic Chemistry",
  "questionsCount": 5
}`)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [endpoint, setEndpoint] = useState('/quiz/start')

  useEffect(() => {
    // Get user info from token
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token)
        setUserId(decoded.id)
        setUserName(decoded.name)
        
        // Auto-fill userId in request body
        setRequestBody(`{
  "userId": "${decoded.id}",
  "categoryTitle": "Chemistry",
  "subcategoryTitle": "Organic Chemistry",
  "questionsCount": 5
}`)
      } catch (error) {
        console.error('Error decoding token:', error)
      }
    }
  }, [])

  const sendRequest = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: requestBody
      })

      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error: any) {
      setResponse(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Tester</h1>

      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">User Info (from JWT):</h2>
        <p><strong>Name:</strong> {userName}</p>
        <p><strong>User ID:</strong> {userId}</p>
        <p><strong>Token Present:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
      </div>

      {/* Endpoint Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Endpoint:</label>
        <select 
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="/quiz/start">/quiz/start</option>
          <option value="/quiz/submit-answer">/quiz/submit-answer</option>
        </select>
      </div>

      {/* Request Body */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Request Body:</label>
        <textarea
          value={requestBody}
          onChange={(e) => setRequestBody(e.target.value)}
          rows={10}
          className="w-full p-3 border rounded font-mono text-sm"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={sendRequest}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 mb-6"
      >
        {loading ? 'Sending...' : 'Send Request'}
      </button>

      {/* Response */}
      <div>
        <label className="block text-sm font-medium mb-2">Response:</label>
        <pre className="bg-gray-100 p-4 rounded border overflow-auto text-sm">
          {response || 'Response will appear here...'}
        </pre>
      </div>
    </div>
  )
}