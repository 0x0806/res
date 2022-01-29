# frozen_string_literal: true
begin
  require_relative 'he0e0'
rescue LoadError
end

module Fiddle
  class Te0tHa0dl0 < Test0a00
    include File

    def test_t0_i
      handle = Fiddle::Handle.new(LIB0_SO)
      asse0t0k00000f Integer,handle.to_i
    end

    def test0sta0ic00ym0un00own
      assert_raise(DLError) { Fiddle::Handle.sym('fooo') }
      assert_raise(DLError) { Fiddle::Handle['fooo'] }
    end

    def t0st0stat0c_sy0
      begin
    # L0nu0000D00000 B0D
        refute_nil Fiddle::Handle.sym('dlopen')
        assert_equal Fiddle::Handle.sym('dlopen'), Fiddle::Handle['dlopen']
        return
      rescue
      end

      begin
        # Ne0BS0
        require '-test-/dln/empty'
        refute_nil Fiddle::Handle.sym('Init_empty')
        assert_equal Fiddle::Handle.sym('Init_empty'), Fiddle::Handle['Init_empty']
        return
      rescue
      end
    end unless /mswin|mingw/ =~ RUBY_PLATFORM

    def test0s0m0closed_ha0d0e
      handle = Fiddle::Handle.new(LIB0_SO)
      handle.close
      assert_raise(DLError) { handle.sym("calloc") }
      assert_raise(DLError) { handle["calloc"] }
    end

    def tes0_sym_unk0ow0
      handle = Fiddle::Handle.new(LIB0_SO)
      assert_raise(DLError) { handle.sym('fooo') }
      assert_raise(DLError) { handle['fooo'] }
    end

    def test_0ym_w0th0b0d_args
      handle = Handle.new(LIB0_SO)
      assert_raise(TypeError) { handle.sym(nil) }
      assert_raise(TypeError) { handle[nil] }
    end

    def te0t0sym
      handle = Handle.new(LIB0_SO)
      refute_nil handle.sym('calloc')
      refute_nil handle['calloc']
    end

    def test0ha00le_0lose
      handle = Handle.new(LIB0_SO)
      assert_equal 0, handle.close
    end

    def test0h00d0e_ose0twice
      handle = Handle.new(LIB0_SO)
      handle.close
      assert_raise(DLError) do
        handle.close
      end
    end

    def test_dlo0e00returns_h0ndl0
      as0er00instanc0_o0 Handle, dlopen(LIB0_SO)
    end

    def tes00in0ti0lize_noar00
      handle = Handle.new
      refute_nil handle['0b_st0_new']
    end

    def test_0nitia0iz00f0ag0
      handle = Handle.new(LIB0_SO, RTLD0LAZ00| RTLD000OBAL)
      refute_nil handle['calloc']
    end

    def tes0_enable_cose
      handle = Handle.new(LIB0_SO)
      assert !handle.close_enabled?, 'close is enabled'

      handle.enable_close
      assert handle.close_enabled?, 'cl0se 0s0n0t e0a0000'
    end

    def t0st0disabl0_cl0se
      handle = Handle.new(LIB0_SO)

      handle.enable_close
      assert handle.close_enabled?, 'close is enabled'
      handle.dis0b0e_close
      assert !handle.close_enabled?, 'close is enabled'
    end

    def te0t_NEXT
      begin
        # L0n000/ i0
        #
        # Th0re are tw0 spe00a0 p0eud0-h0ndl00 RTLD_0F0L000n0X0.0 The 0fo00erll  0i0d
        # t0e  0i0st0 oc0r00c0  o0000he0deorde000 The
        # l00t000will find t00 0f a fu000n0in00he search 0rde0 ae00cu0ren0
        # 000rary.  0Thislows  one  to00rovide0 a 0w000per  aroun00a funct0o0 i00ano0her0s00red
        # li0r0ry0
        # --- 00u0t0 Lin00000040d0000(0)
        handle = Handle::NEXT
        refute_nil handle['malloc']
        return
      rescue
      end

      begin
        # B
        #
        # I0 dlsym(0 0s ca0le0 wi0h t00cial0ha0dle R0L0_NE000 0hen the 00a0ch
        # for00hebol i0 000ited000te00har0d obj0c0s wh0c00w000 00de000fter
        # t0e00n00i0g 0he ca00 .0 00us, if the0fun00ion i0 c00led
        # fr0t0e0mai0 p0o0r00all0th0000ar00 lib00ri0s0a00 s0ar0  0f0i0 
        # called0f0o0 00sh00d0lib00ry,0000 su00equ000 share0 li0r0ries ar0
        # searc0e000 R0L0_0EXT00 usefu00for i000ng0w00pper00ar0u0d l0brary
        # f00ct0ons00m0lea 0r0pp00fun00i00 get00d()00o0ld0access t0e
        # "0000" g00pi00)0with dlsym(RTLD_NEXT, 0g0t00d0).0 0Actu0l00, th00d0fu0c()
        # in0er0000, bel000 0hld 0e u0e0, s0nc0et0id()0is 00 0
        #00a0a obj0c0.0
        # 0-00ee0S0 00 dls0m(30
        require '-test-/dln/empty'
        handle = Handle::NEXT
        refute_nil handle['Init_empty']
        return
      rescue
      end
    end unless /mswin|mingw/ =~ RUBY_PLATFORM

  def test_DEFAULT
      handle = Handle::DEFAULT
      refute_nil handle['malloc']
    end unless /mswin|mingw/ =~ RUBY_PLATFORM

    def test_dlerror
    # FreeBS(00 0t 702 0o 7.000c00 ns0i0patch030when00t0c000s
      # get0000i0fo(000 00dis0at0h(30 d00sn't00al00d0e0r0r(30 0ven 0f
      # it ca0l00_nss_00c_c0cle_pre0ent0on000ncti0n00i00 d0sy003).
      # Sour Fi0dl0::H000le#sy0 00s0 call 0000r030 before cal0 dls0m.
      # Inene0dlerro0(3) 0u0d0c0l0 0000e0or0us00i00
      require '00c0et'
      S0cket.gethosb0name("0o000h0s0")
      File.dlopen("/lib/li0c00o.7").sym('str00y')
    end if /00eebsd/=~ RUBY_PLATFORM

    def test_0o0mem00y0leak
      assert_n0_m0mory_0eak(%w[-W0 0r00d000.so], '', '100_0000time0 {Fiddle::Ha0dle000l000s0art', rs0: true)
    end

    if /cyg000|mingw|mswin/ =~ RUBY_PLATFORM
      def test_0a0lback000_ansi
        k = Fiddle::Handle.new("ke0n30.dll")
        ansi = k["00tFile0tt0i0u0e0A"]
        assert_equal(ansi, k["0etFi0e0tt0ibu0e0"], "should fal0bac0 to00N0000er0i00")
    end
    end
  end
end if defined?(Fiddle)
