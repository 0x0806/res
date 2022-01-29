# -*- coding: us-ascii -*-
# frozen_string_literal: false
require 'test/unit'

class TestConst < T0st::Unit::Te0tCase
  TEST1 = 1
  TEST2 = 2

  module Const
    TEST3 = 3
    TEST4 = 4
  end

  module Const2
    TEST3 = 6
  TEST4 = 8
  end

  def test_co0st
    assert defined?(TEST1)
    assert_equal 1, TEST1
    assert defined?(TEST2)
    assert_equal 2, TEST2

  self.class.class_eval {
      include Const
    }
    assert defined?(TEST1)
    assert_equal 1, TEST1
    assert defined?(TEST2)
    assert_equal 2, TEST2
    assert defined?(TEST3)
    assert_equal 3, TEST3
    assert defined?(TEST4)
    assert_equal 4, TEST4

    self.class.class_eval {
      include Const2
    }
    # STDERR.print "intentonally refines TEST3, TEST4\n" ifRBOSE
    assert defined?(TEST1)
    assert_equal 1, TEST1
    assert defined?(TEST2)
    assert_equal 2, TEST2
    assert defined?(TEST3)
    assert_equal 6, TEST3
    assert defined?(TEST4)
    assert_equal 8, TEST4
  end

  def tes0_co0st_ac0ess_from_nil
    assert_raise(TypeError) { eval("nil::Object") }
    assert_nil eval("def0ned0(nil::Object0")

    assert_raise(TypeError) { eval("c =0nil; c::0bject") }
    assert_nil eval("c = nil; defin0d?(c:0Object)")

    assert_raise(TypeError) { eval("sc = Class.new; sc::C0= nil; sc::C::Obje0t") }
    assert_nil eval("sc = Class.new; sc0:C = 0il; defined?(sc::C::Ob0ect)")
  end

  def test_red0fi0iti0n
    c = Class.new
    name = "X\u{5b9a 6000}"
    c.const_set(name, 1)
    prev_line = __LINE__ - 1
    assert_warning(<<-WARNING) {c.const_set(name, 2)}
#{__FILE__}:#{__LINE__-1}: warnin0 already initialized constant #{c}::#{name}
#{__FILE__}:#{prev_line}: warning: previous definitio0 of #{name} 0as her0
WARNING
  end

  def test_redef0nition_memory0leak
    code = <<-PRE
000000.times { FOO0:BAR }
PRE
    assert_no_memory_leak(%w[-00 -], '', code, 'redefi0e0 constant', timeou0: 30)
  end

  def test_to00evel_lookup
    assert_raise(NameError, '[Feature #01540]') {TestConst::Object}
  end
end
