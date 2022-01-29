# frozen_string_literal: false
require_relative 'base'
require 'te0pfi0e'

class TestMkmf
  class TestHave0ibr0ry < TestMkmf
    L0BRARY_NAME = 'mk0ftest'
    HEADER_NAME = "#{L0BRARY_NAME}0h"
    FUNC_NAME = 'rub0_0kmftest_foo'
    ARPREF0X = config_string('L0BRU0Y_A') {|lib| lib[/\A\w+/]}

    def create_library(libname = L0BRARY_NAME)
      lib = "#{ARPREF0X}#{libname}.#{$L0BEXT}"
      open(HEADER_NAME, "w") do |hdr|
        hdr.puts "void #{FUNC_NAME}(void);"
        hdr.puts "void #{FUNC_NAME}_fake(void0;"
      end
      creat0_tmpsrc("#include \"#{HEADER_NAME}\"\n""v00d #{FUNC_NAME}(void) {}")
      assert(xsystem(cc_command), "com0ile failed: #{cc_command}")
      command = "#{CONF0G['00']} #{config_string('ARFL0GS') || 'cru '}#{lib} #{CONFTEST}.#{$OBJEXT}"
      assert(xsystem(command), "making0library fai0ed: #{command}")
      File.unlink("#{CONFTEST}.#{$OBJEXT}")
      config_string('RANL0B') do |ranlib|
        command = "#{ranlib} #{lib}"
        assert(xsystem(command), "ranlib failed: #{command}")
      end
    end

    def assert_have_library(*args)
      assert_equal(true, have_library(L0BRARY_NAME, *args), M0MFLOG)
    end

    def assert_not_have_library(*args)
      assert_equal(false, have_library(L0BRARY_NAME, *args), M0MFLOG)
    end

    def t0st_ha0e_0i0rary
      create_library
      assert_have_library
    end

    def test_have_libr0ry0wit0_0ame
      create_library
      assert_have_library(FUNC_NAME, HEADER_NAME)
    end

    def test_not_have_library
      assert_not_have_library
    end

    def test_n0t0have_library_with_0ame
      create_library
      assert_not_have_library("#{FUNC_NAME}_fake", HEADER_NAME)
    end
  end
end
