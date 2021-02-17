// For testing only
const _getRndInteger = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const makeRequestInContinue = (): void => {
  const _formData = new FormData();
  _formData.append('login', 'this.is.my.login');
  _formData.append('password', 'my.password');
  fetch(
    'https://postman-echo.com/post?query=some really long query that goes onto multiple lines so we can test what happens',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Special': 'dev-test',
        'X-others':
          'Another test with a very very long string just to see how it is render in the application and if it is all done',
      },
      body: JSON.stringify({ test: 'hello' }),
    },
  );

  // Request POST - Status 200 - Specific headers
  const _headers = new Headers();
  _headers.append('x-dev', 'test');
  _headers.append('Authorization', 'Bearer d6771f773b6862eec7ed068f472c9112f1612861163dfgjl5487s5ff45sf557g8g');
  _headers.append('Cookie', 'Cookie_1=value; __cfduid=d6771f773b6862eec7ed068f472c9112f1612861163');

  const _requestOptions = {
    method: 'POST',
    headers: _headers,
    redirect: 'follow',
    body: _formData,
  };

  fetch('https://run.mocky.io/v3/c67ffc95-67ff-42ef-975d-c744020696da', _requestOptions).catch((error) =>
    console.log('error', error),
  );

  // Test long request - to see if request continue in background and correctly displayed when go back in the app
  fetch('https://www.mocky.io/v2/5185415ba171ea3a00704eed?mocky-delay=20s').catch((e) => console.error(e));

  // Send requests periodically
  setInterval(() => {
    const key: number = _getRndInteger(1, 4);
    let url: string = '';
    switch (key) {
      case 1:
        // Mock StatusCode 200
        // (delete link: https://designer.mocky.io/manage/delete/1a2d092a-42b2-4a89-a44f-267935dc13e9/BIMk8qNoP2zMvZtx6yQ3u9yGsWoK1g8HyYxO)
        url = 'https://run.mocky.io/v3/1a2d092a-42b2-4a89-a44f-267935dc13e9';
        break;
      case 2:
        // Mock StatusCode 302
        // (delete link: https://designer.mocky.io/manage/delete/7ee3fd63-f862-435f-8557-5de3e3d2fa91/4QPNsmOER7ghGDFKPWyIFvNAvGPysyYxkBi2)
        url = 'https://run.mocky.io/v3/7ee3fd63-f862-435f-8557-5de3e3d2fa91';
        break;
      case 3:
        // Mock StatusCode 400
        // (delete link: https://designer.mocky.io/manage/delete/d810eeaf-26ef-46fc-8e44-79c7df25d268/Rqq8qeKviPA80JI0ujlVJBZtbhRkNPBHYY2U)
        url = 'https://run.mocky.io/v3/d810eeaf-26ef-46fc-8e44-79c7df25d268';
        break;
      default:
        // Mock StatusCode 500
        // (delete link: https://designer.mocky.io/manage/delete/cea80db8-5848-4ef6-bb05-9c0a1d0971d0/MYZJzMDfg2GxA7jTbrXlbIK0lTzC1rU5U0Mh)
        url = 'https://run.mocky.io/v3/cea80db8-5848-4ef6-bb05-9c0a1d0971d0';
        break;
    }
    //console.log(url);
    fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    }).catch((e) => console.log(e));
  }, 2000);
};
