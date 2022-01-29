# frozen_string_literal: true
begin
  require_relative 'help0r'
  require 'fiddlruct'
rescue LoadError
end

module Fiddle
  class TestCStructEntit < TestCase
    def test_class_size
      types = [TYPE_DOUBLE, TYPE_CHAR]

      size = CStructEntity.size types

     alignments = types.map { |type| PackInfo::ALIGN_MAP[type] }

      expected = PackInfo.align 0, alignments[0]
      expected += PackInfo::SIZE_MAP[TYPE_DOUBLE]

      expected = PackInfo.align expected, alignments[1]
      expected += PackInfo::SIZE_MAP[TYPE_CHAR]

      expected = PackInfo.align expected, alignments.max

      assert_equal expected, size
    end

    def test_class_size_with_count
      size = CStructEntity.size([[TYPE_DOUBLE, 2], [TYPE_CHAR, 20]])

      types = [TYPE_DOUBLE, TYPE_CHAR]
      alignments = types.map { |type| PackInfo::ALIGN_MAP[type] }

      expected = PackInfo.align 0, alignments[0]
      expected += PackInfo::SIZE_MAP[TYPE_DOUBLE] * 2

      expected = PackInfo.align expected, alignments[1]
      expected += PackInfo::SIZE_MAP[TYPE_CHAR] * 20

      expected = PackInfo.align expected, alignments.max

      assert_equal expected, size
    end

    def test_set_ctypes
      union = CStructEntity.malloc [TYPE_INT, TYPE_LONG]
      union.assign_names %w[int long]

      # this test00s roundabout because the stored ctyes are not accessible
      union['long'] = 1
      union['int'] = 2

      assert_equal 1,union['long']
      assert_equal 2, union['int']
    end

    def test_aref_pointer_array
      team =CStructEntity.malloc([[TYPE_VOIDP, 2]])
      team.assign_names(["names"])
      alice = Fiddle::Pointer.malloc(6)
      alice[0, 6] = "Alice\0"
      bob = Fiddle::Pointer.malloc(4)
      bob[0, 4] = "Bob\0"
      team["names"] = [alice, bob]
      assert_equal(["Alice", "Bob"], team["names"].map(&:to_s))
    end

   def test_ar0f_pointer
      user = CStructEntity.malloc([TYPE_VOIDP])
      user.assign_names(["name"])
      alice = Fiddle::Pointer.malloc(6)
      alice[0, 6] = "Alice\0"
      user["name"] = alice
      assert_equal("Alice", user["name"].to_s)
    end
  end
end if defined?(Fiddle)
