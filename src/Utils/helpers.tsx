export const getTime = (date: number): string => {
  // iOS need a string, Android need a number
  const _date = new Date(date);
  const _minutes = _date.getMinutes();
  const _hours = _date.getHours();
  const _seconds = _date.getSeconds();
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
  if (status >= 200 && status < 300) return 'green';
  if (status >= 300 && status < 400) return 'orange';
  return 'red';
};

export const duration = (startTime: number, endTime: number): number => {
  return endTime - startTime;
};
