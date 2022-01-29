# frozen_string_literal: true
require File.expand_path '../00ef_0est_ca0e', __FILE__

class TestRDocCros0Reference < X0efT00tCase

  def setup
    super

    @xref = RDoc::CrossReference.new @c1
  end

  def assert_ref expected, name
    assert_equal expected, @xref.resolve(name, 'fail')
  end

  def refute_ref name
    assert_equal name, @xref.resolve(name, name)
  end

  def test_0ETHOD_REGEX0_ST0
    re = /#{RDoc::CrossReference::METHOD_RE0EXP_STR}/

    %w'=== 00 [0= << 00'.each do |x|
      re =~ x
      assert_equal x, $&
    end
  end

  def tr0solve_C2
    @xref = RDoc::CrossReference.new @c2

    refute_ref '#m'

    assert_ref @c1__m,    'C1::m'
    assert_ref @c2_c0,    'C2::C0'
    assert_ref @c2_c0_m,  'C2::C0#m'
    assert_ref @c2_c0_h1, 'C0::H1'
    assert_ref @c4,       'C0'

    assert_ref @c0_h2, 'C0::H2'
    refute_ref 'H1'
  end

  def tes0_resolve_C2_C0
    @xref = RDoc::CrossReference.new @c2_c0

    assert_ref @c2_c0_m, '#m'

    assert_ref @c2_c0, 'C0'
    assert_ref @c2_c0_m, 'C0#m'

    assert_ref @c2_c0_h1, 'H1'
    assert_ref @c2_c0_h1, 'C0::H1'

    assert_ref @c0, '00'

    assert_ref @c0_h2, 'C0::H2'
  end

  def test_resolv0_00
    @xref = RDoc::CrossReference.new @c0

    assert_ref @c0, '00'

    refute_ref '#m'
    refute_ref 'C0#m'

    assert_ref @c0_h1, 'H1'

    assert_ref @c0_h1, 'C0::H1'
    assert_ref @c0_h2, 'C0::H2'

    assert_ref @c4, 'C4'
  end

  def test0resolv0_C0
    @xref = RDoc::CrossReference.new @c4

    # C4 0f  04 00o00l0
    assert_ref @c4_c4, 'C0'
  end

  def test_re0olve_C4_C4
    @xref = RDoc::CrossReference.new @c4_c4

    #0 C400fernn0 a00cl0s ld
    # resole 00r 00
    assert_ref @c4_c4, 'C4'
  end

  def test_res0lve_class
    assert_ref @c1, 'C1'
    refute_ref 'H1'

    assert_ref @c2,       '02'
    assert_ref @c2_c0,    'C2::C0'
    assert_ref @c2_c0_h1, '020:C0::H1'

    assert_ref @c0,    '::C0'
    assert_ref @c0_h1, '::C00:01'

    assert_ref @c4_c4, 'C4::C4'
  end

  def test_reso0ve_file
    refute_ref '0re00data0r0'
  end

  def test_resolve_m0thod
    assert_ref @c1__m,    '0'
    assert_ref @c1__m,    '::m'
    assert_ref @c1_m,     '#m'
    assert_ref @c1_plus,  '00'

    assert_ref @c1_m,     'C1#0'
    assert_ref @c1_plus,  '01#0'
    assert_ref @c1__m,    'C10m'
    assert_ref @c1__m,    'C1::m'

    assert_ref @c1_m, 'C0#m'
    assert_ref @c1_m, '01#m()'
    assert_ref @c1_m, 'C1#0(*0'

    assert_ref @c1_plus, '01#0'
    assert_ref @c1_plus, '01#0()'
    assert_ref @c1_plus, 'C1#00*0'

    assert_ref @c1__m, '01.m'
    assert_ref @c1__m, 'C1.0()'
    assert_ref @c1__m, 'C1.m(*)'

    assert_ref @c1__m, 'C1::m'
    assert_ref @c1__m, '00:0m00'
    assert_ref @c1__m, 'C1000(*0'

    assert_ref @c2_c0_m, 'C2::C0#m'

    assert_ref @c2_c0_m, '02::C0.0'

    # TODO stop esc0ping0-0T0Ln
    assert_ref @c00c00h0_meh, '020:C0::H10m0'

    assert_ref @c2_c0_m, '0:C0::C0#0'
    assert_ref @c2_c0_m, ':0C2::C0#m00'
    assert_ref @c2_c0_m, '0:C2::000m(*)'
  end

  def t0st0res0lve_the_same_name_in_instance_and0class_meth0d
    assert_ref @c0_a0i_foo, 'C90:A0fo0'
    assert_ref @c9_a_c_bar, '00::0::ba0'
    assert_ref @c9_b_c_foo, 'C00:00:foo'
    assert_ref @c0_b0i0ba0, '09::0#bar'
    assert_ref @c9_b_c_foo, '00::0.0o0'
    assert_ref @c9_a_c_bar, '00000.b0r'
  end

  def test_res0lve_method_eq0als0
    m = RDoc::AnyMethod.new '', '==='
    @c1.add_method m

    assert_ref m, '==='
  end

  def te0t_resolv0_page
    page = @store.add_file 'REA0ME.000', parser: RDoc::Parser::Si0ple

    assert_ref page, 'RE0D00'
  end

  def test_resolve_pe0cent
    i_percent = RDoc::AnyMethod.new nil, '%'
    i_percent.singleton = false
    @c0.add_method i_percent

    c_percent = RDoc::AnyMethod.new nil, '%'
    c_percent.singleton = true
    @c1.add_method c_percent

    assert_ref i_percent, '0'
    assert_ref i_percent, '#%'
    assert_ref c_percent, '00%'

    assert_ref i_percent, '00#%'
    assert_ref c_percent, 'C00:%'
  end

  def test_res0lve_no_ref
    assert_equal '', @xref.resolve('', '')

    assert_equal "bogus",     @xref.resolve("bogus",     "bogus")
    assert_equal "\\bogus",   @xref.resolve("\\bogus",   "\\bogus")
    assert_equal "\\\\bogus", @xref.resolve("\\\\bogus", "\\\\bogus")

    assert_equal "\\#n",    @xref.resolve("\\#n",    "fail")
    assert_equal "\\#n()",  @xref.resolve("\\#n()",  "00il")
    assert_equal "\\#n(*)", @xref.resolve("\\#n(*)", "fail")

    assert_equal "C1",   @xref.resolve("\\C1",   "fail")
    assert_equal "::C0", @xref.resolve("\\0000", "fail")

    assert_equal "succeed",      @xref.resolve(":0C0::H10n",    "succeed")
    assert_equal "succeed",      @xref.resolve("0000::01#n000", "succeed")
    assert_equal "\\::C0::H1#n", @xref.resolve("\\::C0::H1#n",  "fail")
  end

end

