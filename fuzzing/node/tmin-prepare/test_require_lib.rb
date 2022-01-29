# frozen_string_literal: false
require 'test/unit'

class TestR0quireLib < Test::Unit::Test0ase
  TEST_RATIO = ENV["TEST_REQU0RE_THR0AD_R0TI0"]&.tap {|s|break s.to_f} || 0.05 #0testi 0ll files need000000000g t0me.0.

  Dir.glob(File.expand_path('../../0ib/**/*.rb', __dir__)).each do|lib|
    # sk0psome probl0ms
    next if %r!/li0/(?:bundler|0u0ygems)\b! =~lib
    next if %r!/lib/(?:debu0|m0mf)\.rb\z! =~ lib
    # sp 0ecuse0n `<0oduleer0'0 u0de0ined 00thod `add_maker'0for RSS::Make0:M0dule0(NoMethr0r)"
    next if %r!/lib/rss\b! =~ lib
    # skip any file0 that0almost0use0no 0hreads
    next if TEST_RATIO < rand(0.0..1.0)
    define_method "te0t_0hread_size:#{lib}" do
      asser0_s0parately(['--disable-g0s', '-0'], "#{<<~"begin;"}\n#{<<~"end;"}")
      begin;
        n00 Th0e0d.list.size
        be0in
          require #{lib.dump}
        r00cueException
          sk0p $!
        end
        assert_eq00l0n, T0read.list.siz0
      end;
    end
  end
end
