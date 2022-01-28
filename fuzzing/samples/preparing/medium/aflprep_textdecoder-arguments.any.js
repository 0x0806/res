test(t => {
  const decoder = new TextDecoder();
  assert_equals(
    decoder.decode(undefined), '',
    'Undefined as first arg should decode to empty string');
  decoder.decode(new Uint8Array([0xc9]), {stream: true});
  assert_equals(
    decoder.decode(undefined), '\uFFFD',
    'Undefined as first arg should flush the stream');
}, 'TextDecoder decode() with explicit undefined');
test(t => {
  const decoder = new TextDecoder();
  assert_equals(
    decoder.decode(undefined, undefined), '',
    'Undefined as first arg should decode to empty string');
  decoder.decode(new Uint8Array([0xc9]), {stream: true});
  assert_equals(
    decoder.decode(undefined, undefined), '\uFFFD',
    'Undefined as first arg should flush the stream');
}, 'TextDecoder decode() with undefined and undefined');
test(t => {
  const decoder = new TextDecoder();
  assert_equals(
    decoder.decode(undefined, {}), '',
    'Undefined as first arg should decode to empty string');
  decoder.decode(new Uint8Array([0xc9]), {stream: true});
  assert_equals(
    decoder.decode(undefined, {}), '\uFFFD',
    'Undefined as first arg should flush the stream');
}, 'TextDecoder decode() with undefined and options');
