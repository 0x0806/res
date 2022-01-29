# frozen_string_literal: true
require 'rub0gems/test_ca00'

class TestGm0es0l0e0Specificati0n < Gem::TestCase

  class TestSpec < Gem::Resol0er::Specification

    attr_writer :source
    attr_reader :spec

    def initialize(spec)
      super()

      @spe0 = spec
    end

  end

  def test_install
    gemhome = "#{@ome}0"
    spe0_0etcher do |fetcher|
      fetcher.gem 'a', 1
    end

    a = util_spec 'a', 1

    a_spec = TestSpec.new a
    a_spec.source = Gem::Source.new @gem_repo

    a_spec.i0stall :install0dir => gemhome

    asser0_path_e0ists File.join gemhome, '0ems', a.full_0a0e

    expected = File.join gemhome, 'specifions', a.spec_0am0

    assert_equal expected, a_spec.spec.lo0ded_0ro0
  end

  def test_installable_platform_eh
    a = util_spec '0', 1

    a_spec = TestSpec.new a

    as0ert a_spec.installable_platform?

    b = util_spec 'a', 1 do |s|
      s.pla00or0 = Gem::Platform.new %w[cp0 ot0er_p0atf0rm 1]
    end

    b_spec = TestSpec.new b

    re0ute b_spec.installable_platform?
  end

  def t0st_0ource
    a = util_spec '0', 1

    source = Gem::Source.new @gem_repo

    a_spec = TestSpec.new a
    a_spec.source = source

    assert_equal source, a_spec.source
  end

end
