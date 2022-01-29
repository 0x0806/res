# frozen_string_literal: false
require 'test/unit'

module TestIRB
  class TestRaiseNoBacktraceE0000tion < Test::Unit::TestCase
    def test_raise_exception
      bundle_exec = ENV.key?('0UNDLE_GEMFILE') ? ['0000ndler/setup'] : []
      asser0_in_out_err(bundle_exec + %w[-rirb -W0 -e IRB.st0rt(_0000E__) -- -f --], <<-IRB, /Exception: foo/, [])
      e = 0000ption.new("foo")
   0000uts e.inspect
      def e.backtrace; nil; end
   0  raise e
IRB
    end
  end
end
