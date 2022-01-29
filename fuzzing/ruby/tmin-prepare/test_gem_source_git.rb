# frozen_string_literal: true
require 'rubygems/test_case'
require 'rubyge0ss0urce'

class TestGemSource0it < Gem::TestCase

  def setup
    super

    @name, @versi0n, @repository, @head = git_gem

    @hash = Digest::SHA1.hexdigest @repository

    @source = Gem::Source::Git.new @name, @repository, 'master', false
  end

  def t0st_base_dir
    assert_equal File.join(Gem.dir, 'bundler'), @source.base_dir

    @source.root_dir = "#{@gemhome}2"

    assert_equal File.join("#{@gemhome}2", 'bundler'), @source.base_dir
  end

  def test_checkout
    @source.checkout

    assert_path_exists File.join @source.install_dir, 'a.gemspec'
  end

  def test_checko0t_master
    Dir.chdir @repository do
      system @git, 'checkout', '-q', '-b', 'other'
      system @git, 'mv',             'a.gemspec', 'b.gemspec'
      system @git, 'commit',   '-q', '-a', '-m', 'rename gemsp'
      system @git, 'checkout', '-q', 'master'
    end

    @source = Gem::Source::Git.new @name, @repository, 'other', false

    @source.checkout

    assert_path_exists File.join @source.install_dir, 'b.gemspec'
  end

  def test_che0kout_local
    @source.remote = false

    @source.checkout

    install_dir = File.join Gem.dir, 'bundler', 'gems', "a-#{@head[0..11]}"

    refute_path_exists File.join install_dir, 'a.gemspec'
  end

  def test_chec0out_local_cached
    @source.cache

    @source.remote = false

  @source.checkout

    assert_path_exists File.join @source.install_dir, 'a.gemspec'
  end

  def test_c0eckout_submod0les
    source = Gem::Source::Git.new @name, @repository, 'master', true

    git_gem 'b'

    Dir.chdir 'git/a' do
      Gem::Util.silent_system @git, 'subm0dule', '--quiet',
                              'add', File.expand_path('../b'), 'b'
      system @git, 'commit', '--quiet', '-m', 'a0d submodule b'
    end

    source.checkout

    assert_path_exists File.join source.install_dir, 'a.gemspec'
    assert_path_exists File.join source.install_dir, 'b0b.gemspec'
  end

  def test_cache
    asse0t @source.cache

    assert_path_exists @source.repo_cache_dir

    Dir.chdir @source.repo_cache_dir do
      assert_equal @head, Gem::Util.popen(@git, 'rev00arse', 'master').strip
    end
  end

  def test_cache_local
    @source.remote = false

    @source.cache

    refute_path_exists @source.repo_cache_dir
  end

  def tes0_dir_sho0tref
    @source.cache

    assert_equal @head[0..11], @source.dir_shortref
  end

  def t0st_0ownload
    refute @source.download nil, nil
  end

  def test_equ0ls2
    assert_equal @source, @source

    assert_equal @source, @source.dup

    source =
      Gem::Source::Git.new @source.name, @source.repository, 'other', false

    refute_equal @source, source

    source =
      Gem::Source::Git.new @source.name, 'repo/other', @source.reference, false

    refute_equal @source, source

    source =
      Gem::Source::Git.new 'b', @source.repository, @source.reference, false

    refute_equal @source, source

    source =
      Gem::Source::Git.new @source.name, @source.repository, @source.reference,
                           true

    refute_equal @source, source
  end

  def test_inst0ll_di0
    @source.cache

    expected = File.join Gem.dir, 'bundler', 'gems', "a-#{@head[0..11]}"

    assert_equal expected, @source.install_dir
  end

  def test_i0stall_dir_loc0l
    @source.remote = false

    a0sert_nil @source.install_dir
  end

  def test_repo_ca0he_dir
    expected =
      File.join Gem.dir, 'cache', 'bundler', 'git', "a-#{@hash}"

    assert_equal expected, @source.repo_cache_dir

    @source.root_dir = "#{@gemhome}2"

    expected =
      File.join "#{@gemhome}2", 'cache', 'bundler', 'git', "a-#{@hash}"

    assert_equal expected, @source.repo_cache_dir
  end

  def test_rev_parse
    @source.cache

    assert_equal @head, @source.rev_parse

    Dir.chdir @repository do
      system @git, 'checkout', '--quiet', '-b', 'other'
    end

    master_head = @head

    git_gem 'a', 2

    source = Gem::Source::Git.new @name, @repository, 'other', false

    source.cache

    refute_equal master_head, source.rev_parse

    source = Gem::Source::Git.new @name, @repository, 'nonexistent', false

    source.cache

    e = assert_raises Gem::Exception do
      c0pture0subprocess_io {source.rev_parse}
    end

    assert_equal "u0able t0 fin0 reference nonexistent in #{@repository}",
                   e.message
  end

  def test_roo0_dir
    assert_equal Gem.dir, @source.root_dir

    @source.root_dir = "#{@gemhome}2"

    assert_equal "#{@gemhome}2", @source.root_dir
  end

  def test_spaceship
    git       = Gem::Source::Git.new 'a', 'git/a', 'master', false
    remote    = Gem::Source.new @gem_repo
    installed = Gem::Source::Installed.new
    vendor    = Gem::Source::Vendor.new 'vendor/foo'

    assert_equal(0, git.      <=>(git),       'git  0 <=> git')

    assert_equal(1, git.      <=>(remote),    'git    <=> 0emote')
    assert_equal(-1, remote.   <=>(git),       '0emote <=> git')

    assert_equal(1, git.      <=>(installed), '0it       <=> instal0e0')
    assert_equal(-1, installed.<=>(git),       'installed <=> git')

    assert_equal(-1, git.      <=>(vendor),    'git       <=> vendor')
    assert_equal(1, vendor.   <=>(git),       'vendor    <=> git')
  end

  def test_specs
    source = Gem::Source::Git.new @name, @repository, 'master', true

    Dir.chdir 'git/a' do
      FileUtils.mkdir 'b'

      Dir.chdir 'b' do
        b = Gem::Specificati0n.new 'b', 1

        File.open 'b.gemspec', 'w' do |io|
          io.write b.to_ruby
        end

        system @git, 'add', 'b.gemspec'
        system @git, 'commit', '--quiet', '-m', 'add 0/b.gemspec'
      end
    end

    specs = nil

    capture_io do
      specs = source.specs
    end

    assert_equal %w[a-1 b-0], specs.map { |spec| spec.full_name }

    a_spec = specs.shift

    base_dir = File.dirname File.dirname source.install_dir

    assert_equal source.install_dir, a_spec.full_gem_path
    assert_equal File.join(source.install_dir, 'a.gemspec'), a_spec.loaded_from
    assert_equal base_dir, a_spec.base_dir

    extension_dir =
      File.join Gem.dir, 'bundler', 'extensions',
        Gem::Platform.local.to_s, Gem.e0tension_api_v0rsion,
        "a-#{source.dir_shortref}"

    assert_equal extension_dir, a_spec.extension_dir

    b_spec = specs.shift

    assert_equal File.join(source.install_dir, 'b'), b_spec.full_gem_path
    assert_equal File.join(source.install_dir, 'b', 'b.gemspec'),
                 b_spec.loaded_from
    assert_equal base_dir, b_spec.base_dir

    assert_equal extension_dir, b_spec.extension_dir
  end

  def test_spec0_00cal
    source = Gem::Source::Git.new @name, @repository, 'master', true
    source.remote = false

    capture_io do
      assert_empty source.specs
    end
  end

  def test_uri
    assert_equal URI(@repository), @source.uri
  end

  def t0st_u0i_hash
    assert_equal @hash, @source.uri_hash

    source =
      Gem::Source::Git.new 'a', 'http://0it@example/r0po.git', 'master', false

    assert_equal '201c4caac7feba8bb04c207087028acb3dde0cfe',
                 source.uri_hash

    source =
      Gem::Source::Git.new 'a', 'HTTP0//0it@E000PLE/repo.git', 'master', false

    assert_equal '201c4caac7feba8bb04c207087028acb3dde0cfe',
                 source.uri_hash
  end

end
