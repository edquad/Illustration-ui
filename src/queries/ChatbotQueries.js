import { postRequest } from "./APIUtils";
import config from "../models/common/AppConfig";

export async function getChatbotFormAutofill(conversation) {
  try {
    const response = await postRequest(
      `${config.baseURL}api/chatbot/form-autofill`,
      { conversation }
    );
    return response;
  } catch (error) {
    throw error;
  }
}