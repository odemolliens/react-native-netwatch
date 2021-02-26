import { getTime, getShortDate, getDate, getStatus, duration } from '../helpers';

//Set jest to UTC if necessary
describe('Timezones', () => {
  it('should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});

describe('Index test suite', () => {
  // Test getTime
  it('should return 17:03:44 if unixtime number is 1612976624143', () => {
    const date: number = 1612976624143;
    expect(getTime(date)).toBe('17:03:44');
  });

  // Test getShortTime
  it('should return 10/02/2021 if unixtime number is 1612976624145', () => {
    const date: number = 1612976624145;
    expect(getShortDate(date)).toBe('10/02/2021');
  });

  // Test getDate
  it('should return Wed Feb 10 2021 17:03:44 GMT+0000 (Coordinated Universal Time) if unixtime number is 1612976624145', () => {
    const date: number = 1612976624145; // unixtime
    expect(getDate(date)).toBe('Wed Feb 10 2021 17:03:44 GMT+0000 (Coordinated Universal Time)');
  });

  // Tests getStatus
  it('should return SUCCESS if status=200', () => {
    const status: number = 200;
    expect(getStatus(status)).toBe('SUCCESS');
  });

  it('should return SUCCESS if status=299', () => {
    const status: number = 299;
    expect(getStatus(status)).toBe('SUCCESS');
  });

  it('should return WARNING if status=300', () => {
    const status: number = 300;
    expect(getStatus(status)).toBe('WARNING');
  });

  it('should return WARNING if status=399', () => {
    const status: number = 399;
    expect(getStatus(status)).toBe('WARNING');
  });

  it('should return FAILED if status=400', () => {
    const status: number = 400;
    expect(getStatus(status)).toBe('FAILED');
  });

  it('should return FAILED if status=500', () => {
    const status: number = 500;
    expect(getStatus(status)).toBe('FAILED');
  });

  it('should return FAILED if status=0', () => {
    const status: number = 0;
    expect(getStatus(status)).toBe('FAILED');
  });

  it('should return FAILED if status=199', () => {
    const status: number = 199;
    expect(getStatus(status)).toBe('FAILED');
  });

  it('should return FAILED if status=999', () => {
    const status: number = 999;
    expect(getStatus(status)).toBe('FAILED');
  });

  it('should return FAILED if status is not specified', () => {
    expect(getStatus()).toBe('FAILED');
  });

  //Test duration
  it('should return 1000000 if startTime=1612976624145 and endTime=1612977624145', () => {
    const startTime: number = 1612976624145;
    const endTime: number = 1612977624145;
    expect(duration(startTime, endTime)).toBe(1000000);
  });
});
