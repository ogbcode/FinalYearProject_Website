import { Auth } from "src/modules/auth/entities/auth.entity";

export interface UserProps {
  id?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  auth: Auth;
}
