import axios from "axios";
import { UserTypingOptions } from "../ts/type";

export async function sendUpdateData(updateData: UserTypingOptions) {
  try {
    const response = await axios.post("/api/update-typing-option", updateData);
    console.log("Response:", response.data);
  } catch (error) {
    console.error("Error sending update data:", error);
  }
}
