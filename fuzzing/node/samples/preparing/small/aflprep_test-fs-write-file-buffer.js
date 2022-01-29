'use strict';
const join = require('path').join;
const util = require('util');
const fs = require('fs');
let data = [
  '2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4e',
  'BAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkK',
  'FhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1',
  'dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXG',
  'AxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRom',
  'JygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOE',
  'hYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU',
  'Tjq24nJPXNVtO0KATRvNHCIg3zoWJWQHqp+o4pun+EtJ0zxBq8mnLJa2d1L5',
data = data.join('\n');
tmpdir.refresh();
const buf = Buffer.from(data, 'base64');
fs.writeFileSync(join(tmpdir.path, 'test.jpg'), buf);
util.log('Done!');
