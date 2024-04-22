import  { useContext, useState } from "react";
import { Box, IconButton, Menu, MenuItem, useTheme } from "@mui/material";
import { ColorModeContext } from "../../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useNavigate, useLocation } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {

    navigate("/login");
    localStorage.removeItem('userId');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('token');
    localStorage.removeItem('isVerified');
    handleClose();
  };

  // Check if the current location is the login page
  const isLoginPage = location.pathname === "/login";

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
      {/* Left Section */}
      <Box>
        {/* ... Your left section content ... */}
      </Box>

      {/* Right Section */}
      <Box display="flex" alignItems="center">
        {/* Icons */}
        <Box ml="auto">
          {/* Conditionally render the PersonOutlinedIcon based on the current location */}
          {!isLoginPage && (
            <IconButton onClick={handleClick}>
              <PersonOutlinedIcon />
            </IconButton>
          )}
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
