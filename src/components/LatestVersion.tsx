import React, { useRef, useEffect } from 'react'
import { useAppStore } from '../context/VersionContext'

export const LatestVersion: React.FC = () => {
  const { newUpdateAvailable, setNewUpdateAvailable, forceUpdate } = useAppStore()
  const postponeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // 1-hour snooze before prompting again
  const postponeUpdate = () => {
    setNewUpdateAvailable(false)
    if (postponeTimeoutRef.current) {
      clearTimeout(postponeTimeoutRef.current)
    }
    postponeTimeoutRef.current = setTimeout(() => {
      setNewUpdateAvailable(true)
    }, 60 * 60 * 1000) // 1 hour
  }

  useEffect(() => {
    return () => {
      if (postponeTimeoutRef.current) {
        clearTimeout(postponeTimeoutRef.current)
      }
    }
  }, [])

  if (!newUpdateAvailable) return null

  return (
    <dialog open className="latest-version-snackbar" aria-label="Update notification">
      <div className="snackbar-top-line" />
      <div className="snackbar-body">
        <h3 className="snackbar-title">New version is available</h3>
        <p className="snackbar-text">Update now to get the latest version.</p>
        <div className="snackbar-actions">
          <button className="btn-link" onClick={postponeUpdate}>
            Remind me Later
          </button>
          <button className="btn btn-primary btn-sm" onClick={forceUpdate}>
            Update
          </button>
        </div>
      </div>
    </dialog>
  )
}

export default LatestVersion
