import axios from "../services/api";

const logout = async (token) => {
  try {
    await axios.delete("/logout", {
      headers: {
        Authorization: token,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};

export { logout };
