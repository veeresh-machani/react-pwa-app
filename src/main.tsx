import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ChunkErrorBoundary } from './components/ChunkErrorBoundary.tsx'
import { VersionProvider } from './context/VersionContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChunkErrorBoundary>
      <VersionProvider>
        <App />
      </VersionProvider>
    </ChunkErrorBoundary>
  </StrictMode>,
)
