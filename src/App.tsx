import { useState } from 'react'
import './App.css'
import { TradingCard } from './components/TradingCard'
import type { GitHubUser } from './types/github'

function App() {
  const [username, setUsername] = useState('')
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchGitHubUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return

    setIsLoading(true)
    setError('')
    setUser(null)

    try {
      const response = await fetch(`https://api.github.com/users/${username}`)
      if (!response.ok) {
        throw new Error('User not found')
      }
      const data = await response.json()
      setUser(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app-container">
      <h1>GitHub Trading Card Generator</h1>
      
      <form onSubmit={fetchGitHubUser} className="search-form">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          className="search-input"
        />
        <button type="submit" className="search-button" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Generate Card'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      
      <div className="card-container">
        {user && <TradingCard user={user} />}
      </div>
    </div>
  )
}

export default App
