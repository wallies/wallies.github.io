module.exports = function(casper, scenario, vp) {
  casper.echo( 'Clicking button to show menu' );
  if (vp.name === 'phone') {
    casper.click('.notepad-mobile-menu a');
    casper.wait(500);
  }
}
