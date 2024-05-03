import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { Form, Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useCallback, useState } from "react";
import { tokens } from "../../theme";
import { BASE_URL } from "../../config/config";

const Deploy = () => {
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = tokens(theme.palette.mode);
  const [isDeployLoading, setIsDeployLoading] = useState(false);
  const [isPaystackCheckBoxActive, setIsPaystackCheckBoxActive] =
    useState(false);
  const [isStripeCheckBoxActive, setIsStripeCheckBoxActive] = useState(false);
  const [isBinanceCheckBoxActive, setIsBinanceCheckBoxActive] = useState(false);
  const [isCoinpaymentsCheckBoxActive, setIsCoinpaymentsCheckBoxActive] =
    useState(false);
  const [isNowpaymentsCheckBoxActive, setIsNowpaymentsCheckBoxActive] =
    useState(false);
  const [isCryptoCheckBoxActive, setIsCryptoCheckBoxActive] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [deployStatus, setDeployStatus] = useState<"success" | "error" | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);

  const handleFormSubmit = useCallback(
    async (values: any) => {
      try {
        setIsCreating(true);
        setIsPopupOpen(true);
        const filteredValues = {
          ...values,
          ...(isStripeCheckBoxActive ? {} : { stripe: undefined }),
          ...(isBinanceCheckBoxActive ? {} : { binance: undefined }),
          ...(isPaystackCheckBoxActive ? {} : { paystack: undefined }),
          ...(isCoinpaymentsCheckBoxActive ? {} : { coinpayment: undefined }),
          ...(isNowpaymentsCheckBoxActive ? {} : { nowpayment: undefined }),
          ...(isCryptoCheckBoxActive ? {} : { crypto_address: undefined }),
          userId:localStorage.getItem("userId"),
       
        };
  
        setIsDeployLoading(true);
        const success = await fetchData(filteredValues);
  
        if (success) {
          setDeployStatus("success");
        } else {
          setDeployStatus("error");
          setIsPopupOpen(true);
        }
      } catch (error) {
        console.error("Error during form submission:", error);
        setDeployStatus("error");
        setIsPopupOpen(true);
      } finally {
        setIsCreating(false);
        setIsDeployLoading(false);
      }
    },
    [
      isCreating,
      isStripeCheckBoxActive,
      isBinanceCheckBoxActive,
      isPaystackCheckBoxActive,
      isCoinpaymentsCheckBoxActive,
      isNowpaymentsCheckBoxActive,
      isCryptoCheckBoxActive,
    ]
  );
  
  const fetchData = async (filteredValues: any): Promise<boolean> => {
    try {
      const response = await fetch(`${BASE_URL}/bot/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filteredValues),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch data");
        // console.log(response)
      }
  
      const data = await response.json();
      console.log(data);
      return true; // Assuming success
    } catch (error) {
      console.error("Error fetching data:", error);
      return false; // Fetch failed
    }
  };
  

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    description: yup.string().required("Bot description is required"),
    adminId: yup
      .number()
      .typeError("Telegram Id must be a number")
      .required("Telegram Id is required"),
    twoweeks_price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required"),
    onemonth_price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required"),
    lifetime_price: yup
      .number()
      .typeError("Price must be a number")
      .required("Price is required"),
    groupchatId: yup.string().required("Gropu chatId is required"),
    customersupport_telegram: yup
      .string()
      .required("Customersupport telegram @ required"),
    success_url: yup.string().required("Success url is required"),
    telegram: yup.object().shape({
      telegram_apikey: yup.string().required("Bot API Key is required"),
    }),
    ...(isBinanceCheckBoxActive && {
      binance: yup.object().shape({
        binance_apikey: yup.string().required("Binance API Key is required"),
        binance_secretkey: yup
          .string()
          .required("Binance Secret Key is required"),
      }),
    }),
    ...(isStripeCheckBoxActive && {
      stripe: yup.object().shape({
        stripe_apikey: yup.string().required("Stripe API Key is required"),
        // Add validation for other Stripe fields here if needed
      }),
    }),
    // Validation for Coinpayments fields only if Coinpayments checkbox is active
    ...(isCoinpaymentsCheckBoxActive && {
      coinpayment: yup.object().shape({
        coinpayment_apikey: yup
          .string()
          .required("Coinpayments API Key is required"),
        coinpayment_publickey: yup
          .string()
          .required("Coinpayments Public Key is required"),
        coinpayment_merchantId: yup
          .string()
          .required("Coinpayments Merchant Id is required"),
        coinpayment_ipnsecret: yup
          .string()
          .required("Coinpayments IPN Secret is required"),
      }),
    }),
    // Validation for Now Payments fields only if Now Payments checkbox is active
    ...(isNowpaymentsCheckBoxActive && {
      nowpayment: yup.object().shape({
        nowpayment_apikey: yup
          .string()
          .required("Now Payments API Key is required"),
        nowpayment_ipnsecret: yup
          .string()
          .required("Now Payments IPN Secret is required"),
      }),
    }),
    // Validation for Paystack fields only if Paystack checkbox is active
    ...(isPaystackCheckBoxActive && {
      paystack: yup.object().shape({
        paystack_apikey: yup.string().required("Paystack API key is required"),
        paystack_publickey: yup
          .string()
          .required("Paystack public key is required"),
      }),
    }),
    ...(isCryptoCheckBoxActive && {
      crypto_address: yup.object().shape({
        btc_address: yup.string().required("Binance API Key is required"),
        usdt_address: yup.string().required("Binance Secret Key is required"),
      }),
    }),
  });
  return (
    <Box mr={isMobile ? "2vw" : "0.5vw"} ml={isMobile ? "17.5vw" : "17.5vw"}>
      <Header title="CREATE BOT" subtitle="Create and deploy a new bot" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({ values, errors, touched, handleBlur, handleChange }) => (
          <Form>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Bot Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.name}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label=" Bot Description"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                name="description"
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Bot Api key"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.telegram.telegram_apikey}
                name="telegram.telegram_apikey"
                error={
                  !!touched.telegram?.telegram_apikey &&
                  !!errors.telegram?.telegram_apikey
                }
                helperText={
                  touched.telegram?.telegram_apikey &&
                  errors.telegram?.telegram_apikey
                }
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telegram chat Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.adminId}
                name="adminId"
                error={!!touched.adminId && !!errors.adminId}
                helperText={touched.adminId && errors.adminId}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Twoweeks Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.twoweeks_price}
                name="twoweeks_price"
                error={!!touched.twoweeks_price && !!errors.twoweeks_price}
                helperText={touched.twoweeks_price && errors.twoweeks_price}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Onemonth Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.onemonth_price}
                name="onemonth_price"
                error={!!touched.onemonth_price && !!errors.onemonth_price}
                helperText={touched.onemonth_price && errors.onemonth_price}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Lifetime Price"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lifetime_price}
                name="lifetime_price"
                error={!!touched.lifetime_price && !!errors.lifetime_price}
                helperText={touched.lifetime_price && errors.lifetime_price}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Groupchat Id"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.groupchatId}
                name="groupchatId"
                error={!!touched.groupchatId && !!errors.groupchatId}
                helperText={touched.groupchatId && errors.groupchatId}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="CustomerSupport telegram username"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.customersupport_telegram}
                name="customersupport_telegram"
                error={
                  !!touched.customersupport_telegram &&
                  !!errors.customersupport_telegram
                }
                helperText={
                  touched.customersupport_telegram &&
                  errors.customersupport_telegram
                }
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Success url"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.success_url}
                name="success_url"
                error={!!touched.success_url && !!errors.success_url}
                helperText={touched.success_url && errors.success_url}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Subscription Benefits"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.subscription_benefits}
                name="subscription_benefits"
                error={!!touched.subscription_benefits && !!errors.subscription_benefits}
                helperText={touched.subscription_benefits && errors.subscription_benefits}
                sx={{ gridColumn: "span 4" }}
              />
              <Box>
                <Typography
                  variant="h6"
                  component="h6"
                  gutterBottom
                  sx={{ color: colors.greenAccent[300] }}
                >
                  Payment Methods
                </Typography>
              </Box>
              <Box>
                <Checkbox
                  onClick={() => {
                    setIsBinanceCheckBoxActive(!isBinanceCheckBoxActive);
                    values.binance.binance_apikey = "";
                    values.binance.binance_secretkey = "";
                  }}
                  color="success"
                />
                <span>Binance Pay</span>
              </Box>
              {isBinanceCheckBoxActive ? (
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Binance api key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.binance.binance_apikey}
                    name="binance.binance_apikey"
                    error={
                      !!touched.binance?.binance_apikey &&
                      !!errors.binance?.binance_apikey
                    }
                    helperText={
                      touched.binance?.binance_apikey &&
                      errors.binance?.binance_apikey
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Binance secretkey"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.binance.binance_secretkey}
                    name="binance.binance_secretkey"
                    error={
                      !!touched.binance?.binance_secretkey &&
                      !!errors.binance?.binance_secretkey
                    }
                    helperText={
                      touched.binance?.binance_secretkey &&
                      errors.binance?.binance_secretkey
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
              ) : (
                <></>
              )}
              <Box>
                <Checkbox
                  onClick={() => {
                    setIsPaystackCheckBoxActive(!isPaystackCheckBoxActive);

                    values.paystack.paystack_apikey = "";
                    values.paystack.paystack_publickey = "";
                  }}
                  color="success"
                />
                <span>Paystack Pay</span>
              </Box>
              {isPaystackCheckBoxActive && (
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Paystack API Key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.paystack.paystack_apikey}
                    name="paystack.paystack_apikey"
                    error={
                      touched.paystack?.paystack_apikey &&
                      !!errors.paystack?.paystack_apikey
                    }
                    helperText={
                      touched.paystack?.paystack_apikey &&
                      errors.paystack?.paystack_apikey
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Paystack Public Key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.paystack.paystack_publickey}
                    error={
                      touched.paystack?.paystack_publickey &&
                      !!errors.paystack?.paystack_publickey
                    }
                    helperText={
                      touched.paystack?.paystack_publickey &&
                      errors.paystack?.paystack_publickey
                    }
                    name="paystack.paystack_publickey"
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
              )}{" "}
              <Box>
                <Checkbox
                  onClick={() => {
                    setIsStripeCheckBoxActive(!isStripeCheckBoxActive);
                    if (!isStripeCheckBoxActive) {
                      // Clear form values when checkbox is unchecked
                      handleChange({
                        target: { name: "stripe.stripe_apikey", value: "" },
                      });
                    }
                    values.stripe.stripe_apikey = "";
                  }}
                  color="success"
                />
                <span>Stripe</span>
              </Box>
              {isStripeCheckBoxActive && (
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Stripe API Key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.stripe.stripe_apikey}
                    name="stripe.stripe_apikey"
                    error={
                      touched.stripe?.stripe_apikey &&
                      !!errors.stripe?.stripe_apikey
                    }
                    helperText={
                      touched.stripe?.stripe_apikey &&
                      errors.stripe?.stripe_apikey
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
              )}
              {/* Coinpayments Pay Checkbox and fields */}
              <Box>
                <Checkbox
                  onClick={() => {
                    setIsCoinpaymentsCheckBoxActive(
                      !isCoinpaymentsCheckBoxActive
                    );

                    values.coinpayment.coinpayment_apikey = "";
                    values.coinpayment.coinpayment_publickey = "";
                    values.coinpayment.coinpayment_merchantId = "";
                    values.coinpayment.coinpayment_ipnsecret = "";
                  }}
                  color="success"
                />
                <span>Coinpayments Pay</span>
              </Box>
              {isCoinpaymentsCheckBoxActive && (
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Coinpayments API Key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.coinpayment.coinpayment_apikey}
                    name="coinpayment.coinpayment_apikey"
                    error={
                      touched.coinpayment?.coinpayment_apikey &&
                      !!errors.coinpayment?.coinpayment_apikey
                    }
                    helperText={
                      touched.coinpayment?.coinpayment_apikey &&
                      errors.coinpayment?.coinpayment_apikey
                    }
                    sx={{ gridColumn: "span 2" }}
                  />

                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Coinpayments Public Key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    error={
                      touched.coinpayment?.coinpayment_publickey &&
                      !!errors.coinpayment?.coinpayment_publickey
                    }
                    helperText={
                      touched.coinpayment?.coinpayment_publickey &&
                      errors.coinpayment?.coinpayment_publickey
                    }
                    value={values.coinpayment.coinpayment_publickey}
                    name="coinpayment.coinpayment_publickey"
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Coinpayments Merchant Id"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.coinpayment.coinpayment_merchantId}
                    name="coinpayment.coinpayment_merchantId"
                    error={
                      touched.coinpayment?.coinpayment_merchantId &&
                      !!errors.coinpayment?.coinpayment_merchantId
                    }
                    helperText={
                      touched.coinpayment?.coinpayment_merchantId &&
                      errors.coinpayment?.coinpayment_merchantId
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Coinpayments Ipn secret"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.coinpayment.coinpayment_ipnsecret}
                    name="coinpayment.coinpayment_ipnsecret"
                    error={
                      touched.coinpayment?.coinpayment_ipnsecret &&
                      !!errors.coinpayment?.coinpayment_ipnsecret
                    }
                    helperText={
                      touched.coinpayment?.coinpayment_ipnsecret &&
                      errors.coinpayment?.coinpayment_ipnsecret
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  {/* Add other Coinpayments fields here */}
                </Box>
              )}
              {/* Now Payments Pay Checkbox and fields */}
              <Box>
                <Checkbox
                  onClick={() => {
                    setIsNowpaymentsCheckBoxActive(
                      !isNowpaymentsCheckBoxActive
                    );

                    values.nowpayment.nowpayment_apikey = "";
                    values.nowpayment.nowpayment_ipnsecret = "";
                  }}
                  color="success"
                />
                <span>Now Payments Pay</span>
              </Box>
              {isNowpaymentsCheckBoxActive && (
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Now Payments API Key"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nowpayment.nowpayment_apikey}
                    name="nowpayment.nowpayment_apikey"
                    error={
                      touched.nowpayment?.nowpayment_apikey &&
                      !!errors.nowpayment?.nowpayment_apikey
                    }
                    helperText={
                      touched.nowpayment?.nowpayment_apikey &&
                      errors.nowpayment?.nowpayment_apikey
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="Now Payments IPN Secret"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nowpayment.nowpayment_ipnsecret}
                    error={
                      touched.nowpayment?.nowpayment_ipnsecret &&
                      !!errors.nowpayment?.nowpayment_ipnsecret
                    }
                    helperText={
                      touched.nowpayment?.nowpayment_ipnsecret &&
                      errors.nowpayment?.nowpayment_ipnsecret
                    }
                    name="nowpayment.nowpayment_ipnsecret"
                    sx={{ gridColumn: "span 2" }}
                  />
                  {/* Add other Now Payments fields here */}
                </Box>
              )}
              <Box>
                <Checkbox
                  onClick={() =>
                    setIsCryptoCheckBoxActive(!isCryptoCheckBoxActive)
                  }
                  color="success"
                />
                <span>Crypto Address</span>
              </Box>
              {isCryptoCheckBoxActive && (
                <Box>
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="BTC Address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.crypto_address.btc_address}
                    name="crypto_address.btc_address"
                    error={
                      touched.crypto_address?.btc_address &&
                      !!errors.crypto_address?.btc_address
                    }
                    helperText={
                      touched.crypto_address?.btc_address &&
                      errors.crypto_address?.btc_address
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                  <TextField
                    fullWidth
                    variant="filled"
                    type="text"
                    label="USDT Address"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.crypto_address.usdt_address}
                    name="crypto_address.usdt_address"
                    error={
                      touched.crypto_address?.usdt_address &&
                      !!errors.crypto_address?.usdt_address
                    }
                    helperText={
                      touched.crypto_address?.usdt_address &&
                      errors.crypto_address?.usdt_address
                    }
                    sx={{ gridColumn: "span 2" }}
                  />
                </Box>
              )}
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button
                variant={isDeployLoading ? "outlined" : "contained"}
                color="secondary"
                type="submit"
                disabled={isDeployLoading}
              >
                {isDeployLoading ? "Creating..." : "Create New Bot"}
              </Button>
              <Dialog open={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
                <DialogTitle>
                  {/* {deployStatus === "success"
                    ? "Bot Deployed Successfully"
                    : "Error Deploying Bot"} */}
                  Bot
                </DialogTitle>
                <DialogContent  >
                  {isCreating ? (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      // sx={{ color:colors.primary,backgroundColor:colors.primary}}
                      
                    >
                      <CircularProgress
                        color="success"
                        size={35}
                        value={29}
                        sx={{ variant:"outlined"}}
                       
                      />
                      <Typography variant="body1" sx={{ marginLeft: 2 }}>
                        Creating...
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body1">
                      {deployStatus === "success"
                        ? "Your bot has been deployed successfully\nGo to manage to see your bot details!"
                        : "There was an error deploying your bot."}
                    </Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setIsPopupOpen(false)}
                    sx={{ color: "green" }}
                  >
                    Close
                  </Button>
                </DialogActions>
              </Dialog>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

const initialValues = {
  name: "",
  description: "",
  adminId: "",
  twoweeks_price: "",
  onemonth_price: "",
  lifetime_price: "",
  groupchatId: "",
  customersupport_telegram: "",
  success_url: "",
  binance: {
    binance_apikey: "",
    binance_secretkey: "",
  },
  paystack: {
    paystack_apikey: "",
    paystack_publickey: "",
  },
  telegram: {
    telegram_apikey: "",
  },
  stripe: {
    stripe_apikey: "",
  },
  coinpayment: {
    coinpayment_apikey: "",
    coinpayment_publickey: "",
    coinpayment_merchantId: "",
    coinpayment_ipnsecret: "",
  },
  nowpayment: {
    nowpayment_apikey: "",
    nowpayment_ipnsecret: "",
  },
  crypto_address: {
    btc_address: "",
    usdt_address: "",
  },
  subscription_benefits:"Exclusive VIP Group access⚡️"
  
};

export default Deploy;
