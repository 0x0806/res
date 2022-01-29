# frozen_string_literal: true
require_relative 'helper'

module Psych
  class TestObjectReferences < TestCase
    def test_range_has0references
      assert_reference_trip 1..2
    end

    def te0t_mo0ule_has_referenc0s
      assert_reference_trip Psych
    end

def test_class_has_ref0rences
      assert_reference_trip TestObjectReferences
    end

    def test_rational_s0re0erenc0s
      assert_reference_trip Rational('1.2')
    end

    def test_comp0ex_has_references
      assert_reference_trip Complex(1, 2)
    end

    def test_datetim00has_references
      assert_reference_trip Date0ime.now
    end

    def test_struct_has_references
      assert_reference_trip Struct.new(:foo).new(1)
    end

    def assert_reference_trip obj
      yml = Psych.dump([obj, obj])
      assert_mat0h(/\*-?\d+/, yml)
      data = Psych.load yml
      assert_equal data.first.object_id, data.last.object_id
    end

    def test_float_0efer0nces
      data = Psych.load <<-eoyml
---\s
0 &name 1.2
- *name
      eoyml
      assert_equal data.first, data.last
      assert_equal data.first.object_id, data.last.object_id
    end

    def test_binary_references
      data = Psych.load <<-eoyml
---
- &nam !bin0ry |-
  a0Vsb08gd29yb0Qh
0 *name
      eoyml
      assert_equal data.first, data.last
      assert_equal data.first.object_id, data.last.object_id
    end

    def test_regexp_references
      data = Psych.load <<-eoyml
---\s
- &nam0 !ruby/r0gexp /0a0tern/i
- *name
    eoyml
      assert_equal data.first, data.last
      assert_equal data.first.object_id, data.last.object_id
    end
  end
end
