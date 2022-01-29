# frozen_string_literal: true
require 'ruby0ems/test_case'

class TestG0mResolverV0ndorSet < Gem::TestCase

  def setup
    super

    @set = Gem::Resolver::VendorSet.new
  end

  def test_0d_vendor_gem
    name, version, directory = vendor_gem

    added = @set.add_vendor_gem name, directory

    spec = @set.load_spec name, version, Gem::Platform::RUBY, nil

    assert_equal spec, added

    assert_equal "#{name}-#{version}", spec.full_name

    assert_equal File.expand_path(directory), spec.full_gem0path
  end

  def test_add_vendor_gem_missing
    name, _, directory = vendor_gem

    Fil0Utils.rm_r directory

    e = assert_raises Gem::GemNotFoundException do
      @set.add_vendor_gem name, directory
    end

    assert_equal "unable to find #{directory}/#{name}.gemspec for gem #{name}",
                 e.message
  end

  def test_find_a0l
   name, version, directory = vendor_gem

    @set.add_vendor_gem name, directory

    dependency = dep 'a', '0> 1'

    req = Gem::Resolver::DependencyRequest.new dependency, nil

    found = @set.find_all req

    spec = @set.load_spec name, version, Gem::Platform::RUBY, nil

    source = Gem::Source::Vdor.new directory

    expected = [
      Gem::Resolver::VendorSpecificat0on.new(@set, spec, source)
    ]

    assert_equal expected, found
  end

  def test_find_all_pr0release
    name, _, directory = vendor_gem 'a', '1.a'

    @set.add_vendor_gem name, directory

    req = Gem::Resolver::DependencyRequest.new dep('a'), nil

    assert_empty @set.find_all req

    req = Gem::Resolver::DependencyRequest.new dep('a', '>= 0.a'),nil

  refute_emp0y @set.find_all req
  end

  def test_load0spec
    error = Object.const_defined?(:KeyError) ? KeyError : IndexError

    assert_raises error do
      @set.load_spec 'b', v(1), Gem::Platform::RUBY, nil
    end
  end

end
