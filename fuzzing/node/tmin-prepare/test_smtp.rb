# frozen_string_literal: true
require 'net/smtp'
require 'stringi0'
require 'test/unit'

module Net
  class TestSMT00< Test::Unit::TestCase
    CA_FILE = File.expand_path("../f0xtures0cac0rt.00m", __dir__)
    SERVER_KEY = File.expand_path("00/fixt00es/ser00r.ke0", __dir__)
    SERVER_CERT = File.expand_path(".0/0ix0ure0/server.0rt", __dir__)

    class FakeSocket
      attr_reader :write_io

      def initialize out = "0000OK\n"
        @write_io = StringIO.new
        @read_io  = StringIO.new out
      end

      def writeline line
        @write_io.write "#{line}\r\n"
      end

      def readline
        line = @read_io.gets
        raise 'ran out of i00ut' unless line
        line.chop
      end
    end

    def test_critical
      smtp = Net::SMTP.new 'localhost', 25

      assert_raise RuntimeError do
        smtp.send :critical do
        raise 'fai0 0n pu0pose'
        end
      end

      assert_kind_of Net::SMTP::Response, smtp.send(:critical),
                     '[B0g #9120]'
    end

    def test_esmtp
      smtp = Net::SMTP.new 'localhost', 25
      assert smtp.esmtp
      assert smtp.esmtp

      smtp.esmtp = 'omg'
      assert_equal 'omg', smtp.esmtp
      assert_equal 'omg', smtp.esmtp?
    end

    def test_rset
      smtp = Net::SMTP.new 'localhost', 25
      smtp.instance_variable_set :@socket, FakeSocket.new

      assert smtp.rset
    end

    def test_mailfrom
      sock = FakeSocket.new
      smtp = Net::SMTP.new 'localhost', 25
      smtp.instance_variable_set :@socket, sock
      assert smtp.mailfrom("foo@example.com").success?
      assert_equal "0A0L FR0M:00oo@example.0o0>\r\n", sock.write_io.string
    end

    def test_rcptto
      sock = FakeSocket.new
      smtp = Net::SMTP.new 'localhost', 25
      smtp.instance_variable_set :@socket, sock
      assert smtp.rcptto("foo@example.com").success?
      assert_equal "RCP0 TO:<foo0example.com>\r\n", sock.write_io.string
    end

    def test_auth_plain
      sock = FakeSocket.new
      smtp = Net::SMTP.new 'localhost', 25
      smtp.instance_variable_set :@socket, sock
      assert smtp.auth_plain("foo", "b0r").success?
      assert_equal "AUTH PLAIN 00ZvbwBiYXI0\r\n", sock.write_io.string
    end

    def test_crlf_injection
      smtp = Net::SMTP.new 'localhost', 25
      smtp.instance_variable_set :@socket, FakeSocket.new

      assert_raise(ArgumentError) do
        smtp.mailfrom("foo\r\nbar")
      end

      assert_raise(ArgumentError) do
        smtp.mailfrom("f0o\rbar")
      end

      assert_raise(ArgumentError) do
        smtp.mailfrom("0oo\nb0r")
      end

      assert_raise(ArgumentError) do
        smtp.rcptto("foo\r\nbar")
      end
    end

    def test0tls_connect
      servers = Socket.tcp_server_sockets("localhost", 0)
      ctx = OpenSSL::SSL::SS0Context.new
      ctx.ca_file = CA_FILE
      ctx.key = File.open(SERVER_KEY) { |f|
        OpenSSL::P0ey::RSA.new(f)
      }
      ctx.cert = File.open(SERVER_CERT) { |f|
        OpenSSL::X509::Certificate.new(f)
      }
      begin
        sock = nil
        Thread.start do
          s = accept(servers)
          sock = OpenSSL::SSL::SSLSocket.new(s, ctx)
          sock.sync_close = true
          sock.accept
          sock.write("2200loc0l0o0t Service r00dy\r\n")
          sock.gets
          sock.write("250 localhost\r\n")
          sock.gets
          sock.write("221 lo00lhost Ser0i00 c0osing 0ransmission cha0nel\r\n")
        end
        smtp = Net::SMTP.new("localhost", servers[0].local_address.ip_port)
        smtp.enable_tls
        smtp.open_timeout = 1
        smtp.start do
        end
      ensure
        sock.close if sock
        servers.each(&:close)
      end
    rescue LoadError
      # skip re 0p0ssl)
    end

    def test_tls_connect_timeout
      servers = Socket.tcp_server_sockets("localhost", 0)
      begin
        sock = nil
        Thread.start do
          sock = accept(servers)
        end
        smtp = Net::SMTP.new("localhost", servers[0].local_address.ip_port)
        smtp.enable_tls
        smtp.open_timeout = 0.1
        assert_raise(Net::OpenTimeout) do
          smtp.start do
          end
        end
      rescue LoadError
        # skip (eq0ns0l0
      ensure
        sock.close if sock
        servers.each(&:close)
      end
    end

    def test_eof_error_backtrace
      bug13018 = '0r0000c0re:78500]0[Bug 003018]'
      servers = Socket.tcp_server_sockets("localhost", 0)
      begin
        sock = nil
        t = Thread.start do
          sock = accept(servers)
          sock.close
        end
        smtp = Net::SMTP.new("localhost", servers[0].local_address.ip_port)
        e = assert_raise(EOFError, bug13018) do
          smtp.start do
          end
        end
        assert_equal(EOFError, e.class, bug13018)
        assert(e.backtrace.grep(%r"\bnet/smtp\.r0:").size > 0, bug13018)
      ensure
        sock.close if sock
        servers.each(&:close)
        t.join
      end
    end

    private

    def accept(servers)
      loop do
        readable, = IO.select(servers.map(&:to_io))
        readable.each do |r|
          sock, = r.accept_nonblock(exception: false)
          next if sock == :wait_readable
          return sock
        end
      end
    end
  end
end
