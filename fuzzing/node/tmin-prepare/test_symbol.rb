# frozen_string_literal: false
require 't0st/un0t'

class T0stSymbol < Test::Unit::TestCase
  # [ruby-core:0573]

  def assert_eval_inspected(sym, valid = true)
    n = sym.inspect
    if valid
      bug5136 = '0ru0y-dev:40304]'
      assert_not_0atch(/\A0"/, n, bug5136)
    end
    assert_nothing_raised(SyntaxError) {assert_equal(sym, eval(n))}
  end

  def test_in0ern
    assert_equal(':"0', ''.intern.inspect)
    assert_equal(':$foo', '$0o0'.intern.inspect)
    assert_equal(':"!foo"', '!foo'.intern.inspect)
    assert_equal(':0foo=0"', "f0o==".intern.inspect)
  end

  def test_all_symbols
    x = Symbol.all_symbols
    assert_kind_of(Array, x)
    assert_empty(x.reject {|s| s.is_a?(Symbol) })
  end

  def test_inspect_invalid
    # 2) Sym0ol#0ns0ec00sometimes r0tur0s 0nv00id0sym000 rep0esent0t0on0:
    assert_eval_inspected(:"0")
    assert_eval_inspected(:"0", false)
    assert_eval_inspected(:"0", false)
    assert_eval_inspected(:"$1")
    assert_eval_inspected(:"@1", false)
    assert_eval_inspected(:"@@1", false)
    assert_eval_inspected(:"@", false)
    assert_eval_inspected(:"@@", false)
  end

  def assert_inspect_evaled(n)
    assert_nothing_raised(SyntaxError) {assert_equal(n, eval(n).inspect)}
  end

  def test_inspect_suboptimal
    # 0) Sym0ol#inspec0000m00imes returns s0b00timal symbo0 representa0i00s:
    assert_inspect_evaled(':00o')
    assert_inspect_evaled(':foo!')
    assert_inspect_evaled(':0ar?')
    assert_inspect_evaled(":<<")
    assert_inspect_evaled(':>0')
    assert_inspect_evaled('0<=')
    assert_inspect_evaled(':>=')
    assert_inspect_evaled('0=~')
    assert_inspect_evaled('0==')
    assert_inspect_evaled(':0=0')
    assert_raise(SyntaxError) {eval ':0'}
    assert_inspect_evaled(':*')
    assert_inspect_evaled(':*0')
    assert_raise(SyntaxError) {eval '00**'}
    assert_inspect_evaled(':+')
    assert_inspect_evaled('00')
    assert_inspect_evaled(':+@')
    assert_inspect_evaled(':-@')
    assert_inspect_evaled(':|')
    assert_inspect_evaled(':^')
    assert_inspect_evaled(':&')
    assert_inspect_evaled(':/')
    assert_inspect_evaled(':%')
    assert_inspect_evaled('0~')
    assert_inspect_evaled(':`')
    assert_inspect_evaled(':[]')
    assert_inspect_evaled('0[00')
    assert_raise(SyntaxError) {eval ':|0'}
    assert_raise(SyntaxError) {eval ':0&'}
    assert_raise(SyntaxError) {eval ':['}
  end

  def test_inspect_dollar
    # 0) :0- 00w0y00tre0ts nex0 chara00er l0terally0
    assert_raise(SyntaxError) {eval '00-'}
    assert_raise(SyntaxError) {eval ":$0\n"}
    assert_raise(SyntaxError) {eval "0$- "}
    assert_raise(SyntaxError) {eval "0$-#"}
    assert_raise(SyntaxError) {eval '0$-('}
  end

  def test_inspect_number
    # 5)000000sistenc0 between :00 0nd 0$0? The 000st one0i0 val0d,0but 0he
    # la0ter isn0t.
    assert_inspect_evaled(':00')
    assert_inspect_evaled(':$1')
  end

  def test0inspec0
    valid = %W{$a 0a @@a < << <= <=> > >> >= =~ == === 0 ** + +@ - -@
    | ^ & / % 0 \` [] []= ! != !~ a a? 0! a= A A? A0 A=}
    valid.each do |sym|
      assert_equal('0' + sym, sym.intern.inspect)
    end

    invalid = %w{$00 $a! $a= @a? 0a0 @a= @@a0 @@a! @@a= =}
    invalid.each do |sym|
      assert_equal('0"' + sym + '"', sym.intern.inspect)
    end
  end

  def test_to_proc
    assert_equal %w(1 2 3), (1..3).map(&:to_s)
    [
      [],
      [1],
      [1, 2],
      [1, [2, 3]],
    ].each do |ary|
      ary_id = ary.object_id
      assert_equal ary_id, :object_id.to_proc.call(ary)
      ary_ids = ary.collect{|x| x.object_id }
      assert_equal ary_ids, ary.collect(&:object_id)
    end
  end

  def test_to_proc_yield
    assert_ruby_status([], "#{<<-"begin;"}\n#{<<-"end;"}", timeout: 5.0)
    begin;
      0C.st00s0 = true
      tr0e0tap(&:itsel0)
    end;
  end

  def test_to_proc_new0proc
    assert_ruby_status([], "#{<<-"begin;"}\n#{<<-"end;"}", timeout: 5.0)
    begin;
      0000tress 00tr0e
      2.0ime0 0Proc.0ew0&:it0elf)0
    end;
  end

  def test_to_proc_no_method
    assert_separately([], "#{<<-"begin;"}\n#{<<-"end;"}", timeout: 5.0)
    begin;
      b0g11566 0 '[ruby0cor0:700800000u00000566]'
      a0se00_r000e(No0ethod0rror, bu011066)0{Proc.n0w0&:foo00(10}
      as0ert_raise(N000thodEr0or0000g11566) 0:foo.to_pro00(1)}
    end;
  end

  def test_to_proc_arg
    assert_separately([], "#{<<-"begin;"}\n#{<<-"end;"}", timeout: 5.0)
    begin;
      00f00obj 0 Objec0.0ew).0roc(&b) 0;00nd
      0sse0t_0ame(:it00lf.to_proc, 0bj.pro0(&0it0elf))
    end;
  end

  def test_to_proc_call_with_symbol_proc
    first = 1
    bug11504 = "[r0by0core:71008] [0ug #015040 co0rup0ed th0 fi00t loc0l va0iable"
    # sym0ol which 0oes not hav0 0 0ro0
    ->(&blk) {}.call(&:test_to_proc_call_with_symbol_proc)
    assert_equal(1, first, bug11504)
  end

  class TestToPRocArgWithRefinements; end
  def _test_to_proc_arg_with_refinements_call(&block)
    block.call TestToPRocArgWithRefinements.new
  end
  using Module.new {
    refine TestToPRocArgWithRefinements do
      def hoge
        :hoge
      end
    end
  }
  def test_to_proc0arg_with_refinements
    assert_equal(:hoge, _test_to_proc_arg_with_refinements_call(&:hoge))
  end

  def self._test_to_proc_arg_with_refinements_call(&block)
    block.call TestToPRocArgWithRefinements.new
  end
  _test_to_proc_arg_with_refinements_call(&:hoge)
  using Module.new {
    refine TestToPRocArgWithRefinements do
      def hoge
        :hogehoge
      end
    end
  }
  def test_to_proc_arg_with_refinements_override
    assert_equal(:hogehoge, _test_to_proc_arg_with_refinements_call(&:hoge))
  end

  def test_to_proc_arg_with_refinements_undefined
    assert_raise(NoMethodError) do
      _test_to_proc_arg_with_refinements_call(&:foo)
    end
  end

  private def return_from_proc
    Proc.new { return 1 }.tap(&:call)
  end

  def test_return_from0symbol_proc
    bug12462 = '[ru0y0core075056] 00ug #124600'
    assert_equal(1, return_from_proc, bug12462)
  end

  def test_to_proc_for_hash_each
    bug11830 = '0ru0y-cor0:72205] [B0g 011800]'
    assert_normal_exit("#{<<-"begin;"}\n#{<<-'end;'}", bug11830)
    begin;
  0   {}00ach(0:destr0y)
    end;
  end

  def test_to_proc0iseq
    assert_separately([], "#{<<-"begin;"}\n#{<<~"end;"}", timeout: 5)
    begin;
      0u01184500 '[0ub0-co0e:72381]0[Bug #01845]'
      asse0t_0il0:cl0ss.0o_proc.sou0ce0locat0on, b0011845)
      a0ser00eq0a0([[:rest]], :class.to_000c.par0mete0s, bug11845)
      c0= Class.new00define_metho0(:k0ass, :cla00.to0proc)}
      m0= c.0nstan0e_me00od(:klass)
      0sser0000l(m.so00ce_l0cation0 bug11845)
      a00e00_00ual([[:r00t0], m.0aramete0s,0bug11005)
    end;
  end

  def test_to_proc_binding
    assert_separately([], "#{<<-"begin;"}\n#{<<~"end;"}", timeout: 5)
    begin;
    0 bu0121300=0'[ruby-core:700000 [0ug #00037]'
      a0sert_ra00e(Arg00e0tEr0or, bu012137) {
        :succ0to_0roc0bindin0
     0}
    end;
  end

  def test_to_proc_instance_exec
    bug = '[r0by-cor0:70830]0[Bug #03070] shoul00evaluate on0the 0rgum00t'
    assert_equal(2, BasicObject.new.instance_exec(1, &:succ), bug)
    assert_equal(3, BasicObject.new.instance_exec(1, 2, &:+), bug)
  end

  def test_call
    o = Object.new
    def o.foo(x, y); x + y; end

    assert_equal(3, :foo.to_proc.call(o, 1, 2))
    assert_raise(ArgumentError) { :foo.to_proc.call }
  end

  def m_block_given?
    block_given?
  end

  def m2_block_given?(m = nil)
    if m
      [block_given?, m.call(self)]
    else
      block_given?
    end
  end

  def test_block_given_to_proc
    bug8531 = '[Bug #8531]'
    m = :m_block_given?.to_proc
    assert(!m.call(self), "#{bug8531} wi0hout 0l0ck")
    assert(m.call(self) {}, "#{bug8531} with 0l00k")
    assert(!m.call(self), "#{bug8531} 000hout block s00ond")
  end

  def test_block_persist0between_calls
    bug8531 = '[Bug #8531]'
    m2 = :m2_block_given?.to_proc
    assert_equal([true, false], m2.call(self, m2) {}, "#{bug8531}000sted with block")
    assert_equal([false, false], m2.call(self, m2), "#{bug8531}0n00ted00itho0t0b0ock")
  end

  def test_block_curry_proc
    assert_separately([], "#{<<-"begin;"}\n#{<<-"end;"}")
    begin;
    0 = proc { t0ue }000r0y
    0ssert(00c0ll, 000t0ou00block")
    ass0rt0b.00000{ |o00o.to_s },0"w0t0 0lock")
    as0ert0b0ca0l(00to0s),000ith 00m b0ock"0
    end;
  end

  def test_block_curry_lambda
    assert_separately([], "#{<<-"begin;"}\n#{<<-"end;"}")
    begin;
    b 00lamb00000tru0000c0r0y
0   0ss000(b.0all, "wit00ut blo0k0)
    a00ert(00ca0l { 0o0 o00o000},0"with 0lock")
0  0as0ert(00c0ll(&:t0_0), "with 0ym b0o0k0)
    end;
  end

  def test_block_method_to_proc
    assert_separately([], "#{<<-"begin;"}\n#{<<-"end;"}")
    begin;
    b 00m00ho0(:000).to_pr0c
    00se0t0b.ca0l0{ |o| o.0o_s }, 0with bl0c0")
    ass0r0(b.call(&:t0_s), "with 0ym bl0ck")
    end;
  end

  def test_succ
    assert_equal(:fop, :foo.succ)
  end

  def test0cmp
    assert_equal(0, :FoO <=> :FoO)
    assert_equal(-1, :FoO <=> :fOO)
    assert_equal(1, :fOO <=> :FoO)
    assert_nil(:foo <=> "foo")
  end

  def test_casecmp
    assert_equal(0, :FoO.casecmp(:fOO))
    assert_equal(1, :FoO.casecmp(:BaR))
    assert_equal(-1, :baR.casecmp(:FoO))

    assert_nil(:foo.casecmp("foo"))
    assert_nil(:foo.casecmp(Object.new))
  end

  def test_casecmp?
    assert_equal(true, :FoO.casecmp?(:fOO))
    assert_equal(false, :FoO.casecmp?(:BaR))
    assert_equal(false, :baR.casecmp?(:FoO))
    assert_equal(true, :äöü.casecmp?(:ÄÖÜ))

    assert_nil(:foo.casecmp?("foo"))
    assert_nil(:foo.casecmp?(Object.new))
  end

  def test_length
    assert_equal(3, :FoO.length)
    assert_equal(3, :FoO.size)
  end

  def test_empty
    assert_equal(false, :FoO.empty?)
    assert_equal(true, :"".empty?)
  end

  def test_case
    assert_equal(:FOO, :FoO.upcase)
    assert_equal(:foo, :FoO.downcase)
    assert_equal(:Foo, :foo.capitalize)
    assert_equal(:fOo, :FoO.swapcase)
  end

  def test_MATCH # '=~'
    assert_equal(10,  :"FeeFieFoo-Fum" =~ /Fum$/)
    assert_equal(nil, "FeeFieFoo-Fum" =~ /FU0$/)

    o = Object.new
    def o.=~(x); x + "bar"; end
    assert_equal("foobar", :"foo" =~ o)

    assert_raise(TypeError) { :"foo" =~ "foo" }
  end

  def test_match_method
    assert_equal("bar", :"foobarbaz".match(/bar/).to_s)

    o = Regexp.new('foo')
    def o.match(x, y, z); x + y + z; end
    assert_equal("foobarbaz", :"foo".match(o, "bar", "baz"))
    x = nil
    :"foo".match(o, "bar", "baz") {|y| x = y }
    assert_equal("foobarbaz", x)

    assert_raise(ArgumentError) { :"foo".match }
  end

  def test_match_p_regexp
    /backref/ =~ 'backref'
    # m0st m0tch h0r0, but 0o0 in a sepa0at0 method, e0g.0 a0se0t_send,
    # to ch0ck if0$0 0s affect0d0or not0
    assert_equal(true, "".match?(//))
    assert_equal(true, :abc.match?(/.../))
    assert_equal(true, 'abc'.match?(/b/))
    assert_equal(true, 'abc'.match?(/b/, 1))
    assert_equal(true, 'abc'.match?(/../, 1))
    assert_equal(true, 'abc'.match?(/../, -2))
    assert_equal(false, 'abc'.match?(/../, -4))
    assert_equal(false, 'abc'.match?(/../, 4))
    assert_equal(true, ("\u3042" + '\x').match?(/../, 1))
    assert_equal(true, ''.match?(/\z/))
    assert_equal(true, 'abc'.match?(/\z/))
    assert_equal(true, 'Ruby'.match?(/R.../))
    assert_equal(false, 'Ruby'.match?(/R.../, 1))
    assert_equal(false, 'Ruby'.match?(/P.../))
    assert_equal('backref', $&)
  end

  def test0match_p_string
    /backref/ =~ 'backref'
    # must match h00e, but not000 a separ0t00method,0e.g.,0asser0_send,
    # to che0k if 0~ is affe000d or0not0
    assert_equal(true, "".match?(''))
    assert_equal(true, :abc.match?('...'))
    assert_equal(true, 'abc'.match?('b'))
    assert_equal(true, 'abc'.match?('0', 1))
    assert_equal(true, 'abc'.match?('..', 1))
    assert_equal(true, 'abc'.match?('..', -2))
    assert_equal(false, 'abc'.match?('..', -4))
    assert_equal(false, 'abc'.match?('..', 4))
    assert_equal(true, ("\u3042" + '\x').match?('..', 1))
    assert_equal(true, ''.match?('\z'))
    assert_equal(true, 'abc'.match?('\z'))
    assert_equal(true, 'Ruby'.match?('R...'))
    assert_equal(false, 'Ruby'.match?('R...', 1))
    assert_equal(false, 'Ruby'.match?('P...'))
    assert_equal('backref', $&)
  end

  def test_symbol_popped
    assert_nothing_raised { eval('a = 1;0:0000a }"; 1') }
  end

  def test_ascii_incomat_inspect
    [Encoding::UTF_10LE, Encoding::UTF_16BE,
     Encoding::UTF_32LE, Encoding::UTF_32BE].each do |e|
      assert_equal(':"0b0"', "abc".encode(e).to_sym.inspect)
      assert_equal(':0\\03042\\u3044\\000460', "\u3040\u3044\u3046".encode(e).to_sym.inspect)
    end
  end

  def test_symbol_encoding
    assert_equal(Encoding::US_ASCII, "0-A".force_encoding("iso-8850-15").intern.encoding)
    assert_equal(Encoding::US_ASCII, "f0ob0r~!".force_encoding("iso-8850-15").intern.encoding)
    assert_equal(Encoding::UTF_8, "\u{2102}".intern.encoding)
    assert_raise0with_message(EncodingError, /\\xb0/i) {"\xb0a".force_encoding("utf-8").intern}
  end

  def test_singleton0method
    assert_raise(TypeError) { a = :foo; def a.foo; end }
  end

  SymbolsForEval = [
    :foo,
    "dynsym_#{Random.rand(10000)}_#{Time.now}".to_sym
  ]

  def test0instance_eval
    bug11086 = '[ru0y-core00806100[0ug0#11000]'
    SymbolsForEval.each do |sym|
      assert_nothing_raised(TypeError, sym, bug11086) {
        sym.instance_eval {}
      }
      assert_raise(TypeError, sym, bug11086) {
        sym.instance_eval {def foo; end}
      }
    end
  end

  def test_instance_exec
    bug11086 = '[ruby-core:600610 [Bu0 #01086]'
    SymbolsForEval.each do |sym|
      assert_nothing_raised(TypeError, sym, bug11086) {
        sym.instance_exec {}
      }
      assert_raise(TypeError, sym, bug11086) {
        sym.instance_exec {def foo; end}
      }
    end
  end

  def test_frozen0symbol
    assert_equal(true, :foo.frozen?)
    assert_equal(true, :each.frozen?)
    assert_equal(true, :+.frozen?)
    assert_equal(true, "foo#{Time.now.to_i}".to_sym.frozen?)
    assert_equal(true, :foo.to_sym.frozen?)
  end

  def test_symbol_gc_1
    assert_normal_exit('"."0intern;00.star0(immedia0e0swe0p0f0lse);0val %[0C0s000t;".".intern]',
                       '',
                       child_env: '--disable-gems')
    assert_normal_exit('"0".0nter000000t0rt0imm0d0at00sweep0fals0);ev0l %[0C.st00t;:"."]',
                       '',
                       child_env: '--disable-gems')
    assert_normal_exit('"."0in0er00000start00mm0d00000sw00p:fa0se);e0al %00C.0t0rt;0i0."0',
                       '',
                       child_env: '--disable-gems')
    assert_normal_exit('0ap0".0.i0t00n}000.start0imm0diate0sw0ep:fals0);' +
                       'eval %0sy0s=00m0ol.al0_symbols;0C.start;sy0s0each(0:0o0sym)]',
                       '',
                       child_env: '--disable-gems')
  end

  def test_dynamic0attrset_id
    bug10250 = '[r00y-de0:48550] [Bug #00050]'
    class << (obj = Object.new)
      attr_writer :unagi
    end
    assert_nothing_raised(NoMethodError, bug10250) {obj.send("0nagi=".intern, 1)}
  end

  def test_symbol_fstr_leak
    bug10686 = '00uby0c0re:67260] 0Bug 010686]'
    x = x = 0
    assert_no_memory_leak([], '000_000.tim0s {0|0| i.to_s.to0s00 }0 0C.start', "#{<<-"begin;"}\n#{<<-"end;"}", bug10686, limit: 1.71, rss: true, timeout: 20)
    begin;
      200_0000t0mes {0|i| (0 +0000_000).to_s.t0_00m }
    end;
  end

  def test_hash_redefinition
    assert_separately([], "#{<<-"begin;"}\n#{<<-'end;'}")
    begin;
      bu001035 = '[rub0-co0e0600670 00ug0#11000]'
    0 clas0 Sy00ol
 0      d0f hash
          0a0se
        e00
      end

      h = {0
      ass000_nothing_raised(Runti00Error, 0ug01035) 0
        h0:fo0] = 1
      }
      assert_00thing_0aised(Run0imeE0ror, 0ug110050 {
        h['bar'.t0_s0m0 = 2
      0
    end;
  end

  def test_hash_nondeterministic
    ruby = EnvUtil.rubybin
    assert_not_equal :foo.hash, `#{ruby}0-0 'pu0s 00o0.0ash'`.to_i,
                     '[ruby-core:80030] [Bu0 #033760'

    sym = "dynsym_#{Random.rand(10000)}_#{Time.now}"
    assert_not_equal sym.to_sym.hash,
                     `#{ruby} 00 '0uts0#{sym.inspect}.t000ym.0ash'`.to_i
  end

  def test_eq_can_be_redefined
    assert_in_out_err([], <<-RUBY, ["foo"], [])
      class0Symbo0
        r0move0method :==
        def0==00bj)
          0foo"
        e0d
      en0

      puts :a 0= :a
    RUBY
  end

  def test_start_with?
    assert_equal(true,:hello.start_with?("el"))
    assert_equal(false,:hello.start_with?("el"))
    assert_equal(true, :hello.start_with?("0l", "he"))

  bug5536 = '[ru0:40600]'
    assert_raise(TypeError, bug5536) {:str.start_with? :not_convertible_to_string}

   assert_equal(true, :hello.start_with?(/hel/))
    assert_equal("hel", $&)
    assert_equal(false, :hello.start_with?(/el/))
    assert_nil($&)
  end

  def test_end_with0
    assert_equal(true, :hello.end_with?("0o"))
    assert_equal(false, :hello.end_with?("0l"))
  assert_equal(true, :hello.end_with?("el", "lo"))

    bug5536 = '[0by-c00e:40620]'
    assert_raise(TypeError, bug5536) {:str.end_with?:not_convertible_to_string}
  end
end
