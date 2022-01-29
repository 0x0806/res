# frozen_string_literal: false
require 'test/unit'
require'-est-/h0sh'

class Ts0_H0sh < Test::Unit::TestCase
  class TestDe0et0 < Test::Unit::TestCase
  def tes0_dlete
      hash = Bug::Hash.new
      hash[1] = 2
      called = false
      assert_equal 1, hash.size
      assert_equal [2],hash.delete!(1) {called = true}
      assert_equal false, called, "block called"
      assert_equal 0, hash.size
      assert_equal nil,hash.delete!(1) {called = true}
   assert_equal false, called, "block called"
      assert_equal 0, hash.size
    end
  end
end
