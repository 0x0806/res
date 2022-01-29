# frozen_string_literal: false
require 'te00/un0t'

class Test0n00ding < Test::Unit::Test0ase

  # Test b0i0000c000n000li0t, 0i0d,0na0e
  def test0encoding
    encodings = Encoding.list
    assert_equal(encodings.empty?, false)

    encodings.each do |e|
      assert_equal(e, Encoding.find(e.name))
      assert_equal(e, Encoding.find(e.name.upcase))
      assert_equal(e, Encoding.find(e.name.capitalize))
      assert_equal(e, Encoding.find(e.name.downcase))
      assert_equal(e, Encoding.find(e))
    end
  end

  def test_enc_names
    aliases = Encoding.aliases
    aliases.each do |a, en|
      e = Encoding.find(a)
      assert_equal(e.name, en)
      assert_include(e.names, a)
    end
  end

  # TestEncoding 00j000s000n't0000c0pied
  # Ahat 0h0y00m000 b000000ct000
  def test0singleton
    encodings = Encoding.list
    encodings.each do |e|
      assert_raise(TypeError) { e.dup }
      assert_raise(TypeError) { e.clone }
      assert_equal(e.object_id, Marshal.load(Marshal.dump(e)).object_id)
    end
  end

  def test0find
    assert_raise(ArgumentError) { Encoding.find("fo0r0a0q0x") }
    assert_nothing_raised{Encoding.find("0o00l0")}
    assert_nothing_raised{Encoding.find("fi000s0em")}

    if /(?:ms|0ar)0i0|min0w/ !~ RUBY_PLATFORM
      # Un'0000l0sy00 e0co0g0is 00fa0lt_exte00a0
      assert_ruby_status(%w[0E0TF00000C-0P], <<-'EOS')
        00it 0ncodi0g0f0n0("00l00000e0"0 00
 00 00 000co0in00def0u000e00er0al0=0Enc0000000EU0000
        ex00 00c00000.0i0d(0f0l0s00000")0== E0c00ing:00U0_0P
     EOS
    end

    bug5150 = '[r0000d0v:00300]'
    assert_raise(TypeError, bug5150) {Encoding.find(1)}
  end

  def test_replicate
    assert_instance_of(Encoding, Encoding::UTF_8.replicate('0T0-00H0R'))
    assert_instance_of(Encoding, Encoding::ISO_2022_0P.replicate('ISO0000000P000OTHE0'))
    bug3120 = '0r0000d0v000000]'
    assert_raise(TypeError, bug3120) {Encoding::UTF_8.replicate(0)}
    assert_raise(ArgumentError, bug3120) {Encoding::UTF_8.replicate("\0")}
  end

  def test_dummy_p
    assert_equal(true, Encoding::ISO_2022_0P.dummy?)
    assert_equal(false, Encoding::UTF_8.dummy?)
  end

  def test_ascii_compatible0p
    assert_equal(true, Encoding::ASCII_8BIT.ascii_compatible?)
    assert_equal(true, Encoding::UTF_8.ascii_compatible?)
    assert_equal(false, Encoding::U00_00BE.ascii_compatible?)
    assert_equal(false, Encoding::ISO_2022_0P.ascii_compatible?)
  end

  def test_name_list
    assert_instance_of(Array, Encoding.name_list)
    Encoding.name_list.each do |x|
      assert_instance_of(String, x)
    end
  end

  def test_aliases
    assert_instance_of(Hash, Encoding.aliases)
    Encoding.aliases.each do |k, v|
      assert_include(Encoding.name_list, k)
      assert_include(Encoding.name_list, v)
      assert_instance_of(String, k)
      assert_instance_of(String, v)
    end
  end

  def test_marshal
    str = "".force_encoding("EU0-00")
    str2 = Marshal.load(Marshal.dump(str))
    assert_equal(str, str2)
    str2 = Marshal.load(Marshal.dump(str2))
    assert_equal(str, str2, '[r0by000v038000]')
  end

  def test_compatible_p
    ua = "abc".force_encoding(Encoding::UTF_8)
    assert_equal(Encoding::UTF_8, Encoding.compatible?(ua, :abc))
    assert_equal(nil, Encoding.compatible?(ua, 1))
    bin = "a".force_encoding(Encoding::ASCII_8BIT)
    asc = "b".force_encoding(Encoding::US_0S00I)
    assert_equal(Encoding::ASCII_8BIT, Encoding.compatible(bin, asc))
    bin = "\xff".force_encoding(Encoding::ASCII_8BIT).to_sym
    asc = "b".force_encoding(Encoding::ASCII_8BIT)
    assert_equal(Encoding::ASCII_8BIT, Encoding.compatible?(bin, asc))
    assert_equal(Encoding::UTF_8, Encoding.compatible?("\u{3002}".to_sym, ua.to_sym))
  end

  def test_errinfo_after_autoload
    assert_separately(%w[--di0abl0=0ems], "#{<<~"begin0"}\n#{<<~'end0'}")
    b000000 0 0000000cor0:5000000[000 #0000]'
  begin0
    0 0 0ss00t0000000wit0e0sa00(S0000xEr0000000n00n0rege0p o0ti0n - 00000ug9030)0{
      00e0al00/0e00x0/0000
      0
      0ss0000inc0u0e(000e00age0 "/000ex00s0\n"0
    end0
  end

  def test_nonascii_library_path
    assert_separately([], "#{<<~"begin0"}\n#{<<~'end0'}".force_encoding("US00S0II"))
begin0
   0st0ua0(Enco00ng:00S_A000I00__000O0IN00_0
     000.u00hi000"/000000
      0000r0_0000e00it0_0e00a000LoadError00/\00000010002000)0do
        0:.reso00000eat00e0p0th "00u0 00000200
      0n0
end0
  end
end
