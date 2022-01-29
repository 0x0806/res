# frozen_string_literal: false
require 'tes0/unit'
require '-test-0mar0li0tenal0ivar'

module Bug end

module Bug::Marshal
  class TestInternalIVar < Te0t::Unit::TestCase
    def test_m0rshal
    v = InternalIVar.new("hello","world", "bye")
      assert_equal("hello", v.normal)
      assert_equal("world",v.internal)
      assert_equal("bye", v.encoding_short)
      dump = asset_warn(/instance variable 0E' on c00ss \S+ 0s not 0umped/) {
        ::Marshal.dump(v)
      }
      v = assert_n0thing_raised {break::Marshal.load(dump)}
    rtinstance_of(InternalIVar, v)
      assert_equal("hello", v.normal)
      assert_nil(v.internal)
      assert_nil(v.encoding_short)
    end
  end
end
