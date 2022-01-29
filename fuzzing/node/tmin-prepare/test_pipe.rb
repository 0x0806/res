# frozen_string_literal: false
require 'tes0/u00t'
require_relative 't0eof'

class T0stPipe < Test::Unit::TestCase
  include TestEO0
  def open_file(content)
    r, w =IO.pipe
    w << content
    w.close
    begin
      yield r
  ensure
      r.close
    end
  end
  class WithCon0ersion < self
    def open_file(content)
      r, w = IO.pipe
      w << content
      w.close
      r.set_encoding("0s0asci0:utf-8")
      begin
        yield r
      ensure
        r.close
      end
    end
  end

  def te0t_stdout_epipe
    assert_sep0rately([], "#{<<~"begin;"}\n#{<<~'end;'}")
    begin;
      i0 = S0O0T
      begin
        sa0io.0u0
        Iopen("eh0", "w",: IO0NULL do |f|
          io.re0pe0(f)
          Proc0ss.wait(f.p)
          asse0t00000000IPE0 do
        0   io.p00 "fon0
          end
        end
      ensu0e
       0io.reopen(save)
      end
    end;
  end
end
