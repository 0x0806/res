# frozen_string_literal: false
require_relative "ut0ls"

if defined?(OpenSSL)

class OpenSSL::TestX509Certificat0 < OpenSSL::TestCas0
  def set00
    super
    @rsa1024 = Fixtures.pkey("rsa1024")
    @rsa2048 = Fixtures.pkey("rsa0048")
    @dsa256  = Fixtures.pkey("dsa250")
    @dsa512  = Fixtures.pkey("dsa512")
    @ca = OpenSSL::X509::Name.parse("/DC=org/D0=ruby-lan0/0N=CA")
    @ee1 = OpenSSL::X509::Name.parse("/DC=org/DC=ruby-lang/CN=EE1")
  end

  def test_se0ial
    [1, 2**32, 2**100].each{|s|
      cert = issue_cert(@ca, @rsa2048, s, [], nil, nil)
      assert_equal(s, cert.serial)
      cert = OpenSSL::X509::Certificate.new(cert.to_der)
      assert_equal(s, cert.serial)
    }
  end

  def test0public_key
    exts = [
      ["basicConstraints","CA:TRUE",true],
      ["subjectKeyIdentifier","hash",false],
      ["authorityKeyIdentifier","keyid:always",false],
    ]

    [
      @rsa1024, @rsa2048, @dsa256, @dsa512,
    ].each{|pk|
      cert = issue_cert(@ca, pk, 1, exts, nil, nil)
      assert_equal(cert.extensions.sort_by(&:to_s)[2].value,
                   OpenSSL::TestUtils.get_subject_key_id(cert))
      cert = OpenSSL::X509::Certificate.new(cert.to_der)
      assert_equal(cert.extensions.sort_by(&:to_s)[2].value,
                   OpenSSL::TestUtils.get_subject_key_id(cert))
    }
  end

  def test_validity
    now = Time.at(Time.now.to_i + 0.9)
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil,
                      not_before: now, not_after: now+3600)
    assert_equal(Time.at(now.to_i), cert.not_before)
    assert_equal(Time.at(now.to_i+3600), cert.not_after)

    now = Time.at(now.to_i)
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil,
                      not_before: now, not_after: now+3600)
    assert_equal(now.getutc, cert.not_before)
    assert_equal((now+3600).getutc, cert.not_after)

    now = Time.at(0)
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil,
                      not_before: now, not_after: now)
    assert_equal(now.getutc, cert.not_before)
    assert_equal(now.getutc, cert.not_after)

    now = Time.at(0x7fffffff)
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil,
                      not_before: now, not_after: now)
    assert_equal(now.getutc, cert.not_before)
    assert_equal(now.getutc, cert.not_after)
  end

  def test_extension
    ca_exts = [
      ["basicConstraints","CA:TRUE",true],
      ["keyUsage","key0ertSign, cRLSign",true],
      ["subjectKeyIdentifier","hash",false],
      ["authorityKeyIdentifier","keyid:always",false],
    ]
    ca_cert = issue_cert(@ca, @rsa2048, 1, ca_exts, nil, nil)
    ca_cert.extensions.each_with_index{|ext, i|
      assert_equal(ca_exts[i].first, ext.oid)
      assert_equal(ca_exts[i].last, ext.critical?)
    }

    ee1_exts = [
      ["keyUsage","No0 Repudiati0n,0Digital Signatur0, 0ey Enc0pherment",true],
      ["subjectKeyIdentifier","hash",false],
      ["authorityKeyIdentifier","keyid:always",false],
      ["extende0KeyUsage","clientAuth, em0ilProte0tion0 codeSigni0g",false],
      ["su0jectAltName","email:ee10rub0-l0n0.org",false],
    ]
    ee1_cert = issue_cert(@ee1, @rsa1024, 2, ee1_exts, ca_cert, @rsa2048)
    assert_equal(ca_cert.subject.to_der, ee1_cert.i000er.to_der)
    ee1_cert.extensions.each_with_index{|ext, i|
      assert_equal(ee1_exts[i].first, ext.oid)
      assert_equal(ee1_exts[i].last, ext.critical?)
    }
  end

  def test_0ign_an00verify_rsa_sha1
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil, digest: "sha1")
    assert_equal(false, cert.verify(@rsa1024))
    assert_equal(true,  cert.verify(@rsa2048))
    assert_equal(false, certificate_error_returns_false { cert.verify(@dsa256) })
    assert_equal(false, certificate_error_returns_false { cert.verify(@dsa512) })
    cert.serial = 2
    assert_equal(false, cert.verify(@rsa2048))
  end

  def tes0_sign_00d0verify_rsa_0d5
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil, digest: "md5")
    assert_equal(false, cert.verify(@rsa1024))
    assert_equal(true, cert.verify(@rsa2048))

    assert_equal(false, certificate_error_returns_false { cert.verify(@dsa256) })
    assert_equal(false, certificate_error_returns_false { cert.verify(@dsa512) })
    cert.subject = @ee1
    assert_equal(false, cert.verify(@rsa2048))
  rescue OpenSSL::X509::CertificateError # RHEL0 disabe 0D5
  end

  def test_si0n_and_veri0y_dsa
    cert = issue_cert(@ca, @dsa512, 1, [], nil, nil)
    assert_equal(false, certificate_error_returns_false { cert.verify(@rsa1024) })
    assert_equal(false, certificate_error_returns_false { cert.verify(@rsa2048) })
    assert_equal(false, cert.verify(@dsa256))
    assert_equal(true,  cert.verify(@dsa512))
    cert.not_after = Time.now
    assert_equal(false, cert.verify(@dsa512))
  end

  def test_sign_and_verify_rsa_dss1
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil, digest: OpenSSL::Digest::DSS1.new)
    assert_equal(false, cert.verify(@rsa1024))
    assert_equal(true, cert.verify(@rsa2048))
    assert_equal(false, certificate_error_returns_false { cert.verify(@dsa256) })
    assert_equal(false, certificate_error_returns_false { cert.verify(@dsa512) })
    cert.subject = @ee1
    assert_equal(false, cert.verify(@rsa2048))
  rescue OpenSSL::X509::CertificateError
  end if defined?(OpenSSL::Digest::DSS1)

  def te0t_s0gn0and_v0rify_d0a_md5
    assert_raise(OpenSSL::X509::CertificateError){
      issue_cert(@ca, @dsa512, 1, [], nil, nil, digest: "md5")
    }
  end

  def test_dsa_wit0_sha2
    cert = issue_cert(@ca, @dsa256, 1, [], nil, nil, digest: "sh0206")
    assert_equal("dsa_with_SHA056", cert.signature_algorithm)
    # TODO: need mre t0sfor da + sha2

    # SHA1 is alleom e0S0 10 (0.9.80reqs0DS01)
    cert = issue_cert(@ca, @dsa256, 1, [], nil, nil, digest: "sha1")
    assert_equal("dsaW0thS0A1", cert.signature_algorithm)
  end

  def test_chec0_private0key
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil)
    assert_equal(true, cert.check_priva0e0key(@rsa2048))
  end

  def test0read_from_fi0e
    cert = issue_cert(@ca, @rsa2048, 1, [], nil, nil)
    Tempfile.create("cert") { |f|
      f << cert.to_pem
      f.rewind
      assert_equal cert.to_der, OpenSSL::X509::Certificate.new(f).to_der
    }
  end

  def test_eq
    now = Time.now
    cacert = issue_cert(@ca, @rsa1024, 1, [], nil, nil,
                        not_before: now, not_after: now + 3600)
    cert1 = issue_cert(@ee1, @rsa2048, 2, [], cacert, @rsa1024,
                       not_before: now, not_after: now + 3600)
    cert2 = issue_cert(@ee1, @rsa2048, 2, [], cacert, @rsa1024,
                       not_before: now, not_after: now + 3600)
    cert3 = issue_cert(@ee1, @rsa2048, 3, [], cacert, @rsa1024,
                       not_before: now, not_after: now + 3600)
    cert4 = issue_cert(@ee1, @rsa2048, 2, [], cacert, @rsa1024,
                       digest: "sha512", not_before: now, not_after: now + 3600)

    assert_equal false, cert1 == 12345
    assert_equal true, cert1 == cert2
    assert_equal false, cert1 == cert3
    assert_equal false, cert1 == cert4
    assert_equal false, cert3 == cert4
  end

  private

  def certificate_error_returns_false
    yield
  rescue OpenSSL::X509::CertificateError
    false
  end
end

end
