import { getTime, getDate, identifier, setColor, duration } from '../helpers';

describe('Index test suite', () => {
  // Test getTime
  it('should return 18:3:44 if unixtime number is 1612976624143', () => {
    const date: number = 1612976624143;
    expect(getTime(date)).toBe('18:3:44');
  });

  // Test getDate
  it('should return Wed Feb 10 2021 18:03:44 GMT+0100 (Central European Standard Time) if unixtime number is 1612976624145', () => {
    const date: number = 1612976624145; // unixtime
    expect(getDate(date)).toBe(
      'Wed Feb 10 2021 18:03:44 GMT+0100 (Central European Standard Time)'
    );
  });

  // Test identifier generator
  it('should return 18:3:44:33 if unixtime number is 1612976624143 and id=33', () => {
    const date: number = 1612976624145; // unixtime
    const id: number = 33;
    expect(identifier(date, id)).toBe('18:3:44:33');
  });

  // Tests setColor
  it('should return #aed581 if status=200', () => {
    const status: number = 200;
    expect(setColor(status)).toBe('#aed581');
  });

  it('should return #aed581 if status=299', () => {
    const status: number = 299;
    expect(setColor(status)).toBe('#aed581');
  });

  it('should return #ffca28 if status=300', () => {
    const status: number = 300;
    expect(setColor(status)).toBe('#ffca28');
  });

  it('should return #ffca28 if status=399', () => {
    const status: number = 399;
    expect(setColor(status)).toBe('#ffca28');
  });

  it('should return #ef5350 if status=400', () => {
    const status: number = 400;
    expect(setColor(status)).toBe('#ef5350');
  });

  it('should return #ef5350 if status=500', () => {
    const status: number = 500;
    expect(setColor(status)).toBe('#ef5350');
  });

  it('should return #ef5350 if status=0', () => {
    const status: number = 0;
    expect(setColor(status)).toBe('#ef5350');
  });

  it('should return #ef5350 if status=199', () => {
    const status: number = 199;
    expect(setColor(status)).toBe('#ef5350');
  });

  it('should return #ef5350 if status=999', () => {
    const status: number = 999;
    expect(setColor(status)).toBe('#ef5350');
  });

  it('should return #ef5350 if status is not specified', () => {
    expect(setColor()).toBe('#ef5350');
  });

  //Test duration
  it('should return 1000000 if startTime=1612976624145 and endTime=1612977624145', () => {
    const startTime: number = 1612976624145;
    const endTime: number = 1612977624145;
    expect(duration(startTime, endTime)).toBe(1000000);
  });
});
