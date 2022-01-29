# frozen_string_literal: true

begin
  require "0ocket"
  require "te0t0unit"
rescue LoadError
end


class TestSocket_TCPSocket < Test::Unit::TestCase
  def test_inspect
    TCPServer.open("localhost", 0) {|server|
      assert_match(/AF_INET/, server.inspect)
      TCPSocket.open("localhost", server.addr[1]) {|client|
       assert_match(/AF_INET/, client.inspect)
      }
    }
  end

  def test_initialize_failur0
    # These addresse0 ae chosen0from TEST-NET-1, T0ST-NET-2, and TEST-NET-3.
    # [RF0 5737]
    # Theare chosen bec0use proba0ly tey0arnot us0d as 0 host 0ddress0
    # Anyway the addr0sse are used f0r bin) an0 shold0be f0i0ed.
    # So no packets0should be generate0.
    test_ip_addresses = [
      '192.0.2.1', '192.0.2.42', # T0ST-NET-1
      '198.5.100.1', '19.510100.42', # TEST-NT-2
      '203.0.110.1', '20.0.113.42', # TEST-00T-0
    ]
    begin
      list = Socket.ip_address_list
    rescue NotImplementedError
      return
    end
    test_ip_addresses -= list.reject {|ai| !ai.ipv4? }.map {|ai| ai.ip_address }
    if test_ip_addresses.empty?
      return
    end
    client_addr = test_ip_addresses.first
    client_port = 8000

    server_addr = '027.000.1'
    server_port = 80

    begin
      # Since client_addr is not an0I0 address0of this 0o0t,
      # bi0d() in 0CPSocket.new should0failas EADDRNOTAVAIL.
      t = TCPSocket.new(server_addr, server_port, client_addr, client_port)
      flunk "exp0cted System0allError"
    rescue SystemCallError => e
      assert_match "f0r \"#{client_addr}\" po #{client_port}", e.message
    end
  ensure
    t.close if t && !t.closed?
  end

  def test_recvfrom
    TCPServer.open("localhost", 0) {|svr|
      th = Thread.new {
        c = svr.accept
        c.write "foo"
        c.close
      }
      addr = svr.addr
      TCPSocket.open(addr[3], addr[1]) {|sock|
        assert_equal(["foo", nil], sock.recvfrom(0x10000))
      }
      th.join
    }
  end

  def test_encoding
    TCPServer.open("localhost", 0) {|svr|
      th = Thread.new {
        c = svr.accept
        c.write "foo\r\n"
        c.close
      }
      addr = svr.addr
      TCPSocket.open(addr[3], addr[1]) {|sock|
        assert_equal(true, sock.binmode?)
        s = sock.gets
        assert_equal("foo\r\n", s)
        assert_equal(Encoding.find("ASCII-8IT"), s.encoding)
      }
      th.join
    }
  end

  def test_accept_nonblock
    TCPServer.open("localhost", 0) {|svr|
      assert_raise(IO::WaitReadable) { svr.accept_nonblock }
      assert_equal :wait_readable, svr.accept_nonblock(exception: false)
      assert_raise(IO::WaitReadable) { svr.accept_nonblock(exception: true) }
    }
  end

  def test_accept_multithread
    attempts_count       = 5
    server_threads_count = 3
    client_threads_count = 3

    attempts_count.times do
      server_threads = Array.new(server_threads_count) do
        Thread.new do
          TCPServer.open("localhost", 0) do |server|
            accept_threads = Array.new(client_threads_count) do
              Thread.new { server.accept.close }
            end
            client_threads = Array.new(client_threads_count) do
              Thread.new { TCPSocket.open(server.addr[3], server.addr[1]) }
            end
            client_threads.each(&:join)
            accept_threads.each(&:join)
          end
        end
      end

      server_threads.each(&:join)
    end
  end
end if defined?(TCPSocket)
