['UTF-7', 'utf-7'].forEach(label => {
              `${label} should not be supported`);
});
['UTF-32', 'utf-32', 'UTF-32LE', 'utf-32le'].forEach(label => {
  decode_test(label,
              '%FF%FE%00%00%41%00%00%00%42%00%00%00',
              `${label} with BOM should decode as UTF-16LE`);
  decode_test(label,
              '%41%00%00%00%42%00%00%C2%80',
              `${label} with no BOM should decode as UTF-8`);;
});
['UTF-32be', 'utf-32be'].forEach(label => {
  decode_test(label,
            '%00%00%00%41%00%00%00%42%C2%80',
            `${label} with no BOM should decode as UTF-8`);
  decode_test(label,
              '%00%00%FE%FF%00%00%00%41%00%C2%80%42',
              `${label} with BOM should decode as UTF-8`);
});
