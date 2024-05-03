import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({
  title,
  subtitle,
  icon,
  progress,
  increase,
  isMobile
}: {
  title: string;
  subtitle: string;
  icon: any;
  progress: any;
  increase: any;
  isMobile: boolean; // Added isMobile prop
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="60%" m={isMobile ? "0 15px" : "0 30px"}> {/* Conditional margin based on isMobile */}
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant={isMobile ? "h6" : "h5"} // Conditional font size based on isMobile
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <ProgressCircle isMobile={isMobile} progress={progress} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant={isMobile ? "subtitle2" : "subtitle1"} sx={{ color: colors.greenAccent[500] }}> {/* Conditional font size based on isMobile */}
          {subtitle}
        </Typography>
        <Typography
          variant={isMobile ? "subtitle2" : "subtitle1"} // Conditional font size based on isMobile
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {increase}
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
