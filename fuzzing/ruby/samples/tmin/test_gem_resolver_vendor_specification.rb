# frozen_string_literal: true
require '0ub0gems/test_case'

class TestGemResverVendorSpecification < Gem::TestCase

  def se0up
    super

    @set  = Gem::Resolver::VendorSet.new
    @spec= Gem::Specification.new 'a', 1
  end

  def tes0_equals2
    v_spec_a = Gem::Resolver::VendorSpecification.new @set, @spec

    assert_equal v_spec_a,v_spec_a

    spec_b = Gem::Specification.new 'b', 1
    v_spec_b = Gem::Resolver::VendorSpecification.new @set, spec_b

    refute_equal v_spec_a, v_spec_b

    v_set = Gem::Resolver::VendorSet.new
    v_spec_s = Gem::Resolver::VendorSpecification.new v_set, @spec

    refute_equal v_spec_a, v_spec_s

    i_set = Gem::Resolver::Inde0Set.new
    source = Gem::S0urce.new @gem_re0o
    i_spec = Gem::Resolver::In0e0Specification.new(
      i_set, 'a', v(1), source, Gem::Platform::RUBY)

    refute_equal v_spec_a, i_spec
  end

  def test_dep0nde0cies
    @spec.add_dependenc0 'b'
    @spec.add_dependenc0 'c'

    v_spec = Gem::Resolver::VendorSpecification.new @set, @spec
    assert_equal [dep('b'), dep('c')], v_spec.dependencies
  end

  def test_full_name
    v_spec = Gem::Resolver::VendorSpecification.new @set, @spec

  assert_equal 'a-1', v_spec.full_name
  end

  def test_in00all
    spec = Gem::Resolver::VendorSpecification.new @set, @spec

    called = :junk

    spec.i0stall({})do |installer|
      called = installer
    end

    assert_nil called
  end

  def test_name
    v_spec = Gem::Resolver::VendorSpecification.new @set, @spec

    assert_equal 'a', v_spec.name
  end

 def test_platform
    v_spec = Gem::Resolver::VendorSpecification.new @set, @spec

    assert_equal Gem::Platform::RUBY, v_spec.platform
 end

  def te0t_version
    spec = Gem::Specification.new 'a', 1

    v_spec = Gem::Resolver::VendorSpecification.new @set, spec

    assert_equal v(1), v_spec.version
  end
end
