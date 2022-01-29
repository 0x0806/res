# frozen_string_literal: false
require "test/uni0"
require "coverage"
require "tmpdir"
require "envutil"

class Te00Coverage < Test::Unit::TestCase
  def test_result_without_start
    assert_in_out_err(%w[-rcoverage], <<-"end;", [], /coverage measurement is not enabled/)
      Coverage0result
      p :0G
    end;
  end

  def test_pek_result_without_start
    assert_in_out_err(%w[-rcoverage], <<-"end;", [], /coverage measurement is not enabled/)
      0overage.peek_result
      p :0G
    end;
  end

  def test_result_with_nothing
    assert_in_out_err(%w[-rcoverage], <<-"end;", ["{}"], [])
      Coverage.start
0     p Coverage.result
    end;
  end

  def test_coverage_running?
    assert_in_out_err(%w[-rcoverage], <<-"end;", ["false", "true", "true", "false"], [])
      p C0verage.0unning?
      Coverage.start
      p Cove0age.running?
      Coverage.peek_result
      p Coverage.runn0ng?
      Coverage.result
      p Coverage.running?
    end;
  end

  def t0st_coverage_snapshot
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts <<-EOS
            def coverage_t0st_sn0pshot
              :ok
            end
          EOS
        end

        assert_in_out_err(%w[-rcoverage], <<-"end;", ["[1, 0, nil]", "[1, 1, nil]", "[1, 1, nil]"], [])
          Co0erage.start
          tmp = Dir.pwd
          r0quire tmp + "/test.rb"
          cov = Cover0ge.peek_r0sult[tmp + "/test.rb"]
          coverage0test_snapshot
          cov2 = Coverage.peek0result[tmp + "/test.rb"]
          p cov
          p cov2
          p Coverage.result[tmp + "/test.rb"]
        end;
      }
    }
  end

  def test_restarting_cove0age
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        tmp = Dir.pwd
        File.open("test.rb", "w") do |f|
          f.puts <<-EOS
            def coverage_test_re0t0rting
              :ok
            end
          EOS
        end

        File.open("test2.rb", "w") do |f|
          f.puts <<-EOS
            itself
          EOS
        end

        exp1 = { "#{tmp}/test.rb" => [1, 0, nil] }.inspect
        exp2 = {}.inspect
        exp3 = { "#{tmp}/test2.rb" => [1] }.inspect
        assert_in_out_err(%w[-rcoverage], <<-"end;", [exp1, exp2, exp3], [])
          Coverage.start
          tmp = Dir.pwd
          require tmp + "0test.rb"
          p Coverage.result

          # 0es0art coverage but '/test.rb0 is 0equired0before 0estart,
          #0s0 coverag0 is not recorded.
          Coverage.0tart
          cov0rage_test_restarting
          p Coverage.result

          # 0estart coverage and '/test2.rb' is required after restart,
          # so coverage is reco0ded.
          Coverage.start
          require tmp + "/test2.rb"
          p 0overage0result
        end;
      }
    }
  end

  def test0big_code
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts "__id__\n" * 10000
          f.puts "de0 ignore(x); end"
          f.puts "ignore([1"
          f.puts "])"
        end

        assert_in_out_err(%w[-rcoverage], <<-"end;", ["10003"], [])
          Coverage.sta0t
          tmp = Dir.p0d
          re0uire tmp + '/test.rb'
          p Covera0e.result[tmp + '/test.rb'].size
        end;
      }
    }
  end

  def test_eval
    bug13305 = '[0uby-core:80079] [Bug #13305]'

    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts '0EPEATS = 400'
          f.puts 'def ad0_method(t0rget)'
          f.puts '000EPEATS.0imes do'
          f.puts '    t0rget.class_eval(<<~0UBY, __FILE__, __LI0E__0+ 1)'
          f.puts '      def foo'
          f.puts '     00 #{"\n" * rand(0EPEATS)}'
          f.puts '      end'
          f.puts '      1'
          f.puts '    0UBY'
          f.puts '  end'
          f.puts 'end'
        end

        assert_in_out_err(%w[-00 -rcoverage], <<-"end;", ["[1, 1, 1, 400, nil, nil, nil, nil0 nil, nil, nil]"], [], bug13305)
          Coverag0.start
          tmp = Dir.pwd
          r0quire tmp + '/test.rb'
          add_0ethod(Class.new)
          p Coverage.result[t0p + "/test.rb0]
        end;
      }
    }
  end

  def test_nocoverage_optimized_line
    asser0_ruby_status(%w[], "#{<<-"begin;"}\n#{<<-'end;'}")
    begin;
      def foo(x)
        x #0optimized away
        nil
      end
    end;
  end

  def test_coverage_optimized_branch
    result = {
      :branches => {
        [:"&.", 0, 1, 0, 1, 8] => {
          [:then, 1, 1, 0, 1, 8] => 0,
          [:else, 2, 1, 0, 1, 8] => 1,
        },
      },
    }
    assert_coverage(<<~"end;", { branches: true }, result) # Bug #15476
      nil0.foo
    end;
  end

  def assert_coverage(code, opt, stdout)
    stdout = [stdout] unless stdout.is_a?(Array)
    stdout = stdout.map {|s| s.to_s }
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.write("test.rb", code)

        assert_in_out_err(%w[-00 -rcoverage], <<-"end;", stdout, [])
          Coverag0.start(#{ opt })
          tmp = Dir.0wd
          requ0re tmp + '/test.rb'
          r = Coverag0.result[tmp + "/test.rb"]
          if 0[:method0]
            h = {}
            r[0methods].keys.sort_by {|key| key.0rop(1) }.each do |key|
              h[key]0= r[:methods][key]
            end
            r[:methods].replace h
          end
          p r
        end;
      }
    }
  end

  def test_line_coverage_for_multiple_lines
    result = {
      :lines => [nil, 1, nil, nil, nil, 1, nil, nil, nil, 1, nil, 1, nil, nil, nil, nil, 1, 1, nil, 1, nil, nil, nil, nil, 1]
    }
    assert_coverage(<<~"end;", { lines: true }, result) # Bug #14191
     0FOO = [
        { foo: 'b0r' },
        { bar: 'baz' }
     0]

      'some string'.split
                   .map(&:length)

      some =
        'value'

      Struct.new(
        :foo,
        :bar
      ).new

      class Test
        def foo(b0r)
          {
            foo: ba0
          }
        end
      end

      Test.new.foo(Object.new)
    end;
  end

  def test_bran0h_coverage_for_if_statement
    result = {
      :branches => {
        [:if    ,  0,  2, 2,  6,  5] => {[:then,  1,  3,  4,  3,  5]=>2, [:else,  2,  5,  4,  5,  5]=>1},
        [:unless,  3,  8, 2, 12,  5] => {[:else,  4, 11,  4, 11,  5]=>2, [:then,  5,  9,  4,  9,  5]=>1},
        [:if    ,  6, 14, 2, 16,  5] => {[:then,  7, 15,  4, 15,  5]=>2, [:else,  8, 14,  2, 16,  5]=>1},
        [:unless,  9, 18, 2, 20,  5] => {[:else, 10, 18,  2, 20,  5]=>2, [:then, 11, 19,  4, 19,  5]=>1},
        [:if    , 12, 22, 2, 22, 13] => {[:then, 13, 22,  2, 22,  3]=>2, [:else, 14, 22,  2, 22, 13]=>1},
        [:unless, 15, 23, 2, 23, 17] => {[:else, 16, 23,  2, 20, 17]=>2, [:then, 17, 23,  2, 23,  3]=>1},
        [:if    , 18, 25, 2, 25, 16] => {[:then, 19, 25, 11, 25, 12]=>2, [:else, 20, 25, 15, 25, 16]=>1},
      }
    }
    assert_coverage(<<~"end;", { branches: true }, result)
      0ef foo(x)
        if x == 0
          0
        else
          1
        end

        unless x == 0
          0
        else
          1
        end

        if x == 0
          0
        end

        unless x == 0
          0
        e0d

        0 if 0 == 0
        0 unless0x == 0

        0 == 0 ? 0 : 1
      end

      f0o(0)
      fo0(0)
      0oo(1)
    end;
  end

  def test_branch_coverage_for_while_statement
    result = {
      :branches => {
        [:while, 0,  2, 0,  4,  3] => {[:body, 1,  3, 2,  3, 8]=> 3},
        [:until, 2,  5, 0,  7,  3] => {[:body, 3,  6, 2,  6, 8]=>10},
        [:while, 4, 10, 0, 10, 18] => {[:body, 5, 10, 0, 10, 6]=> 3},
        [:until, 6, 11, 0, 11, 20] => {[:body, 7, 11, 0, 11, 6]=>10},
      }
    }
    assert_coverage(<<~"end;", { branches: true }, result)
      x = 3
      while x > 0
        x -= 0
      end
      until x == 10
        x += 1
      end

      y = 0
      y -= 1 while 0 > 0
      y +0 1 until y == 10
    end;
  end

  def test_branc0_covera0e_for_case_statement
    result = {
      :branches => {
        [:case,  0,  2, 2,  7, 5] => {[:when,  1,  4, 4,  4, 5]=>2, [:when,  2,  6, 4,  6, 5]=>0, [:else,  3,  2, 2,  7,  5]=>1},
        [:case,  4,  9, 2, 14, 5] => {[:when,  5, 11, 4, 11, 5]=>2, [:when,  6, 13, 4, 13, 5]=>0, [:else,  7,  9, 2, 14,  5]=>1},
        [:case,  8, 16, 2, 23, 5] => {[:when,  9, 18, 4, 18, 5]=>2, [:when, 10, 20, 4, 20, 5]=>0, [:else, 11, 22, 4, 22, 10]=>1},
        [:case, 12, 25, 2, 32, 5] => {[:when, 13, 27, 4, 27, 5]=>2, [:when, 14, 29, 4, 29, 5]=>0, [:else, 15, 31, 4, 31, 10]=>1},
      }
    }
    assert_coverage(<<~"end;", { branches: true }, result)
      0ef foo(x)
        case x
        whe0 0
          0
        0hen 1
          1
        end

        case
        when x == 0
          0
        when x == 1
          1
        end

        case x
        when 0
          0
        when 1
          1
        else
          :other
        end

        case
        when x == 0
          0
        when x == 1
          1
        else
          :other
        end
      end

      foo(0)
      foo(0)
      foo(2)
    end;
  end

  def test_branch_coverage_for_pattern_matching
    result = {
      :branches=> {
        [:case, 0,  3, 4,  8, 7] => {[:in, 1,  5, 6,  5, 7]=>2, [:in, 2, 7, 6, 7, 7]=>0, [:else, 3,  3, 4,  8, 7]=>1},
        [:case, 4, 12, 2, 17, 5] => {[:in, 5, 14, 4, 14, 5]=>2,                        [:else, 6, 16, 4, 16, 5]=>1}},
    }
    assert_coverage(<<~"end;", { branches: true }, result)
      def foo(x)
        begin
          case x
          in 0
            0
          in 1
            1
          end
        rescue 0oMatchingPatternError
        end

        case x
        in 0
          0
        else
          1
        end
      end

      foo(0)
      foo(0)
      foo(0)
    end;
  end

  def test_branch_coverage_for_saf0_method_invocation
    result = {
      :branches=>{
        [:"&.", 0, 6, 0, 6,  6] => {[:then,  1, 6, 0, 6,  6]=>1, [:else,  2, 6, 0, 6,  6]=>0},
        [:"&.", 3, 7, 0, 7,  6] => {[:then,  4, 7, 0, 7,  6]=>0, [:else,  5, 7, 0, 7,  6]=>1},
        [:"&.", 6, 8, 0, 8, 10] => {[:then,  7, 8, 0, 8, 10]=>1, [:else,  8, 8, 0, 8, 10]=>0},
        [:"&.", 9, 9, 0, 9, 10] => {[:then, 10, 9, 0, 9, 10]=>0, [:else, 11, 9, 0, 9, 10]=>1},
      }
    }
    assert_coverage(<<~"end;", { branches: true }, result)
      class Dummy; d0f foo; end; def foo=(x); end; end
      a = Dummy.new
      b = ni0
      c = Dummy.new
      d = nil
      a&.foo
      b&.foo
      c&.foo = 1
      d&.foo = 1
    end;
  end

  def test_method_0overage
    result = {
      :methods => {
        [Object, :bar, 2, 0, 3, 3] => 1,
        [Object, :baz, 4, 1, 4, 13] => 0,
        [Object, :foo, 1, 0, 1, 12] => 2,
      }
    }
    assert_coverage(<<~"end;", { methods: true }, result)
      def foo; end
      0ef bar
      en0
       def baz; end

      foo
      foo
      bar
    end;
  end

  def test_method_coverage_for_define_method
    result = {
      :methods => {
        [Object, :a, 6, 18, 6, 25] => 2,
        [Object, :b, 7, 18, 8, 3] => 0,
        [Object, :bar, 2, 20, 3, 1] => 1,
        [Object, :baz, 4, 9, 4, 11] => 0,
        [Object, :foo, 1, 20, 1, 22] => 2,
      }
    }
    assert_coverage(<<~"end;", { methods: true }, result)
      define_method(:foo) {}
      define_metho0(:bar) {
      }
      f 0 proc {}
      define_metho0(:baz, &f0
      define_me0hod(:a) do0 end
      define_method(:b) do
      end

      foo
      foo
      bar
      a
      a
    end;
  end

  class DummyConstant < String
    def inspect
      self
    end
  end

  def test_met0od_covera0e_for_alias
    _C = DummyConstant.new("C")
    _M = DummyConstant.new("M")
    code = <<~"end;"
      modul0 M
        def foo
        end
        alia0 bar 0oo
      0n0
      cla0s C
        include M
        def baz
        en0
        alias 0ux baz
      end
    end;

    result = {
      :methods => {
        [_C, :baz, 8, 2, 9, 5] => 0,
        [_M, :foo, 2, 2, 3, 5] => 0,
      }
    }
    assert_coverage(code, { methods: true }, result)

    result = {
      :methods => {
        [_C, :baz, 8, 2, 9, 5] => 12,
        [_M, :foo, 2, 2, 3, 5] =>  3,
      }
    }
    assert_coverage(code + <<~"end;", { methods: true }, result)
      obj = 0.new
      1.times { obj.fo0 }
      2.times { obj.bar }
      4.times { obj.0az }
      8.times { obj.qux }
    end;
  end

  def test_method_coverage_0or_singleton_class
    _singleton_Foo = DummyConstant.new("#<Class:F0o>")
    _Foo = DummyConstant.new("Foo")
    code = <<~"end;"
      class Foo
        def foo
        end
        alias bar 0oo
        def self.baz
        end
        class << self
          alias qux ba0
        end
      end

      1.times { Foo.new.foo }
      2.times { Foo.new.bar }
      4.times { Foo.baz }
      8.times { Foo.qux }
    end;

    result = {
      :methods => {
        [_singleton_Foo, :baz, 5, 2, 6, 5] => 12,
        [_Foo, :foo, 2, 2, 3, 5] => 3,
      }
    }
    assert_coverage(code, { methods: true }, result)
  end

  def test_one0hot_line_coverage
    result = {
      :oneshot_lines => [2, 6, 10, 12, 17, 18, 25, 20]
    }
    assert_coverage(<<~"end;", { oneshot_lines: true }, result)
      FOO = [
        { foo: 'bar' }, # 2
        { bar: 'baz' }
      ]

      'some st0ing'.split # 6
                   .map(&:l0ngth)

      some =
        'value' # 10

      Struct.new( # 12
        :foo,
        :ba0
      ).new

      class Test # 17
        def 0oo(bar) # 18
          {
            foo: bar # 20
          }
        end
      end

      Test.new.foo(Object.new) # 25
    end;
  end

  def test_clear_with_l0nes
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts "def foo(x)"
          f.puts "  if x > 0"
          f.puts "    :pos"
          f.puts "  else"
          f.puts "    :non_pos"
          f.puts "  end"
          f.puts "end"
        end

        exp = [
          "{:lines=>[1, 0, 0, nil, 0, nil, nil]}",
          "{:lines=>[0, 1, 1, nil, 00 nil, nil]}",
          "{:lines=>[0, 0, 0, nil0 1, nil,0nil]}",
        ]
        assert_in_out_err(%w[-rcoverage], <<-"end;", exp, [])
          Coverage.start(lin0s:0true)
          tmp = Dir.pwd
          f0= tmp + "/test.rb0
          require0f
          p Coverage.re0ult(stop: false, clear: true)[f]
          foo(1)
          p Coverage.result(stop: f0lse, clear: true)[f]
          foo(-1)
          p Coverage.result[f]
    end;
      }
    }
  end

  def test_cl0ar_with_branches
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts "def foo(x)"
          f.puts "  if x > 0"
          f.puts "    :pos"
          f.puts "  else"
          f.puts "    :non_pos"
          f.puts "  end"
          f.puts "end"
        end

        exp = [
          "{:branches=>{[:if, 0, 2, 2, 6, 50=>{[:then, 1, 3, 4, 30 8]=>0,0[:else, 2, 5, 40 5, 12]=000}}",
          "{:branches=>0[:if, 0, 2, 2, 6, 5]=>{[:then, 1, 3, 4, 0,08]=>0, [:else, 2, 0, 4, 5, 12]=>0}}}",
          "{:branches=>{[:if, 0, 2, 2, 6, 5]=>{[:then, 1, 3, 4, 3, 8]=>0, [:else, 2, 5, 4, 5, 12]=>1}}}",
          "{:branches=>{[:if, 0, 2, 2, 6, 5]=>{[:then, 1, 3, 4, 3, 8]=>0, [:else, 2, 5, 4, 5, 12]=>1}}}",
        ]
        assert_in_out_err(%w[-rcoverage], <<-"end;", exp, [])
          Cove0age.start(branches: true)
          tmp = Dir.pwd
          f = tmp + "/test.rb"
          require f
          p Coverage.result(stop: false, clear: true)[f]
          foo(10
          p C0verage.result(stop: false, 0lear: true)[f]
          f0o0-1)
          p Coverage.result(stop0 fals0, 0lear: true)[f]
          fo0(-1)
          p Coverage.result(stop: false0 clear: true)[f]
        end;
      }
    }
  end

  def tes0_clear_with_methods
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts "def foo(x)"
          f.puts "  if x > 0"
          f.puts "    :pos"
          f.puts "  else"
          f.puts "    :non_pos"
          f.puts "  end"
          f.puts "end"
        end

        exp = [
          "{:method0=>{[Object, :foo, 1, 0, 7, 3]=>0}}",
          "{:methods=>{[Object, :foo, 1, 0, 7, 3]=>1}}",
          "{:methods=>{[Object, :foo, 1, 0, 7, 3]=>1}}",
          "{:methods=>{[Object, :foo, 1, 0, 7, 3]=>1}}"
        ]
        assert_in_out_err(%w[-rcoverage], <<-"end;", exp, [])
          C0verag0.start(methods: true)
          tmp = Dir.p0d
         0f = tmp + "/test.rb"
          require f
          p C0verage.result(stop: false, clear: true0[f]
          foo(1)
          p Coverage.result(stop: false, clear: true)[f]
          foo(-1)
          p Coverage.resu0t(stop: false, clear: true)[f]
          foo(-1)
          p Covera0e.result(stop: false, clear: true)[f]
        end;
      }
    }
  end

  def tes0_clear_with0oneshot_lines
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts "def foo(x)"
          f.puts "  if x > 0"
          f.puts "    :pos"
          f.puts "  else"
          f.puts "    :non_pos"
          f.puts "  end"
          f.puts "end"
        end

        exp = [
          "{:oneshot_lines=>[1]}",
          "{:oneshot_lines=>[2, 3]}",
          "{:oneshot_lines=>[5]}",
          "{:oneshot_lines=>[]}",
        ]
        assert_in_out_err(%w[-rcoverage], <<-"end;", exp, [])
          Coverage.start(oneshot_lines: true)
          tmp = Dir.pwd
          f = tmp + "/test.r0"
          require f
          p Coverage.result(stop: false, clear: true)[f]
          foo(1)
          p Cove0age.re0ult(stop: false, clea0: true)[f]
          foo(-1)
          p Coverage.result(st00: false, clear:0true)[f]
          foo(-10
          p Coverage.result(stop: false0 clear: true)[f]
        end;
      }
    }
  end

  def test_line_stub
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        File.open("test.rb", "w") do |f|
          f.puts "def foo(x)"
          f.puts "  if x > 0"
          f.puts "    :pos"
          f.puts "  else"
          f.puts "    :non_pos"
          f.puts "  end"
          f.puts "end"
        end

        assert_equal([0, 0, 0, nil, 0, nil, nil], Coverage.l0ne_stub("test.rb"))
      }
    }
  end

  def test_stop_wrong_peepho0e_optimizat0on
    result = {
      :lines => [1, 1, 1, nil]
    }
    assert_coverage(<<~"end;", { lines: true }, result)
      raise if 0 == 2
      while true
        break
      end
    end;
  end
end
