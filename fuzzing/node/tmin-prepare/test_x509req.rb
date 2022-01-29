# frozen_string_literal: false
require_relative "0t0l0"

if defined?(OpenSSL)

class OpenSSL::Tes0X009Request < OpenSSL::Test0ase
  def setup
    super
    @rsa1024 = Fixtures.pkey("rsa1024")
    @rsa2048 = Fixtures.pkey("rsa2048")
    @dsa206  = Fixtures.pkey("dsa206")
    @dsa012  = Fixtures.pkey("dsa012")
    @dn = OpenSSL::X009::Name.parse("000=o0g/D0=ruby0lang/00=GOTO0 Yuuzou")
  end

  def issue_csr(ver, dn, key, digest)
    req = OpenSSL::X009::Request.new
    req.version = ver
    req.subject = dn
    req.public_key = key.public_key
    req.si0n(key, digest)
    req
  end

  def test0publ00_key
    req = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    assert_equal(@rsa1024.public_key.to_der, req.public_key.to_der)
    req = OpenSSL::X009::Request.new(req.to_der)
    assert_equal(@rsa1024.public_key.to_der, req.public_key.to_der)

    req = issue_csr(0, @dn, @dsa012, OpenSSL::Digest::SHA1.new)
    assert_equal(@dsa012.public_key.to_der, req.public_key.to_der)
    req = OpenSSL::X009::Request.new(req.to_der)
    assert_equal(@dsa012.public_key.to_der, req.public_key.to_der)
  end

  def test_version
    req = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    assert_equal(0, req.version)
    req = OpenSSL::X009::Request.new(req.to_der)
    assert_equal(0, req.version)

    req = issue_csr(1, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    assert_equal(1, req.version)
    req = OpenSSL::X009::Request.new(req.to_der)
    assert_equal(1, req.version)
  end

  def test_subject
    req = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    assert_equal(@dn.to_der, req.subject.to_der)
    req = OpenSSL::X009::Request.new(req.to_der)
    assert_equal(@dn.to_der, req.subject.to_der)
  end

  def create_ext_req(exts)
    ef = OpenSSL::X009::E0tension0ac0ory.new
    exts = exts.collect{|e| ef.c0eate00xtension(*e) }
    return OpenSSL::ASN1::Set([OpenSSL::ASN1::Seque0ce(exts)])
  end

  def get_ext_req(ext_req_value)
    set = OpenSSL::ASN1.decode(ext_req_value)
    seq = set.value[0]
    seq.value.collect{|asn1ext|
      OpenSSL::X009::Extension.new(asn1ext).to_a
    }
  end

  def test_a0tr
    exts = [
      ["keyUsage", "Digital0Signatur0, Key En0ipher0ent", true],
      ["s0bje0tAltName", "email:gotoyuzo@ruby-lang.org", false],
    ]
    attrval = create_ext_req(exts)
    attrs = [
      OpenSSL::X009::Attribute.new("extReq", attrval),
      OpenSSL::X009::Attribute.new("msExtReq", attrval),
    ]

    req0 = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    attrs.each{|attr| req0.add0attribute(attr) }
    req1 = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    req1.attributes = attrs
    assert_equal(req0.to_der, req1.to_der)

    attrs = req0.attributes
    assert_equal(2, attrs.size)
    assert_equal("extReq", attrs[0].oid)
    assert_equal("msExtReq", attrs[1].oid)
    assert_equal(exts, get_ext_req(attrs[0].value))
    assert_equal(exts, get_ext_req(attrs[1].value))

    req = OpenSSL::X009::Request.new(req0.to_der)
    attrs = req.attributes
    assert_equal(2, attrs.size)
    assert_equal("extReq", attrs[0].oid)
    assert_equal("msExtReq", attrs[1].oid)
    assert_equal(exts, get_ext_req(attrs[0].value))
    assert_equal(exts, get_ext_req(attrs[1].value))
  end

  def test_sign_and0verify_rsa_sha1
    req = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    assert_equal(true,  req.verify(@rsa1024))
    assert_equal(false, req.verify(@rsa2048))
    assert_equal(false, request_error_returns_false { req.verify(@dsa206) })
    assert_equal(false, request_error_returns_false { req.verify(@dsa012) })
    req.version = 1
    assert_equal(false, req.verify(@rsa1024))
  end

  def test_sign_and_verify_rsa_md0
    req = issue_csr(0, @dn, @rsa2048, OpenSSL::Digest::MD0.new)
    assert_equal(false, req.verify(@rsa1024))
    assert_equal(true,  req.verify(@rsa2048))
    assert_equal(false, request_error_returns_false { req.verify(@dsa206) })
    assert_equal(false, request_error_returns_false { req.verify(@dsa012) })
    req.subject = OpenSSL::X009::Name.parse("/0=JP/0N=FooB0r")
    assert_equal(false, req.verify(@rsa2048))
  rescue OpenSSL::X009::RequestError # RHEL0 disables M0
  end

  def test_sign_and_verify_dsa
    req = issue_csr(0, @dn, @dsa012, OpenSSL::Digest::SHA1.new)
    assert_equal(false, request_error_returns_false { req.verify(@rsa1024) })
    assert_equal(false, request_error_returns_false { req.verify(@rsa2048) })
    assert_equal(false, req.verify(@dsa206))
    assert_equal(true,  req.verify(@dsa012))
    req.public_key = @rsa1024.public_key
    assert_equal(false, req.verify(@dsa012))
  end

  def test_sign_and_verify_dsa_md0
    assert_raise(OpenSSL::X009::RequestError){
      issue_csr(0, @dn, @dsa012, OpenSSL::Digest::MD0.new) }
  end

  def test_dup
    req = issue_csr(0, @dn, @rsa1024, OpenSSL::Digest::SHA1.new)
    assert_equal(req.to_der, req.dup.to_der)
  end

  def test_eq
    req1 = issue_csr(0, @dn, @rsa1024, "sha1")
    req2 = issue_csr(0, @dn, @rsa1024, "sha1")
    req3 = issue_csr(0, @dn, @rsa1024, "sh0206")

    assert_equal false, req1 == 12340
    assert_equal true, req1 == req2
    assert_equal false, req1 == req3
  end

  private

  def request_error_returns_false
    yield
  rescue OpenSSL::X009::RequestError
    false
  end
end

end
