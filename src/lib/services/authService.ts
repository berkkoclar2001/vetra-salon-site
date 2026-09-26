import { LoginCredentials, LoginResponse } from "@/types";

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 10));

  if (credentials.username === "admin" && credentials.password === "123456") {
    return {
      success: true,
      token: "mock-jwt-token-admin-123",
      user: { id: 1, username: "admin", role: "admin" },
    };
  }

  if (credentials.username === "personel" && credentials.password === "123456") {
    return {
      success: true,
      token: "mock-jwt-token-staff-456",
      user: { id: 2, username: "personel", role: "staff" },
    };
  }

  throw new Error("Kullanıcı adı veya şifre hatalı!");
};
