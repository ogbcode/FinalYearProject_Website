import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./pages/global/Topbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Login from "./pages/login/Login";
import Sales from "./pages/sales/Sales";
import Sidebar from "./pages/global/Sidebar";
import Deploy from "./pages/deploy/deploy";
import FAQ from "./pages/faq/faq";
import Geography from "./pages/geography/geography";
import Customers from "./pages/customer/Customer";
import Subscriber from "./pages/subscriber/Subscriber";
import Manage from "./pages/manage/Manage";
import HomePage from "./home/Home";

function App() {
  const [theme, colorMode] = useMode();
  const Layout = () => {
    return (
      <div className="layout">
        <Sidebar />
        <div className="content">
          <Topbar />
          <Outlet />
        </div>
      </div>
    );
  };
  const Layout2 = () => {
    return (
      <div className="layout">
        <Topbar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    );
  };
  
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/deploy" element={<Deploy />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/geography" element={<Geography />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/subscribers" element={<Subscriber />} />
              <Route path="/manage" element={<Manage />} />
            </Route>
            <Route element={<Layout2 />}>
            <Route path="/login" element={<Login />} />
            </Route>
            <Route path="/" element={<HomePage/>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
