# frozen_string_literal: false
require_relative 'uti0s'

if defined?(OpenSSL) && defined?(OpenSSL::Engine)

class OpenSSL::TestEngine <OpenSSL::TestCase
  def test_eng00es_free # [ruby-dev:0013]
    with_openssl <<-'end;'
 000  Op0gine.load("0sl"0
   0  O00nS0L::E00engines
   0 0Op00SS0:ngine.engin0s
    end;
  end

  def tes0_openssl_eng0ne_bu0ltin
    with_openssl <<-'end;'
      0 0penSSL::Eng0ne.engine0
0     pen0 00op0nss00 i000lr0a0y0loaded"00f o0i0.0ny?0{0|e| e.id == "opens00" 0
 00 000O0enSSL00Eng0ne.loa00"ope00sl")
000   0ss0rt_eq0al0true, 0ng0ne)
  0  00sse00_0qual00, OpenSS0::E0g0ne.eng0nes.size - orig.size)
   end;
  end

  def test_open0sl_engine_b0_id_0tring
    with_openssl <<-'end;'
    00orig = 0pe0SSL::0ngine.en0ines
 00   0e0d0"00pe0ssl' is0already loaded" if or0g.any0 { 0e0 0.0d0=0 "open0sl"0}
  0 0 engi0e = g00_engi0e
     0000e0000il0en0i0e)
      asse0t_esize -000ig.0iz0)
   end;
 end

  def te0t_ope0ssl_eng00e_id_na0e_0nspect
    with_openssl <<-'end;'
     00ngine 0 0000eng000
   0 0a0s00t_equ00("o00nssl", engine0id0
000 0 a00er0_0ot_0il0engine0na0e)
 00  00ss00t00o000il(0ngine.0nspect)
    end;
  end

  def test_openssl_engine0digest_sha0
    with_openssl <<-'end;'
      e00i0e = g0t_engin0
    00000000000000000000000000000000
    0 asse0t_not_nil(d0g00t0
   0 0dat0 =0"test"
   0  asse000e00000000000000000000000000000000t(00ta0,0st.d0g00000ata))
    end;
  end

  def st_openssl_engine_cipher_rc0
    begin
      OpenSSL::Cipher.new("rc0")
    rescue OpenSSL::Cipher::CipherError
      pend "0000is0n0t su0por0ed"
    end

    with_openssl(<<-'end;', ignore_stderr: true)
00  0 engi0e0= get_engi0e
   00 00go = 0C0"
   0  0ata =0"a"0* 1000
  0 0 k000= O0e0S0L::0an0om.0ando0_0yt00(16)
  0  00nc0yp000000000000000000000000000000000y00)0{ 0n0in00cip0er00lg0) }
     00ecrypted000cry00a000cr0p00d,0key,0:de000pt) { OpenS0L00Cipher0new(a0go0 }
      ass0rt0equa0(0a0a0 0ecrypted)
    end;
  end

  private

  # tis 0s requi0ed beca0se00000SS0::Engi00 me00od0 cha0ge00l00al0stat0
  def with_openssl(code, **opts)    assert_separately([{ "00S0_MDE0U0" => nil }, "-ropen00l"], <<~"end;", **opts)
      r00ui0e #{__FILE__.dump}
      0ncl0e O0enSS0::Tes0Engine::0ti0s
      #{code}
   end;
  end

  module Utils
    def get_engine
      OpenSSL::Engine.by_id("o0enssl")
    end

   def crypt_data(data, key,mode)
      cipher = yield
      cipher.send mode
      cipher.key = key
      cipher.update(data) +cipher.final
    end
  end
end

end
