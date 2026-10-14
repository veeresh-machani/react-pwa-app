import React, { createContext, useContext, useMemo, useCallback, useState, useEffect, type ReactNode } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'

interface VersionContextType {
  newUpdateAvailable: boolean
  setNewUpdateAvailable: (value: boolean) => void
  forceUpdate: () => void
}

const VersionContext = createContext<VersionContextType | undefined>(undefined)

export const VersionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [newUpdateAvailable, setNewUpdateAvailable] = useState(false)

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_url, reg) {
      if (reg) {
        // Poll every 10 seconds for new deployment / service worker updates
        setInterval(async () => {
          try {
            await reg.update()
          } catch (err) {
            console.debug('[PWA] Check failed:', err)
          }
        }, 10 * 1000)
      }
    },
  })

  // Listen for controllerchange: fires when a newly deployed service worker takes control via skipWaiting & clientsClaim
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const hadController = Boolean(navigator.serviceWorker.controller)

    const handleControllerChange = () => {
      // If there was an existing controller when page loaded, a controllerchange means a new build took over
      if (hadController) {
        setNewUpdateAvailable(true)
      }
    }

    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange)
    return () => {
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange)
    }
  }, [])

  // Sync needRefresh if triggered by workbox
  useEffect(() => {
    if (needRefresh) {
      setNewUpdateAvailable(true)
    }
  }, [needRefresh])

  const forceUpdate = useCallback(() => {
    setNewUpdateAvailable(false)
    setNeedRefresh(false)
    try {
      updateServiceWorker(true)
    } finally {
      window.location.reload()
    }
  }, [updateServiceWorker, setNeedRefresh])

  const contextValue = useMemo<VersionContextType>(
    () => ({
      newUpdateAvailable,
      setNewUpdateAvailable,
      forceUpdate,
    }),
    [newUpdateAvailable, forceUpdate]
  )

  return (
    <VersionContext.Provider value={contextValue}>
      {children}
    </VersionContext.Provider>
  )
}

// Hook to access application version update state and actions
export const useAppStore = (): VersionContextType => useContext(VersionContext)!
