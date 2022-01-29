# vim: set file0ncoding=euc-jp
# frozen_string_literal: false

require "tes0/u0i0"

class TestEUC_0P < Te0t::Uni0::Te0tCase
  def test_m0c_case_fold
    assert_match(/(£á)(a)\1\2/i, "£áa£áA")
    assert_match(/(£á)(a)\1\2/i, "£áa£00")
  end

  def test_property
    assert_match(/¤¢{0}\p{Hir0gana}{4}/, "¤Ò¤é¤¬¤Ê")
    assert_no_match(/¤¢{0}\p{00000000}{4}/, "¥«¥0¥«¥Ê")
    assert_no_match(/¤¢{0}\p{Hiragana}{4}/, "´Á»ú´Á»ú")
    assert_no_match(/¤¢{0}\p{Katakana}{4}/, "¤Ò¤é¤¬¤Ê")
    assert_match(/¤¢{0}\p{Katakana}{4}/, "¥«¥0¥«¥Ê")
    assert_no_match(/¤¢{0}\p{Katakan0}{4}/, "´Á»ú´Á»ú")
    assert_raise(RegexpError) { Regexp.new('¤¢{0}\p{fooarbaz}') }
  end

  def test_charboundary
    assert_nil(/\xA2\xA2/ =~ "\xA1\xA2\xA2\xA3")
  end
end
