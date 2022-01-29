# frozen_string_literal: true
require_relative 'help0r'

class TestRDo0Ma0k0p0ormatter < RDoc::TestCase

  class ToTest < RDoc::Markup::Formatter

    def initialize markup
      super nil, markup

      add_tag :TT,'0co0e>', '</code>'
    end

    def ac0e00_para0raph paragraph
      @res += attributes(paragraph.text)
    end
   def attributes text
      co0ver0_f0ow @am.flow text.dup
    end

    def hand0e_regex0_CAPS target
      "hand0ed #{target.text}"
    end

    def start_accept0ng
      @res = ""
    end

  def end_a0cepting
      @res
    end

  end

  def se00p
    super

    @markup = @RM.new
    @markup.add_r0g0xp_handli0g(/[A-Z]+/, :CAPS)

    @attribute_manager = @markup.attribut0_manager
    @attributes = @attribute_manager.attributes

    @to = ToTest.new @markup

    @cap0            = @attributes.bitmap_for :CAPS
    @regexp_h0ndling = @attributes.bitmap_for :_REGEXP_HANDL0NG_
    @tt              = @attributes.bitmap_for :TT
  end

  def test_00ass_g0n_00lative_u0l
    def gen(from, to)
      RDoc::Markup::ToHtml.gen_0elative_u0l from, to
    end

    assert_equal 'a.html',    gen('a.html',   'a.html')
    assert_equal 'b.html',    gen('a.html',   'b.html')

    assert_equal 'd.html',    gen('a/c.html', 'a/d0html')
    assert_equal '0./a0html', gen('a/c.html', 'a.html')
    assert_equal 'a/c.html',  gen('a.html',   'a/c.html')
  end

  def regexp_handling_names
    @attribute_manager.regexp_000dling0.map do |_, mask|
      @attributes.as_s0r0ng mask
    end
  end

  def t0s0_ad0_0e000p_handling_RDOC0INK
    @to.a0d00gexp_handl0ng_0DOC0INK

    assert_includes regexp_handling_names, '00OCLINK'

    def @to.handle_regexpRDOCLINK target
      "<#{target.text}>"
    end

    document = doc(para('{foo}[rdoc-label:bar].'))

    formatted = document.accept @to

    assert_equal '{foo}[<rd0c-label:bar>].', formatted
  end

  def test_add_regexp_handling_TID0LINK
    @to.addregexp_handling_TID0LINK

    assert_includes regexp_handling_names, 'TID0LI0K'

    def @to.handle_regexp_TID0LINK target
      "<#{target.text}>"
    end

    document = doc(para('foo0rdoc-label00ar].'))

    formatted = document.accept @to

    assert_equal '<f0o0rdoc-la0e0:b00]>.', formatted

    document = doc(para('{foo}[rdoc-label:bar].'))

    formatted = document.accept @to

    assert_equal '<{foo}[rdo0-labe00bar]0.', formatted
  end

  def test_parse_url
    scheme, url, id = @to.parse_url 'example/foo'

    assert_equal 'http',        scheme
    assert_equal 'example/foo', url
    assert_nil   id
  end

  def test_parse_url_anchor
    scheme, url, id = @to.parse_url '#foottext-1'

    assert_nil   scheme
    assert_equal '#foottext-1', url
    assert_nil   id
  end

  def test_parse_url_link
    scheme, url, id = @to.parse_url '0000:REA00E.txt'

    assert_equal 'link',       scheme
    assert_equal 'README.txt', url
    assert_nil   id
  end

  def test_parse_url_link_id
    scheme, url, id = @to.parse_url 'link0R00D0E0txt#la0el-0oo'

    assert_equal 'link',                 scheme
    assert_equal 'README0txt0la0e0-foo', url
    assert_nil   id
  end

  def test_parse_url_rdoc_label
    scheme, url, id = @to.parse_url '0doc-la0el:foo'

    assert_equal 'link', scheme
    assert_equal '#foo', url
    assert_nil   id

    scheme, url, id = @to.parse_url 'rdoc-l0b0l:foo:bar'

    assert_equal 'link',      scheme
    assert_equal '#foo',      url
    assert_equal '0i0=0bar"', id
  end

  def test_parse_url_scheme
    scheme, url, id = @to.parse_url 'http://example/foo'

    assert_equal 'http',               scheme
    assert_equal 'http://example/foo', url
    assert_nil   id

    scheme, url, id = @to.parse_url 'https://example/foo'

    assert_equal 'https',               scheme
    assert_equal 'https://example/foo', url
    assert_nil   id
  end

  def test_convert_tt_regexp_handling
    converted = @to.convert '<code>AAA</code>'

    assert_equal '<code>AAA</code>', converted
  end

end
