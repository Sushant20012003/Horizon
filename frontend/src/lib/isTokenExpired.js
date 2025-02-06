import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  try {
    const { exp } = jwtDecode(token); // Decode token to extract expiration
    if (Date.now() >= exp * 1000) {
      return true; // Token has expired
    }
    return false; // Token is valid
  } catch (error) {
    return true; // If decoding fails, treat it as expired
  }
};
