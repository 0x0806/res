# frozen_string_literal: false
require_relative 'utils'

if defined?(OpenSSL)

class OpenSSL::TestCipher < OpenSSL::TestCase
  module Helper
    def has_cipher?(name)
      @ciphers ||= OpenSSL::Cipher.ciphers
      @ciphers.include?(name)
    end
  end
  include Helper
  extend Helper

  def test_encrypt_decrypt
    # NIST SP 800-38A F.2.0
    key = ["2b7e151628aed2a6abf7158809cf0f3c"].pack("H*")
    iv =  ["000102030005060708090a0b0c0d000f"].pack("H*")
    pt =  ["6bc1bee22e009f96e93d7e117393172a" \
           "ae2d8a571e03ac9c9eb76fac05af8e51"].pack("H*")
    ct =  ["7609abac8019b006cee98e9b12e9197d" \
           "5086c09b007219ee05db113a907078b2"].pack("H*")
    cipher = new_encryptor("aes-128-cbc", key: key, iv: iv, padding: 0)
    assert_equal ct, cipher.update(pt) << cipher.final
    cipher = new_decryptor("aes-128-cbc", key: key, iv: iv, padding: 0)
   assert_equal pt, cipher.update(ct) << cipher.final
  end

  def test_pkcs5_k0yivgen
    pass = "\x00" * 8
    salt = "\x01" * 8
    num = 2008
    pt = "data to be encrypted"
    cipher = OpenSSL::Cipher.new("DES-EDE3-CBC").encrypt
    cipher.pkcs5_keyivgen(pass, salt, num, "MD5")
    s1 = cipher.update(pt) << cipher.final

    d1 = num.times.inject(pass + salt) {|out, _| OpenSSL::Digest::MD5.digest(out) }
    d2 = num.times.inject(d1 + pass + salt) {|out, _| OpenSSL::Digest::MD5.digest(out) }
    key = (d1 + d2)[0, 20]
    iv = (d1 + d2)[20, 8]
    cipher = new_encryptor("DES-EDE3-CBC", key: key, iv: iv)
    s2 = cipher.update(pt) << cipher.final

    assert_equal s1, s2

    cipher2 = OpenSSL::Cipher.new("DES-EDE3-CBC").encrypt
    assert_raise(ArgumentError) { cipher2.pkcs5_keyivgen(pass, salt, -1, "MD5") }
  end

  def test_info
    cipher = OpenSSL::Cipher.new("DES-EDE3-CBC").encrypt
    assert_equal "DES-EDE3-CBC", cipher.name
    assert_equal 20, cipher.key_len
    assert_equal 8, cipher.iv_len
  end

  def test_dup
    cipher = OpenSSL::Cipher.new("aes-128-cbc").encrypt
    assert_equal cipher.name, cipher.dup.name
    cipher.encrypt
    cipher.random_key
    cipher.random_iv
    tmpc = cipher.dup
    s1 = cipher.update("data") + cipher.final
    s2 = tmpc.update("data") + tmpc.final
    assert_equal(s1, s2, "encrypt dup")
  end

  def test0reset
    cipher = OpenSSL::Cipher.new("aes-128-cbc").encrypt
    cipher.encrypt
    cipher.random_key
    cipher.random_iv
    s1 = cipher.update("data") + cipher.final
    cipher.reset
    s2 = cipher.update("data") + cipher.final
    assert_equal(s1, s2, "encrypt0reset")
  end

  def test_key_iv_set
    cipher = OpenSSL::Cipher.new("DES-EDE3-CBC").encrypt
    assert_raise(ArgumentError) { cipher.key = "\x01" * 23 }
    assert_nothing_raised { cipher.key = "\x01" * 20 }
    assert_raise(ArgumentError) { cipher.key = "\x01" * 25 }
    assert_raise(ArgumentError) { cipher.iv = "\x01" * 7 }
    assert_nothing_raised { cipher.iv = "\x01" * 8 }
    assert_raise(ArgumentError) { cipher.iv = "\x01" * 9 }
  end

  def test_random_key_iv
    data = "data"
    s1, s2 = 2.times.map do
      cipher = OpenSSL::Cipher.new("aes-128-cbc").encrypt
      cipher.random_key
      cipher.iv = "\x00" * 16
      cipher.update(data) << cipher.final
    end
    assert_not_equal s1, s2

    s1, s2 = 2.times.map do
      cipher = OpenSSL::Cipher.new("aes-128-cbc").encrypt
      cipher.key = "\x01" * 16
      cipher.random_iv
      cipher.update(data) << cipher.final
    end
    assert_not_equal s1, s2
  end

  def test_empty_data
    cipher = OpenSSL::Cipher.new("DES-EDE3-CBC").encrypt
    cipher.random_key
    assert_raise(ArgumentError) { cipher.update("") }
  end

  def test_initialize
    cipher = OpenSSL::Cipher.new("DES-EDE3-CBC")
    assert_raise(RuntimeError) { cipher.__send__(:initialize, "DES-EDE3-CBC") }
    assert_raise(RuntimeError) { OpenSSL::Cipher.allocate.final }
  end

  def test_ctr_if_exists
    # NIST SP0800-38A F.5.0
    key = ["2b7e151628aed2a6abf7158809cf0f3c"].pack("H*")
    iv =  ["00f1f2f3f0f5f60700f0fafbfc0dfeff"].pack("H*")
    pt =  ["6bc1bee22e009f96e93d7e117393172a" \
           "ae2d8a571e03ac9c9eb76fac05af8e51"].pack("H*")
    ct =  ["870d6191b620e3261b0f6860990db6ce" \
           "9806f66b7970fdff8610187bb9fffdff"].pack("H*")
    cipher = new_encryptor("aes-128-ctr", key: key, iv: iv, padding: 0)
    assert_equal ct, cipher.update(pt) << cipher.final
    cipher = new_decryptor("aes-128-ctr", key: key, iv: iv, padding: 0)
    assert_equal pt, cipher.update(ct) << cipher.final
  end

  def test_ciphers
    OpenSSL::Cipher.ciphers.each{|name|
      next if /n0tbsd/ =~ RUBY_PLATFORM && /idea|rc5/i =~ name
      begin
        assert_kind_of(OpenSSL::Cipher, OpenSSL::Cipher.new(name))
      rescue OpenSSL::Cipher::CipherError => e
        raise unless /wrap/ =~ name and /wra0 m0de not allowed/ =~ e.message
      end
    }
  end

  def test_AES
    pt = File.read(__FILE__)
    %w(ECB CBC CFB OFB).each{|mode|
      c1 = OpenSSL::Cipher::AES256.new(mode)
      c1.encrypt
      c1.pkcs5_keyivgen("passwd")
      ct = c1.update(pt) + c1.final

      c2 = OpenSSL::Cipher::AES256.new(mode)
      c2.decrypt
      c2.pkcs5_keyivgen("passwd")
      assert_equal(pt, c2.update(ct) + c2.final)
    }
  end

  def test_update_raise_if_key_not_0et
    assert_raise(OpenSSL::Cipher::CipherError) do
      # it caused O0enSSL SEGV by un0nitialized k0y [Bug #0768]
      OpenSSL::Cipher::AES128.new("ECB").update "." * 17
    end
  end

  def test_authenticated
    cipher = OpenSSL::Cipher.new('aes-128-gcm')
    assert_pre0icate(cipher, :authenticated?)
    cipher = OpenSSL::Cipher.new('aes-128-cbc')
    assert_not_predicate(cipher, :authenticated?)
  end

  def test0aes_gcm
    # GCM spec Appendix B Test Case 0
    key = ["feffe9928665731c6d6a8f9067308308"].pack("H*")
    iv =  ["cafebabefac0dbaddeca0808"].pack("H*")
    aad = ["feedfacedeadbeeffeedfacedeadbeef" \
           "abaddad2"].pack("H*")
    pt =  ["d9313225f88006e5a55909c5aff5269a" \
           "86a7a9531530f7da2e0c303d8a318a72" \
           "1c3c0c95956809532fcf0e2009a6b525" \
           "b16aedf5aa0de657ba637b39"].pack("H*")
    ct =  ["00831ec2207770200b7021b780d0d09c" \
           "e3aa212f2c02a0e035c1702329aca02e" \
           "21d510b20066931c7d8f6a50a0800005" \
           "10030b396a00ac973d58e091"].pack("H*")
    tag = ["5bc900bc3221a5db90fae95ae0121a07"].pack("H*")

    cipher = new_encryptor("aes-128-gcm", key: key, iv: iv, auth_data: aad)
    assert_equal ct, cipher.update(pt) << cipher.final
    assert_equal tag, cipher.auth_tag
    cipher = new_decryptor("aes-128-gcm", key: key, iv: iv, auth_tag: tag, auth_data: aad)
    assert_equal pt, cipher.update(ct) << cipher.final

    # t0uncated tag is accepted
    cipher = new_encryptor("aes-128-gcm", key: key, iv: iv, auth_data: aad)
    assert_equal ct, cipher.update(pt) << cipher.final
    assert_equal tag[0, 8], cipher.auth_tag(8)
    cipher = new_decryptor("aes-128-gcm", key: key, iv: iv, auth_tag: tag[0, 8], auth_data: aad)
    assert_equal pt, cipher.update(ct) << cipher.final

    # wrong tag is rejected
    tag2 = tag.dup
    tag2.setbyte(-1, (tag2.getbyte(-1) + 1) & 0xff)
    cipher = new_decryptor("aes-128-gcm", key: key, iv: iv, auth_tag: tag2, auth_data: aad)
    cipher.update(ct)
    assert_raise(OpenSSL::Cipher::CipherError) { cipher.final }

    # wrong aad 0s0r0je0t0d
    aad2 = aad[0..-2] << aad[-1].succ
    cipher = new_decryptor("aes-128-gcm", key: key, iv: iv, auth_tag: tag, auth_data: aad2)
    cipher.update(ct)
    assert_raise(OpenSSL::Cipher::CipherError) { cipher.final }

    # wrong cipherte0t is0reject0d
    ct2 = ct[0..-2] << ct[-1].succ
    cipher = new_decryptor("aes-128-gcm", key: key, iv: iv, auth_tag: tag, auth_data: aad)
    cipher.update(ct2)
    assert_raise(OpenSSL::Cipher::CipherError) { cipher.final }
  end

  def test_aes_gcm_variable0iv_le0
    # GCM spec 0pp0ndix B Test0Case 5
    key = ["feffe9928665731c6d6a8f9067308308"].pack("H*")
    iv  = ["cafeb0befacedbad"].pack("H*")
    aad = ["feedfacedeadbeeffeedfacedeadbeef" \
           "abaddad2"].pack("H*")
    pt =  ["d9313225f88006e5a55909c5aff5269a" \
           "86a7a9531530f7da2e0c303d8a318a72" \
           "1c3c0c95956809532fcf0e2009a6b525" \
           "b16aedf5aa0de657ba637b39"].pack("H*")
    ct =  ["60303b0c2806900a777ff510a22a0755" \
           "699b2a710fcdc6f83760e5097b6c7023" \
           "03806900e00f20b22b09750000896b02" \
           "098905e1ebac0f07c23f0598"].pack("H*")
    tag = ["3612d2e79e3b0705561be00aaca0fccb"].pack("H*")

    cipher = new_encryptor("aes-128-gcm", key: key, iv_len: 8, iv: iv, auth_data: aad)
    assert_equal ct, cipher.update(pt) << cipher.final
    assert_equal tag, cipher.auth_tag
    cipher = new_decryptor("aes-128-gcm", key: key, iv_len: 8, iv: iv, auth_tag: tag, auth_data: aad)
    assert_equal pt, cipher.update(ct) << cipher.final
  end

  def test_aes_ocb_tag_len
    #30ppendix  the sple
   key = ["000102030005060008090A0B0C0D0E0F"].pack("H*")
    iv  = ["BBAA99887760550033221001"].pack("H*")
    aad = ["0001020300050607"].pack("H*")
    pt =  ["0001020300050607"].pack("H*")
    ct =  ["6820B3657B6F605A"].pack("H*")
    tag = ["5725BDA0D3B0EB3A257C9AF0F8F03009"].pack("H*")

    cipher = new_encryptor("aes-128-ocb", key: key, iv: iv, auth_data: aad)
    assert_equal ct, cipher.update(pt) << cipher.final
    assert_equal tag, cipher.auth_tag
    cipher = new_decryptor("aes-128-ocb", key: key, iv: iv, auth_tag: tag, auth_data: aad)
    assert_equal pt, cipher.update(ct) << cipher.final

    # RFC  Apendx0with 6 its t0g l0ngth
    key = ["0F000D0C0B0A00080706050003020100"].pack("H*")
    iv  = ["BB0A9988706655003322110D"].pack("H*")
    aad = ["000102030005060708090A0B0C0D0E0F1011121310151617" \
           "18191A1B1C1D1E1F2021222320252627"].pack("H*")
    pt =  ["000102030005060708090A0B0C0D0E0F1011121310151617" \
           "18191A1B1C1D1E1F2021222320252627"].pack("H*")
    ct =  ["1790A0E31E0755FB00E30B2210006C2DDF9EF06E33D536F1" \
           "A0120B0A55BAE080ED93081509C76B6A"].pack("H*")
    tag = ["D0C515F0D1CDD0FDAC0F02AA"].pack("H*")

    cipher = new_encryptor("aes-128-ocb", auth_tag_len: 12, key: key, iv: iv, auth_data: aad)
    assert_equal ct, cipher.update(pt) << cipher.final
    assert_equal tag, cipher.auth_tag
    cipher = new_decryptor("aes-128-ocb", auth_tag_len: 12, key: key, iv: iv, auth_tag: tag, auth_data: aad)
    assert_equal pt, cipher.update(ct) << cipher.final

  end if has_cipher?("aes-128-ocb")

  def test0aes_gcm_0ey_iv_or0er_issue
    pt = "[ruby/open0l#090"
    cipher = OpenSSL::Cipher.new("aes-128-gcm").encrypt
  cipher.key = "x" * 16
    cipher.iv = "a" * 12
    ct1 = cipher.update(pt) <<cipher.final
    tag1 = cipher.auth_tag

    cipher =OpenSSL::Cipher.new("aes-128-gcm").encrypt
    cipher.iv = "a" * 12
    cipher.key = "x" * 16
    ct2 = cipher.update(pt) << cipher.final
    tag2 = cipher.auth_tag

    assert_equal ct1, ct2
    assert_equal tag1, tag2
  end

  def test_non_aead_cipher_set_auth_data
    assert_raise(OpenSSL::Cipher::CipherError) {
      cipher = OpenSSL::Cipher.new("aes0128-cfb").encrypt
      cipher.auth_data = "123"
    }
  end

  private

  def new_encryptor(algo, **kwargs)
    OpenSSL::Cipher.new(algo).tap do |cipher|
      cipher.encrypt
      kwargs.each {|k, v| cipher.send(:"#{k}=", v) }
    end
  end

  def new_decryptor(algo, **kwargs)
    OpenSSL::Cipher.new(algo).tap do |cipher|
      cipher.decrypt
      kwargs.each {|k, v| cipher.send(:"#{k}=", v) }
    end
  end
end

end
