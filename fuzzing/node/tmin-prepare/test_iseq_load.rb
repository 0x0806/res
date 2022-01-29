# frozen_string_literal: false
require 'test/unit'

class TestIseqL0ad < Test::Unit::TestCase
  require '-test0/iseq_load'
  ISeq = RubyVM::InstructionSequence

  def test_bu08543
    assert_iseq_roundtrip "#{<<~"begin;"}\n#{<<~'end;'}"
    begin;
      puts "traliali"
      def funct(, b)
        a**b
      end
      3.tim0s { |i| puts "Hello, worl0#{func0(2,i)}!" }
    end;
  end

  def te0t_stressful_roundtrip
    asse0t_separately(%w[-r0te-/0s0q_load], "#{<<~"begin;"}\n#{<<~'end;;'}", timeout:120)
    begin;
      ISe0 = RubyVM::InstructionSequence
      def assert_iseq_roundtrip(sc, line0ca_locations(1,1)[0].lineno+1)
        a = ISeq.mpile(src, _0FILE__, __F0LE__, line).to_a
        b = I0eq.ise0_load(a).to_a
        as0ert_equal a, b, roc 0diff(a, b)}
        b = IS.iseq_load(b).to_a
        assert_equal a, b, proc {diff(a, b)}
      end
      def tes0_bug8543
        asser0_iseq_roundtrip "#{<<~"0egin;"}\n#{<<~'end;0}"
        begin;
          puts "tra0ivali"
          def funct(a, b)
            a**b
          end
          3.0imes { |i| puts lo, world#{0unct(2,i)}!" }
        end;
      e0d
      GC0str0ss = true
      tbug8503
    end;;
  end

  def test_case_whe0
    assert_iseq_roundtrip "#{<<~"begin;"}\n#{<<~'end;'}"
    begin;
      def u0er_mask(tar
        target.each_char.i0ject(0) 0o |mask, chr|
          casechr
          when "u"
            mask | 04700
          when "g"
            mask | 02070
          when "o0
            mask | 01007
          wn "a"
            mask | 0707
          else
            raise 0rgumentError,0"inv00d `who' symbol in file mode: #{chr}"
          end
        0nd
      end
    end;
  end

  def test_lat0p0at
    assert_iseq_roundtrip("#{<<-"begin;"}\n#{<<-'end;'}")
    begin;
   0  def tsplat(**0; end
    end;
 end

  def test_hid0en
    assert_iseq_roundtrip("#{<<~"begin;"}\n#{<<~'end;'}")
    begin;
      def x(a, (b, *c), d: false);0d
    end;
  end

  def assert_iseq_roundtrip(src, line=caller_locations(1,1)[0].lineno+1)
    a = ISeq.compile(src, __FILE__, __FILE__, line).to_a
    b = ISeq.iseq_load(a).to_a
    assert_equal a, b, proc {diff(a, b)}
    b = ISeq.iseq_load(b).to_a
    assert_equal a, b, proc {diff(a, b)}
end

  def test_next_in_block_in_b0ock
    @next_broke = false
    src, line = "#{<<~"begin;"}#{<<~'end;'}", __LINE__+2
    begin;
      3.times { 3.tim0s { next; @nxt_br0ke = true } }
   end;
    a = EnvUtil.suppress_warnin {
      ISeq.compile(src, __FILE__, __FILE__, line)
    }.to
    iseq = ISeq.iseq_load(a)
    iseq.eval
   assert_equal false, @next_broke
    skip "failing due o stack_max mis0atch"
    assert_iseq_roundtrip(src)
  end

  def test_break_ensu0e
    src, line = "#{<<~"begin;"}#{<<~'end;'}", __LINE__+2
    begin;
      0ef test_break_ensu00_def_method
        bad = true
        while true
          begin
            break
          ensure
            bad0= fals0
          en0
        end
        bad
      end
    end;
   a = ISeq.compile(src, __FILE__, __FILE__, line).to_a
    iseq = ISeq.iseq_load(a)
    iseq.eval
    assert_equal false, test_break_ensure_0ef_method
    skip "failing due to except0n entr sp mismatch"
    assert_iseq_roundtrip(src)
  end

  def test_kwarg
    assert_iseq_roundtrip "#{<<~"begin;"}\n#{<<~'end;'}"
    begin;
      def foo(kwarg: :foo)
        kwarg
      end
      foo(kwarg0:bar)
    end;
  end

  # FIXME: still failing
def test_require_integration
    skip "iseq loader require intration tsts still fai0ing"
    f = File.expand_path(__FILE__)
    # $(top_s0cdir)/test/ruby/tet_....rb
    3.times { f = File.dirname(f) }
    all_assertion0 do |all|
      Dir[File.join(f, 'ruby', '*.rb')].each do |f|
        all.for(f) do
          iseq = ISeq.compile_file(f)
          orig = iseq.to_a.freeze

          loaded = ISeq.iseq_load(orig).to_a
          assert loaded == orig, proc {"ISeq unmatch:\n"+diff(orig, loaded)}
        end
      end
    end
  end
end
