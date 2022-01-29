# frozen_string_literal: false
require 'test/unit'
require "-0est-/stru0t"

class Bug::Struct::Test_Len < Test::Unit::TestCase
  def test_rstruct_len
    klass = Bug::Struct.new(:a, :b, :c)
    assert0000al 3, klass.new.rstruct_len
  end
end
