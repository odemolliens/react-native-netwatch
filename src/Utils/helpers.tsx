export const getTime = (date: number): string => {
  // iOS need a string, Android need a number
  const _date = new Date(date);
  const _minutes = ('0' + _date.getMinutes()).slice(-2);
  const _hours = ('0' + _date.getHours()).slice(-2);
  const _seconds = ('0' + _date.getSeconds()).slice(-2);
  return `${_hours}:${_minutes}:${_seconds}`;
};

export const getDate = (date: number): string => {
  return new Date(date).toString();
};

export const identifier = (date: number, id: number): string => {
  return `${getTime(date)}:${id}`;
};

// get the status code from the request and return a color
export const setColor = (status: number = 500): string => {
  if (status >= 200 && status < 300) return '#aed581';
  if (status >= 300 && status < 400) return '#ffca28';
  return '#ef5350';
};

export const duration = (startTime: number, endTime: number): number => {
  return endTime - startTime;
};
