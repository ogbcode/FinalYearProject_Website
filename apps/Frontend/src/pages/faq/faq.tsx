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
            To set up Paystack webhook for your bot, copy your bot's domain and
            go to your Paystack settings. Paste your bot's domain followed by
            "/paystack" in the webhook URL field.
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
            If your bot isn't working, it's usually due to incorrect parameters
            during deployment. Try deleting the bot and creating it again, or
            contact support for further assistance.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            Deployment Parameter guide
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            name: The name of title of the product or service. <br />
            description: A brief description or summary of the product or
            service. <br />
            Telegram chat id: Your telegram chat Id. <br />
            Twoweeks Price: Price for a two-week subscription or access in usd. <br />
            Onemonth Price: Price for a one-month subscription or access in usd. <br />
            Lifetime Price: Price for a lifetime subscription or access in usd. <br />
            Groupchat Id: TelegramID of the group chat associated with the product or
            service. <br />
            Customersupport Telegram: Telegram username or link for customer
            support. <br />
            Group link: URL to redirect users to upon successful payment. <br />
            Subscribtion Benefits:Benefits users get for paying for ypour service  <br />
            Binance Apikey: API key for accessing Binance services. <br />
            Binance Secretkey: Secret key for accessing Binance services. <br />
            Paystack Apikey: API key for integrating Paystack payment gateway.{" "}
            <br />
            Paystack Publickey: Public key for integrating Paystack payment
            gateway. <br />
            Telegram Apikey: API key provided by Botfather.{" "}
            <br />
            Stripe Apikey: API key for integrating with Stripe payment gateway.{" "}
            <br />
            Coinpayment Apikey: API key for integrating with Coinpayment
            service. <br />
            Coinpayment Publickey: Public key for integrating with Coinpayment
            service. <br />
            Coinpayment MerchantId: Merchant ID for Coinpayment service. <br />
            Coinpayment Ipnsecret: IPN (Instant Payment Notification) secret for
            Coinpayment Service. <br />
            Nowpayment Apikey: API key for integrating with NowPayment service.{" "}
            <br />
            Nowpayment Ipnsecret: IPN secret for NowPayment service. <br />
            Btc Address: Bitcoin (BTC) wallet address. <br />
            Usdt Address: USDT (Tether) wallet address.
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
            If you forgot your password, you can reset it by clicking on the
            "Forgot Password" link on the login page. Follow the instructions
            sent to your registered email to reset your password securely.
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
            To deactivate your account, please contact our support team. They
            will assist you in the deactivation process and address any concerns
            you may have.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
