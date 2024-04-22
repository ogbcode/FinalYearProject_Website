import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadUser } from "../login/Login";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const isAuthenticated = await loadUser(token);
          if (isAuthenticated) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("Error loading user:", error);
          navigate("/login", { replace: true });
        }
      } else {
        navigate("/login", { replace: true });
      }
    };

    checkUser();
  }, [navigate]);

  return <></>; // You can add content here if needed
};

export default HomePage;
