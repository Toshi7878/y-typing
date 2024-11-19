import { Dispatch } from "react";

export const handleKeyDown = (
  event: KeyboardEvent,
  videoId: string | null,
  setPreviewVideoId: Dispatch<string | null>,
) => {
  if (event.key === "Escape") {
    if (videoId) {
      setPreviewVideoId(null);
    }
  }
};
