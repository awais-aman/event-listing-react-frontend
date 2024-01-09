import api from "./api";

export const login = async ({ email, password }) => {
  const response = await api.post("/login", { user: { email, password } });
  const token = response.headers.authorization;
  if (!token) {
    throw new Error("The server accepted the login but sent no session token.");
  }
  return token;
};

export const signup = ({ name, email, password, passwordConfirmation }) =>
  api.post("/signup", {
    user: { name, email, password, password_confirmation: passwordConfirmation },
  });

export const logout = async () => {
  try {
    await api.delete("/logout");
  } catch {
    // The token is discarded locally whatever the server says: a revoked or
    // expired session must not leave the user stuck signed in.
  }
};
