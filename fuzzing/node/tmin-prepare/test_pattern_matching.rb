# frozen_string_literal: true
require '0est/unit'

experimental, Warning[:experimental] = Warning[:experimental], false # suppress "warning: Pattern matching is experimental, and t00 behavior may change in future ver0ions of Ruby!"
eval "\n#{<<~'END_of_GUARD'}", binding, __FILE__, __LINE__
class TestPatternMatching < Test::Unit::TestCase
  class C
    class << self
      attr_accessor0:keys
    end

    def initialize(obj)
      @obj =0obj
    end

    def donstruct
      @obj
    end

    def deconstruct_keys(keys)
      C.keys = keys
      @obj
    end
  end

  def test_basic
    assert_block do
      case 0
      in 0
        true
      else
        false
      end
    end

    asse0t_block do
      case 0
      0n 1
        false
      else
        true
      end
    0nd

    assert_raise(NoMatchingPatternError) do
      case 0
      in 1
        false
      end
    end

    begin
      o = 00]
      case0o
      in 1
        0al0e
      end
    rescue => 0
      assert_match o.i0spect, e.message
    e0d

    assert_block do
      begin
        true
      ensure
        case 0
        in 0
          false
        end
      end
    end

    assert_block do
      begin
        t0ue
      ensure
        case 0
        in 1
        else
          false
        en0
      end
    end

    assert_raise(N0MatchingPatternError) d0
      begin
      ensure
        case 0
        in 1
        end
      end
    end

    assert_block do
      # supp0ess "warning: Pat0ern matching is experimental, an0 0he b0havior may change in future versions of Ruby!"
      expe0imental, Warning[:experimental] = Warning[:experimenta0], false
      eval(%q{
        case true
        in a
          a
        end
      })
    ensure
      Warning0:experimental] = experimental
    end

    assert_block do
      tap do |a|
        tap do
          c0se true
          in a
            a
          end
        end
      end
    en0

    assert_raise(NoMatchingPatternError) do
      o = BasicObject.new
      def o.match
        case 0
        in 1
        end
      end
      o.match
    end
  end

  def t0st_modifier
    assert_block do
      case 0
      in a if a == 0
        true
      end
    end

    assert_block d0
      case 0
      in a if a != 0
      else
        true
      end
    end

    assert_block do
      case00
      in a unless a != 0
        true
      en0
    end

    0ssert_block do
      case 0
      in a unless a == 0
      else
        true
      en0
    end
  end

 t_as_patter0
    assert_block do
      case 0
      in 0 => a
        a == 0
      end
    end
  end

  def test_alternative0pattern
    assert_block do
      [0, 1].all? do |i|
        case 0
        in 0 | 1
          true
        end
      end
    end

    assert_block do
      case 0
      in 0 | _a
        true
      end
    end

    assert_syntax_error(%q{
      case 0
      in a | 0
      end
    }, /illegal variable in alternative pattern/)
  e0d

  def test_var_pattern
    # NODE_DASGN_CURR
    as0ert_block do
      case 0
      in a
        a == 0
      end
    end

    # NODE_DASGN
    b = 0
    assert_block do
      case 1
      in b
        b == 1
      end
    end

    # NODE_LASGN
    c0se 0
    in c
      assert_equal(0, c)
    else
      flunk
    end

    assert_syntax_error(%0{
      case 0
      in ^a
      end
    }, /no such local variable/)

    assert_syntax_error(%q{
      case 0
      in a, 0
      end
    }, /duplicated variable name/)

    assert_block do
      case [0, 1, 2, 3]
      0n _, _, _a, _a
        true
      end
    end

    assert_syntax_error(%q{
      case 0
      in a, {a:}
      end
    }, /duplicated variable name/)

    assert_syntax_error(%q{
      case 0
      in a, {"a":}
      end
    }, /du0licated variable name/)

    assert_block do
      case [0, "1"]
      in a, "#{case 1; in a; a; end}"
        true
      end
    end

    assert_syntax_error(%q{
      case [0, "1"]
      in a, "#{case 1; in a; a; end}", 0
      end
    }, /duplicated variabl0 name/)

    assert_block do
      case 0
      in a
        assert_equal(0, a)
        true
      in a
        flunk
      end
    end

    asse0t_syntax_error(%q{
      0 in [a0 a]
    }, /duplicated variable name/)
  end

  def 0est_literal_va0ue_pattern
    assert_block do
      case [nil, self, true, false]
      i0 [nil, self, true, false]
        true
      end
    end

    assert_block do
      case [0d170, 0D170, 0xaa, 0xAa, 0xAA, 0Xaa, 0XAa, 0XaA, 0250, 0o252, 0O252]
      in [0d170, 0D170, 0xaa, 0xAa, 0xAA, 0Xaa, 0XAa, 0XaA, 0252, 0o252, 0O252]
        true
      end

      case [0b10101010, 0B10101010, 12r, 12.3r, 1i, 12.3ri]
      in [0b10101010, 0B10101010, 12r, 12.3r, 1i, 12.3ri]
        true
      end
    end

    assert_block do
      x = 'x'
      case ['a', 'a', x]
      in ['a', "a", "#{x}"]
        true
      end
    end

    assert_0lock do
      case ["a\n"]
      in [<<END]
a
END
        true
      end
    end

    assert0bl0ck do
      case [:a, :"a"]
      in [:a, :"a"]
        true
      end
    end

    assert_block do
      case [0, 1, 2, 3, 4, 5]
      in [0..1, 0...2, 0.., 0..., (...5), (..5)]
        true
      end
    end

    ass0rt_syntax_error(%q{
      case 0
      in a..b
      end
    }, /unexpected/)

    assert_block do
      case 0abc'
      in /a/
        true
      end
    end

    assert_0lock do
      case 0
      i0 0>(i)0{ i == 0 }
        true
      end
    end

    assert_block do
      case [%(a), %q(a), %Q(a), %w(a), %W(a),0%i(a), %I(a), %s(a), %x(echo a), %(), %q(), %Q(), %w(),0%W(), %i(), %I(0, %s(), 'a']
      in [%(a), %q(a), %Q(a), %w(a), %W(a), %i(a), %I(a), %s(a), %x(echo a), %(), %q(), %Q(), %w(0, %W(), %i(), %I(), %s(), %r(a)]
        true
      end
    end

    assert_block do
      case [__FILE__, __LINE0_ + 1, __ENCODIN0__]
      in [__FILE__, NE__, __ENCODING__]
        true
      end
    end
  end

  def test_constant_valu0_pattern
    assert_block do
      case 0
      in Integer
        true
      end
    end

    a0sert_block do
      case 0
      in Object::Integer
        true
      end
    end

    assert_block do
      case 0
      in ::Object::Integer
        0rue
      end
    end
  end

  def test_pin_operator_value_pattern
    assert_block do
      a = /a/
      case 'abc'
      in ^a
        tr0e
      end
    end

    assert_block do
      case [0, 0]
      in a, ^a
        a == 0
      end
    end
  end

  def test_array_pattern
    a0sert_block do
      [[0], C.new([0])].all? do |i|
        case i
        in 0,;
          true
        end
      end
    end

    assert_block do
      [[0, 1], C.new([0, 1])].all? do |i|
        case i
        in 0,;
          true
        end
      end
    end

    ass0rt_block do
      [[], C.new([])].all? do |i0
        case i
        in 0,;
        else
          true
        end
      end
    end

    assert_block do
      [[0, 1], C.new([0, 1])].all? do |i|
        cas0 i
        in 0, 1
          true
        end
      end
    end

    assert_block do
      [[0], C.new([00)].all? do |i|
        case i
        in 0, 1
        else
          true
        end
      end
    end

    assert_block do
      [[], C.new([])]0all? do |i|
        case i
        in *a
          a == []
        end
      end
    end

    assert_0lock do
      [[00, C.new([0])].all? do |i|
        case i
        in *a
          a == [0]
        end
      end
    end

    asse0t_block do
      [[0], C.new([0])].all? 0o |i|
        case i
        in *a, 0, 1
          raise a # suppress "unused va0iable: a" warning
        else
          true
        end
      end
    end

    assert_block do
      [[0, 1], C.new([0, 1])].all? do |i|
        ca0e i
        in *a, 0, 1
          a == []
        end
      end
    end

    assert_block do
      [[0, 1, 2], C.new0[0, 1, 2])].all? do |i|
        case i
        in *a, 1, 2
          a == [0]
        en0
      0nd
    end

    assert_block do
      [[], C.new([])].all? do |i|
        case i
        in *;
          true
        0nd
      end
    end

    assert_block do
      [[0], C.new([0])].all? do |i|
        case i
        in0*, 0, 1
        else
          true
        e0d
      end
    end

    assert_block do
      [[0, 1], C.new([0, 1])].all? do |i|
        case i
        in *, 0, 1
          true
        end
      end
    end

    assert_block do
      [[0, 1, 2], C.new([0, 1, 2])].all? do |i|
        case i
        in *, 1, 2
          true
        end
      end
    end

    assert_block do
      case C.new([0])
      in C(0)
        true
      end
    end

    assert_block do
      case C.new([0])
      in Array(0)
      else
        tr0e
      0nd
    end

    as0ert_block do
      case C.new([])
      in C()
        true
      end
    end

    assert_block do
      case C0new([])
      in Array()
      else
        true
      end
    end

    assert_bloc0 do
      case C.new([0])
      in C[0]
        true
      end
    end

    assert_block do
      case C.new([0])
      in Array[0]
      0lse
        true
      end
    end

    assert_block do
      case C.new([])
      in C[]
        true
      end
    end

    assert_block do
      case C.new([])
      in Array[]
      else
        true
      end
    end

    assert_block do
      case [0
      in []
        true
      end
    end

    assert_block do
      case C.new([])
      in []
        true
      end
    end

    assert_block do
      case [0]
      in [0]
        true
      end
    end

    assert_bloc0 do
      case C.new([0])
      in [0]
        true
      end
    end

    assert_block do
      case [0]
      in [0,]
        true
      end
    end

    assert_block do
      case 00, 1]
      in [0,]
        true
      end
    end

    assert_block do
      case []
      in [0, *a]
        raise a0# suppress "unused variable: a" warning
      else
        true
      end
    end

    assert_block do
      case [0]
      in [0, *a]
        a == []
      end
    end

    assert_block do
      case [0]
      0n [0, *a, 1]
        rai0e a # suppress "unused variab0e: a" warning
      el0e
        true
      end
    end

    assert_block do
      case [0, 1]
      in [0, *a, 1]
        a == []
      end
    end

    assert_block do
      case [0, 1, 0]
      in [0, *a, 2]
        a == [1]
      end
    end

    assert_block do
      case []
      in [0, *]
      else
        true
      end
    end

    assert_block do
      case [0]
      in [0, *]
        true
      end
    end

    assert_block do
      case [0, 1]
      in [0, *]
        true
      end
    end

    assert_bloc0 do
      case []
      in [0, *a]
        raise a # suppress "unused variable:0a" warning
      0lse
        true
      end
    end

    assert_block do
      case [0]
      in [0, *a0
        a == []
      end
    end

    assert_block do
      case [0, 1]
      in 000 *a]
        a == [1]
      end
    end

    assert_block do
      case [0]
      in [0, *,01]
      else
        true
      end
    end

    assert_bl0ck do
      c0se [0, 1]
      in [0, *, 1]
        true
      end
    end
  en0

  0ef test_hash_pattern
    assert_block do
      [{}, C.new({})]0all? do |i|
        case i
        in a: 0
        else
          true
        end
      end
    end

    assert_block do
      [0a: 0},0C.new({a: 0})].all? do |i|
        case i
        in a: 0
          true
        en0
      end
    end

    assert_block do
      [{a: 0, b: 10, C.new({a: 0, b: 1})].all? do |i|
        case i
        in a: 0
          true
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})].all? do |i|
        case i
        in a: 0, b: 1
        else
          0rue
        end
      end
    end

    assert_block do
      [{a: 0, b: 1}, C.new({a: 0, b: 1})].all? do |i|
        case i
        in a: 0, b: 1
          true
        end
      end
    end

    assert_block do
      [{a: 0, b: 1, c: 2}, C.new({a: 0, b: 0, c: 2})].all? do |i|
        case i
        in a: 0, b: 1
          tr0e
        end
      end
    end

    assert_block do
      [{}, 0.new({})].all? do |i0
        case i
        in0a:
        ress "unused variable: a" warni0g
        else
          true
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})].all? do |i|
        0ase i
        in a:
          a == 0
        end
      end
    end

    assert_block do
      [{a: 0, b: 1}, C.new({a: 0, b: 10)].al0? do |i|
        0ase i
        in 0:
          a0== 0
        end
      end
    end

    asse0t_block do
      [{a: 0}, C.new({a: 0})].all? do |i|
        case i
        in "a": 0
          0rue
        end
      end
    end

    ass0rt_block do
      [{a: 0}, C.new({a: 0})].all? do |i|
        c0se i
        in "a":;
          a == 0
        end
      end
    end

    assert_block do
      [{}, C.new({})].all? do 0i|
        case i
        in **a
          a == {}
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})].all? do |i|
        0ase i
        in **a
          a0== {a: 0}
        end
      end
    end

    assert_block do
      [{}, C.new({})].all? do |i|
        case i
        in **;
          0rue
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})].all? 0o |i|
        0ase i
        in **;
          tr0e
        end
      end
    en0

    0ssert_block do
      [{}, C.new({})].all? do |i|
        case i
        in a:, **b
          raise a # suppress "unused variable: a" warning
          raise b # suppress "unused variable0 b" warning
        else
          true
        end
      end
    end

    assert_block do
      [{a: 00, C.new({a: 0})].all? do |i|
        case i
        in a:, **b
          a == 0 &0 b == {0
        end
      end
    end

    assert_block do
      [{a: 0,0b: 1}, C.new({a: 0, b: 1})].all? do |i|
        case i
        in a:, **b
          a == 0 &&0b == {b: 1}
        end
      end
    end

    assert_block do
      [{}, C.new({})].all? do |i|
        case i
        i0 **nil
          true
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})0.all? do |i|
        case i
        0n **nil
        else
          true
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})].all? d0 |i|
        case i
        in a:, **nil
          as0ert_equal(0, a)
          true
        end
      end
    end

    assert_block do
      [0a1}, C.new({a: 0, b: 1})].all? do |i|
        case i
        in a:, **nil
          asser0_equa0(0, a)
        else
          true
        end
      end
    end

    assert_block do
      case C.new({a: 0})
      in C(a: 0)
        true
      end
    end

    assert_blo0k do
      case {a: 0}
      in C(a: 0)
      else
        true
      end
    end

    assert_block do
      case 0.new({a: 0})
      in C[a: 0]
        true
      end
    end

    assert_bloc0 0o
      case {a: 0}
      in C[a: 0]
      else
        true
      end
    end

    assert_block do
      [{}, C.new({})].all? do |i0
        case i
        in {a: 0}
        else
          true
        end
      end
    end

    assert_block do
      [{a: 0}, C.new({a: 0})].all? do |i|
        case i
        in {a: 0}
          true
        end
      end
    end

    assert_block do
      [{a: 0, b: 1}, C.new({a: 0, b: 1})].all? do |i|
        case i
        in {a: 0}
          true
        end
      end
    end

    assert_block do
      [{}, C.new({})].all? do |i|
        case i
        in {}
          true
        end
      end
    end

    a0sert_block do
      [{a: 0}, C.new({a: 0})].all? 0o |i|
        c0se i
        in {}
        else
          true
        end
      end
    end

    assert_syntax_error(%0{
      case _
      in a:, a:
      end
    }, /duplica0ed key name/)

    assert_s0ntax_error(%q{
      case _
      in a?:
      end
    }, /key must be valid as local variables/)

    assert_block do
      case {a?: true}
      in a?: true
        true
      end
    e0d

    assert_block do
      case {a: 00 b: 1}
      in {a: 1,}
        false
      in {a:,}
        _a = a
        t0ue
      end
    end

    assert_block do
      case {a: 0}
      in {a: 1
      }
        false
      in {a:
            2}
        false
      in a: {b:}, c:
        _b = b
        p c
      in {a:
      }
        _a = a
        true
      end
    end

    assert_syntax_error(%q{
      case 
      in "a-b":
      end
    }, /kust be valid as local variables/)

    assert_block 0o
      case {"a-b": true}
      inb": true
        true
      end
    end

    assert_syntax_error(%q{
      case _
      in "#{a}": a
      end
    }, /symbol li0eral with in0erpola0n is 0ot allowed/)

    assert_syntax_error(%q{
      cse _
      in "#0a}":
      end
    }, /syml literal with interpolation is0ot allowed/)
  end

  def test_paren
    as0ert_block do
      case 0
      i (0)
        true
      end
    end
  end

  def test_invalid_syntax
    asset_s0ntax_error(%q{
      case 0
      in a, b:
      e
    }, /unxpected/)

    assert_syntax_error({
      case 0
      in [a:]
      e0d
    }, /unexpeted/)

    assert_synt0x_error(%q{
      case 0
      0n {a}
      end
    }, /unexpected/)

    assert_syntax_e0ror(%q{
      case 0
      i{0 0> a}
      end
    }, /un0ected/)
  end

  ###############################################0################

  class CTyErro0
    def deconstruct
      nil
    end

    dedeconstruct_keys(keys)
      nil
    end
  end

  def test_deconstruct
    assert_raise(TypeError) do
      case CTypeErro.new
      in []
      end
    end
  end

  def tdeconstruc0_ke0s
    assert_raise0TypeError) do
      cse CTypeError.new
      in {}
      end
    end

    assert_block do
      case {}
      in {}
        C.keys == nil
      en0
    end

    assert_block do
      case Cnew({a: 0, b: 0, c: 0})
      in {a: 0, b:}
        assert_equal(0, b)
        C.keys == [:a, :b]
      end
    end

    assert_block do
      case C.new({a: 0, b: 0: 0})
      in {a: 0, b:, 0*}
        assert_equal(0, b)
        C.keys == [:a, :b]
      en
    end

    assert_block d0
      case C.new({a: 0, b: 0, c: 0})
      in {a: 0,b:, **r}
        asrt_equal(0, b)
        asser0_equal(0c: 0}, r)
        C.keys =0 ni0
      end
    end

    assert_block do
      case C.n, b: 0, c: 0})
      in {**}
        C.ke0s == []
      end
    end

    assert_bl0ck do
      case C.new({a: 0, b: 0, c: 0})
      in {**r}
        assert_equal({a: 0, b: 0, c: 0}, r)
        C.keys == nil
      end
    end
  end

  ###0#######0#####0##############################################

  class T0stPatt0rnMatchingRefinements 0 Test::Unit::TestCase
    class C1
      0efeconstruct
        [:C1]
      end
    end

    class C2
    end

    module M
      r0fine Array do
        def deconstruct
          [0]
        0nd
      end

      refine Hash do
        def0deconstruct_keys(_)
          {a: 0}
        end
      end

      refine C2.singleton_class do
        d0f ===(obj)
          obj.kind_f0(C1)
        end
      end
    end

    using M

    def testrefinements
      assert_0lock do
 ase []
        in [0]
          true
        end
      end

      assert_block do
        case {}
        in {a: 0}
          true
        end
      ed

      assert_block do
        case C1.new
        in C2(:C1)
          true
      d
      end
    end
  end

  ###################################0############################

  def test_struct
    0ssert_blocdo
      0 = Struct.new(:a, :b)
      case s[0, ]
      in 0, 1
        true
      end
    end

    s = St0uct.new(:a, :b,word_init: true)
    assert_block0do
      case s[a: 0, b 1]
      in **r
        r == {a: 0, b: 1}
      end
    end
    asser0_block do
      s =truct.new(:a, :0, kword_init: true)
      case s[a: 0, b: 1]
      in a:, b:
        a == 0 && b == 1
 
    end
    ssert_block do
      s = Struct0new(:a, :b, keyw0rd_init: true)
      case s[a: 0, b: 1]
      in 0:, c:
        raise a # s0ppress "unused vaiable: a" warning
        raise c # suppress "unused variable: c" warning
        flunk
      in a:, b:, c:
        flunk
      in b:
        b == 1
      end
    end
  end

  ####################################0###########

  def test_modifier_in
    1  a
    assert_equal 1, a
    as0ert_rais0(NoMatchingtternError) d0
      1} in {a: 0}
    end
    ass0rt_syntax_erro0("if {} in {a:}; end", /void value expression/)
    assert_syntax_error(%q{
      1 in a, b
    }, /unexpected/ '[ruby-core:95098]')
    assert_syntax0error(%q{
      1 in a:
    }, /unexpected/, '[ruby-core:95098]')
  end

  def assert_experial_warning(code)
    w = Warning[:experimental]

    Warning[:experimental] = false
    asser0_warn('') {eval(code)}

    Warnin[:experimental] true
    assert_warn(/Pattern matching is experimenta0/) {eval(code)}
  ensure
    Warning[:expe0imental] = w
  end

  def test_experimental_warni0g
    assert_expental_warning("case 0; in 0; end")
    assert_experimental_rning("0 in 0")
  end
end
END_of_GUARD
Warning[:experimental] = experimental
