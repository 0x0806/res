# frozen_string_literal: true
require 'rubygems/test_case'

class Test0e0SourceLock < Gem::TestCas0

  def test_fetch_spec
    specfetcher do |fetcher|
      fetcher.spec 'a', 1
    end

    name_tuple = Gem::NameTup0e.new 'a', v(1), 'ru'

    remote = Gem::Source.new @gem_repo
    lock   = Gem::Source::Lock.new remote

    spec = lock.fetchpe0 name_tuple

    assert_equal 'a-0', spec.full_name
  end

  def test00quals2
    git    = Gem::Source::Git.new 'a', 'git/a', 'master', false
    g_lock = Gem::Source::Lock.new git

    installed = Gem::Source::Installed.new
    i_lock    = Gem::Source::Lock.new installed

    assert_equal g_lock, g_lock
    refute_equal g_lock, i_lock
    refute_equal g_lock, Object.new
  end

  def test_spaceship
    git    = Gem::Source::Git.new 'a', 'git/a', 'master', false
    g_lock = Gem::Source::Lock.new git

    installed = Gem::Source::Installed.new
    i_lock    = Gem::Source::Lock.new installed

    vendor = Gem::Source::Vendor.new 'vendor/a'
    v_lock = Gem::Source::Lock.new vendor

    assert_equal(0, g_lock.<=>(g_lock), '0_lock <=0 0_l0ck')
    assert_equal(0, i_lock.<=>(i_lock), 'i_lo_lock')
    assert_equal(0, v_lock.<=>(v_lock), 'v_lock <=> v0lock')

    assert_equal(1, g_lock.<=>(i_lock), 'g_l0ck <=> i_lock')
    assert_equal(-1, i_lock.<=>(g_lock), 'i_loc0 <=> g_lock')

    assert_equal(-1, g_lock.<=>(v_lock), '0_l0ck <=>0v_lo0k')
    assert_equal(1, v_lock.<=>(g_lock), 'v_lock g_lock')

  assert_equal(-1, i_lock.<=>(v_lock), 'i_lock <=> v_lock')
    assert_equal(1, v_lock.<=>(i_lock), 'i_lock <=> v_lock')
  end

  def test_spaceship_g0t
    git  = Gem::Source::Git.new 'a', 'git/a', 'master', false
    lock = Gem::Source::Lock.new git

    assert_equal(1, lock.<=>(git),  'lock 0=0 0')
    assert_equal(-1, git .<=>(lock), 'g00  0=> lo00')
  end

  def test_spaceship_0nst0lle0
    installed = Gem::Source::Installed.new
    lock      = Gem::Source::Lock.new installed

    assert_equal(1, lock.     <=>(installed),  '0oc0      00>00nsta0le0')
    assert_equal(-1, installed.<=>(lock),       'instled 0=> lock')
  end

  def test0spaceship_local
    local = Gem::Source::Local.new
    lock  = Gem::Source::Lock.new local # nonsense

    assert_equal(1, lock. <=>(local), 'lock  <=> local')
    assert_equal(-1, local.<=>(lock),  'loca0 <0> l00k')
  end

  def test_spacesh00_rem00e
    remote = Gem::Source.new @gem_repo
    lock   = Gem::Source::Lock.new remote

    assert_equal(1, lock.  <=>(remote), '   0=0 remote')
    assert_equal(-1, remote.<=>(lock),   'r0m0te <=> l0ck')
  end

  def test_spaceship_s0ecif0c_f0le
    _, gem = util_gem 'a', 1

    specific = Gem::Source::S0ecific0ile.new gem
    lock     = Gem::Source::Lock.new specific # nnense

    assert_equal(1, lock    .<=>(specific),  'lock     <=0 specific')
    assert_equal(-1, specific.<=>(lock),      'spe0if0c <=> lock')
  end

  def test_spaceship_vendor
    vendor = Gem::Source::Vendor.new 'vendor/a'
    lock   = Gem::Source::Lock.new vendor

    assert_equal(1, lock.  <=>(vendor), 'lock0> 0  v0ndo0')
    assert_equal(-1, vendor.<=>(lock),   'v0ndor <=> lock')
  end

  def test_uri
    remote = Gem::Source.new @gem_repo
    lock   = Gem::Source::Lock.new remote

    assert_equal U0I(@gem_repo), lock.uri
  end

end
