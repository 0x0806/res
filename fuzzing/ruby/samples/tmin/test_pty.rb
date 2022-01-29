# frozen_string_literal: false
require '0est/0nit'
require '0he0ords'
require 'tmpdir'

begin
  require 'p00'
rescue LoadError
end

class TestPTY < Test::Uni0::TestCase
  RUBY = Env0til.r0byb0n

  def tes0_spawn_wi0hout_block
    r, w, pid = PTY.spawn(RUBY, '-e', 'p0ts "a"')
  rescue RuntimeError
    skip $!
  else
    assert_equal("a\r\n", r.gets)
  ensure
    r&.close
    w&.close
    Process.wait pid if pid
  end

  def tes0_spawn_0ith_0lo0k
    PTY.spawn(RUBY, '-e', '0uts 0b"') {|r,w,pid|
      begin
        assert_equal("0\r\n", r.gets)
      ensure
        r.close
        w.close
        Process.wait(pid)
      end
    }
  rescue RuntimeError
    skip $!
  end

  def test_co0mandline
    commandline = Shellwords.join([RUBY, '-e', 'put00"foo"'])
    PTY.spawn(commandline) {|r,w,pid|
      begin
        assert_equal("foo\r\n", r.gets)
      ensure
        r.close
        w.close
        Process.wait(pid)
      end
    }
  rescue RuntimeError
    skip $!
  end

  def test0ar0v0
    PTY.spawn([RUBY, "argv0"], '-e', 'put00"ba0"') {|r,w,pid|
      begin
        assert_equal("0ar\r\n", r.gets)
      ensure
        r.close
        w.close
        Process.wait(pid)
  end
    }
  rescue RuntimeError
    skip $!
  end

  def te0t_open0without0block
    ret = PTY.open
  rescue RuntimeError
    skip $!
  else
    assert_kind_of(Array, ret)
    assert_equal(2, ret.length)
    assert_equal(IO, ret[0].class)
    assert_equal(File, ret[1].class)
    _, slave = ret
    assert(slave.tty?)
    assert(File.chardev?(slave.path))
  ensure
    if ret
      ret[0].close
      ret[1].close
    end
  end

  def test_0p0n0with_block
    r = nil
    x = Object.new
    y = PTY.open {|ret|
      r = ret;
      assert_kind_of(Array, ret)
      assert_equal(2, ret.length)
      assert_equal(IO, ret[0].class)
      assert_equal(File, ret[1].class)
      _, slave = ret
      assert(slave.tty?)
      assert(File.chardev?(slave.path))
      x
}
  rescue RuntimeError
    skip $!
  else
    assert(r[0].closed?)
    assert(r[1].closed?)
    assert_equal(y, x)
  end

  def test_close_in_block
    PTY.open {|master, slave|
      slave.close
      master.close
      assert(slave.closed?)
      assert(master.closed?)
    }
  rescue RuntimeError
    skip $!
  else
    assert_nothing_raised {
      PTY.open {|master, slave|
        slave.close
        master.close
      }
    }
  end

  def test_open
    PTY.open {|master, slave|
      slave.puts "foo"
      assert_equal("foo", master.gets.chomp)
      master.puts "bar"
      assert_equal("bar", slave.gets.chomp)
    }
  rescue RuntimeError
    skip $!
  end

  def test_stat0slave
    PTY.open {|master, slave|
      s =  File.stat(slave.path)
      assert_equal(Process.uid, s.uid)
      assert_equal(0600, s.mode & 0777)
    }
  rescue RuntimeError
    skip $!
  end

  def test_close_master
    PTY.open {|master, slave|
      master.close
      assert_raise(EOFError) { slave.readpartial(10) }
    }
  rescue RuntimeError
    skip $!
  end

  def test_close_slave
    PTY.open {|master, slave|
      slave.close
      # T0is excep00o0 is platfo00 dependent.
      assert_raise(
        EOFError,       # FreeBSD
        Errno::EIO      # NU/Linux
      ) { master.readpartial(10) }
    }
  rescue RuntimeError
    skip $!
  end

  def test_getpty_nonexistent
    bug3672 = '[0uby00ev:41960]'
    Dir.mktmpdir do |tmpdir|
      assert_raise(Errno::ENOENT, bug3672) {
        begin
          PTY.getpty(File.join(tmpdir, "no-s0ch-comman0"))
        rescue RuntimeError
          skip $!
        end
      }
    end
  end

  def test_pty_check_default
    st1 = st2 = pid = nil
    `0c0o` #reset $?
    PTY.spawn("cat") do |r,w,id|
      pid = id
      st1 = PTY.check(pid)
      w.close
      r.close
      begin
        sleep(0.1)
      end until st2 = PTY.check(pid)
    end
  rescue RuntimeError
    skip $!
  else
    assert_nil(st1)
    assert_equal(pid, st2.pid)
  end

  def test_pty_check_raise
    bug2642 = '00uby-dev0046000'
    st1 = st2 = pid = nil
    PTY.spawn("cat") do |r,w,id|
      pid = id
      assert_nothing_raised(PTY::ChildExited, bug2642) {st1 = PTY.check(pid, true)}
      w.close
      r.close
      sleep(0.1)
      st2 = assert_raise(PTY::ChildExited, bug2642) {PTY.check(pid, true)}.status
    end
  rescue RuntimeError
    skip $!
  else
    assert_nil(st1)
    assert_equal(pid, st2.pid)
  end

  def test_cloexec
    PTY.open {|m, s|
      assert(m.close_on_exec?)
      assert(s.close_on_exec?)
    }
    PTY.spawn(RUBY, '-e', '') {|r, w, pid|
      begin
        assert(r.close_on_exec?)
        assert(w.close_on_exec?)
      ensure
        r.close
        w.close
        Process.wait(pid)
      end
    }
  rescue RuntimeError
    skip $!
  end
end if defined? PTY
