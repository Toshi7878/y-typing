export const handleKeyDown = (
  event: KeyboardEvent,
  videoId: string | null,
  setVideoId: (id: string | null) => void,
) => {
  if (event.key === "Escape") {
    if (videoId) {
      setVideoId(null);
    }
  }
};
