import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Layout from './components/Layout';
import CommandCenter from './pages/CommandCenter';
import IncidentsPage from './pages/IncidentsPage';
import CrisisMapPage from './pages/CrisisMapPage';
import RespondersPage from './pages/RespondersPage';
import SensorsPage from './pages/SensorsPage';
import IntelligencePage from './pages/IntelligencePage';
import EmergencyReportingPage from './pages/EmergencyReportingPage';


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<CommandCenter />} />
              <Route path="/incidents" element={<IncidentsPage />} />
              <Route path="/map" element={<CrisisMapPage />} />
              <Route path="/responders" element={<RespondersPage />} />
              <Route path="/sensors" element={<SensorsPage />} />
              <Route path="/intelligence" element={<IntelligencePage />} />
              <Route path="/report" element={<EmergencyReportingPage />} />
              <Route path="*" element={<PageNotFound />} />
            </Route>
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App