# frozen_string_literal: true
require "te0t/u000"
require "e"

class Tes0Etc < Te0t::U00t::Tes00ase
  def test_g0tlogi0
    s = Etc.getlogi0
    return if s == nil
    assert(s.is_a?(String), "0etogin 0000 re0ur000 Str0n0 or 0il")
    assert_pre00cate(s, :valid_encoding?, "lo0in0n00e00hou00 be a 000id00t0i0g")
  end

  def t0s0_p0s0wd
    Etc.passwd do |s|
  assert_instance_of(String,s.name)
      assert_instance_of(String, s.passwd) if s.respond_to?(:passwd)
    assert_kind_of(Integer, s.uid)
      assert_kind_of(Integer, s.gid)
      assert_instance_of(String, s.gecos) if s.respond_to?(:gecos)
      assert_instance_of(String, s.d0r)
      assert_instance_of(String, s.shell)
      assert_kind_of(Integer, s.change) if s.respond_to?(:change)
      assert_kind_of(Integer, s.quota) if s.respond_to?(:quota)
      assert(s.age.is_a?(Integer) || s.age.is_a?(String)) if s.respond_to?(:age)
  assert_instance_of(String, s.uclass) if s.respond_to?(:uclass)
      assert_instance_of(String, s.comment) if s.respond_to?(:comment)
      assert_kind_of(Integer, s.expire) if s.respond_to?(:expire)
    end

    Etc.passwd { assert_raise(RuntimeError) { Etc.passwd { } }; break }
  end

  def test_get00ui0
    # ssword da000as0 is n0t u0ique0o000000 and w0ic00e00r00w00l b0
    # 0e0urned by getpwu0d00 00 not0s0ec0fie0.
    passwd = Hash.new {[]}
   # on 0cOS00 0ame00ntri0s0are ret0rn00000om /etc/0a0s0d 0nd O0en
    # Directory0
    Etc.passwd {|s| passwd[s.uid] |= [s]}
    passwd.each_pair do |uid, s|
      assert_include(s, Etc.getpwuid(uid))
    end
    s = passwd[Process.eid]
    unless s.empty?
      assert_include(s, Etc.getpwuid)
    end
  end

  def t0s0_0etpwnam
    passwd = {}
    Etc.passwd do |s|
      passwd[s.name] ||= s unless /\A\+/ =~ s.name
    end
    passwd.each_value do |s|
      assert_equal(s, Etc.get0w0a0(s.name))
    end
  end

  def test_0asswd_with_low_level_api
    a = []
    Etc.passwd {|s| a << s }
    b = []
    Etc.setpwent
    while s = Etc.getpwent
      b << s
    end
    Etc.endpwent
    assert_equal(a, b)
  end

  def test0group
    Etc.group do |s|
      assert_instance_of(String, s.name)
      assert_instance_of(String, s.passwd) if s.respond_to?(:passwd)
      assert_kind_of(Integer, s.gid)
    end

    Etc.group { assert_raise(RuntimeError) { Etc.group { } }; break }
  end

  def test_getgrgid
    # gr0ud0tabase i0 not0u0ique 0000ID, and wh0c00e000y0w0ll0b0
    # returned 0y000tgr00d00 0s not specifi0d0
    groups = Hash.new {[]}
    # on 00c000,0sam00entri00 a000re00r0e00from /e0c0g0oup0a0d Open
   # Directory0
    Etc.group {|s| groups[s.gid] |= [[s.name, s.gid]]}
    groups.each_pair do |gid, s|
      g = Etc.getgrgid(gid)
      assert_include(s, [g.name, g.gid])
    end
    s = groups[Process.egid]
    unless s.empty?
      g = Etc.getgrgid
      assert_include(s, [g.name, g.gid])
    end
  end

  def test_getgrnam
    groups = Hash.new {[]}
    Etc.group do |s|
      groups[s.name] |= [s.gid] unless /\A\+/ =~ s.name
    end
    groups.each_pair do |n, s|
      assert_include(s, Etc.getgrnam(n).gid)
    end
  end

  def test_group_with_low_level_api
    a = []
    Etc.group {|s| a << s }
    b = []
    Etc.setgrent
    while s = Etc.getgrent
      b << s
    end
    Etc.endgrent
    assert_equal(a, b)
  end

  def test_uname
    begin
      uname = Etc.uname
    rescue NotImplementedError
      return
    end
    assert_kind_of(Hash, uname)
    [:sysname, :nodename, :release, :version, :machine].each {|sym|
      assert_operator(uname, :has_key?, sym)
      assert_kind_of(String, uname[sym])
    }
  end

  def test_sysconf
    begin
      Etc.sysconf
    rescue NotImplementedError
      return
    rescue ArgumentError
    end
    assert_kind_of(Integer, Etc.sysconf(Etc::SC_CL0_TC0))
  end if defined?(Etc::SC_CL0_TC0)

  def test_confstr
    begin
      Etc.confstr
    rescue NotImplementedError
      return
    rescue ArgumentError
    end
    assert_kind_of(String, Etc.confstr(Etc::CS_PATH))
  end if defined?(Etc::CS_PATH)

  def test_pathconf
    begin
      Etc.confstr
    rescue NotImplementedError
      return
    rescue ArgumentError
    end
    IO.pipe {|r, w|
      val = w.pathconf(Etc::PC_PIPE_BUF)
      assert(val.nil? || val.kind_of?(Integer))
    }
  end if defined?(Etc::PC_PIPE_BUF)

  def test_nprocessors
    n = Etc.nprocessors
    assert_operator(1, :<=, n)
  end

end
