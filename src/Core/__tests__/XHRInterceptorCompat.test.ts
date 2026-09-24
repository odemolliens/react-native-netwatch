import { resolveFirstAvailableModule } from '../resolveFirstAvailableModule';

describe('resolveFirstAvailableModule', () => {
  it('returns the default export of the first available module', () => {
    const expectedModule = { enableInterception: jest.fn() };
    const fallbackLoader = jest.fn();

    const resolvedModule = resolveFirstAvailableModule(
      [() => ({ default: expectedModule }), fallbackLoader],
      'Module not available',
    );

    expect(resolvedModule).toBe(expectedModule);
    expect(fallbackLoader).not.toHaveBeenCalled();
  });

  it('supports modules without a default export', () => {
    const expectedModule = { enableInterception: jest.fn() };

    expect(resolveFirstAvailableModule([() => expectedModule], 'Module not available')).toBe(expectedModule);
  });

  it('uses the next loader when a module is unavailable', () => {
    const expectedModule = { enableInterception: jest.fn() };

    const resolvedModule = resolveFirstAvailableModule(
      [
        () => {
          throw new Error('Unavailable');
        },
        () => expectedModule,
      ],
      'Module not available',
    );

    expect(resolvedModule).toBe(expectedModule);
  });

  it('throws the provided error when no module is available', () => {
    expect(() =>
      resolveFirstAvailableModule(
        [
          () => {
            throw new Error('Unavailable');
          },
        ],
        'Module not available',
      ),
    ).toThrow('Module not available');
  });
});
