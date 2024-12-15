import { RouterOutPuts } from "@/server/api/trpc";
import axios from "axios";

export async function sendUpdateData(
  updateData: RouterOutPuts["userOption"]["getUserTypingOptions"],
) {
  try {
    const response = await axios.post("/api/update-typing-option", updateData);
  } catch (error) {
    console.error("Error sending update data:", error);
  }
}
