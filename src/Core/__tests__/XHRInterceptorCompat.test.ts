const modernInterceptorPath = 'react-native/src/private/devsupport/devmenu/elementinspector/XHRInterceptor';

describe('XHRInterceptorCompat', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    jest.dontMock(modernInterceptorPath);
  });

  it('loads the interceptor from recent React Native versions', () => {
    const interceptor = { enableInterception: jest.fn() };
    jest.doMock(modernInterceptorPath, () => ({ default: interceptor }), { virtual: true });

    jest.isolateModules(() => {
      expect(require('../XHRInterceptorCompat').default).toBe(interceptor);
    });
  });

});
