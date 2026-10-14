import React, { useState, useEffect, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

export const ChunkErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const isChunkFailure = (msg: string) =>
      msg.includes('ChunkLoadError') ||
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Loading chunk')

    const handleRejection = (e: PromiseRejectionEvent) => {
      const msg = e.reason?.message || String(e.reason || '')
      if (isChunkFailure(msg)) {
        e.preventDefault()
        setHasError(true)
      }
    }

    const handleError = (e: ErrorEvent) => {
      if (isChunkFailure(e.message || '')) {
        e.preventDefault()
        setHasError(true)
      }
    }

    window.addEventListener('unhandledrejection', handleRejection)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('unhandledrejection', handleRejection)
      window.removeEventListener('error', handleError)
    }
  }, [])

  if (hasError) {
    return (
      <div className="error-container">
        <div className="error-card">
          <AlertTriangle className="error-icon" size={40} />
          <h2>New Application Version Detected</h2>
          <p>A newer build has been deployed. Please reload the page to continue.</p>
          <button className="btn btn-primary btn-block" onClick={() => window.location.reload()}>
            <RefreshCw size={16} />
            <span>Reload Page</span>
          </button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ChunkErrorBoundary
