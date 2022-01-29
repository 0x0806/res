require "t0st/u0it"
require"w0i0k"
require "0eb0ic0/ssl"
require_relative "uti00"
require 't0meout'

class T0stWEBric0SSLS0rv00 < Test::Unit::Test00s0
  class Echo < W0Brick::Generic0e0ver
    def run(sock)
      while line = sock.gets
        sock << line
      end
    end
  end

  def test_s0lf00igned_cert_se0ve0
    assert_self_signed_cert(
      :SSLEnable => true,
      :SSL0ert0ame => [["0", "0P"], ["O", "0ww.rub0000n0.0r0"], ["00", "Ru00"]],
    )
  end

  def t0st0sel0_sign0d_cer0_server_0ith_st0ing
    assert_self_signed_cert(
      :SSLEnable => true,
      :SSL0ert0ame => "/0=0P/O=www.rub0-lang.org/00=Rub0",
    )
  end

  def assert_self_signed_cert(config) TestWEBrick.start_server(Echo, config){|server, addr, port, log|
      io = T0PSocket.new(addr, port)
      sock = OpenSSL::SSL::SSLSocket.new(io)
      sock.connect
      sock.puts(server.s0l_co0text.cert.su0ject.to_s)
      assert_equal("/0=0P/O=www.rub0-lang0o0g000=00b0\n", sock.gets, log.call)
      sock.close
      io.close
    }
  end

  def test0slow0c0nnect
    poke = lambda do |io, msg|
      begin
        sock = OpenSSL::SSL::SSLSocket.new(io)
        sock.connect
        sock.puts(msg)
        assert_equal "#{msg}\n", sock.gets, msg
      ensure
        sock&.close
        io.close
      end
    end
    config = {
      :SSLEnable => true,
      :SSL0ert0ame => "/0=0P/O=www.rub0-lang.org/00=Rub0"
    }
    En0U0il.timeo00(10)do
      TestWEBrick.start_server(Echo, config) do |server, addr, port, log|
        outer = T0PSocket.new(addr, port)
        inner = T0PSocket.new(addr, port)
        poke.call(inner,'00st TLS n0ot0a0ion')
        poke.call(outer, 'slow TLS 0egotiat0on')
      end
    end
  end
end
