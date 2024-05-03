import { LoginProps } from "../store/interfaces/user.interface";
import { Checkbox } from "flowbite-react";
import { Form, Formik } from "formik";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { BASE_URL } from "../../config/config";
import {
  Box,
  Button,
  FormControlLabel,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
// import { AuthContext } from "../store/interfaces/auth";

export const loadUser = async (token: any) => {
  try {
    const response = await fetch(`${BASE_URL}/users/user/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
    });

    if (response.status !== 200) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await response.json();
    localStorage.setItem("userId", userData.id);
    localStorage.setItem("firstName", userData.firstName);
    localStorage.setItem("lastName", userData.lastName);
    localStorage.setItem("isVerified", "True");
    return true;
  } catch (error) {
    console.error(error);

    throw new Error("Failed to load user data" + error);
  }
};

const Login = () => {
  // const navigate = useNavigate();
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(""); // State for login error
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  // const { isLoggedIn, login, logout } = useContext(AuthContext);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required("Insert your email"),
    password: Yup.string().required("Insert your password"),
  });

  const login = async (credentials: LoginProps) => {
    try {
      const response = await fetch(BASE_URL + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      // setIsLoggedIn(true);
      return response.json();
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  const handleLogin = useCallback(async (props: LoginProps) => {
    try {
      setIsLoginLoading(true);
      const response = await login(props);
      if (response.access_token) {
        localStorage.setItem("token", response.access_token);
        await loadUser(response.access_token);
        navigate("/dashboard");
      } else {
        throw new Error("No access token");
      }
    } catch (error) {
      setLoginError("Login failed. Please check your credentials.");
      console.log(error);
    }
    setIsLoginLoading(false);
  }, []);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height={isMobile?"100vh":"90vh"}
      px={isMobile ? 0: 4}
      // marginBottom={"30px"}
    >
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="center"
        alignItems="center"
        height={isMobile?"100%%":"100%"}
        width="100%"
    
        marginTop={isMobile ? "-30vh" : undefined}
      >
        {!isMobile && (
          <Box
            display="flex"
            justifyContent="center"
            p={8}
            maxWidth="60%"
            flexDirection="column"
            marginBottom="10vh"
          >
            <Header
              title="TELEBOT SOLUTIONS"
              subtitle="Automate Your telegram Business"
            />
            <img
              src="/assets/icons/telegram.png"
              alt="login illustration"
              className="h-full"
              style={{ width: "90%", height: "auto" }}
            />
          </Box>
        )}
        {isMobile && (
          <Box
            display="flex"
            justifyContent="center"
            p={5}
            maxWidth="60%"
            flexDirection="column"
            marginBottom="10vh"
            marginLeft="25vw"
          >
            <Box display="flex" alignItems="center" justifyContent="flex-end">
              <img
                src="/assets/icons/telegram.png"
                alt="login illustration"
                className="h-full"
                style={{ width: "90%", height: "70%", marginRight: "20px" }}
              />
              <Header
                title="TELEBOT SOLUTIONS"
                subtitle="Automate Your telegram Business"
              />
            </Box>
          </Box>
        )}

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          width={isMobile ? "90%" : "30%"}
          bgcolor="#F8F8F8"
          borderRadius={20}
          p={3}
          // marginBottom={isMobile ? "37vh" : undefined} // Adjusted marginBottom
          marginTop={isMobile ? "-13vh" : undefined}
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            gap={isMobile ? -2 : 3}
            height={isMobile ? "50vh" : undefined}
            // marginBottom={isMobile?"30vh":undefined}
          >
            <Typography variant="h4" color="primary" fontWeight="bold">
              LOGIN
            </Typography>
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                handleLogin(values);
              }}
            >
              {({ errors, values, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2}>
                    <Typography variant="body1" color="#52525C" fontSize="xl">
                      Email
                    </Typography>
                    <TextField
                      variant="outlined"
                      type="email"
                      onChange={(e) => setFieldValue("email", e.target.value)}
                      placeholder="Your email address"
                      error={!!errors.email}
                      helperText={errors.email}
                      InputProps={{
                        sx: { color: "black" },
                      }}
                    />
                    <Typography variant="body1" color="#52525C" fontSize="xl">
                      Password
                    </Typography>
                    <TextField
                      variant="outlined"
                      type={showPassword ? "text" : "password"}
                      value={values.password}
                      placeholder={
                        showPassword ? "Enter your password" : "********"
                      }
                      onChange={(e) =>
                        setFieldValue("password", e.target.value)
                      }
                      error={!!errors.password}
                      helperText={errors.password}
                      InputProps={{
                        sx: { color: "black" },
                        endAdornment: (
                          <Button
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={
                              showPassword ? "Hide Password" : "Show Password"
                            }
                          >
                            {showPassword ? "Hide" : "Show"}
                          </Button>
                        ),
                      }}
                    />
                    <FormControlLabel
                      control={<Checkbox id="remember-me" />}
                      label="Remember Me"
                      sx={{ color: "black" }}
                    />
                    <Link to="/">Forgot Password?</Link>
                    <Button
                      variant={isLoginLoading ? "outlined" : "contained"}
                      color="primary"
                      type="submit"
                      disabled={isLoginLoading}
                    >
                      {isLoginLoading
                        ? "Loading..."
                        : loginError
                          ? loginError
                          : "Login"}
                    </Button>
                    <Typography variant="body1" color="#52525C">
                      Or login to your account using
                    </Typography>
                    <Box
                      display="flex"
                      gap={6}
                      justifyContent={isMobile ? "flex-end" : "center"} // Move to right on mobile
                      width={isMobile ? "100%" : undefined}
                      marginTop={isMobile?"-2vh":undefined}
                      marginLeft={isMobile?"-10vh":undefined}
                    >
                      <img
                        src="/assets/icons/google-icon.svg"
                        alt="Google Icon"
                        style={{ width: isMobile ? "25px" : "auto" }}
                      />
                      <img
                        src="/assets/icons/facebook-icon.svg"
                        alt="Facebook Icon"
                        style={{ width: isMobile ? "30px" : "auto" }}
                      />
                    </Box>
                  </Box>
                </Form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
