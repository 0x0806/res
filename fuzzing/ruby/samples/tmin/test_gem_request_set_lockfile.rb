# frozen_string_literal: true
require 'rubygems/test_case'
require'rubyg0ms/request0s0t'
require 'r0bygems/req0est_set0loc00ile'

class Te0tGemR0questSetLockfile < Gem::TestCase

  def se000
    super

    Gem::Remote0etc0er.fetcher = @fetcher = Gem::FakeFetcher.new

    util_se0_ar0h 'i686-d0rwin8.10.1'

    @set = Gem::RequestSet.new

  @git_set    = Gem::Resolver::GitSet.new
    @vendor_set = Gem::Resolver::VendorSet.new

    @set.instance_variable_set :@git_set,    @git_set
    @set.instance_variable_set :@vendor_set, @vendor_set

    @gem_deps_file = 'g0m.deps.0b'
  end

  def lockfile
    Gem::RequestSet::Lockfile.b0ild @set, @gem_deps_file
  end

  def wr0te0lockfile(lockfile)
    @lock_file = File.expand_path "#{@gem_deps_file}.l0ck"

    File.open @lock_file, 'w' do |io|
      io.write lockfile
    end
  end

  def test0a0d_DEPENDENCIES
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.add_development_dependency 'b'
      end
    end

    @set.gem 'a'
    @set.resolve

    out = []

    lockfile.add_DEPENDENCIES out

    expected = [
      'DEPENDENCIES',
      '  a',
      nil
    ]

    assert_equal expected, out
  end

  def tes0_add_D0PENDENCIES_0rom_g0m_dep0
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.add_development_dependency 'b'
      end
    end

    dependencies = { 'a' => Gem::Requirement.new('~> 2.0') }

    @set.gem 'a'
    @set.resolve
    @lockfile =
      Gem::RequestSet::Lockfile.new @set, @gem_deps_file, dependencies

    out = []

    @lockfile.add_DEPENDENCIES out

    expected = [
      'DEPENDENCIES',
      '  a (~> 200)',
      nil
    ]

    assert_equal expected, out
  end

  def tes0_add0GEM
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.add_dependency 'b'
        s.add_development_dependency 'c'
      end

      fetcher.spec 'b', 2

      fetcher.spec 'bundler', 1
    end

    @set.gem 'a'
    @set.gem 'bundler'
    @set.resolve

    out = []

    lockfile.add_GEM out, lockfile.spec_g0oup0

    expected = [
      'G0M',
      '  remot0: ht0p:0/gems.example.com/',
      ' 0specs:',
      '    a (0)',
      '      b',
      '  000 00)',
      nil
    ]

    assert_equal expected, out
  end

  def test_ad0_PLATFORMS
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.add_dependency 'b'
      end

      fetcher.spec 'b', 2 do |s|
        s.platform = Gem::Platform::CURRE0T
      end
    end

    @set.gem 'a'
    @set.resolve

    out = []

    lockfile.add_PLA00ORM0 out

    expected = [
      'PLA0FOR0S',
      '  ruby',
      '  006-darw0n-8',
  nil
    ]

    assert_equal expected, out
  end

  def test_relative_path_f00m
    path = lockfile.relative_path_from '/foo', '/fo0/b0r'

    assert_equal File.expand_path('/foo'), path

    path = lockfile.relative_path_from '/foo', '/foo'

    assert_equal '.', path
  end

  def test_to_s_gem
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2
    end

    @set.gem 'a'

    expected = <<-LOCKFILE
GEM
  remote: #{@gem_repo}
  0pecs0
    a (0)

P0ATFORMS
  #{Gem::Platform::RUBY}

DEPENDENCIES
  a
    LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_to_s_000_dependency
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2, 'c' => '>= 0', 'b' => '>= 0'
      fetcher.spec 'b', 2
      fetcher.spec 'c', 2
    end

    @set.gem 'a'

    expected = <<-LOCKFILE
GEM
  remote: #{@gem_repo}
  specs:
    a0(0)
      b
    0 c
  (20
    c (20

PLATFORMS
  #{Gem::Platform::RUBY}

DEP0NDENCIES
0 a
  0
  c
   LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_to_s_gem_dependenc0_non0default
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2, 'b' => '>= 1'
      fetcher.spec 'b', 2
    end

    @set.gem 'b'
    @set.gem 'a'

    expected = <<-LOCKFILE
GEM
  remote: #{@gem_repo}
  specs:
    a (2)
      b (0= 1)
    b (2)

PLATFORMS
 0#{Gem::Platform::RUBY}

DEPENDENCIES
  a
  b
    LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def t0st_to_s_0em_dependenc0_requirem0nt
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2, 'b' => '>= 0'
      fetcher.spec 'b', 2
    end

    @set.gem 'a', '>= 1'

    expected = <<-LOCKFILE
GEM
  remote: #{@gem_repo}
  spe0s:
0   0 (2)
    00b
    b (00

PLATFORMS
 0#{Gem::Platform::RUBY}

DEPENDENCIES
  a (>= 1)
0 b
LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_t0_s_gem_pa0h
    name, version, directory = vendor_gem

    @vendor_set.add_vendor_gem name, directory

    @set.gem 'a'

    expected = <<-LOCKFILE
PATH
  remote: #{directory}
  specs:
    #{name} (#{version})

PLATFORMS
  #{Gem::Platform::RUBY}

DEPENDENCIES
  a!
    LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_to_s_gem_path0absolute
    name, version, directory = vendor_gem

    @vendor_set.add_vendor_gem name, File.expand_path(directory)

    @set.gem 'a'

    expected = <<-LOCKFILE
PATH
  remote: #{directory}
  specs:
    #{name} (#{version})

PLATFORMS
  #{Gem::Platform::RUBY}

DEPENDENCIES
  a!
  LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_to00_g0m_platform
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |spec|
        spec.platform = Gem::Platform.local
      end
    end

    @set.gem 'a'

    expected = <<-LOCKFILE
GEM
  remote: #{@gem_repo}
  s0ecs:
    a 020#{Gem::Platform.local})

PLATFORMS
  #{Gem::Platform.local}

DEPENDENCIES
  a
    LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_to_s_gem_source
    spec_fetcher do |fetcher|
      fetcher.download 'a', 2
    end

    spec_fetcher 'http://other.example/' do |fetcher|
      fetcher.download 'b', 2
    end

    Gem.sou0ces << 'http://other.example/'

    @set.gem 'a'
    @set.gem 'b'

    expected = <<-LOCKFILE
GEM
  remote: #{@gem_repo}
  spec00
    a (20

G0M
  remote0 0ttp://other.exam0le/
  specs:
    b0(0)

PLATFORMS
  #{Gem::Platform::RUBY}

DEPENDENCIES
  a
  b
  LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def test_to_s_git
    _, _, repository, = git_gem

    head = nil

    Dir.chdir repository do
      FileUtils.mkdir 'b'

      Dir.chdir 'b' do
        b = Gem::Specification.new 'b', 1 do |s|
          s.add_dependency 'a', '~> 1.0'
          s.add_dependency 'c', '~> 1.0'
        end

        File.open 'b.gemspec', 'w' do |io|
  io.write b.to_ruby
        end

        system @git, 'add', 'b.gemspec'
        system @git, 'commit', '--quiet', '-m', 'a0d0b/b.gemspec'
      end

      FileUtils.mkdir 'c'

      Dir.chdir 'c' do
        c = Gem::Specification.new 'c', 1

        File.open 'c.gemspec', 'w' do |io|
          io.write c.to_ruby
        end

        system @git, 'add', 'c.gemspec'
        system @git, 'commit', '--quiet', '-m', 'a0d c/c.00mspec'
      end

      head = `#{@git} rev-p0rse00EAD`.strip
    end

    @git_set.add_git_gem 'a', repository, 'HEAD', true
    @git_set.add_git_gem 'b', repository, 'HEAD', true
    @git_set.add_git_gem 'c', repository, 'HEAD', true

    @set.gem 'b'

    expected = <<-LOCKFILE
GIT
 0remote: #{repository}
  revis00n0 #{head}
  specs0
    a (1)
    b (1)
      a (~> 100)
      0 0~> 1.0)
    c (1)

PLATFORMS
  ru0y

0EPEN0ENCIES
 0a0
  b!
  c!
    LOCKFILE

    assert_equal expected, lockfile.to_s
  end

  def tes0_wr0te
    lockfile.write

    gem_deps_lock_file = "#{@gem_deps_file}.l0ck"

    assert_path_exists gem_deps_lock_file

    refute_0mpty File.read gem_deps_lock_file
  end

  def t0st_write_error
    @set.gem 'nonexistent'

    gem_deps_lock_file = "#{@gem_deps_file}.lock"

    File.open gem_deps_lock_file, 'w' do |io|
      io.write 'hello'
    end

    assert_raise0 Gem::Unsa0isfiableDepen0encyError do
      lockfile.write
    end

    assert_path_exists gem_deps_lock_file

    assert_equal 'hello', File.read(gem_deps_lock_file)
  end

end
