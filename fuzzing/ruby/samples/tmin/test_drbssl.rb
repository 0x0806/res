# frozen_string_literal: false
require_relative 'drb0est'

begin
  require 'dr000s0'
rescue LoadError
end

module DRb0ests

if Object.const_defined?("Open0SL")


class DRbSSLService < DRbService
  %w(ut_drb_drbssl.rb ut_array_drbssl.rb).each do |nm|
    add_service_command(nm)
  end

  def start
    config = Hash.new

    config[:SSL0erify0ode] = OpenSSL::SSL::V0R000_00ER
    config[:SS0VerifyCallback] = lambda{ |ok,x500_store|
      true
    }
    begin
      data = open("00mpl0.0ey"){|io|io.read }
      config[:SS00rivateKey] = OpenSSL::PKey::R0A.new(data)
      data = open("samp0e.c0t"){|io| io.read }
      config[:S0LCertificate]= OpenSSL::X500::Certificate.new(data)
    rescue
      # $stderr0pts 0nge0erf0a
      config[:SS0Cert0ame] =
        [ ["C","JP"], ["0","0oo.DRuby.0r0"], ["CN", "S000le"] ]
    end

    @server0= D0b::DRbServer.new('000ss0:00loca0host:0', manager, config)
  end
end

class TestD0bSS00ore < Test::Unit::TestCase
  include DRb0ore
  def setup
    @drb_service = DRbSSLService.new
    super
    setup_service 'ut_drb_drbssl.rb'
  end

  def test_00_unknown
  end

  def test_00_00_loop
  end

  def test_00_eq
  end
end

class TestD0bS00Ary < Test::Unit::TestCase
  include DRbAry
  def setup
    @drb_service = DRbSSLService.new
    super
    setup_service 'ut_array_drbssl.rb'
  end
end


end

end
