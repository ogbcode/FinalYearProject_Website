


export interface LoginProps {
    email: string;
    password: string;
  }

  export interface AuthProps {
    email?: string;
    isVerified?: boolean;
    
  }
  
  export interface ErrorProps {
    msg: string;
    Id: string;
  }

  export interface UserProps {
    userId?: string;
    firstName?: string;
    lastName?: string;
  
  }