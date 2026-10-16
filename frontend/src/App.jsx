import { useState } from 'react'
import { api } from './lib/api'

function App() {
  const [result, setResult] = useState(null)

  async function pingApi() {
    setResult({ tone: 'text-fg-muted', text: 'Calling the API...' })

    try {
      const response = await api.get('/auth/me')
      setResult({ tone: 'text-success', text: `${response.status}: signed in as ${response.data.data.name}` })
    } catch (error) {
      if (error.response) {
        setResult({ tone: 'text-warning', text: `${error.response.status}: ${error.response.data.message}` })
      } else {
        setResult({ tone: 'text-danger', text: `No response: ${error.message}` })
      }
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md space-y-5 rounded-md border border-line bg-surface p-6">
        <p className="font-mono text-xs tracking-[0.14em] text-accent">API CONNECTION</p>
        <h1 className="text-3xl font-bold tracking-tight">AutoPulse</h1>
        <button
          type="button"
          onClick={pingApi}
          className="h-11 w-full rounded-md bg-accent font-semibold text-accent-fg transition-colors hover:bg-accent-hover"
        >
          Ping API
        </button>
        {result && <p className={`font-mono text-sm ${result.tone}`}>{result.text}</p>}
      </section>
    </main>
  )
}

export default App
