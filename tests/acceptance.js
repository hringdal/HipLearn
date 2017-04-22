/* eslint-env mocha */
/* eslint-disable func-names, prefer-arrow-callback */

/* globals browser assert server */
function countLists() {
  browser.waitForExist('.header');
  const elements = browser.elements('.header');
  return elements.value.length;
}
describe('header', function () {
  beforeEach(function () {
    browser.url('http://localhost:3000');
    // server.call('generateFixtures');
  });
  it('can create a list @watch', function () {
    const initialCount = countLists();
    browser.click('.header');
    assert.equal(countLists(), initialCount + 1);
  });
});
