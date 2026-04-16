import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  exp: number;
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};
