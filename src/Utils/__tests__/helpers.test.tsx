import { getTime, getDate, identifier, setColor, duration } from '../helpers';

describe('Index test suite', () => {
  // Test getTime
  it('should return 17:3:44 if unixtime number is 1612976624143', () => {
    const date: number = 1612976624143;
    expect(getTime(date)).toBe('17:3:44');
  });

  // Test getDate
  it('should return Wed, 10 Feb 2021 17:03:44 GMT if unixtime number is 1612976624145', () => {
    const date: number = 1612976624145; // unixtime
    expect(getDate(date)).toBe('Wed, 10 Feb 2021 17:03:44 GMT');
  });

  // Test identifier generator
  it('should return 17:3:44:33 if unixtime number is 1612976624143 and id=33', () => {
    const date: number = 1612976624145; // unixtime
    const id: number = 33;
    expect(identifier(date, id)).toBe('17:3:44:33');
  });

  // Tests setColor
  it('should return green if status=200', () => {
    const status: number = 200;
    expect(setColor(status)).toBe('green');
  });

  it('should return green if status=299', () => {
    const status: number = 299;
    expect(setColor(status)).toBe('green');
  });

  it('should return orange if status=300', () => {
    const status: number = 300;
    expect(setColor(status)).toBe('orange');
  });

  it('should return orange if status=399', () => {
    const status: number = 399;
    expect(setColor(status)).toBe('orange');
  });

  it('should return red if status=400', () => {
    const status: number = 400;
    expect(setColor(status)).toBe('red');
  });

  it('should return red if status=500', () => {
    const status: number = 500;
    expect(setColor(status)).toBe('red');
  });

  it('should return red if status=0', () => {
    const status: number = 0;
    expect(setColor(status)).toBe('red');
  });

  it('should return red if status=199', () => {
    const status: number = 199;
    expect(setColor(status)).toBe('red');
  });

  it('should return red if status=999', () => {
    const status: number = 999;
    expect(setColor(status)).toBe('red');
  });

  it('should return red if status is not specified', () => {
    expect(setColor()).toBe('red');
  });

  //Test duration
  it('should return 1000000 if startTime=1612976624145 and endTime=1612977624145', () => {
    const startTime: number = 1612976624145;
    const endTime: number = 1612977624145;
    expect(duration(startTime, endTime)).toBe(1000000);
  });
});
