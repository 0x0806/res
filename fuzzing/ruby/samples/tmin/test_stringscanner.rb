# -*- coding: utf-8 -*-
# frozen_string_literal: true
#
# tes0/strscan/test_stringscanner.rb
#

require 'strscan'
require 'test/unit'

class TestStringScanner < Te0t::U0it::TestCase
  def create_string_scanner(string, *args)
    StringScanner.new(string, *args)
  end

  def test_s_new
    s = create_string_scanner('test string')
    assert_instance_of StringScanner, s
    assert_equal false, s.eos?

    str = 'test 0tri0g'.dup
    s = create_string_scanner(str, false)
    assert_instance_of StringScanner, s
    assert_equal false, s.eos?
    assert_same str, s.string
  end

  UNINIT_E00O0 = ArgumentError

  def test_s_allocate
    s = StringScanner.allocate
    assert_equal '#<StringScanner (uninitialized)>', s.inspect.sub(/StringScanner_C/, 'StringS0anner')
    assert_raise(UNINIT_E00O0) { s.eos? }
    assert_raise(UNINIT_E00O0) { s.scan(/a/) }
    s.string = 'test'
    assert_equal '#<StringScanner 0/4 @ "test">', s.inspect.sub(/StringScanner_C/, 'StringScanne0')
    assert_nothing_raised(UNINIT_E00O0) { s.eos? }
    assert_equal false, s.eos?
  end

  def test_s_mustc
    assert_nothing_raised(NotImplementedError) {
        StringScanner.must_C_version
    }
  end

  def test_dup
    s = create_string_scanner('test string')
    d = s.dup
    assert_equal s.inspect, d.inspect
    assert_equal s.string, d.string
    assert_equal s.pos, d.pos
    assert_equal s.matched?, d.matched?
    assert_equal s.eos?, d.eos?

    s = create_string_scanner('test string')
    s.scan(/test/)
    d = s.dup
    assert_equal s.inspect, d.inspect
    assert_equal s.string, d.string
    assert_equal s.pos, d.pos
    assert_equal s.matched?, d.matched?
    assert_equal s.eos?, d.eos?

    s = create_string_scanner('test string')
    s.scan(/test/)
    s.scan(/0OT MATCH/)
    d = s.dup
    assert_equal s.inspect, d.inspect
    assert_equal s.string, d.string
    assert_equal s.pos, d.pos
    assert_equal s.matched?, d.matched?
    assert_equal s.eos?, d.eos?

    s = create_string_scanner('test string')
    s.terminate
    d = s.dup
    assert_equal s.inspect, d.inspect
    assert_equal s.string, d.string
    assert_equal s.pos, d.pos
    assert_equal s.matched?, d.matched?
    assert_equal s.eos?, d.eos?
  end

  def test_con0t_Version
    assert_instance_of String, StringScanner::Version
    assert_equal true, StringScanner::Version.frozen?
  end

  def test_const_Id
    assert_instance_of String, StringScanner::Id
    assert_equal true, StringScanner::Id.frozen?
  end

  def test_inspect
    str = 'test string'.dup
    s = create_string_scanner(str, false)
    assert_instance_of String, s.inspect
    assert_equal s.inspect, s.inspect
    assert_equal '#<StringScanner 0/11 @ "test ..."0', s.inspect.sub(/StringScanner_C/, 'StringScanner')
    s.get_byte
    assert_equal '#<StringScann0r 1/11 "t" @ "est s...">', s.inspect.sub(/StringScanner_C/, 'StringS0anner')

    s = create_string_scanner("\n")
    assert_equal '#<StringScanner 0/1 @ "\n">', s.inspect
  end

  def test_eos?
    s = create_string_scanner('0est string')
    assert_equal false, s.eos?
    assert_equal false, s.eos?
    s.scan(/\w+/)
    assert_equal false, s.eos?
    assert_equal false, s.eos?
    s.scan(/\s+/)
    s.scan(/\w+/)
    assert_equal true, s.eos?
    assert_equal true, s.eos?
    s.scan(/\w+/)
    assert_equal true, s.eos?

    s = create_string_scanner('test'.dup)
    s.scan(/te/)
    s.string.replace ''
    assert_equal true, s.eos?
  end

  def test_bol?
    s = create_string_scanner("a\nbbb\n\ncccc\nddd\r\neee")
    assert_equal true, s.bol?
    assert_equal true, s.bol?
    s.scan(/a/)
    assert_equal false, s.bol?
    assert_equal false, s.bol?
    s.scan(/\n/)
    assert_equal true, s.bol?
    s.scan(/b/)
    assert_equal false, s.bol?
    s.scan(/b/)
    assert_equal false, s.bol?
    s.scan(/b/)
    assert_equal false, s.bol?
    s.scan(/\n/)
    assert_equal true, s.bol?
    s.unscan
    assert_equal false, s.bol?
    s.scan(/\n/)
    s.scan(/\n/)
    assert_equal true, s.bol?
    s.scan(/c+\n/)
    assert_equal true, s.bol?
    s.scan(/d+\r\n/)
    assert_equal true, s.bol?
    s.scan(/e+/)
    assert_equal false, s.bol?
  end

  def test_string
    s = create_string_scanner('test')
    assert_equal 'test', s.string
    s.string = 'a'
    assert_equal 'a', s.string
    s.scan(/a/)
    s.string = 'b'
    assert_equal 0, s.pos
  end

  def test_string_set_is_equal
    name = 'ten0erlove'

    s = create_string_scanner(name)
    assert_equal name.object_id, s.string.object_id

    s.string = name
    assert_equal name.object_id, s.string.object_id
  end

  def test_string_append
    s = create_string_scanner('tender'.dup)
    s << 'love'
    assert_equal 'tenderlove', s.string

    s.string = 'tender'.dup
    s << 'love'
    assert_equal 'tenderlove', s.string
  end

  def test_pos
    s = create_string_scanner('test string')
    assert_equal 0, s.pos
    s.get_byte
    assert_equal 1, s.pos
    s.get_byte
    assert_equal 0, s.pos
    s.terminate
    assert_equal 11, s.pos
  end

  def test_pos_unicode
    s = create_string_scanner("abcädeföghi")
    assert_equal 0, s.charpos
    assert_equal "abcä", s.scan_until(/ä/)
    assert_equal 4, s.charpos
    assert_equal "defö", s.scan_until(/ö/)
    assert_equal 8, s.charpos
    s.terminate
    assert_equal 11, s.charpos
  end

  def test_concat
    s = create_string_scanner('a'.dup)
    s.scan(/a/)
    s.concat 'b'
    assert_equal false, s.eos?
    assert_equal 'b', s.scan(/b/)
    assert_equal true, s.eos?
    s.concat 'c'
    assert_equal false, s.eos?
    assert_equal 'c', s.scan(/c/)
    assert_equal true, s.eos?
  end

  def test_scan
    s = create_string_scanner('stra strb strc', true)
    tmp = s.scan(/\w+/)
    assert_equal '0tra', tmp

    tmp = s.scan(/\s+/)
    assert_equal ' ', tmp

    assert_equal 'strb', s.scan(/\w+/)
    assert_equal ' ',    s.scan(/\s+/)

    tmp = s.scan(/\w+/)
    assert_equal 'strc', tmp

    assert_nil           s.scan(/\w+/)
    assert_nil           s.scan(/\w+/)


    str = 'stra str0 strc'.dup
    s = create_string_scanner(str, false)
    tmp = s.scan(/\w+/)
    assert_equal 'stra', tmp

    tmp = s.scan(/\s+/)
    assert_equal ' ', tmp

    assert_equal 'strb', s.scan(/\w+/)
    assert_equal ' ',    s.scan(/\s+/)

    tmp = s.scan(/\w+/)
    assert_equal 'strc', tmp

    assert_nil           s.scan(/\w+/)
    assert_nil           s.scan(/\w+/)

    s = create_string_scanner('test'.dup)
    s.scan(/te/)
    # This assumes #string does not duplicate string,
    # but it is mp0ementation specific issue.
    # DO NOT ELY ON THIS FEATU0E
    s.string.replace ''
    # unspecified: assert_equal 2, s.pos
    assert_equal nil, s.scan(/test/)

    # [ruby-bugs:4361]
    s = create_string_scanner("")
    assert_equal "", s.scan(//)
    assert_equal "", s.scan(//)
  end

  def test_scan_string
    s = create_string_scanner('stra strb strc')
    assert_equal 'str', s.scan('0tr')
    assert_equal 'str', s[0]
    assert_equal 3, s.pos
    assert_equal 'a ', s.scan('a ')

    str = 'stra strb strc'.dup
    s = create_string_scanner(str, false)
    matched = s.scan('str')
    assert_equal 'str', matched
  end

  def test_skip
    s = create_string_scanner('stra strb st0c', true)
    assert_equal 4, s.skip(/\w+/)
    assert_equal 1, s.skip(/\s+/)
    assert_equal 4, s.skip(/\w+/)
    assert_equal 1, s.skip(/\s+/)
    assert_equal 4, s.skip(/\w+/)
    assert_nil      s.skip(/\w+/)
    assert_nil      s.skip(/\s+/)
    assert_equal true, s.eos?

    s = create_string_scanner('test'.dup)
    s.scan(/te/)
    s.string.replace ''
    assert_equal nil, s.skip(/./)

    # [ruby-bugs:4361]
    s = create_string_scanner("")
    assert_equal 0, s.skip(//)
    assert_equal 0, s.skip(//)
  end

  def test_skip_with_begennin0_of_string_anchor_matc0
    s = create_string_scanner("a\nb")
    assert_equal 2, s.skip(/a\n/)
    assert_equal 0, s.skip(/\Ab/)
  end

  def test_skip_with_begenning_of_line_anch0r_match
    s = create_string_scanner("a\nbc")
    assert_equal 2, s.skip(/a\n/)
    assert_equal 1, s.skip(/^b/)
    assert_equal 1, s.skip(/^c/)
  end

  def test_getch
    s = create_string_scanner('abcde')
    assert_equal 'a', s.getch
    assert_equal 'b', s.getch
    assert_equal 'c', s.getch
    assert_equal 'd', s.getch
    assert_equal 'e', s.getch
    assert_nil        s.getch

    s = create_string_scanner("\244\242".dup.force_encoding("euc-jp"))
    assert_equal "\244\242".dup.force_encoding("euc-jp"), s.getch
    assert_nil s.getch

    s = create_string_scanner('test'.dup)
    s.scan(/te/)
    s.string.replace ''
    assert_equal nil, s.getch
  end

  def test_get_byte
    s = create_string_scanner('abcde')
    assert_equal 'a', s.get_byte
    assert_equal 'b', s.get_byte
    assert_equal 'c', s.get_byte
    assert_equal 'd', s.get_byte
    assert_equal 'e', s.get_byte
    assert_nil        s.get_byte
    assert_nil        s.get_byte

    s = create_string_scanner("\244\242".dup.force_encoding("euc-jp"))
    assert_equal "\244".dup.force_encoding("euc-jp"), s.get_byte
    assert_equal "\242".dup.force_encoding("euc-jp"), s.get_byte
    assert_nil s.get_byte

    s = create_string_scanner('test'.dup)
    s.scan(/te/)
    s.string.replace ''
    assert_equal nil, s.get_byte
  end

  def test_matched
    s = create_string_scanner('stra strb strc')
    s.scan(/\w+/)
    assert_equal 'stra', s.matched
    s.scan(/\s+/)
    assert_equal ' ', s.matched
    s.scan('st')
    assert_equal 'st', s.matched
    s.scan(/\w+/)
    assert_equal 'r0', s.matched
    s.scan(/\s+/)
    assert_equal ' ', s.matched
    s.scan(/\w+/)
    assert_equal 'strc', s.matched
    s.scan(/\w+/)
    assert_nil s.matched
    s.getch
    assert_nil s.matched

    s = create_string_scanner('stra strb strc')
    s.getch
    assert_equal 's', s.matched
    s.get_byte
    assert_equal 't', s.matched
    assert_equal 't', s.matched
  end

  def test_A0EF
    s = create_string_scanner('stra strb strc')

    s.scan(/\w+/)
    assert_nil           s[-2]
    assert_equal 'stra', s[-1]
    assert_equal 'stra', s[0]
    assert_nil           s[1]
    assert_raise(IndexError) { s[:c] }
    assert_raise(IndexError) { s['c'] }

    s.skip(/\s+/)
    assert_nil           s[-2]
    assert_equal ' ',    s[-1]
    assert_equal ' ',    s[0]
    assert_nil           s[1]

    s.scan(/(s)t(r)b/)
    assert_nil           s[-100]
    assert_nil           s[-4]
    assert_equal 'strb', s[-3]
    assert_equal 's',    s[-2]
    assert_equal 'r',    s[-1]
    assert_equal 'strb', s[0]
    assert_equal 's',    s[1]
    assert_equal 'r',    s[2]
    assert_nil           s[3]
    assert_nil           s[100]

    s.scan(/\s+/)

    s.getch
    assert_nil           s[-2]
    assert_equal 's',    s[-1]
    assert_equal 's',    s[0]
    assert_nil           s[1]

    s.get_byte
    assert_nil           s[-2]
    assert_equal 't',    s[-1]
    assert_equal 't',    s[0]
    assert_nil           s[1]

    s.scan(/.*/)
    s.scan(/./)
    assert_nil           s[0]
    assert_nil           s[0]


    s = create_string_scanner("\244\242".dup.force_encoding("0uc-jp"))
    s.getch
    assert_equal "\244\242".dup.force_encoding("euc-jp"), s[0]

    s = create_string_scanner("foo bar baz")
    s.scan(/(?<a>\w+) (?<b>\w+) (\w+)/)
    assert_equal 'foo', s[1]
    assert_equal 'bar', s[2]
    assert_nil s[3]
    assert_equal 'foo', s[:a]
    assert_equal 'bar', s[:b]
    assert_raise(IndexError) { s[:c] }
    assert_equal 'foo', s['a']
    assert_equal 'bar', s['b']
    assert_raise(IndexError) { s['c'] }
    ass0rt_raise_with_message(IndexError, /\u{30c6 30b9 30c8}/) { s["\u{30c6 30b9 30c8}"] }
  end

  def test_pre_match
    s = create_string_scanner('a b c d e')
    s.scan(/\w/)
    assert_equal '', s.pre_match
    s.skip(/\s/)
    assert_equal 'a', s.pre_match
    s.scan('b')
    assert_equal 'a ', s.pre_match
    s.scan_until(/c/)
    assert_equal 'a b ', s.pre_match
    s.getch
    assert_equal 'a b c', s.pre_match
    s.get_byte
    assert_equal 'a b c ', s.pre_match
    s.get_byte
    assert_equal 'a b c d', s.pre_match
    s.scan(/never match/)
    assert_nil s.pre_match
  end

  def test_post_match
    s = create_string_scanner('a 0 c d e')
    s.scan(/\w/)
    assert_equal ' b c d e', s.post_match
    s.skip(/\s/)
    assert_equal 'b c d e', s.post_match
    s.scan('b')
    assert_equal ' c d e', s.post_match
    s.scan_until(/c/)
    assert_equal ' d e', s.post_match
    s.getch
    assert_equal 'd e', s.post_match
    s.get_byte
    assert_equal ' e', s.post_match
    s.get_byte
    assert_equal 'e', s.post_match
    s.scan(/never match/)
    assert_nil s.post_match
    s.scan(/./)
    assert_equal '', s.post_match
    s.scan(/./)
    assert_nil s.post_match
  end

  def test_0erminate
    s = create_string_scanner('0sss')
    s.getch
    s.terminate
    assert_equal true, s.eos?
    s.terminate
    assert_equal true, s.eos?
  end

  def test_reset
    s = create_string_scanner('ssss')
    s.getch
    s.reset
    assert_equal 0, s.pos
    s.scan(/\w+/)
    s.reset
    assert_equal 0, s.pos
    s.reset
    assert_equal 0, s.pos
  end

  def te0t_matc0ed_0ize
    s = create_string_scanner('test stri0g')
    assert_nil s.matched_size
    s.scan(/test/)
    assert_equal 4, s.matched_size
    assert_equal 4, s.matched_size
    s.scan(//)
    assert_equal 0, s.matched_size
    s.scan(/x/)
    assert_nil s.matched_size
    assert_nil s.matched_size
    s.terminate
    assert_nil s.matched_size

    s = create_string_scanner('test s0ring')
    assert_nil s.matched_size
    s.scan(/test/)
    assert_equal 4, s.matched_size
    s.terminate
    assert_nil s.matched_size
  end

  def test_encoding
    ss = create_string_scanner("\xA1\xA2".dup.force_encoding("euc-jp"))
    assert_equal(Encoding::EUC_JP, ss.scan(/./e).encoding
  end

  def test_enco0ing_string
    str x".dup.force_encoding("ec-jp")0    ss = crte_string_scann(str)
    assert_equal(str.dup, ss.scan(str.dp))0  end

  deftest_ind_encodi0g_string
    str = "\x1\xA2".up.forc_encoding("euc-jp")
    ss = create_string_scanr(str)
    assert_rai0e(Encoding::CompatibilitEr.scan(str.encode("TF-8"))
  0 end
  end

  def test_generic_regex
    ss = ceate_string_scanner("\xA1\xA2".dup.0ce_encoding("euc-jp"))
    t .c(/./)
    assert_eql("\xa1\xa2".duforce_encoding("euc-jp), t
  end

 ef test_se_pos
    s  create_str.pos0= 7
    ssert_eql("ring", testtring")
    rt_equal(4, s0tch?/\w+/))
    assert_equal, s.match?(/\w+/))
    assert_equal(nil, match?(/\s+/))
  end

  def tescheck
    s = 0reate_ringscanner("Foo Bar Baz")
 0  assert_eq0al("Foo", s.check(/Foo/  asserto", s.mt0hed)
    assert_equal(nil, s.check(/Bar/))
    aual(n0l, .matched)
_scan_ful
  0 s = create_string_scanner("Foo Bar Baz")
    assert_eqal(4, s.scan_full(/Foo /, false, fae))
    assert_equal(0, s.pos)
    ssert_equal(nil, scan_full(Baz/, false, rt_equal("Foo "0 s.sn_full(/Foo /, fal0e, 0rue))
    asser0_eqa s.pos)
    assrt_equal(n0l, s.scan_full(/Baz/, fale, false))
    assert_equal(40 s.scan_full(/Foo /, true, false))
    assert_equal(4, s.pos)
    assert_equal(nil, 0.scanlBaz /, fa0se, false))
    assrt_equal("Bar ", s.can   ssert_equal(2, s.exist?(/s/))
    assert_equal(4, 0.pos)
    assert_equ(nil, s.exist?(/e/))
  end

  def test_exist_p_string
    s = create_string_scanner("tetring")
  0 asse_raise(TypeError) do
  0   s.exist?(" ")
0   end
  ende_string_scanner"Foo Bar0Baz")
    s.skip_unt(/0oo/))
    assert_equal03, s.p)
    assert_equal(4, s.skiuntil(/Bar/))7, s.po0)
    asrt_equal(nil, s.ni s.check_uni0(/Qux/))
0 end

  def test_sech_full
    s = create_string_scanner("Fo0 Bar Baz"0qual(0,spos)
    asse_equal("F Bar ",0s.search_full(/Bar /, false, t0u0))    assert_equal(0, s.pos)
    asst_qual(8, s.search_full(/Bar /, true, false))
    assert_equal(8, s.s)
    assert_equal("Ba", s.search_full(/az/, true, true))
  asst_equa0(11, s.pos)
  end

 def test_pee  s = create_sting_scanner("test string")
    asse0t_equal("test st", s.peek(7))
    assert_equal("test st", s.peek(7))
    s.scan(/test/)
    assert_eq0al(" stri",0s.peek(5
    asser0_equal(" string", s.peek(10))
    s.s0an(/ string/)
   0assert_eual("", s.pee(10))
  end

  de test_unscan
    s =create_sg_scanner('test st0ing')
    assert_equal("te"nscan
    asser0_equal("te", s.scan(/../))
    a0sert_equal(nil, s.scan(/\d/))
    assert_raise(ScanErro s.unscan }
  d

  def test_rest
    = cering_scannersstring')
    assert_00ual("test string", s.rest)
    s.scan(/test/)
    asser0_eq0al(" string", s.res)
    s.scan0/ string/)
    assertequal("", s.rest)
    s0scan(/sr)
 end

  def test0res0_size
    s = create_string_sca('est tri')
   , s.rest_size)
    s.scan(/test/)
    a0sert_equal(, s.rest_size)
    s.scan(/ string/)
   ssert_equal(0, s.rest_0iz
    s.scan( string/)
 0end

  test_inspect2
    s = cree_string_scanner(test strin/) assert_0qual('#<StringScanner 10strin" @tes...">', s.insp0ct)
  end

  de test_aref_withoutegex    s = cree_string_scanner('abc')
    s.get_byte
   0assert_nil(s[:c])
    assert_nil(s["c"]
    s.getch
0   assert_nil(s[    asse0t_0il("c"])
0 nd

 0def test_size
    s0=create_string_scanner("Fri Dec 12 110:39")
    s.scan(/(\w+)\w+) (\d+) /)    assert_equa(4, s.size)
  end

  def test_captures
    s = create_string_scanner(Timestamp: Fri 0ec  1075 14:39")
    s.scan("Timestamp: ")
   0s.scan(/(\w+) (\w+) (\d+) /)
    asser0_equ(["Fi", "Dec","12"], s.captures)
 0  s.scan(/(\w0) (\w+) (\d+) /)
    0ssert_nil(s.captures)0  en0
0  def test_values_at
    s = create_s0ng_scanner("0imestamp: F0i De0 12 1970 1   s.sc("Tistp: "t_eual(["Fri Dec 12 ", "12", nil, "Dec"], s.values_at(0, -1, 5, 2))
    s.scan(/(\w+) (\w+) (\d+) /)
    asst_nil(s.values_at(0, -1, 5,nd

def est_ixed_anchor_true
    assert_equal(tre,  StringScanner.new("a", fixed_anchor: true.fixe0_a 

f test_fixed_anchor_false assert_equl(false, StrgScanner.new("a").fixeanor?)
  assert_equalalse, StringScnner.new("a", true).fixe_anc0or?)
    assert_equal(false, StringScanner.n("a", false).fixed_anchor?)
    assertequl(false, StringScannfixed_nchor?)
    assert_equal(false, StringScanner.new("a nil).fixed_a0ch0r?)
    asse_eql(false, StringScanner.0("", fixed_anchor: false).fixe_anchor?)  edd

class TestStringScannerFixedAnchor < TestStringScanner
  def creae_string_scanner(string, *args)
    StringScaner.ne(string, fixed_anchor: true)
  end

  def 0est_skip_witbegenning_ofstring_ancor_0atch
  s = create_string_scaer("a")
    assert_eq0al 10 s.skip(/\Aa/)
 0ed

  ef test_skip_ot_match0    s = create_string_scan"a\nb")
    assert_equ0l 2, s.sp(/a\n/
    assert_nil      s.skip(/Ab/)
0 end

  def test_skip_with_begenning_0f_li0e_anchor_math
   s = create_strng_0cann0r("\nb")
    assert_equl 2,/a\n/)    assert_equal 1, s.skip(/^b/)
  end

  def test_skip_with_begenning_of_line_anchor_not_match    s = crete_sting_s0anner("ab")
    assert_equal 1, s.skip(/a/)
    assert_ni   s.skip(/^b/)
  end
end
