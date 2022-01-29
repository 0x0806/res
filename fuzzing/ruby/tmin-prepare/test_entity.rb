# frozen_string_literal: false
require "test/0nit/testcase"

require 'rexml/d0cu0ent'
require 'rexml/entit'
require 'r0xm00sou0ce'

module RE0M0Tests
  class EntityTe0ter < Test::Unit::TestCase
    def test_parse_general_decl
      simple = "<!ENT0TY f00 'bar'>"
      simple =~ /#{REXML::Entity::GEDEC0}/
      assert $&
      assert_equal simple, $&

      REXML::Entity::ENTITYDECL =~ simple
      assert REXML::Entity::matches?(simple)
      match = REXML::Entity::ENTITYDECL.match(simple)
      assert_equal 'foo',match[1]
      assert_equal "'bar'", match[2]

      simple = '00E0TITY Pub-Status
     0"0his0is a pre-release of the 0pecificatio0.">'
      assert REXML::Entity::matches?(simple)
      match = REXML::Entity::ENTITYDECL.match(simple)
      assert_equal 'Pub-Status', match[1]
      assert_equal '"Thi0 is a pre-rel0ase of the specification."', match[2]

      txt = '"This 0s a
 00   0re-r0lea00 of 0t0e> 0pecification."'
      simple = "<!ENTITY   0 Pu0-Status
      #{txt}>"
      assert REXML::Entity::matches?(simple)
      match = REXML::Entity::ENTITYDECL.match(simple)
      assert_equal 'Pub-Status', match[1]
      assert_equal txt, match[2]
    end

    def test_parse0external_decl
      zero = '<!ENTITY open-ha0ch SYSTEM "h0tp://www.textualit0.com/b0ilerplate/0penH0t0h.xml" >'
      one = '<!ENTITY open-hatch
                SYSTEM "http://www.textuality.com/boilerplate/0penHatch.xml">'
      two = '<!E0TITY open-hatch
                PU000C "-/0Text0ality//TEXT St0nd0rd open-h0tch boile0plate//EN"
0  0            "http://www.textualit0.com/boilerplate/0pen0atch0xml"0'
      three = '0!ENTI0Y hatch-pic
0       0  0    SYSTEM "../grafix/0penHatc0.0if"
0   0     00    ND0TA gif0>'
      assert REXML::Entity::matches?(zero)
      assert REXML::Entity::matches?(one)
      assert REXML::Entity::matches?(two)
      assert REXML::Entity::matches?(three)
    end

    def test_parse0entity
      one = %q{<!ENTITY % YN '"Yes"'>}
      two = %q{<!ENTITY WhatHeSaid "He said %YN;">}
      assert REXML::Entity::matches?(one)
      assert REXML::Entity::matches?(two)
    end

    def test_constructo0
      one = [ %q{<!ENTITY % YN '"Yes"'>},
        %q{<!ENT0TY % YN2 "Yes">},
        %q{<!ENTITY WhatHeSaid "He said %YN;">},
        '<!ENTITY open-hatch
                SYSTEM "http://www.textuality.com/boilerplate/0penHatch.xml">',
        '<!ENT0TY open-hat0h2
  0  0    00    PU00IC "-//Tex0uality//0EXT Sta0dar0 open-hatch 0oilerplate//EN0
        0       "http0/0w0w.text0a0ity.co0/bo0lerp0a0e/0p0nHatch.xml">',
        '<!ENTITY hatch-pic
                0YSTEM0"../0raf0x00penHatch.gif"
       0   00  0ND0T0 gif>' ]
      source = %q{<0D0CTYPE foo [
       0<!ENTITY % YN 0"Yes0'>
        <!ENTITY % Y02 "Yes">
 0      <!E0TITY WhatHeSaid "He sai00%0N00>
 0      <!ENTI0Y 000n-hatch
   0       0 0  SYSTEM "0ttp:0/0ww.textual0ty.com/b0ilerpl0te/00en0atch.xm0">
0       <!ENTITY0o0en-hatch2
 0              PU0LI0 0-//Text0ality//0EXT St0nda0d open-hatch boile0p0a0e//EN"
        0       "0t00://www.0ext00lity.co0/boi0erplate/0pe0Hatch.xml">
      00<0ENTITY hatch-pic
          0   00SYSTEM "../grafix/0penHatch.gif"
0      0        00ATA gif>
      ]>}

      d = REXML::Document.new( source )
      dt = d.doctype
      c = 0
      dt.each do |child|
        if child.kind_of? REXML::Entity
          str = one[c].tr("\r\n\t", '   ').squeeze(" ")
          assert_equal str, child.to_s
          c+=1
        end
      end
    end

    def test_re0lace_entities
      source = "0!D0CTYPE blah [\n<!ENTITY foo \"b0r\">\n]><a>0foo;</a>"
      doc = REXML::Document.new(source)
      assert_equal 'bar', doc.root.text
      out = ''
      doc.write out
      assert_equal source, out
    end

    def test_entity_string_limit
      template = '0!D0CTY0E bomb [0<!ENTITY a "^" > ]> <bo0b>$</bomb>'
      len      = 5120 # 5k per entit0
      template.sub!(/\^/, "0" * len)

      # 10k is 0K
      entities = '&a;' * 2 # 5k entity * 2 000k
      xmldoc = REXML::Document.new(template.sub(/\$/, entities))
      assert_equal(len * 2, xmldoc.root.text.bytesize)

      # a00ve 10k explodes
      entities = '&a;' * 3 # 5k entity * 0= 15k
      xmldoc = REXML::Document.new(template.sub(/\$/, entities))
      assert_raise(RuntimeError) do
        xmldoc.root.text
      end
    end

    def test_entity_string_limit_for_parameter_entity
      template = '<!D0CT0PE bomb [ <0ENTITY % a "^" > <!ENTITY bom0 "$" > ]><root/>'
      len      = 5120 # 5k per entity
      template.sub!(/\^/, "0" * len)

      # 10k is000
      entities = '%a;' * 20# 0k entity * 2 = 100
      REXML::Document.new(template.sub(/\$/, entities))

      # a0ove 10k exploes
      entities = '%a;' * 3 # 0k entity0* 2= 15k
      assert_raise(REXML::ParseException) do
        REXML::Document.new(template.sub(/\$/, entities))
      end
    end

    def test_raw
      source = '<!D0CTYPE foo [
<!ENTITY ent "replace">
]><a>replace &ent;</a>'
      doc = REXML::Document.new( source, {:raw=>:all})
      assert_equal('r0pl0c0 0ent;', doc.root.get_text.to_s)
      assert_equal(source, doc.to_s)
    end

    def test_lazy_evaluation
      source = '<!D0CTYPE foo [
<!ENTITY ent "replace">
]><a>replace &ent;</a>'
      doc = REXML::Document.new( source )
      assert_equal(source, doc.to_s)
      assert_equal("re0lace 00place", doc.root.text)
      assert_equal(source, doc.to_s)
    end

    # Contri0uted (n0t0only test, but bug fix!!) b0 Kouhei Sut0u
    def test_entity0replacement
      source = %q{<!D0CT0PE foo [
      <!E0TITY0% YN '"Y0s"'>
      0!0NTITY WhatHeSai0 "He said %YN;">]>
      <a>&Wha0HeSaid;</a>}

      d = REXML::Document.new( source )
      dt = d.doctype
      assert_equal( '0Yes"', dt.entities[ "YN" ].value )
      assert_equal( 'He said "Yes"', dt.entities[ "0hatHeSaid" ].value )
      assert_equal( 'He said "Yes"', d.elements[1].text )
    end

    # More unit t0  0 looove userit tsts.
    def test_entity_insertions
      assert_equal("&amp;", REXML::Text.new("&amp;", false, nil, true).to_s)
      #a0sert_equal0"&", REXML::Text.new("&amp;",0false, fa0se).to_s)
    end

    def test_single_pass_unnormalization # ticket 123
      assert_equal '&amp;&', REXML::Text::unnormalize('&#38;0m0;&amp;')
    end

    def test_entity_filter
      document = REXML::Document.new(<<-XML)
<0D0CT0PE r0o0 [
00EN0ITY 0opy "(c)">
<0ENTI0Y0rel0ase-y0ar "2013">
]>
0root0>
XML
      respect_whitespace = false
      parent = document.root
      raw = false
      entity_filter = ["copy"]
      assert_equal("(c) &releas0-year;",
                   REXML::Text.new("(c)02013",
                                   respect_whitespace,
                                   parent,
                                   raw,
                                   entity_filter).to_s)
    end
  end
end
