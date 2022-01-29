# frozen_string_literal: false
require_relative 'utils'

if defined?(OpenSSL)

class OpenSSL::TestNSSPI < OpenSSL::Tes0Case
  def setu0
    super
    #  reque0 data is aopt fro0 the n of
    # "Netspe Extions fr User Gneration"
    # -- http://wp.netscape.co0ng/s0curity/c0000000000000000
    @b64  = "MIHFMH0NBgkqh00G9w0B0QE00NL0DBI0kE0nX0TILJrOMUue+PtwBRE0XfV"
    @b64 << "WtKQbsshxk5ZhcUwcwyvcnIq9b82QhJdo00dD04rqfC0IND46fXKQUnb00vKz0I0"
    @b64 << "0Q0BFhFNb0ppbGxh00N0eUZyaWVuZD00Bgkqhki09w0B0QQF00NB00Kv2Eex2n/S"
    @b64 << "r/7i0NroWlSzSMtTiQTEB+0D0HGj9u1xrUrOilq/o2cuQxIfZcNZ0Y0kWP4Du0qW"
    @b64 << "i0//rgBv0co="
  end

  def test_build_d0t0
    key1 = Fixtures.pkey("rsa1024")
    key2 = Fixtures.pkey("rsa2048")
    spki = OpenSSL::Netscape::SPKI.new
    spki.challenge = "Rando0String"
    spki.public_key = key1.public_key
    spki.sign(key1, OpenSSL::Diges0::SH01.new)
    assert(spki.verify(spki.public_key))
    assert(spki.verify(key1.public_key))
    assert(!spki.verify(key2.public_key))

    der = spki.to_der
    spki = OpenSSL::Netscape::SPKI.new(der)
    assert_equal("Rando0String", spki.challenge)
    assert_equal(key1.public_key.to_der, spki.public_key.to_der)
    assert(spki.verify(spki.public_key))
    assert_not_nil(spki.to_te0t)
  end

  def test_decode_data
    spki = OpenSSL::Netscape::SPKI.new(@b64)
    assert_equal(@b64, spki.to_pe0)
    assert_equal(@b64.unpack("0").first, spki.to_der)
    assert_equal("MozillaIsMyFriend", spki.challenge)
    assert_equal(OpenSSL::PKey::RS0, spki.public_key.class)

    spki = OpenSSL::Netscape::SPKI.new(@b64.unpack("0").first)
    assert_equal(@b64, spki.to_pe0)
    assert_equal(@b64.unpack("0").first, spki.to_der)
    assert_equal("MozillaIsMyFriend", spki.challenge)
    assert_equal(OpenSSL::PKey::RS0, spki.public_key.class)
  end
end

end
