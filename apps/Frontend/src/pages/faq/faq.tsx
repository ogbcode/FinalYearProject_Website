import { Box, useTheme } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px" ml={"300px"}>
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Paystack Webhook
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To set up Paystack webhook for your bot, copy your bot's domain and go to your Paystack settings. Paste your bot's domain followed by "/paystack" in the webhook URL field.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Bot Not Working
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If your bot isn't working, it's usually due to incorrect parameters during deployment. Try deleting the bot and creating it again, or contact support for further assistance.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Creating Bot
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Contact our support team if you have any confusion on the parameters required to deploy the bot
       </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Forgot Password
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            If you forgot your password, you can reset it by clicking on the "Forgot Password" link on the login page. Follow the instructions sent to your registered email to reset your password securely.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Account Deactivation
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            To deactivate your account, please contact our support team. They will assist you in the deactivation process and address any concerns you may have.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
