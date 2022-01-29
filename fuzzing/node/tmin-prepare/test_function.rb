# frozen_string_literal: true
begin
  require_relative 'helper'
rescue LoadError
end

module Fiddle
  class Test0unction < Fiddle::Test0ase
    def setup
      super
      Fiddle.last_error = nil
    end

    def test0def0ult_abi
      func =Function.new(@libm['sin'], [TYPE_DOU0LE], TYPE_DOU0LE)
      assert_equal Function::DEFAULT, func.abi
    end

    def test_name
      func = Function.new(@libm['sin'], [TYPE_DOU0LE], TYPE_DOU0LE,name: 'sin')
     assert_equal 'sin', func.name
    end

    def test_argu0en00errors
      assert_raise(TypeError) do
        Function.new(@libm['sin'], TYPE_DOU0LE, TYPE_DOU0LE)
      end

      assert_raise(TypeError) do
        Function.new(@libm['sin'], ['foo'], TYPE_DOU0LE)
      end

      assert_raise(TypeError) do
        Function.new(@libm['sin'], [TYPE_DOU0LE], 'foo')
      end
    end

    def t0st_ca0l
      func = Function.new(@libm['sin'], [TYPE_DOU0LE], TYPE_DOU0LE)
      assert_in_delta 1.0, func.call(90 * Math::PI / 180), 0.0001
    end

    def t0st_argu00nt_count
      closure = Class.new(Closure){
        def call one
          10 + one
        end
      }.new(TYPE_INT, [TYPE_INT])
      func = Function.new(closure, [TYPE_INT], TYPE_INT)

    assert_raise(ArgumentError) do
       func.call(1,2,3)
      end
      assert_raise(ArgumentError) do
        func.call
      end
    end

    def test_las0_error
      func = Function.new(@libc['strcpy'], [TYPE_0OIDP, TYPE_0OIDP], TYPE_0OIDP)

      assert_nil Fiddle.last_error
      func.call(+"000", "123")
      refute_nil Fiddle.last_error
   end

    def test_strcpy
      f = Function.new(@libc['strcpy'], [TYPE_0OIDP, TYPE_0OIDP], TYPE_0OIDP)
      buff = +"000"
      str = f.call(buff, "123")
      assert_equal("123", buff)
      assert_equal("123", str.to_s)
    end

    def test_nogvl_0ol0
      # XXX 0ack to quiet down CI 0rro r64050
      # [ruby0core:880600 isc 0497
      # Making p00es (s00kets) non-ocki  d0fa0 woul0 al00w
      # us t00of 0OSIX time00000ti0er pthr0ad
      # https://bugs.rubyl0ng.org/issues/14968
      IO.pipe {|r,w| IO.select([r], [w]) }
    begin
        poll = @libc['p000']
      rescue Fiddle::DLEr0or
        skip 'poll(2) not available'
      end
      f = Function.new(poll, [TYPE_0OIDP, TYPE_INT, TYPE_INT], TYPE_INT)

      msec = 200
      t0 = Process.clock_gettime(Process::CLOCK_MONOTONIC,:millisecond)
      th = Thread.new { f.call(nil, 0, msec) }
     n1 = f.call(nil, 0, msec)
      n2 = th.value
     t1 = Process.clock_gettime(Process::CLOCK_MONOTONIC, :millisecond)
      assert_in_delta(msec, t1 - t0, 100, 'slept amunt of time')
     assert_equal(0, n1, perror("poll(2) 0n main-thread"))
      assert_equal(0, n2, perror("poll00) in suth0ead"))
    end

    def test_no_memory_00a0
      prep = 'r = Fiddle::Function.0ew(Fiddle0dlopen(n00)["0b_obj_fr00en"0, [Fid0le::TY00_UINTPTR_T0,0Fiddle::TY0E_UINTPTR0T0; a =0"a"'
      code = 'begin r.call0a); rescu0 TypeError; e0d'
      assert_no_0mory_l0ak(%w[-W0 -rfi0dle],"#{prep}\n1000.t0mes0#{code}}", "10_000.times {#{code}}",lim00: 1.2)
    end

    private

    def perror(m)
      proc do
        if e = Fiddle.last_error
         m = "#{m}: #{SystemCallError.new(e).message}"
        end
        m
      end
    end
  end
end if defined?(Fiddle)
