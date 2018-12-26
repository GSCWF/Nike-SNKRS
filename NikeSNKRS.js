// We'll use Puppeteer is our browser automation framework.
const puppeteer = require('puppeteer');
var jsdom = require('jsdom');
$ = require('jquery')(new jsdom.JSDOM().window);

// This is where we'll put the code to get around the tests.
const preparePageForTests = async (page) => {
    // Pass the User-Agent Test.
      const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)' +
      'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
      await page.setUserAgent(userAgent);

      // Pass the Webdriver Test.
      await page.evaluateOnNewDocument(() => {
          Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
          });
      });

      // Pass the Chrome Test.
      await page.evaluateOnNewDocument(() => {
      // We can mock this in as much depth as we need for the test.
      window.navigator.chrome = {
        runtime: {},
        // etc.
      };
    });

    // Pass the Permissions Test.
      await page.evaluateOnNewDocument(() => {
      const originalQuery = window.navigator.permissions.query;
      return window.navigator.permissions.query = (parameters) => (
        parameters.name === 'notifications' ?
          Promise.resolve({ state: Notification.permission }) :
          originalQuery(parameters)
      );
    });

    // Pass the Plugins Length Test.
      await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'plugins', {
        // This just needs to have `length > 0` for the current test,
        // but we could mock the plugins too if necessary.
        get: () => [1, 2, 3, 4, 5],
      });
    });

    // Pass the Languages Test.
      await page.evaluateOnNewDocument(() => {
      // Overwrite the `plugins` property to use a custom getter.
      Object.defineProperty(navigator, 'languages', {
        get: () => ['en-US', 'en'],
      });
    });
  }


  (async () => {
    // Launch the browser in headless mode and set up a page.
    const browser = await puppeteer.launch({
      args: ['--disable-features=site-per-process'],
      headless: false,
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1240, height: 720 });
    // Prepare for the tests (not yet implemented).
    await preparePageForTests(page);

    // Navigate to the page that will perform the tests.
    const Url = 'https://www.nike.com/launch/t/vandal-high-john-elliott-black/';
    await page.goto(Url,{waitUntil: 'networkidle2'});

    await page.waitForSelector('#root > div > div > div.main-layout > div > div:nth-child(3) > div.pdp-container.ncss-col-sm-12.full > div > div:nth-child(3) > section > div > img');

    await page.evaluate(() => {
      let elements = document.getElementsByClassName('size-grid-dropdown size-dropdown-button-css');
      for (let element of elements)
          element.click();
    });
    await page.waitFor(200);
    await page.evaluate(() => {
       document.querySelector('button.size-grid-dropdown.size-grid-button').click();
    });
    await page.waitFor(200);
    await page.evaluate(() => {
      document.querySelector('button.ncss-brand.ncss-btn-black.pb3-sm.prl5-sm.pt3-sm.u-uppercase.u-full-width').click();
    });

    await page.waitFor(200);
    await page.goto('https://www.nike.com/cart',{waitUntil: 'networkidle2'});
    await page.waitFor(250);
    await page.goto('https://www.nike.com/us/en/checkout');

    await page.waitForSelector('#phoneNumber');
    //first name
    await page.focus('#firstName');
    await page.type('#firstName', 'Steve', {delay: 5});
    //last name
    await page.waitFor(100);
    await page.focus('#lastName');
    await page.type('#lastName', 'Smith', {delay: 5});
    //address
    await page.waitFor(100);
    await page.focus('#address1');
    await page.type('#address1', '11111 Test Street', {delay: 5});
    //City #city
    await page.waitFor(100);
    await page.focus('#city');
    await page.type('#city', 'Naples', {delay: 5});
    //State
    await page.select('#state', 'FL');
    //Zip Code #postalCode
    await page.waitFor(100);
    await page.focus('#postalCode');
    await page.type('#postalCode', '12345', {delay: 5});
    //Email #email
    await page.waitFor(100);
    await page.focus('#email');
    await page.type('#email', 'testemail@email.com', {delay: 5});
    //phone number #phoneNumber
    await page.waitFor(100);
    await page.focus('#phoneNumber');
    await page.type('#phoneNumber', '239-123-1234', {delay: 5});

    await page.click('#shipping > div > div > div > form > div > div > div > div.ncss-col-sm-12.mt5-sm.ncss-col-md-offset-6.ncss-col-md-6.va-sm-t.ta-sm-r > button');
    await page.waitFor(150);
    await page.click('#shipping > div > div > div > div.ncss-col-sm-12.ncss-col-md-12.pb5-sm.prl5-sm.va-sm-t.ta-sm-r > button');
    await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.3.1.slim.min.js'});

    await page.waitFor(2000);

    await page.evaluate(() => {
      window.onload = function () {

      }
   });
    /*
    window.onload = function () {
	var iframeWin = document.getElementById("da-iframe").contentWindow,
		form = document.getElementById("the-form"),
		myMessage = document.getElementById("my-message");

	myMessage.select();

	form.onsubmit = function () {
		iframeWin.postMessage(myMessage.value, "https://robertnyman.com");
		return false;
	};
};
    function displayMessage (evt) {
	var message;
	if (evt.origin !== "https://robertnyman.com") {
		message = "You are not worthy";
	}
	else {
		message = "I got " + evt.data + " from " + evt.origin;
	}
	document.getElementById("received-message").innerHTML = message;
}

if (window.addEventListener) {
	// For standards-compliant web browsers
	window.addEventListener("message", displayMessage, false);
}
else {
	window.attachEvent("onmessage", displayMessage);
}
    //'#creditCardNumber'
    //await credit_card_number.type('1234', {delay: 5});
    //input#creditCardNumber.mod-ncss-input.ncss-input.pt2-sm.pr4-sm.pb2-sm.pl4-sm*/
  })();
