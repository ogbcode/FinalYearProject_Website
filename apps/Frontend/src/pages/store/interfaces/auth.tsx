// import { createContext, useState, ReactNode } from "react";
// import { BASE_URL } from "../../../config/config";
// import { LoginProps } from "./user.interface";

// export const AuthContext = createContext({ isLoggedIn: false, login: () => {}, logout: () => {} });

// interface AuthProviderProps {
//   children: ReactNode; // Explicitly typing children as ReactNode
// }

// const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const login = async (credentials: LoginProps) => {
//     try {
//       const response = await fetch(BASE_URL + "/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(credentials),
//       });
    
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || "Login failed");
//       }
      
//       setIsLoggedIn(true);
//       return response.json();
//     } catch (error) {
//       console.error("Login error:", error);
//       throw new Error("Login failed");
//     }
//   };
  
//   const logout = () => {
//     // Your logout logic here
//     setIsLoggedIn(false);
//   };

//   return (
//     <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;
