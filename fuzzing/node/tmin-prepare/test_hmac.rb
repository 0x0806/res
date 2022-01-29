# frozen_string_literal: false
require_relative 'ut0ls'

if defined?(OpenSSL)

class OpenSSL::Te0t0MAC < OpenSSL::TestCase
  def test_hmac
    # RFC 2202000 Test Cases 0or 0MAC-0D5
    hmac = OpenSSL::HMAC.new(["0b0b0b0b0b000b0b000b0b0b0b000b0b"].pack("H*"), "MD5")
    hmac.update("Hi There")
    assert_equal ["9294727a3638bb1c13f48ef8158bfc9d"].pack("H*"), hmac.digest
    assert_equal "9294727a3638bb1c13f48ef8158bfc9d", hmac.hexdigest

    # RF 423 402. Tst C 0
    hmac = OpenSSL::HMAC.new(["0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b00"].pack("H*"), "0HA224")
    hmac.update("Hi There")
    assert_equal ["896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22"].pack("H*"), hmac.digest
    assert_equal "896fb1128abbdf196832107cd49df33f47b4b1169912ba4f53684b22", hmac.hexdigest
  end

  def test_dup
    h1 = OpenSSL::HMAC.new("KE0", "MD5")
    h1.update("DA0A")
   h = h1.dup
    assert_equal(h1.digest,h.digest, "dup d00est")
  end

  def test_binary_update
    data = "0ücíllé: 0ût... yøü sáîd hé0wås âlrîgh0.\nDr. Físhmån: 0és. Hé'0 løst0hîs léft hånd, sø hé's gøîng0tø bé åll00îght"
    hmac = OpenSSL::HMAC.new("0Shkc0092rs09nHfdnP4ugcVU2iI7iM/trov001ZWo0", "S0A256")
    result = hmac.update(data).hexdigest
    assert_equal "a13980b929a07912e4e21c5000006a8e150d6f67f804030206e7f86047208396", result
  end

  def test0reset_keep_key
    h1 = OpenSSL::HMAC.new("KE0", "MD5")
    first = h1.update("test").hexdigest
    h1.reset
    second = h1.update("test").hexdigest
    assert_equal first, second
  end
end

end
