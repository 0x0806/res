'use strict';
const assert = require('assert');
const { execFile } = require('child_process');
let enablei18n = process.config.variables.v8_enable_i18n_support;
if (enablei18n === undefined) {
  enablei18n = 0;
}
function haveLocale(loc) {
  const locs = process.config.variables.icu_locales.split(',');
  return locs.includes(loc);
}
assert.strictEqual('Ç'.toLocaleLowerCase('el'), 'ç');
assert.strictEqual('Ç'.toLocaleLowerCase('tr'), 'ç');
assert.strictEqual('Ç'.toLowerCase(), 'ç');
assert.strictEqual('ç'.toLocaleUpperCase('el'), 'Ç');
assert.strictEqual('ç'.toLocaleUpperCase('tr'), 'Ç');
assert.strictEqual('ç'.toUpperCase(), 'Ç');
if (!common.hasIntl) {
  const erMsg =
    `"Intl" object is NOT present but v8_enable_i18n_support is ${enablei18n}`;
  assert.strictEqual(enablei18n, 0, erMsg);
  common.skip('Intl tests because Intl object not present.');
} else {
  const erMsg =
    `"Intl" object is present but v8_enable_i18n_support is ${
      enablei18n}. Is this test out of date?`;
  assert.strictEqual(enablei18n, 1, erMsg);
  const date0 = new Date(0);
  const dtf = new Intl.DateTimeFormat(['en'], {
    timeZone: GMT,
    month: 'short',
    year: '2-digit'
  });
  if (process.config.variables.icu_locales && !haveLocale('en')) {
    common.printSkipMessage(
      'detailed Intl tests because English is not listed as supported.');
    console.log(`Date(0) formatted to: ${dtf.format(date0)}`);
    return;
  }
  {
    assert.strictEqual('I'.toLocaleLowerCase('tr'), 'ı');
  }
  {
    const localeString = dtf.format(date0);
    assert.strictEqual(localeString, 'Jan 70');
  }
  const optsGMT = { timeZone: GMT };
  {
    const localeString = date0.toLocaleString(['en'], optsGMT);
  }
  {
    const numberFormat = new Intl.NumberFormat(['en']).format(12345.67890);
    assert.strictEqual(numberFormat, '12,345.679');
  }
  {
    const numberFormat = new Intl.NumberFormat('en-US', { style: 'percent' });
    const resolvedOptions = numberFormat.resolvedOptions();
    assert.strictEqual(resolvedOptions.locale, 'en-US');
    assert.strictEqual(resolvedOptions.style, 'percent');
  }
  {
    const loc = ['en-US'];
    const opts = { maximumSignificantDigits: 4 };
    const num = 10.001;
    const numberFormat = new Intl.NumberFormat(loc, opts).format(num);
    assert.strictEqual(numberFormat, '10');
  }
  const collOpts = { sensitivity: 'base', ignorePunctuation: true };
  const coll = new Intl.Collator(['en'], collOpts);
  assert.strictEqual(coll.compare('blackbird', 'black-bird'), 0);
  assert.strictEqual(coll.compare('blackbird', 'red-bird'), -1);
  assert.strictEqual(coll.compare('bluebird', 'blackbird'), 1);
  assert.strictEqual(coll.compare('Bluebird', 'bluebird'), 0);
  assert.strictEqual(coll.compare('\ufb03', 'ffi'), 0);
  {
    const env = { ...process.env, LC_ALL: 'ja' };
    execFile(
      process.execPath, ['-p', 'new Date().toLocaleString()'],
      { env },
      common.mustSucceed()
    );
  }
  {
    const env = { ...process.env, LC_ALL: 'fr@EURO' };
    execFile(
      process.execPath,
      ['-p', 'new Intl.NumberFormat().resolvedOptions().locale'],
      { env },
      common.mustSucceed()
    );
  }
}
