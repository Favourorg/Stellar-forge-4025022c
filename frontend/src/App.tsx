import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { WalletProvider } from './context/WalletContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { NetworkProvider } from './context/NetworkContext'
import { StellarProvider } from './context/StellarContext'
import { NetworkSwitcher } from './components/NetworkSwitcher'
import { NetworkBadge, NetworkMismatchBanner } from './components/NetworkBadge'
import { useWallet } from './hooks/useWallet'
import { truncateAddress, formatXLM } from './utils/formatting'
import { NavBar } from './components/NavBar'
import { Home } from './components/Home'
import { CreateToken } from './components/CreateToken'
import { MintForm } from './components/MintForm'
import { BurnForm } from './components/BurnForm'
import { Dashboard } from './components/Dashboard'
import { TokenDetail } from './components/TokenDetail'
import { Button, Spinner, ToastContainer } from './components/UI'
import './App.css'

const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { wallet } = useWallet()
  if (!wallet.isConnected) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const { wallet, connect, disconnect, isConnecting, error, isInstalled } = useWallet()
  const { addToast } = useToast()

  const handleConnect = async () => {
    try {
      await connect()
      if (!error) addToast('Wallet connected', 'success')
    } catch {
      addToast('Failed to connect wallet', 'error')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    addToast('Wallet disconnected', 'info')
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded"
      >
        Skip to main content
      </a>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-white shadow" role="banner">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">StellarForge</h1>
                <p className="mt-2 text-sm text-gray-600">Stellar Token Deployer</p>
              </div>

              <div className="flex items-center gap-4">
                {/* NetworkBadge shows current network; NetworkSwitcher lets user change it */}
                <NetworkBadge />
                <NetworkSwitcher />

                {!isInstalled && (
                  <a
                    href="https://www.freighter.app/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Install Freighter
                  </a>
                )}

                {wallet.isConnected ? (
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {wallet.address && truncateAddress(wallet.address)}
                      </div>
                      {wallet.balance && (
                        <div className="text-xs text-gray-600">{formatXLM(wallet.balance)}</div>
                      )}
                    </div>
                    <Button onClick={handleDisconnect} variant="secondary" size="sm">
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button onClick={handleConnect} disabled={isConnecting} size="sm">
                    {isConnecting ? (
                      <span className="flex items-center gap-2">
                        <Spinner size="sm" />
                        Connecting...
                      </span>
                    ) : (
                      'Connect Wallet'
                    )}
                  </Button>
                )}
              </div>
            </div>

            <NavBar />
          </div>
        </header>

        {/* Full-width mismatch warning — shown below header when Freighter network differs */}
        <NetworkMismatchBanner />

        <main id="main-content" className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {error && (
              <div
                className="mb-4 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
                role="alert"
              >
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <Routes>
                <Route path="/" element={<Home onGetStarted={() => addToast("Welcome! Let's deploy your token.", 'info')} />} />
                <Route path="/create" element={<ProtectedRoute><CreateToken /></ProtectedRoute>} />
                <Route path="/mint" element={<ProtectedRoute><MintForm /></ProtectedRoute>} />
                <Route path="/burn" element={<ProtectedRoute><BurnForm /></ProtectedRoute>} />
                <Route path="/tokens" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/tokens/:address" element={<ProtectedRoute><TokenDetail /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </div>
        </main>

        <ToastContainer />
      </div>
    </>
  )
}

function App() {
  return (
    <Router>
      <NetworkProvider>
        <StellarProvider>
          <WalletProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </WalletProvider>
        </StellarProvider>
      </NetworkProvider>
    </Router>
  )
}

export default App
