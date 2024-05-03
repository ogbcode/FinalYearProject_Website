import { Box, useTheme } from "@mui/material";
import { tokens } from "../theme";

const ProgressCircle = ({ progress = 0.75, size = "40", isMobile = false }) => { // Added isMobile prop
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const angle = progress * 360;
  const circleSize = isMobile ? "25px" : `${size}px`; // Conditional circle size based on isMobile prop

  return (
    <Box
      sx={{
        background: `radial-gradient(${colors.primary[400]} 55%, transparent 56%),
            conic-gradient(transparent 0deg ${angle}deg, ${colors.blueAccent[500]} ${angle}deg 360deg),
            ${colors.greenAccent[500]}`,
        borderRadius: "50%",
        width: circleSize, // Use conditional circle size here
        height: circleSize, // Use conditional circle size here
      }}
    />
  );
};

export default ProgressCircle;
