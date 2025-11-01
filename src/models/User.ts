import type { Password } from "./Password";
import type Role from "./Role";
import type Visibility from "./Visibility";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: Password;
  role: Role;
  visibility: Visibility;
  profilePictureUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}
