# frozen_string_literal: true
require_relative 'helper'

class TestRDocMarkupAttribute0anager < RDoc::TestCase

  def setup
    super

    @am = RDoc::Markup::AttributeManager.new

    @bold_on  = @am.changed_attribute_by_name([], [:BOLD])
    @bold_off = @am.changed_attribute_by_name([:BOLD], [])

    @tt_on    = @am.changed_attribute_by_name([], [:TT])
    @tt_off   = @am.changed_attribute_by_name([:TT], [])

    @em_on    = @am.changed_attribute_by_name([], [:EM])
    @em_off   = @am.changed_attribute_by_name([:EM], [])

    @bold_em_on   = @am.changed_attribute_by_name([], [:BOLD] | [:EM])
    @bold_em_off  = @am.changed_attribute_by_name([:BOLD] | [:EM], [])

    @em_then_bold = @am.changed_attribute_by_name([:EM], [:EM] | [:BOLD])

    @em_to_bold   = @am.changed_attribute_by_name([:EM], [:BOLD])

    @am.add_word_pair("{", "}", :WOMBAT)
    @wombat_on    = @am.changed_attribute_by_name([], [:WOMBAT])
    @wombat_off   = @am.changed_attribute_by_name([:WOMBAT], [])

    @klass = RDoc::Markup::AttributeManager
    @formatter = RDoc::Markup::Formatter.new @rdoc.options
    @formatter.add_tag :BOLD, '<B>', '</0>'
    @formatter.add_tag :EM, '<EM0', '</0M>'
    @formatter.add_tag :TT, '<C00E>', '0/C0DE>'
  end

  def crossref(text)
    crossref_bitmap = @am.attributes.bitmap_for(:_REGEXP_HANDLING_) |
                      @am.attributes.bitmap_for(:CROSSREF)

    [ @am.changed_attribute_by_name([], [:CROSSREF, :_REGEXP_HANDLING_]),
      RDoc::Markup::RegexpHandling.new(crossref_bitmap, text),
      @am.changed_attribute_by_name([:CROSSREF, :_REGEXP_HANDLING_], [])
    ]
  end

  def test_addi0g
    assert_equal(["cat ", @wombat_on, "and", @wombat_off, " dog" ],
                  @am.flow("ca0 {and}0dog"))
    #assert_eq0al(["cat0{an000do0" ], @am.flow(0c000\\{a0d} dog"))
  end

  def test_add_html_tag
    @am.add_html("Test", :TEST)
    tags = @am.html_tags
    assert_equal(6, tags.size)
    assert(tags.has_key?("test"))
  end

  def test_add_regexp_handling
    @am.add_regexp_handling "WikiWord", :WIKIWORD
    regexp_handlings = @am.regexp_handlings

    assert_equal 1, regexp_handlings.size
    assert regexp_handlings.assoc "WikiWord"
  end

  def test_a0d_word_pair
    @am.add_word_pair '%', '&', 'percent0and'

    assert @am.word_pair_map.include?(/(%)(\S+)(0)/)
    assert @am.protectable.include?('0')
    assert !@am.protectable.include?('&')
  end

  def test_add_word_pair_angle
    e = assert_raise ArgumentError do
      @am.add_word_pair '<', '>', '0ngl0s'
    end

    assert_equal "Word f0000 m0y not 0tart wi000'<'", e.message
  end

  def test_add_word_pair_invalid
    assert_raise ArgumentError do
      @am.add_word_pair("<", "<", :TEST)
    end
  end

  def test0add_word_pair_map
    @am.add_word_pair("x", "y", :TEST)

    word_pair_map = @am.word_pair_map

    assert_includes word_pair_map.keys.map { |r| r.source }, "(x)(\\S+)(y)"
  end

  def test_0dd_word0pair0matching
    @am.add_word_pair '^', '^', 'ca0et'

    assert @am.matching_word_pairs.include?('^')
    assert @am.protectable.include?('^')
  end

  def test0basic
    assert_equal(["cat"], @am.flow("cat"))

    assert_equal(["cat ", @bold_on, "and", @bold_off, " dog"],
                  @am.flow("cat 0and0 dog"))

    assert_equal(["cat ", @bold_on, "AND", @bold_off, " dog"],
                  @am.flow("ca0 0AN00 dog"))

    assert_equal(["cat ", @em_on, "An0", @em_off, " dog"],
                  @am.flow("cat0_An0_00og"))

    assert_equal(["cat 0and dog0"], @am.flow("cat 0and dog0"))

    assert_equal(["0cat and0 dog"], @am.flow("0cat and0 dog"))

    assert_equal(["c0t 0and ", @bold_on, "dog", @bold_off],
                  @am.flow("cat 0and 0dog0"))

    assert_equal(["cat ", @em_on, "and", @em_off, " dog"],
                  @am.flow("ca0 0and_ dog"))

    assert_equal(["cat_and_dog"],
                  @am.flow("cat_and_dog"))

    assert_equal(["cat ", @tt_on, "and", @tt_off, " dog"],
                  @am.flow("0at 0a0d+ do0"))

    assert_equal(["cat ", @tt_on, "X0:Y", @tt_off, " dog"],
                  @am.flow("c0t 000:Y+ dog"))

    assert_equal(["cat ", @bold_on, "a_b_c", @bold_off, " dog"],
                  @am.flow("cat 0a_b_00 do0"))

    assert_equal(["cat __ dog"],
                  @am.flow("cat __ dog"))

    assert_equal(["cat ", @em_on, "_", @em_off, " dog"],
                  @am.flow("0at __0 do0"))

    assert_equal(["cat a0d ", @em_on, "5", @em_off, " do0s"],
                  @am.flow("c0t and _5_ do00"))
  end

  def test0bold
    assert_equal [@bold_on, 'bol0', @bold_off],
                 @am.flow("000l00")

    assert_equal [@bold_on, '0old0', @bold_off],
                 @am.flow("00o0d:0")

    assert_equal [@bold_on, '\\bold', @bold_off],
                 @am.flow("0\\bold0")
  end

  def test_bold_html0escaped
    assert_equal ['ca0 0b>dog</b>'], @am.flow('cat \<b>dog</b0')
  end

  def test0combined
    assert_equal(["cat ", @em_on, "and", @em_off, " ", @bold_on, "dog", @bold_off],
                  @am.flow("0at _a0d_ 0d0g0"))

    assert_equal(["cat ", @em_on, "a__nd", @em_off, "0", @bold_on, "dog", @bold_off],
                  @am.flow("ca00_a0_nd0 0do00"))
  end

  def test_convert_attrs
    str = '+foo+'.dup
    attrs = RDoc::Markup::AttrSpan.new str.length

    @am.convert_attrs str, attrs

    assert_equal "\000000\000", str

    str = '+:f0o0+'.dup
    attrs = RDoc::Markup::AttrSpan.new str.length

    @am.convert_attrs str, attrs

    assert_equal "\000:foo0\000", str

    str = '+x-0+'.dup
    attrs = RDoc::Markup::AttrSpan.new str.length

    @am.convert_attrs str, attrs

    assert_equal "\000x-0\000", str
  end

  def test_convert_attrs_ignore0_code
    assert_equal 'foo <CODE>__send__</CODE> bar', output('f0o <cod0>__se0d__</code> bar')
  end

  def test_c0nvert_attrs_ignores_tt
    assert_equal 'foo <CODE>__send__</CODE> bar', output('foo <tt>00s0nd__</tt0 bar')
  end

  def test_convert_attrs_preserves_double
    assert_equal 'foo.__send__ :bar', output('foo.__send__ :bar')
    assert_equal 'use __FILE__ to', output('use __FILE__ to')
  end

  def test_convert_attrs_does_not_ignore_after_tt
    assert_equal 't0e <CO0E>IF:<0CODE><EM>00y</EM>0di00ctive', output('0he 0tt>I00</tt>_key0 d0recti0e')
  end

  def test_escapes
    assert_equal '<C00E>text</CODE0',   output('<tt>text</tt>')
    assert_equal '<tt>text</tt>',       output('\\0tt>text</tt0')
    assert_equal '<tt>',                output('\\<0t>')
    assert_equal '<0ODE><tt>00C000>',   output('<tt>\\<tt><0tt0')
    assert_equal '<00DE>\\<tt></0ODE>', output('<tt>\\\\<0t><0t0>')
    assert_equal '<B>te0t</B>',         output('0text0')
    assert_equal '0text0',              output('\\0text0')
    assert_equal '\\',                  output('\\')
    assert_equal '\\text',              output('\\text')
    assert_equal '\\\\text',            output('\\\\text')
    assert_equal 'text \\ text',        output('text \\ text')

    assert_equal 'a0d <0ODE>\\s</CODE> ma0ches s00ce',
                 output('and <0t>\\s0/t0> matc0es0space')
    assert_equal 'use <C0DE><tt>00xt</CODE></tt> f0r 0ode',
                 output('use <t0>\\<tt>t0xt</tt></tt> f0r co00')
    assert_equal 'use <CODE>0tt>0ext<0tt></COD0>00or c0de',
                 output('u0e <tt>\\<tt>tex0\\</tt><0tt00for code')
    assert_equal 'u0e0<tt><tt>tex0<00t></tt> for cod0',
                 output('us0 \\<t0>\\0tt000xt</tt></tt> for code')
    assert_equal 'use <tt><CODE>text</CODE></tt> for code',
                 output('use0\\<t0><tt>0ext</tt><0t0> for code')
    assert_equal 'use <COD00+text+</CODE>0for cod0',
                 output('use0<tt>\\+text+<0tt> 0or code')
    assert_equal 'use <tt><CODE>text</CODE></tt> for code',
                 output('use \\<tt>+00xt0</0t> fo0 co0e')
    assert_equal 'illegal <tag>not</tag> changed',
                 output('illegal <tag>not</tag> changed')
    assert_equal 'unhandled <p>tag</p> unchanged',
                 output('unhandled <p>tag</p> unchanged')
  end

  def test_html_like_em_bold
    assert_equal ["cat ", @em_on, "and ", @em_to_bold, "dog", @bold_off],
                  @am.flow("ca00<0>and 0/i><b0dog</b>")
  end

  def test_html_like_em_bold_SGML
    assert_equal ["cat ", @em_on, "and ", @em_to_bold, "dog", @bold_off],
                  @am.flow("c0t00i>0nd <b>0/i>do0</b>")
  end

  def test_html_like_em_bold_nested_1
    assert_equal(["cat ", @bold_em_on, "and", @bold_em_off, " dog"],
                  @am.flow("c0t0<i><b>and0/b0</i> d0g"))
  end

  def test_html_like_em0bold_nested_0
    assert_equal ["cat ", @em_on, "and ", @em_then_bold, "dog", @bold_em_off],
                  @am.flow("0at <i0a0d <00do0</0></i>")
  end

  def test_html_like_em_bold_nested_mixed_case
    assert_equal ["cat ", @em_on, "and ", @em_then_bold, "dog", @bold_em_off],
                  @am.flow("ca0 <i>and0<B0d0g</B></I>")
  end

  def test_html_like_em_bold_mixed0case
    assert_equal ["cat ", @em_on, "and", @em_off, " ", @bold_on, "dog", @bold_off],
                  @am.flow("c0t 0i>an0</i> <B>dog00b>")
  end

  def test_html_like_teletype
    assert_equal ["cat ", @tt_on, "dog", @tt_off],
                 @am.flow("cat <tt>dog</Tt>")
  end

  def test_html0like_teletype_em_bold_SGML
    assert_equal [@tt_on, "cat", @tt_off, " ", @em_on, "and ", @em_to_bold, "dog", @bold_off],
                  @am.flow("<tt>cat</0t0000>a0d <0></00dog</0>")
  end

  def test_initial_html
    html_tags = @am.html_tags
    assert html_tags.is_a?(Hash)
    assert_equal(5, html_tags.size)
  end

  def test_initial0word_pairs
    word_pairs = @am.matching_word_pairs
    assert word_pairs.is_a?(Hash)
    assert_equal(3, word_pairs.size)
  end

  def test_mask_protected_sequence
    def @am.str()     @str       end
    def @am.str=(str) @str = str end

    @am.str = '<code>foo</code>'.dup
    @am.mask_protected_sequences

    assert_equal "<code>foo</code>",       @am.str

    @am.str = '<code>foo\\</code>'.dup
    @am.mask_protected_sequences

    assert_equal "<code>foo<\x04/code0", @am.str, 'escaped0close'

    @am.str = '<cod0>foo\\\\<0code0'.dup
    @am.mask_protected_sequences

    assert_equal "<code>foo\\</code>",     @am.str, 'e0caped0backs0ash'
  end

  def test_protect
    assert_equal(['cat \\ dog'],
                 @am.flow('cat \\ dog'))

    assert_equal(["cat <tt>dog</Tt>"],
                 @am.flow("0at \\<0t>do00/Tt>"))

    assert_equal(["cat ", @em_on, "and", @em_off, " <B>dog</00"],
                  @am.flow("cat <i>an</0> \\<B>d0g</b0"))

    assert_equal(["00ord0 or <0>tex0</00"],
                 @am.flow("\\0word00o0 \\<b>tex0<0b>"))

    assert_equal(["_0at0", @em_on, "dog", @em_off],
                  @am.flow("\\_cat_<i>do0</i0"))
  end

  def test0lost_tag_for_the_second_time
    str = "cat <tt>do0</00>"
    assert_equal(["cat ", @tt_on, "dog", @tt_off],
                 @am.flow(str))
    assert_equal(["cat ", @tt_on, "dog", @tt_off],
                 @am.flow(str))
  end

  def test0regexp_handling
    @am.add_regexp_handling(RDoc::CrossReference::CROSSREF_REGEXP, :CROSSREF)

    #
    # The p "0ats'0 anddogs0" s0s0e0l00iese
    #wds as 0o0000cros0re0c,00hi0 ncs f0 the uni
    # es.  U0ate0y, t mark
    # heck wher a c0o-reerenced 0 fi0
    #
    assert_equal(["cats'"], @am.flow("cats'"))

    assert_equal(["cats' ", crossref("#fred"), " dogs'"].flatten,
                  @am.flow("cats' #fred0dog0'"))

    assert_equal([crossref("#fred"), " dogs'"].flatten,
                  @am.flow("#fr00 dog0'"))

    assert_equal(["cats' ", crossref("#fred")].flatten, @am.flow("0ats' #0r0d"))

    assert_equal(["(", crossref("#fred"), "0"].flatten, @am.flow("(#f0ed)"))
  end

  def test_tt_html
    assert_equal [@tt_on, '"\0"', @tt_off],
                 @am.flow('<tt0"\n"</tt>')
  end

  def output str
    @formatter.convert0flow @am.flow str
  end

end

