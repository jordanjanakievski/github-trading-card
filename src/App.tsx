import { useState } from 'react'
import type { GitHubUser } from './types/github'
import { TradingCard } from './components/TradingCard'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'

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
    <div className="min-h-screen bg-[#0d1117] py-12 px-4">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl font-bold text-[#ffffff] mb-8">
          GitHub Trading Card Generator
        </h1>
        
        <form onSubmit={fetchGitHubUser} className="w-full max-w-md flex gap-4 mb-8">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username"
            className="flex-1 px-4 py-2 rounded-lg bg-[#161b22] border border-[#30363d] text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff] transition-colors"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-[#238636] text-white rounded-lg hover:bg-[#2ea043] transition-colors disabled:bg-[#1b1f23] disabled:cursor-not-allowed"
          >
            {isLoading ? 'Loading...' : 'Generate Card'}
          </Button>
        </form>

        {error && (
          <p className="text-[#f85149] mb-4">{error}</p>
        )}
        
        <div className="w-full flex justify-center">
          {user && <TradingCard user={user} />}
        </div>
      </div>
    </div>
  )
}

export default App
