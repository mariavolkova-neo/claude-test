export type UserRole = "admin" | "manager" | "member" | "viewer";
export type UserStatus = "active" | "inactive" | "pending";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  title?: string;
  division?: string;
  pronouns?: string;
  timezone?: string;
  preferredLanguages: string[];
  status: UserStatus;
  role: UserRole;
  about?: string;
  avatarUrl?: string;
  contentLicenses: string[];
  tags: string[];
  loginId?: string;
  createdAt: string;
}
