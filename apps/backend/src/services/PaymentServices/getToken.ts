import axios from "axios";
import AppError from "../../errors/AppError";

export const getToken = async () => {
  const options = {
    method: "POST",
    url: "https://accept.paymob.com/api/auth/tokens",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      api_key: process.env.PAYMOB_API_KEY,
    },
  };
  try {
    const response = await axios(options);
    return response.data.token;
  } catch (error) {
    throw new AppError("Failed to get Paymob auth token");
  }
};
