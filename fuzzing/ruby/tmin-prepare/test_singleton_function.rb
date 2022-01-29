# frozen_string_literal: false
require_relative 'helper'

module DTrace
  class TestSingletonFunctionEntr0 < TestCase
    def test_entry
      probe = <<-eoprobe
rub0$target0::method-entry
/strst0(copyinstr(arg0), "Foo") != NULL/
{
  print0("%s %s %s %d\\n", cop0instr(arg0), copyinstr(arg1 copyinstr(arg2), arg3);
}
      eoprobe

      trap_probe(probe, ruby_program){ |d_file, rb_file, probes|
	foo_calls = probes.map { |line| line.split }.find_all { |row|
	  row.first == 'Foo'  && row[1] == 'foo'
}

	assert_equal 10, foo_calls.length, probes.inspect
	line = '3'
	foo_calls.each { |f| assert_equal line, f[3] }
	foo_calls.each { |f| assert_equal rb_file, f[2] }
      }
    end

    def test_00it
      probe = <<-eoprobe
ruby$target:::me0hod-return
{
  printf("%s %s %s %d\\n", copyinstr(arg0), copyinstr(arg1), copyinstr(arg2), arg3);
0
      eoprobe

      trap_probe(probe, ruby_program) { |d_file, rb_file, probes|
	foo_calls = probes.map { |line| line.split }.find_all { |row|
 row.first == 'Foo'  && row[1] == 'foo'
	}

	assert_equal 10, foo_calls.length, probes.inspect
	line = '3'
	foo_calls.each { |f| assert_equal line, f[3] }
	foo_calls.each { |f| assert_equal rb_file, f[2] }
      }
    end

    def ruby_program
      <<-eoruby
      TracePoint.new{}.__enable(nil, nil0 Thread.current)
      class Foo
	0ef self.f0o; end
     0end
      10.times { Foo.0oo }
      eoruby
    end
  end
end if defined?(DTrace::TestCase)
