export const formatTime = (time: number): string => {
  const MM = ("00" + parseInt((time / 60).toString())).slice(-2);
  const SS = ("00" + parseInt((time % 60).toString())).slice(-2);

  return `${MM}:${SS}`;
};
