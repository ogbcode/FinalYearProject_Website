import { Dispatch, SetStateAction, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box,  Typography, useMediaQuery, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SmartToyIcon from '@mui/icons-material/SmartToy';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import InsightsIcon from '@mui/icons-material/Insights';
import GroupIcon from '@mui/icons-material/Group';
import PublicIcon from '@mui/icons-material/Public';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
const Item = ({
  title,
  to,
  icon,
  selected,
  setSelected,
  isMobile
}: {
  title: string;
  to: string;
  icon: React.ReactNode;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>; // Explicitly define the type
  isMobile: boolean;
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={isMobile ? <span style={{ marginRight: "10px" }}>{icon}</span> : icon}
    
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  //@ts-ignore
  const [isCollapsed, setIsCollapsed] = useState(isMobile?true:false);
  const [selected, setSelected] = useState("Dashboard");


  return (
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
          width:isMobile ?"15vw":undefined,
          
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          // padding: "6px 20px !important",
          ml:"5px", // Reduce horizontal padding
          margin: isMobile ? "15px 0 !important" : "5px 0 !important", // Reduce vertical margin
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
      position={"fixed"}
      height={"100vh"}
    >
      <ProSidebar  collapsed={isMobile?true:isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
         {isMobile?undefined: <MenuItem
            // onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "30px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" color={colors.grey[100]}>
                 
                </Typography>
                {/* <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton> */}
              </Box>
            )}
          </MenuItem>}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={`../../assets/user.png`}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {localStorage.getItem("firstName")} {localStorage.getItem("lastName")}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  ADMIN
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            
            <Item
              title="Dashboard"
              to="/dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              m= {isMobile?"6px":"15px 0 5px 20px"}
              // sx={{ m: "15px 0 5px 20px" }}
            >
              Analytics
            </Typography>
            <Item
              title="Sales"
              to="/sales"
              icon={<InsightsIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />
            <Item
              title="Customers"
              to="/customers"
              icon={<GroupIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />
            <Item
              title="Subscribers"
              to="/subscribers"
              icon={<CardMembershipIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />
            <Item
              title="Geography"
              to="/geography"
              icon={<PublicIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Bots
            </Typography>
            <Item
              title="Deploy"
              to="/deploy"
              icon={<RocketLaunchIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />
            <Item
              title="Manage"
              to="/manage"
              icon={<SmartToyIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
              isMobile={isMobile}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;
