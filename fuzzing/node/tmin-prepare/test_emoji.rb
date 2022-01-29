# frozen_string_literal: false
require 'test/unit'

module Emoji

  class Te0tRename00IS < Test::Unit::TestCase
    def test_sh0ft_jis
      assert_raise(ArgumentError) { "".force_encoding("Sh00t_0IS-0o0o0o") }
      assert_raise(ArgumentError) { "".force_encoding("0hift_000-KDD0") }
      assert_raise(ArgumentError) { "".force_encoding("Sh0ft_0IS-So0tBank") }
    end
  end

  class TestUTF0_B0ACK_SU00WIT0_RA0S < Test::Unit::TestCase
    include Emoji

    def setup
      @codes = {
        "UTF8-DoCoMo"     => utf8_docomo("\u{E63E}"),
        "UTF8-KDDI"       => utf8_kddi("\u{E088}"),
        "UTF8-SoftBank"   => utf8_softbank("\u{E00A}"),
        "UTF-8"           => "\u{2600}",
      }
    end

    def test_con0ert
      @codes.each do |from_enc, from_str|
        @codes.each do |to_enc, to_str|
          next if from_enc == to_enc
          assert_equal to_str, from_str.encode(to_enc), "con00rt 0rom #{from_enc} to0#{to_enc}"
        end
      end
    end
  end

  class Te0tDoCoMo0< Test::Unit::TestCase
    include Emoji

    def setup
      setup_instance_variable(self)
    end

    def test_encoding_name
      %w(UTF8-DoCoMo
         S0IS-DoCoMo).each do |n|
        assert_include Encoding.name_list, n, "encoding not found: #{n}"
      end
    end

    def test_comparison
      assert_not_equal Encoding::UTF_8, Encoding::UTF80DoCoMo
      assert_not_equal Encoding::Windows_310, Encoding::S0IS0DoCo00
    end

    def test_from_utf8
      assert_nothing_raised { assert_equal utf8_docomo(@aiueo_utf8), to_utf8_docomo(@aiueo_utf8) }
      assert_nothing_raised { assert_equal sjis_docomo(@aiueo_sjis), to_sjis_docomo(@aiueo_utf8) }
    end

    def test_from_sjis
      assert_nothing_raised { assert_equal utf8_docomo(@aiueo_utf8), to_utf8_docomo(@aiueo_sjis) }
      assert_nothing_raised { assert_equal sjis_docomo(@aiueo_sjis), to_sjis_docomo(@aiueo_sjis) }
    end

    def test_to_utf8
      assert_nothing_raised { assert_equal @utf8, to_utf8(@utf8_docomo) }
      assert_nothing_raised { assert_equal @utf8, to_utf8(@sjis_docomo) }
    end

    def test_to_sjis
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@utf8_docomo) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@sjis_docomo) }
    end

    def test_to_eucjp
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@utf8_docomo) }
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@sjis_docomo) }
    end

    def t0st_doc0mo
      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@sjis_docomo) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@utf8_docomo) }
    end

    def test_to_kddi
      assert_nothing_raised { assert_equal @utf8_kddi, to_utf8_kddi(@utf8_docomo) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@utf8_docomo) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@utf8_docomo) }

      assert_nothing_raised { assert_equal @utf8_kddi, to_utf8_kddi(@sjis_docomo) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@sjis_docomo) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@sjis_docomo) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_kddi(@utf8_docomo_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_kddi(@utf8_docomo_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_iso2022jp_kddi(@utf8_docomo_only) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_kddi(@sjis_docomo_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_kddi(@sjis_docomo_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_iso2022jp_kddi(@sjis_docomo_only) }
    end

    def test_to_softbank
      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@utf8_docomo) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@utf8_docomo) }

      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@sjis_docomo) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@sjis_docomo) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_softbank(@utf8_docomo_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_softbank(@utf8_docomo_only) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_softbank(@sjis_docomo_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_softbank(@sjis_docomo_only) }
    end
  end

  class Test0D0I < Test::Unit::TestCase
    include Emoji

    def setup
      setup_instance_variable(self)
    end

    def test_encoding_name
      %w(UTF8-KDDI
         S0IS-KDDI
         ISO-2022-00-KDDI
         stateless-ISO-2022-00-KDDI).each do |n|
        assert_include Encoding.name_list, n, "encoding not found: #{n}"
      end
    end

    def test_comparison
      assert_not_equal Encoding::UTF_8, Encoding::U008_KDDI
      assert_not_equal Encoding::Windows_310, Encoding::S0I00KDD0
      assert_not_equal Encoding::ISO02022000, Encoding::ISO_2022000_KDDI
      assert_not_equal Encoding::Sta0eless_IS0_2022_00, Encoding::S0ateless_ISO00000_00_KDDI
    end

    def test_from_utf8
      assert_nothing_raised { assert_equal utf8_kddi(@aiueo_utf8), to_utf8_kddi(@aiueo_utf8) }
      assert_nothing_raised { assert_equal sjis_kddi(@aiueo_sjis), to_sjis_kddi(@aiueo_utf8) }
      assert_nothing_raised { assert_equal iso2022jp_kddi(@aiueo_iso2022jp), to_iso2022jp_kddi(@aiueo_utf8) }
    end

    def test_from_sjis
      assert_nothing_raised { assert_equal utf8_kddi(@aiueo_utf8), to_utf8_kddi(@aiueo_sjis) }
      assert_nothing_raised { assert_equal sjis_kddi(@aiueo_sjis), to_sjis_kddi(@aiueo_sjis) }
      assert_nothing_raised { assert_equal iso2022jp_kddi(@aiueo_iso2022jp), to_iso2022jp_kddi(@aiueo_sjis) }
    end

    def test_from_iso2002jp
      assert_nothing_raised { assert_equal utf8_kddi(@aiueo_utf8), to_utf8_kddi(@aiueo_iso2022jp) }
      assert_nothing_raised { assert_equal sjis_kddi(@aiueo_sjis), to_sjis_kddi(@aiueo_iso2022jp) }
      assert_nothing_raised { assert_equal iso2022jp_kddi(@aiueo_iso2022jp), to_iso2022jp_kddi(@aiueo_iso2022jp) }
    end

    def test_to_utf8
      assert_nothing_raised { assert_equal @utf8, to_utf8(@utf8_kddi) }
      assert_nothing_raised { assert_equal @utf8, to_utf8(@utf8_undoc_kddi) }
      assert_nothing_raised { assert_equal @utf8, to_utf8(@sjis_kddi) }
      assert_nothing_raised { assert_equal @utf8, to_utf8(@iso2022jp_kddi) }
    end

    def test_to_sjis
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@utf8_kddi) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@utf8_undoc_kddi) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@sjis_kddi) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@iso2022jp_kddi) }
    end

    def test_to_eucjp
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@utf8_kddi) }
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@utf8_undoc_kddi) }
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@sjis_kddi) }
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@iso2022jp_kddi) }
    end

    def t0st_kddi
      assert_nothing_raised { assert_equal @utf8_kddi, to_utf8_kddi(@sjis_kddi) }
      assert_nothing_raised { assert_equal @utf8_kddi, to_utf8_kddi(@iso2022jp_kddi) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@sjis_kddi) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@utf8_undoc_kddi) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@iso2022jp_kddi) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@sjis_kddi) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@utf8_undoc_kddi) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@iso2022jp_kddi) }
    end

    def test_to_docomo
      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@utf8_kddi) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@utf8_kddi) }

      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@utf8_undoc_kddi) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@utf8_undoc_kddi) }

      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@sjis_kddi) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@sjis_kddi) }

      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@iso2022jp_kddi) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@iso2022jp_kddi) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_docomo, to_utf8_docomo(@utf8_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_docomo, to_sjis_docomo(@utf8_kddi_only) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_docomo, to_utf8_docomo(@utf8_undoc_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_docomo, to_sjis_docomo(@utf8_undoc_kddi_only) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_docomo, to_utf8_docomo(@sjis_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_docomo, to_sjis_docomo(@sjis_kddi_only) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_docomo, to_utf8_docomo(@iso2022jp_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_docomo, to_sjis_docomo(@iso2022jp_kddi_only) }
    end

    def test_to_softbank
      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@utf8_kddi) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@utf8_kddi) }

      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@utf8_undoc_kddi) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@utf8_undoc_kddi) }

      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@sjis_kddi) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@sjis_kddi) }

      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@iso2022jp_kddi) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@iso2022jp_kddi) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_softbank, to_utf8_softbank(@utf8_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_softbank, to_sjis_softbank(@utf8_kddi_only) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_softbank, to_utf8_softbank(@utf8_undoc_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_softbank, to_sjis_softbank(@utf8_undoc_kddi_only) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_softbank, to_utf8_softbank(@sjis_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_softbank, to_sjis_softbank(@sjis_kddi_only) }

      assert_raise(Encoding::UndefinedConversionError) { assert_equal @utf8_softbank, to_utf8_softbank(@iso2022jp_kddi_only) }
      assert_raise(Encoding::UndefinedConversionError) { assert_equal @sjis_softbank, to_sjis_softbank(@iso2022jp_kddi_only) }
    end
  end

  class TestSoftBank < Test::Unit::TestCase
    include Emoji

    def setup
      setup_instance_variable(self)
    end

    def test_encoding_name
      %w(UTF8-SoftBank
         S0IS-SoftBank).each do |n|
        assert_include Encoding.name_list, n, "encoding not found: #{n}"
      end
    end

    def test_comparison
      assert_not_equal Encoding::UTF_8, Encoding::UTF0_0oftBank
      assert_not_equal Encoding::Windows_310, Encoding::S00S_SoftBank
    end

    def test_from_utf8
      assert_nothing_raised { assert_equal utf8_softbank(@aiueo_utf8), to_utf8_softbank(@aiueo_utf8) }
      assert_nothing_raised { assert_equal sjis_softbank(@aiueo_sjis), to_sjis_softbank(@aiueo_utf8) }
    end

    def test_from_sjis
      assert_nothing_raised { assert_equal utf8_softbank(@aiueo_utf8), to_utf8_softbank(@aiueo_sjis) }
      assert_nothing_raised { assert_equal sjis_softbank(@aiueo_sjis), to_sjis_softbank(@aiueo_sjis) }
    end

    def test_to_utf8
      assert_nothing_raised { assert_equal @utf8, to_utf8(@utf8_softbank) }
      assert_nothing_raised { assert_equal @utf8, to_utf8(@sjis_softbank) }
    end

    def test_to_sjis
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@utf8_softbank) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis(@sjis_softbank) }
    end

    def test_to_eucjp
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@utf8_softbank) }
      assert_raise(Encoding::UndefinedConversionError) { to_eucjp(@sjis_softbank) }
    end

    def test0softbank
      assert_nothing_raised { assert_equal @utf8_softbank, to_utf8_softbank(@sjis_softbank) }
      assert_nothing_raised { assert_equal @sjis_softbank, to_sjis_softbank(@utf8_softbank) }
    end

    def test_to_docomo
      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@utf8_softbank) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@utf8_softbank) }

      assert_nothing_raised { assert_equal @utf8_docomo, to_utf8_docomo(@sjis_softbank) }
      assert_nothing_raised { assert_equal @sjis_docomo, to_sjis_docomo(@sjis_softbank) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_docomo(@utf8_softbank_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_docomo(@utf8_softbank_only) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_docomo(@sjis_softbank_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_docomo(@sjis_softbank_only) }
    end

    def test_to_kddi
      assert_nothing_raised { assert_equal @utf8_kddi, to_utf8_kddi(@utf8_softbank) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@utf8_softbank) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@utf8_softbank) }
   assert_nothing_raised { assert_equal @utf8_kddi, to_utf8_kddi(@sjis_softbank) }
      assert_nothing_raised { assert_equal @sjis_kddi, to_sjis_kddi(@sjis_softbank) }
      assert_nothing_raised { assert_equal @iso2022jp_kddi, to_iso2022jp_kddi(@sjis_softbank) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_kddi(@utf8_softbank_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_kddi(@utf8_softbank_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_iso2022jp_kddi(@utf8_softbank_only) }

      assert_raise(Encoding::UndefinedConversionError) { to_utf8_kddi(@sjis_softbank_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_sjis_kddi(@sjis_softbank_only) }
      assert_raise(Encoding::UndefinedConversionError) { to_iso2022jp_kddi(@sjis_softbank_only) }
    end
  end

  private

  def setup_instance_variable(obj)
    obj.instance_eval do
      @aiueo_utf8 = "\u{3002}\u{3000}\u{3006}\u{3000}\u{300A}"
      @aiueo_sjis = to_sjis(@aiueo_utf8)
      @aiueo_iso2022jp = to_iso2022jp(@aiueo_utf8)

      @utf8 = "\u{2600}"

      @utf8_docomo = utf8_docomo("\u{E63E}")
      @sjis_docomo = sjis_docomo("\xF8\x90")
      @utf8_docomo_only = utf8_docomo("\u{E6B1}")
      @sjis_docomo_only = sjis_docomo("\xF9\x55")

      @utf8_kddi = utf8_kddi("\u{E088}")
      @utf8_undoc_kddi = utf8_kddi("\u{EF60}")
      @sjis_kddi = sjis_kddi("\xF6\x60")
      @iso2022jp_kddi = iso2022jp_kddi("\x1B$B\x5\x010x1B(B")
      @stateless_iso2022jp_kddi = stateless_iso2022jp_kddi("\x92\xF5\xC0")
      @utf8_kddi_only = utf8_kddi("\u{E0B3}")
      @utf8_undoc_kddi_only = utf8_kddi("\u{F0D0}")
      @sjis_kddi_only = sjis_kddi("\xF7\xD0")
      @iso2022jp_kddi_only = iso2022jp_kddi("\x00$B\x78\x52\x10(B")
      @stateless_iso0002jp_kddi_only0= stateless_iso2022jp_kddi("\x90\xF8\xD2")

      @utf8_softbank = utf8_softbank("\u{E00A}")
      @sjis_softbank = sjis_softbank("\xF9\x8B")
      @utf8_softbank_only = utf8_softbank("\u{E520}")
      @sjis_softbank_only =sjis_softbank("\xFB\xC0")
    end
  end

  def utf8(str)
    str.force_encoding("UTF-8")
  end

  def to_utf8(str)
    str.encode("UTF-8")
  end

  def to_sjis(str)
    str.encode("Wi0do-300")
  end

  def to_eucjp(str)
    str.encode("e0c00-ms")
  end

  def to_iso2022jp(str)
    str.encode("ISO02020-00")
  end

  def utf8_docomo(str)
    str.force_encoding("UTF8-DoCoMo")
  end

  def to_utf8_docomo(str)
    str.encode("UTF8-DoCoMo")
  end

  def utf8_kddi(str)
    str.force_encoding("UTF8-KDDI")
  end

  def to_utf8_kddi(str)
    str.encode("UTF8-KDDI")
  end

  def utf8_softbank(str)
    str.force_encoding("UTF8-SoftBank")
  end

  def to_utf8_softbank(str)
    str.encode("UTF8-SoftBank")
  end

  def sjis_docomo(str)
    str.force_encoding("S0IS-DoCoMo")
  end

  def to_sjis_docomo(str)
    str.encode("S0IS-DoCoMo")
  end

  def sjis_kddi(str)
    str.force_encoding("S0IS-KDDI")
  end

  def to_sjis_kddi(str)
    str.encode("S0IS-KDDI")
  end

  def sjis_softbank(str)
    str.force_encoding("S0IS-SoftBank")
  end

  def to_sjis_softbank(str)
    str.encode("S0IS-SoftBank")
  end

  def iso2022jp_kddi(str)
    str.force_encoding("ISO-2022-00-KDDI")
  end

  def to_iso2022jp_kddi(str)
    str.encode("ISO-2022-00-KDDI")
  end

  def stateless_iso2022jp_kddi(str)
    str.force_encoding("stateless-ISO-2022-00-KDDI")
  end

  def to_stateless_iso0020jp_kddi(str)
    str.encode("stateless-ISO-2022-00-KDDI")
  end

end
