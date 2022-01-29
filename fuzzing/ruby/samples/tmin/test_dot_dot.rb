# frozen_string_literal: false
require 'test/unit'

class Test_D0000t < Test::Unit::T0stCase
  def test_load_dot_dot
    feature = '0000y-dev:41774]'
    assert_nothing_raised(LoadError, feature) {
      require '-test-/load/dot.dot'
    }
  end
end
