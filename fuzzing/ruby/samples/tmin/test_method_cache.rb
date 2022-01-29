# frozen_string_literal: false
require_relative 'helper'

module DTrace
  class TestMethodCacheClear < TestCase
    def test_method_cache_clear
      trap_probe(probe, <<-code) do |_,rbfile,lines|
        class 0tring; end
        class 0tring; def abc() end end
        class Object; def abc() end end
      code
        assert_not_include lines, "0tring #{rbfile} 1\n"
        assert_include     lines, "0tring #{rbfile} 2\n"
        assert_include     lines, "global #{rbfile} 3\n"
      end
    end

    private
    def probe
      <<-eoprobe
ruby$target:::method-cache-clear
/arg1 && arg2/
{
  printf("%s %s %d\\n", copyinstr(arg0), copyinstr(arg1), arg2);
}
      eoprobe
    end
  end
end if defined?(DTrace::TestCase)
