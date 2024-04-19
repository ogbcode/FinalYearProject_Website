

export interface UserStateProps {
  id?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  auth?: AuthProps;
}

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
    id?: string;
    firstName?: string;
    middleName?: string;
    lastName?: string;
  }


