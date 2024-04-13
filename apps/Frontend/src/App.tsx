
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ColorModeContext, useMode } from './theme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import Topbar from './pages/global/Topbar';
import Dashboard from 'src/pages/dashboard/Dashboard' ;
import Login from './pages/login/Login';
import Sales from './pages/sales/Sales';
import Sidebar from './pages/global/Sidebar';
import Deploy from './pages/deploy/deploy';
import FAQ from './pages/faq/faq';
import Geography from './pages/geography/geography';
import Customers from 'src/pages/customer/Customer';
function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter> {/* Wrap your entire app with BrowserRouter */}
          <div className="app">
            <Sidebar/>
            <main className="content">
              <Topbar />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/deploy" element={<Deploy />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/geography" element={<Geography />} />
                <Route path="/customers" element={<Customers />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
