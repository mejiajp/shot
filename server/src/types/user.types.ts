export interface CreateUserInput {
  username: string;
  password: string;
  role: "ADMIN" | "BASIC";
}
