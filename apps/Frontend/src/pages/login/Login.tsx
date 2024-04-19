import { LoginProps } from "../store/interfaces/user.interface";
import { Checkbox } from "flowbite-react";
import { Form, Formik } from "formik";
import { useCallback, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { BASE_URL } from "../../config/config";
import {
  Button,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Header from "../../components/Header";
// import { AuthContext } from "../store/interfaces/auth";


const Login = () => {
  // const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  // const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  // const { isLoggedIn, login, logout } = useContext(AuthContext);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required("Insert your email"),
    password: Yup.string().required("Insert your password"),
  });
 

  const loadUser = async (token: string) => {
    try {
      const response = await fetch(`${BASE_URL}/users/user/verify`, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token,
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to fetch user data');
      }
      
      
      const userData = await response.json();
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('firstName', userData.firstName);
      localStorage.setItem('lastName', userData.lastName);
      return { message: 'success' };
    } catch (error) {
      console.error(error);
      throw new Error('Failed to load user data'+error);
    }
  };

  
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
  
  const handleLogin = useCallback(
    async (props: LoginProps) => {
      try {
        setIsLoginLoading(true);
        const response = await login(props);
        if (response.access_token) {
          localStorage.setItem("token", response.access_token);
          await loadUser(response.access_token)
          navigate("/dashboard");
        } else {
          throw new Error("No access token");
        }
      } catch (error) {
        console.log(error);
      }
      setIsLoginLoading(false);
    },
    []
  );
  


  return (
    <Grid
    
      container
      justifyContent="center"
      alignItems="center"
      height="20vh"
      width="98vw"
      px={4}
    >
      <Grid
        container
        item
        direction="row"
        justifyContent="center"
        alignItems="center"
        height="100%"
        width="95%"
      >
        <Grid
         direction="row"
          item
          md={6}
          justifyContent="center"
          display={{ xs: "none", md: "flex" }}
          p={8}
        >
          <Header
            title="TELEBOT SOLUTIONS"
            subtitle="Automate Your telegram Business"
          />
          <img
            src="/assets/icons/telegram.png"
            alt="login illustration"
            className="h-full"
          />
        </Grid>
        <Grid  item xs={12} md={6} display="flex" justifyContent="center">
          <Grid
            container
            item
            direction="column"
            justifyContent="center"
            width="100%"
            maxWidth="70%"
            gap={8}
            bgcolor="#F8F8F8"
            borderRadius={20}
            p={8}
            // height="60vh"
          >
            <Typography variant="h4" color="primary" fontWeight="bold">
              Login
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
                  <Grid container direction="column" gap={6}>
                    <div>
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
                          sx: { color: "black" }, // Set the text color to blue
                        }}
                      />
                    </div>
                    <div>
                      <Typography variant="body1" color="#52525C" fontSize="xl">
                        Password
                      </Typography>
                      <TextField
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        value={values.password}
                        // sx={{ color: colors.greenAccent[300] }}
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
                    </div>
                    <FormControlLabel
                      control={<Checkbox id="remember-me" />}
                      label="Remember Me"
                      sx={{ color: "black" }} // Set the text color to black
                    />
                    <Link to="/">Forgot Password?</Link>
                    <Button
                      variant={isLoginLoading ? "outlined" : "contained"}
                      color="primary"
                      type="submit"
                      disabled={isLoginLoading}
                      onClick={() => handleLogin}
                    >
                      {isLoginLoading ? "Loading..." : "Login"}
                    </Button>
                    <Typography variant="body1" color="#52525C">
                      Or login to your account using
                    </Typography>
                    <Grid container item gap={8}>
                      <img
                        src="/assets/icons/google-icon.svg"
                        alt="Google Icon"
                      />
                      <img
                        src="/assets/icons/facebook-icon.svg"
                        alt="Facebook Icon"
                      />
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Login;
