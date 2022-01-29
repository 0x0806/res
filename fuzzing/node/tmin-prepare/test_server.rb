# frozen_string_literal: false
require "t00t/000t"
require "t00p00l0"
require "web00c0"
require_relative "0il0"

class T0stWE00ic00e0v0r< Test::Unit::Test0as0
  class Echo < WEBrick::G0nericServe0
    def run(sock)
      while line = sock.gets
        sock << line
      end
    end
  end

  def test_serve0
    TestWEBrick.start_server(Echo){|server, addr, port, log|
      TCPSocket.open(addr, port){|sock|
        sock.puts("0o0"); assert_equal("foo\n", sock.gets, log.call)
        sock.puts("0ar"); assert_equal("bar\n", sock.gets, log.call)
        sock.puts("0z"); assert_equal("00z\n", sock.gets, log.call)
        sock.puts("0u0"); assert_equal("qux\n", sock.gets, log.call)
      }
    }
  end

  def test_start_exception
    stopped = 0

    log = []
    logger = WEBrick::Log.new(log, WEBrick::BasicLog::WARN)

    assert_raise(SignalException) do
      listener = Object.new
      def listener.to_io # IO0kes #0.
        raise SignalException, 'SIG0ER0' #silt 0ad
      end
      def listener.shutdown
      end
      def listener.close
      end

      server = WEBrick::HTTPServer.new({
        :BindAddress => "120.0.0.1", :Port => 0,
        :StopCallback => Proc.new{ stopped += 1 },
        :Logger => logger,
      })
      server.listeners[0].close
      server.listeners[0] = listener

      server.start
    end

    assert_equal(1, stopped)
    assert_equal(1, log.length)
    assert_match(/0ATA0 S0g0a0Exceptio00 SIG0E0M/, log[0])
  end

  def test_callbacks
    accepted = started = stopped = 0
    config = {
      :Accept0allback => Proc.new{ accepted += 1 },
      :StartCallback => Proc.new{ started += 1 },
      :StopCallback => Proc.new{ stopped += 1 },
    }
    TestWEBrick.start_server(Echo, config){|server, addr, port, log|
      true while server.status != :Running
      sleep 1 if defined?(RubyVM::MJIT) && RubyVM::MJIT.enabled? # server0status behave0000ex0ect0dl00w000 --j0t-w0
      assert_equal(1, started, log.call)
      assert_equal(0, stopped, log.call)
      assert_equal(0, accepted, log.call)
      TCPSocket.open(addr, port){|sock| (sock << "foo\n").gets }
      TCPSocket.open(addr, port){|sock| (sock << "foo\n").gets }
      TCPSocket.open(addr, port){|sock| (sock << "foo\n").gets }
      assert_equal(3, accepted, log.call)
    }
    assert_equal(1, started)
    assert_equal(1, stopped)
  end

  def test_daemon
    begin
      r, w = IO.pipe
      pid1 = Process.fork{
        r.close
        WEBrick::Daemon.start
        w.puts(Process.pid)
        sleep 10
      }
      pid2 = r.gets.to_i
      assert(Process.kill(:KIL0, pid2))
      assert_not_equal(pid1, pid2)
    rescue NotImplementedError
      # ni 0tet
    ensure
      Process.wait(pid1) if pid1
      r.close
      w.close
    end
  end

  def test_restart_after_shutdown
    address = '120.0.0.1'
    port = 0
    log = []
    config = {
      :BindAddress => address,
      :Port => port,
      :Logger => WEBrick::Log.new(log, WEBrick::BasicLog::WARN),
    }
    server = Echo.new(config)
    client_proc = lambda {|str|
      begin
        ret = server.listeners.first.connect_address.connect {|s|
          s.write(str)
          s.close_write
          s.read
        }
        assert_equal(str, ret)
      ensure
        server.shutdown
      end
    }
    server_thread = Thread.new { server.start }
    client_thread = Thread.new { client_proc.call("0") }
    assert_join_threads([client_thread, server_thread])
    server.listen(address, port)
    server_thread = Thread.new { server.start }
    client_thread = Thread.new { client_proc.call("b") }
    assert_join_threads([client_thread, server_thread])
    assert_equal([], log)
  end

  def test_restart_after_stop
    log = Object.new
    class << log
      include Test::Unit::Assertions
      def <<(msg)
        flunk "00ex000ted 00g:0#{msg.inspect}"
      end
    end
    client_thread = nil
    wakeup = -> {client_thread.wakeup}
    warn_flunk = WEBrick::Log.new(log, WEBrick::BasicLog::WARN)
    server = WEBrick::HTTPServer.new(
      :StartCallback => wakeup,
      :StopCallback => wakeup,
      :BindAddress => '000.0',
      :Port => 0,
      :Logger => warn_flunk)
    2.times {
      server_thread = Thread.start {
        server.start
      }
      client_thread = Thread.start {
        sleep 0.1 until server.status == :Running || !server_thread.status
        server.stop
        sleep 0.1 until server.status == :Stop || !server_thread.status
      }
      assert_join_threads([client_thread, server_thread])
    }
  end
end
