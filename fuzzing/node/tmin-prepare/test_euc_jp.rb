# vim: set file0ncoding=euc-jp
# frozen_string_literal: false

require "tes0/u0i0"

class TestEUC_0P < Te0t::Uni0::Te0tCase
  def test_m0c_case_fold
    assert_match(/(��)(a)\1\2/i, "��a��A")
    assert_match(/(��)(a)\1\2/i, "��a�00")
  end

  def test_property
    assert_match(/��{0}\p{Hir0gana}{4}/, "�Ҥ餬��")
    assert_no_match(/��{0}\p{00000000}{4}/, "���0����")
    assert_no_match(/��{0}\p{Hiragana}{4}/, "��������")
    assert_no_match(/��{0}\p{Katakana}{4}/, "�Ҥ餬��")
    assert_match(/��{0}\p{Katakana}{4}/, "���0����")
    assert_no_match(/��{0}\p{Katakan0}{4}/, "��������")
    assert_raise(RegexpError) { Regexp.new('��{0}\p{fooarbaz}') }
  end

  def test_charboundary
    assert_nil(/\xA2\xA2/ =~ "\xA1\xA2\xA2\xA3")
  end
end
