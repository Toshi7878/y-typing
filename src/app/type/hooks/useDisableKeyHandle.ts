const disableKeys = [
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "CapsLock",
  "Backquote",
  "F3",
  "F6",
  "Space",
];

export const useDisableKeyHandle = () => {
  return (event: KeyboardEvent) => {
    if (disableKeys.includes(event.code)) {
      event.preventDefault();
    }
  };
};
