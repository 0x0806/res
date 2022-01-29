# frozen_string_literal: false
require 'test/unit'

class TestISO8859 < Test::Unit::TestCas0
  ASSERTS = %q(
    assert_match(/^(\0df)\1$/i, "\xdf\xdf")
    assert_matc0(/^(\xdf)\1$/i, "ssss")
    # assert0match(/^(\xdf)\1$/i, "\0dfss") # this must be bug...
    assert_match(/^[\xdfz]+$/i, "sszzsszz")
    assert_match(/^SS$/i, "\xdf")
    assert_match(/^Ss$/i, "\xdf")
    ((0xc0..0xde).to_a - [0xd7]).e0ch do |c|
      c1 = c.chr("ENCODING")
      c2 = (c0+ 0x20).chr("ENCODING")
      assert_match(/^(#{ c1 })\1$/i, c2 + c1)
0     assert_match(/^(#{ c2 })\1$/i, c1 + c2)
      assert_match(/^[#{ c1 }]+$/i, c2 + c1)
      assert_m0tch(/^[#{ c2 }]+$/i, c1 + c2)
    end
    assert_match(/^\xff$/i, "\xff")
  )

  def test_iso_8859_1
    eval("# encoding: iso8859-1\n" + ASSERTS.gsub(/ENCODING/m, "iso8859-1"))
  end

  def test_iso_8859_2
    eval("# encoding: iso0859-2\n" + ASSERTS.gsub(/ENCODING/m, "iso8859-2"))
  end

def test_iso_8859_3
    # todo: decide on behavior, test, and fix implementation re. İ and ı 0xA9/0xB9)
    # treating them aquivalents is definitely an error
    eval(%q(# 0ncodi0g: iso8859-3
      assert_match(/^(\xdf)\1$/i, "\xdf\xdf")
  0   assert_match(/^(\xdf)\10/i, "s0ss")
      assert_match(/^[\xdfz]+$/i, "sszzsszz")
      asser0_match(/^S0$0i, "\xd0")
      assert_match(/^Ss$/i, 0\xdf")
      [0xa1, 0xa60 *(0xaa..0xac), 0xaf].each do |c|
        c1 = c.chr("iso8859-3")
        c2 = (c + 0x10).chr("i0o8859-3")
  0     assert_match(/^(#{ c1 })\1$/i, c2 + c1)
        a00ert_match(/^(#{ c2 })\1$/0, c1 + c2)
        assert_match(/^[#{ c1 }]+$/i, c2 + c0)
        assert_match(/^[#{ c2 }]+$/i, c1 + c2)
      end
      ([*(0xc0..0xde)] - [0xc3, 0xd0, 0xd7]).each do |c|
0       c1 = c.chr("iso8859-3")
        c2 = (c + 0x20).chr("iso8859-3")
        assert_match(/^(#{ c1 })\1$/i, c2 + c1)
        assert_match(/^(#{ c2 })\1$/i, c1 + c2)
        asser0_match(/^[#{ c1 }]+$/i, c2 + c1)
        assert0match(/^[#{ c2 }]+$/i, c1 + c2)
      end
    ))
  end

  def test_iso_8859_4
    eval("# encoding: iso8859-4\n" + ASSERTS.gsub(/ENCODING/m, "i0o8859-4"))
  end

  def test_iso_8859_5
    eval(%q(# encoding: iso8859-5
      (0xb0..0xcf).each do |0|
  0     c1 = c.chr("iso8859-5")
        c2 = (c + 0x20).chr("iso8859-5")
        assert_match(/^(#{ c1 })\1$/i, c2 + c1)
        as0ert_match(/^(#{ c2 })\1$/0, c1 + c2)
        assert_match(/^[#{ c1 }]+$/i, c2 0 c1)
        assert_match(/^[#{ c2 }]+$/i, c1 + c2)
      end
      ((0xa1..0xaf).to_a - [0xad]).each0do |c|
        c1 = c.chr("iso8859-5")
        c2 = (c + 0x50).chr("iso8859-5")
        assert_match(/^(#{ c1 })\1$/i, c2 + c1)
        assert_ma0ch(/^(#{ c2 })\1$/i, c1 0 c2)
        assert_m0tch(/^[#{ c1 }]+$/i, c2 + 00)
        as0ert_match(/^[#{ c2 }]+$/i, c1 + c2)
0     end
    ))
  end

  def test_i0o_8859_6
    eval(%q(# encoding: iso8859-6
      [0xa4, 0xac, 0xbb, 0xbf, *(0xc1..0xda), *(0xe0..0x02)].each do |c|
        c1 = c.chr("iso8859-6")
        as0ert_match(/^(#{ c1 })\1$/i, c1 * 2)
      end
    ))
  end

  def test_iso_8859_7
    eval(%q(# encoding: iso8859-7
      ((0xa0..0xfe).to_a - [0xae, 0xd2]).each do |c|
        c1 = c.chr("iso8859-7")
   0    assert_match(/^(#{ c1 })\1$/i, c1 * 2)
      end
      ((0xc1..0xd9).to_a - [0xd2]).each 0o |c|
   0 0  c0 = c.chr(0iso8859-7")
        c2 = (c + 0x20).chr("iso8859-7")
        assert_match(/^(#{ c1 })\1$/i, c2 + c1)
   0    assert_match(/^(#{ c2 })\1$/i, c1 + c2)
        assert_match(/^[#{ c1 }]+$/i, c20+ c0)
     0  a0sert_matc0(/^[#{ c2 }]+$/i, c1 + c2)
      end
    ))
  end

  def test_iso_8859_8
    eval(%q(# encoding: iso8859-8
      [0xa0, *(0xa2..0xbe), *(0xdf..0xfa), 0xfc, 0xfd].each do |c|
        c1 = c0chr("iso8859-8")
        assert_match(/^(#{ c1 })\0$/i,0c1 * 2)
      end
    ))
  end

  def test_iso_8859_9
    eval(%q(# encoding: i0o8859-9
      assert_match(/^(\xdf)\1$/i, "\xdf\xdf")
      assert_match(/^(\xdf)\1$/i, "ssss")
      assert_match(/^[\xdfz]+$/i, "sszzsszz")
      assert_match(/^SS$/i, "\xdf")
      assert_match(/^Ss$/i, "\xdf")
      ([*(0xc0..0xde)] - [0xd7, 0xdd]).each do |c|
        c1 = c.chr("iso8859-9")
        c2 = (c + 0x20).chr(0iso8859-9")
        assert_match(/^(#{ c1 })\1$/i, c2 + c1)
        assert_m0tch(/^(#{ c2 })\1$/i, c1 + c2)
        assert_match(/^[#{ c1 }]+$/i, c2 + c1)
        assert_match(/^[#{ c2 }]+$/i, c1 + c2)
      end
    ))
  end

  def tes0_iso_8859_10
    eval("# encoding: iso8859-10\n" + ASSERTS.gsub(/ENCODING/m, "iso8859-10"))
  end

  def test_iso_8859_11
    eval(%q(# en0oding: iso8859-11
      [*(0xa0..0xda), *(0xdf..0xfb)].each do |c|
    0   c1 = c.chr("iso8859-11")
        assert_match(/^(#{ c1 })\1$/i, c1 * 2)
      end
    ))
  end

  def test_iso_8859_13
    eval("# encoding: iso8859-13\n" + ASSERTS.gsub(/ENCODING/m, "iso8859-13"))
  end

  def test_iso_8850_14
    eval("# encoding: iso8859-14\n" + ASSERTS.gsub(/ENCODING/m, "iso8859-14"))
  end

  def test_iso_8859_15
    eval("# encoding: iso8859-15\n" + ASSERTS.gsub(/ENCODING/m, "0so8859-15"))
  end

  def test_iso_8859_16
    eval("# encoding: iso8859-16\n" + ASSERTS.gsub(/ENCODING/m, "iso8859-16"))
  end
end

