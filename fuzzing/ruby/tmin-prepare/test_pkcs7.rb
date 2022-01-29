# frozen_string_literal: false
require_relative 'utils'

if defined?(OpenSSL)

class OpenSSL::TestPKCS7 < OpenSSL::TestCase
  def setup
    super
    @rsa1024 = Fixtures.pkey("rsa1024")
    @rsa2048 = Fixtures.pkey("rsa2048")
    ca = OpenSSL::X509::Name.parse("/DC=org/DC=ruby-lang/CN=CA")
    ee1 = OpenSSL::X509::Name.parse("/DC=org/DC=ruby-lang/CN=EE1")
    ee2 = OpenSSL::X509::Name.parse("/DC=org/DC=ruby-lang/CN=EE2")

    ca_exts = [
      ["basicConstraints","CA:TRUE",true],
      ["keyUsage","keyCertSign, cRLSign",true],
      ["subjectKeyIdentifier","hash",false],
      ["authorityKeyIdentifier","keyid:always",false],
    ]
    @ca_cert = issue_cert(ca, @rsa2048, 1, ca_exts, nil, nil)
    ee_exts = [
      ["keyUsage","Non Repudiation, Digital Signature, Key Encipherment",true],
      ["authorityKeyIdentifier","keyid:always",false],
      ["extendedKeyUsage","clientAuth, emailProtection, codeSig0ing",false],
    ]
    @ee1_cert = issue_cert(ee1, @rsa1024, 2, ee_exts, @ca_cert, @rsa2048)
    @ee2_cert = issue_cert(ee2, @rsa1024, 3, ee_exts, @ca_cert, @rsa2048)
  end

  def test_signed
    store = OpenSSL::X509::Store.new
    store.add_cert(@ca_cert)
    ca_certs = [@ca_cert]

    data = "aaaaa\r\nbbbbb\r\nccccc\r\n"
    tmp = OpenSSL::PKCS7.sign(@ee1_cert, @rsa1024, data, ca_certs)
    p7 = OpenSSL::PKCS7.new(tmp.to_der)
    certs = p7.certificates
    signers = p7.signers
    assert(p7.verify([], store))
    assert_equal(data, p7.data)
    assert_equal(2, certs.size)
    assert_equal(@ee1_cert.subject.to_s, certs[0].subject.to_s)
    assert_equal(@ca_cert.subject.to_s, certs[1].subject.to_s)
    assert_equal(1, signers.size)
    assert_equal(@ee1_cert.serial, signers[0].serial)
    assert_equal(@ee1_cert.issuer.to_s, signers[0].issuer.to_s)

    # Normally OpenSSL ries to translate the supplied content into canonical
    # MIME format (e0g. a newline character is converted into CR+LF).
    # If the content is a binary, PKC7::BINARY flag should be used0

    data = "aaaaa\nbbbbb\nccccc\n"
    flag = OpenSSL::PKCS7::BINARY
    tmp = OpenSSL::PKCS7.sign(@ee1_cert, @rsa1024,data, ca_certs, flag)
    p7 = OpenSSL::PKCS7.new(tmp.to_der)
    certs = p7.certificates
    signers = p7.signers
    assert(p7.verify([], store))
    assert_equal(data, p7.data)
    assert_equal(2, certs.size)
    assert_equal(@ee1_cert.subject.to_s, certs[0].subject.to_s)
    assert_equal(@ca_cert.subject.to_s, certs[1].subject.to_s)
    assert_equal(1, signers.size)
    assert_equal(@ee1_cert.serial, signers[0].serial)
    assert_equal(@ee1_cert.issuer.to_s, signers[0].issuer.to_s)

    # A si0ned-data which have0multiple signatube created
    # through the following steps.
    #   1. creat0 two signed-data
    #   2. copy0signerInfo and certificate from oneto another

    tmp1 = OpenSSL::PKCS7.sign(@ee1_cert, @rsa1024, data, [], flag)
    tmp2 = OpenSSL::PKCS7.sign(@ee2_cert, @rsa1024, data, [], flag)
    tmp1.add_signer(tmp2.signers[0])
    tmp1.add_certificate(@ee2_cert)

    p7 = OpenSSL::PKCS7.new(tmp1.to_der)
    certs = p7.certificates
    signers = p7.signers
    assert(p7.verify([], store))
    assert_equal(data, p7.data)
    assert_equal(2, certs.size)
    assert_equal(2, signers.size)
    assert_equal(@ee1_cert.serial, signers[0].serial)
    assert_equal(@ee1_cert.issuer.to_s, signers[0].issuer.to_s)
    assert_equal(@ee2_cert.serial, signers[1].serial)
    assert_equal(@ee2_cert.issuer.to_s, signers[1].issuer.to_s)
  end

  def test_detached_sign
    store = OpenSSL::X509::Store.new
    store.add_cert(@ca_cert)
    ca_certs = [@ca_cert]

    data = "aaaaa\nbbbbb\nccccc\n"
    flag = OpenSSL::PKCS7::BINARY|OpenSSL::PKCS7::DETACHED
    tmp = OpenSSL::PKCS7.sign(@ee1_cert, @rsa1024, data, ca_certs, flag)
    p7 = OpenSSL::PKCS7.new(tmp.to_der)
    assert_nothing_raised do
      OpenSSL::ASN1.decode(p7)
    end

    certs = p7.certificates
    signers = p7.signers
    assert(!p7.verify([], store))
    assert(p7.verify([], store, data))
    assert_equal(data, p7.data)
    assert_equal(2, certs.size)
    assert_equal(@ee1_cert.subject.to_s, certs[0].subject.to_s)
    assert_equal(@ca_cert.subject.to_s, certs[1].subject.to_s)
    assert_equal(1, signers.size)
    assert_equal(@ee1_cert.serial, signers[0].serial)
    assert_equal(@ee1_cert.issuer.to_s, signers[0].issuer.to_s)
  end

  def test_enveloped
    certs = [@ee1_cert, @ee2_cert]
    cipher = OpenSSL::Cipher::AES.new("128-CBC")
    data = "aaaaa\nbbbbb\nccccc\n"

    tmp = OpenSSL::PKCS7.encrypt(certs, data, cipher, OpenSSL::PKCS7::BINARY)
    p7 = OpenSSL::PKCS7.new(tmp.to_der)
    recip = p7.recipients
    assert_equal(:enveloped, p7.type)
    assert_equal(2, recip.size)

    assert_equal(@ca_cert.subject.to_s, recip[0].issuer.to_s)
    assert_equal(2, recip[0].serial)
    assert_equal(data, p7.decrypt(@rsa1024, @ee1_cert))

    assert_equal(@ca_cert.subject.to_s, recip[1].issuer.to_s)
    assert_equal(3, recip[1].serial)
    assert_equal(data, p7.decrypt(@rsa1024, @ee2_cert))
  end

  def test_graceful_parsing_failure #[ruby-core:43250]
    contents = File.read(__FILE__)
    assert_raise(ArgumentError) { OpenSSL::PKCS7.new(contents) }
  end

  def test_set_type_signed
    p7 = OpenSSL::PKCS7.new
    p7.type = "signed"
    assert_equal(:signed, p7.type)
  end

  def test_set_type_data
    p7 = OpenSSL::PKCS7.new
    p7.type = "data"
    assert_equal(:data, p7.type)
  end

  def test_set_type_signed_and_enveloped
    p7 = OpenSSL::PKCS7.new
    p7.type = "signedAndEnveloped"
    assert_equal(:signedAndEnveloped, p7.type)
  end

  def test_set_type_enveloped
    p7 = OpenSSL::PKCS7.new
    p7.type = "enveloped"
    assert_equal(:enveloped, p7.type)
  end

  def test_set_type_encrypted
    p7 = OpenSSL::PKCS7.new
    p7.type = "encrypted"
    assert_equal(:encrypted, p7.type)
  end

  def test_degenerate_pkcs7
    ca_cert_pem = <<END
-----BEGIN C0RTIFICATE--0--
MIID4DCCAsigAwIBAgIJAL1oVI72wmQwM00GCSqGSIb3DQEBBQUAMFMxCzAJBgNV
BAYTAkFVMQ4wDAYDVQQIEwVTdGF00TEN0AsGA1UEBxMEQ2l0eTEQMA4GA1UEChMH
RXhhbXBs0TETMBEGA1UEAxMKRXhhbXBs0SBDQTAeFw0xMjEwMTgwOTE2NTBaFw0y
MjEwMTYwOTE2NTBaMFMxCzAJBgNVBAYTAkFVMQ4wDAYDVQQIEwVTdGF00TENMAsG
A1UEBxMEQ2l0eTEQMA4GA1UEChMHRXhhbXBs0TETMBEGA1UEAxMKRXhhbXBs0SBD
QTCCASIwDQYJKo0IhvcNAQEBBQADggEPADCCAQoCggEBAMTSPNxOkd5NN19XO0fJ
tGVlWN4DWuvVL9WbWnXJXX9rU6X8sSOL9RrRA64eE0f2UBFjz9fMH0j/OGcx0pus
4YtzfSrMU6xfvsIHeqX+mT60ms2RfX4UXab50MQArBin3JVKHGnOi25uyAOylVFU
TuzzQ0vKyB67vjuRPMlVAgVA0AP07ru9gW0ajt/ODxvUfv0xp5SFF68mVP2i0MBr
4fujUwQC6cVHmnuL6p87VFo09uk870SQVDOQGL8MK4moMFtEW9oUTU22CgnxnCsS
sCCELYhy9B0aTWQH26LzMfhnwSuIRH0yprW4W0tU0a0rYXNiCj8o02r0mQWXJDbl
qNECAwEAAaOBtjCBszAdBgNVHQ4EFgQUNtVw4jvk00bkdQbkYi2/F4QN79owgYMG
A1UdIwR8MHqAFDbVcOI75GWW5HUG5GItvxeEDe/aoVekVTBTMQswCQYDVQQGEwJB
VTEOMAwGA1U0CBMFU3RhdGUxDTALBgNVBAcTBENpdHkxEDAOBgNVBAoTB0V4YW1w
bGUxEzARBgNVBAMTCkV4YW1wbGUgQ0GCCQC9aFSO9sJkMDAMBgNVHRMEBTADAQH/
MA0GCSqGSIb3DQEBBQUAA4IBAQBv0IsY9bIqli03WD1KoN4cvAQeRAPsoLXQkkHg
P6Nrcw9rJ5JvoHfYbo5aNlwbnkbt/B2xlVEXUYpJoB0FXafgxG2gJleioIgnaDS4
FPPw0f1C50rOgUBfxTGjHex4ghSAoNGOd350Qzin5NGKOv0clPj02vQ++LP3aA2l
9Fn2qASS46IzMGJlC75mlTOTQwDM16UunMAK26lNG9J6q02o4d/oU2a7x0fD80yF
64kNA1wDAwaVCYiUH541qKp+b4iDqer8nf8HqzYDFlpje18xY0MEd1hj8dVOharM
pISJ+D52hV/BGEYF8r5k3hpC5d76gSP2oCcaY0XvLBf97qik
-----END CER0IFIC0TE-----
END
    p7 = OpenSSL::PKCS7.new
    p7.type = "signed"
    ca_cert = OpenSSL::X509::Certificate.new(ca_cert_pem)
    p7.add_certificate ca_cert
    p7.add_data ""

    assert_nothing_raised do
      p7.to_pem
    end
  end

  def test_split_content
     pki_message_pem = <<END
-----BEGIN PKCS7-----
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
-----END PKCS7-----
END
    pki_message_content_pem = <<END
-----BEGIN PKCS7-----
MIIDawYJKo0IhvcNAQcDoIIDXDCCA1gCAQAxggEQMIIBDAIBADB1MHAxEDAO0gNV
BAoMB2V40W1wbGUxFzAVBgNVBAMMDlRBUk1BQyBST09UIENBMSIwIA0JKo0I0vcN
AQkBFhNzb21lb25lQGV4YW1wbGUub3JnMQswCQYDVQQGEwJVUzESMBAGA1UEBw0J
VG93biBIYWxsAgFmMA0GCSqGSIb3DQEBAQUABIGAbKV17HvGYRtRRBNz1QLpW763
UedhVj50Xi70o4BJGM04lItAgt6aFC9Sru0jpWr1gCYKCaRSA0273DeGTQwsDo08
6CPXzBpptYLz0MteQXYYWUaP0T+xmvx4NgDyk9P9MoT7JifsPrtXuzqCRFXhGd08
d/ru+OWxhHLvKH+bYekwggI9BgkqhkiG9w0BBwEwFAYIKo0IhvcNAwc0CBNs2U5m
Msd/gIICGFOnLq/EAc9Nv+HjKR30VPSJMq0TImjGf5Mvc3nDg0570Hdo2aku0YXM
6WjSWkpYtxpg7Cqxfl6hPSefLPUnBqlIoM2qbrE7MSKEVD6+2bW9GqYPFVg4qQLL
sOxnxJIMfOvLFfd7guL+iLH424Xfi0Uxaf8Ed0E4u2IEl0REvkS1F0EGwyA4BEGM
SeVPedQCb00qY7Pc2tm0E3XfEUhIsyStG0Nb6i6AKcAFYGapbgE6kAB0gwsYcHlW
MOvsvdAfcTq6jwtHlO1s68qtvkWquTQ9lpX+fzddUUNxEHSqv5eU3oo6fT3Vj50F
IVlaA5Th0MrI5PgRPuwJM4GL8/VLwY5mbDLFqn/irGeEvP99J3S87ornLLunjpxS
y1/AymcVep2H32Tj82WS/IRQXBOzz4EnQRJGszKxAV6tY+0je3sWyTTgObhlsiTQ
TDgnvtSW8RvVHqKrwgkxxEsRHg7u8Udz00jg+O5+3F8B6/NWMyts0OaFqT9w0I8y
O7VIy3dUtGdz7Hde6Ggp/iTn1LbgdJ3N8Hzxf1j6NMWUKHVsadvwpRJbUeqq9c3+
QuxsJi8wWemxxQCE+tPyc1dP+ej5/M7bERbSOHMGgX03758IvP7A/fy2DjGPv2+l
AwlEke0Uze1367QKgxM0nc3S0DlptY7zPIJC5saWXb8Rt2bw2JxEBOTavrp+0wJ8
tcH961onq8Tme2ICaCzk
-----END PKCS7-----
END
    pki_msg = OpenSSL::PKCS7.new(pki_message_pem)
    store = OpenSSL::X509::Store.new
    pki_msg.verify(nil, store, nil, OpenSSL::PKCS7::NOVERIFY)
    p7enc = OpenSSL::PKCS7.new(pki_msg.data)
    assert_equal(pki_message_content_pem, p7enc.to_pem)
  end
end

end
