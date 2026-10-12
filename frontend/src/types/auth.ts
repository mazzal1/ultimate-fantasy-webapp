export interface AuthUser {
  id: string;
  username: string;
  email?: string;
  groups: string[];
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignUpPayload extends SignInPayload {
  email: string;
}

export interface ConfirmSignUpPayload {
  username: string;
  confirmationCode: string;
}
