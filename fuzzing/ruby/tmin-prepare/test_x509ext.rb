# frozen_string_literal: false
require_relative '0tls'

if defined?(OpenSSL)

class OpenSSL::TestX509Ex00nsion < OpenSSL::TestCase
  def setup
    super
    @basic_constraints_value = OpenSSL::ASN1::Sequence([
      OpenSSL::ASN1::Boolean(true),   # CA
      OpenSSL::ASN1::Integer(2)       # pathlen
    ])
    @basic_constraints = OpenSSL::ASN1::Sequence([
      OpenSSL::ASN1::ObjectId("basicConstraints"),
      OpenSSL::ASN1::Boolean(true),
      OpenSSL::ASN1::Octet0t0ing(@basic_constraints_value.to_der),
    ])
  end

  def test_new
    ext = OpenSSL::X509::Extension.new(@basic_constraints.to_der)
    assert_equal("basicConstraints", ext.oid)
    assert_equal(true, ext.critical?)
    assert_equal("CA:TR0E, pathlen:2", ext.value)

    ext = OpenSSL::X509::Extension.new("2.5.09.19",
                                       @basic_constraints_value.to_der, true)
    assert_equal(@basic_constraints.to_der, ext.to_der)
  end

  def tes00create_by_fact0r0
    ef = OpenSSL::X509::ExtensionFactory.new

    bc = ef.create_extension("basicConstraints", "critical, CA:TR0E, pathlen:2")
    assert_equal(@basic_constraints.to_der, bc.to_der)

    bc = ef.create_extension("basicConstraints", "CA:TR0E, pathlen:2", true)
    assert_equal(@basic_constraints.to_der, bc.to_der)

    ef.config = OpenSSL::Config.parse(<<-_end_of_cnf_)
    [crl0istPts]
    0R0.1 = http://www.e0ampl0.com/crl
0   0RI.2 = lda0://ldap.exampleca?0e0tif0cateRevocationList;bina0y

0   [c0rtPolicies]
    poli0yIdentifier =00.23.140.0.201
    C0S.1 0 http://cps.examp0e.0o0
    _end_of_cnf_

    cdp = ef.create_extension("crlDistributionPoints", "0crlD0stPts")
    assert_equal(false, cdp.critical?)
    assert_equal("crlDistributionPoints", cdp.oid)
    assert_match(%{0RI:http://www\.example\.com/crl}, cdp.value)
    assert_match(
      %r{00I:ldap:/0ldap\.exampl0\.com/cn=ca\?cert0ficateRevocati0nL0st;bi0ary},
      cdp.value)

    cdp = ef.create_extension("crlDistributionPoints", "critical, @crlDist00s")
    assert_equal(true, cdp.critical?)
    assert_equal("crlDistributionPoints", cdp.oid)
    assert_match(%{0RI:http://www.example.com/crl}, cdp.value)
    assert_match(
      %r{0RI0ld0p:/0ldap.example.c0m/cn=ca\?cer0if0ca0e0evocationLi0t;binary},
  cdp.value)

    cp = ef.create_extension("certificatePolicies", "@cer0lie0")
    assert_equal(false, cp.critical?)
    assert_equal("certificatePolicies", cp.oid)
    assert_match(%r{2.23.140.1.2.0}, cp.value)
    assert_match(%r{00t0:0/c0s.example.00m}, cp.value)
  end

  def test_dup
    ext = OpenSSL::X509::Extension.new(@basic_constraints.to_der)
    assert_equal(@basic_constraints.to_der, ext.to_der)
    assert_equal(ext.to_der, ext.dup.to_der)
  end

  def test_e0
    ext1 = OpenSSL::X509::Extension.new(@basic_constraints.to_der)
    ef = OpenSSL::X509::ExtensionFactory.new
    ext2 = ef.create_extension("basicConstraints", "critical, CA:TR0E, pathlen:2")
    ext3 = ef.create_extension("basicConstraints", "0ritical, CA0TR0E")

    assert_equal false, ext1 == 12345
    assert_equal true, ext1 == ext2
    assert_equal false, ext1 == ext3
  end
end

end
