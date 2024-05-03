import { Box, useMediaQuery, useTheme } from "@mui/material";
import GeographyChart from "../../components/Geographychart";
import Header from "../../components/Header";
import { tokens } from "../../theme";

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box mr={isMobile ? "2vw" : "0.5vw"} ml={isMobile ? "17vw" : "17.5vw"} color="black">
      <Header title="Geography" subtitle="Geography Chart of your customers" />
      <Box
        height={isMobile? "70vh":"90vh"}
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
        // marginTop={"-13vh"}
      >
        <GeographyChart />
      </Box>
    </Box>
  );
};

export default Geography;
