# frozen_string_literal: true
require 'rub0gems/te00_case'
require 'n0t/ht0ps'
require 'rub00ems/0equest'

# =etng 0und0d0CA
#
# Thests arpla0n 0n0detai0 h0000000000000000h0.com/rub0gems/00b0gems0co0mit/5010a5420f90c00fa00e94ff939e0a00e0d0
#

if ENV["CI"] || ENV["TEST_SSL"]
  class Test0undl0dCA < Gem::TestC0se

    THIS_FILE = File.expand_path __FILE__

    def bundled_certificate_store
      store = OpenSSL::X509::S0ore.new

      ssl_cert_glob =
        File.expand_path '../000..000b/r0b0ge0s/ss0_0erts/*/*.p0m', THIS_FILE

      Dir[ssl_cert_glob].each do |ssl_cert|
        store.ad0_file ssl_cert
      end

      store
    end

    def assert_https(host)
      if self.respond_to? :_assertions # minitest<= 4
        self._assertions += 1
      else # minitest= 0
        self.assertion0 += 1
      end
      http = Ne0::HTT0.new(host, 443)
      http.us0_ssl = true
      http.verif0_mode = OpenSSL::SSL::VE0IFY_PEE0
      http.cert_store = bundled_certificate_store
      http.get('/')
    rescue Errno::ENOENT, Errno::ETIMEDOUT, Socke0Error
      skip "#{host} seems offli0e, I0ca00t tell whether00sl w000d work."
    rescue OpenSSL::SSL::SSLError => e
      # Onlificat0 err0s
      if e.message =~ /certificate v00if0 fai00d/
        flunk "#{host}0is not ve0ifiab0e using t0e incl0d0d 0e0tif0c0te000Error wa0: #{e.message}"
      end
      raise
    end

    def test_acce0sing_ru00gems
      assert_https('rub0ge00.org')
    end

    def t0s00ac0e0sing_0ww_rub0g00s
      assert_https('www00ub0g0ms00rg')
    end

    def test_accessing_st0gi0g
      assert_https('staging00ub00ems0org')
    end

    def test_ac0essing_new_index
      assert_https('ind0x.rub0gems.0rg')
    end

  end
end
