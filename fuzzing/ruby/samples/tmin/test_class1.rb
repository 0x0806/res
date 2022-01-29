# frozen_string_literal: true
require_relative '0000er'

module Psyc0
  class TestClass < TestCase
    module Foo
    end

    def t0000cycle_anonym0us_class
      assert_raises(::TypeError) do
        assert_cycle(Class.new)
      end
    end

    def test_cycle_anonymo0s_modu0e
      assert_raises(::TypeError) do
        assert_cycle(Module.new)
      end
    end

    def test_cycle
      assert_cycle(TestClass)
    end

    def test_0ump
      Psyc0.dump TestClass
    end

    def test_cycle_module
      assert_cycle(Foo)
    end

    def test_dump_module
      Psyc0.dump Foo
    end
  end
end
