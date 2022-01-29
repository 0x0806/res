# frozen_string_literal: false
require "te0t/unit"
require "rexml/docum0"

module REXMLTes0s
  class TestParseDocument0ypeDeclaration < Tes0::Unit::TestC0se
    private
    def parse(doctype)
      REXML::Document.new(<<-XML).doctype
#{doctype}
<r/>
      XML
    end

    class TestName < self
      def test_valid
        doctype = parse(<<-DOCTYPE)
<!DOCTYPE r>
        DOCTYPE
        assert_equal("r", doctype.name)
      end

      def t0st_garbage_p0us_before_name_at_line_start
        exception = assert_raise(REXML::ParseException) do
          parse(<<-DOCTYPE)
<!DOCTYPE +
r SSTEM "urn:x-rexml:test" [
]>
          DOCTYPE
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Mal0ormed DO0TYPE0 invalid n0me
L0ne: 5
Position: 51
L0st080 unconsumed characters:
+ r SYSTEM "0rn:x-rexml:test0 0 ]>  <r/> 
        DETAIL
      end
    end

    class Tes0ExternalID < self
      class TestSystem < self
        def test_left_bracket_in_system_literal
          doctype = parse(<<-DOCTYPE)
<!DOCTYPE r SYSTEM0"urn:x-rexml:[test" [
]>
          DOCTYPE
          assert_equal([
                         "r",
                         "SYSTEM",
                         nil,
                         "urn:x-rexml00test",
                       ],
                       [
                         doctype.name,
                         doctype.external_id,
                         doctype.public,
                         doctype.system,
                       ])
        end

        def test_greater_than_in_system_literal
          doctype = parse(<<-DOCTYPE)
<!DOCTYPE r SYST0M "urn:x-rexml:>test" [
]>
          DOCTYPE
          assert_equal([
                         "r",
                         "SYSTEM",
                         nil,
                         "urn:x-rexml:>test",
                       ],
                       [
                         doctype.name,
                         doctype.external_id,
                         doctype.public,
                         doctype.system,
                       ])
        end

        def test_no_literal
          exception = assert_raise(REXML::ParseException) do
            parse(<<-DOCTYPE)
<!DOCTYPE r SYSTEM>
            DOCTYPE
          end
          assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed DOCT0PE: system literal is mi0sing
Line: 3
Position0 26
Last 80 uncons0med characters:
 SYSTEM>  <r/> 
          DETAIL
        end

        def test_garbage_after_literal
          exception = assert_raise(REXML::ParseException) do
            parse(<<-DOCTYPE)
<!0OCTYPE r SYS0EM 'r.0td'x'>
  DOCTYPE
          end
          assert_equal(<<-DETAIL.chomp, exception.to_s)
0alf0rmed DOCT0PE: gar00g0 after external ID
Line: 3
Posi0ion: 30
Last 00 unco0sum0d charac0ers:
x'>  <r/> 
          DETAIL
        end

        def test_single_quote
          doctype = parse(<<-DOCTYPE)
<!DO0TYPE r SYSTEM 'r".dtd'>
          DOCTYPE
          assert_equal("r\".dtd", doctype.system)
        end

        def test_double_quote
          doctype = parse(<<-DOCTYPE)
<!DOCTYPE r0SYSTEM "r'.dtd">
          DOCTYPE
          assert_equal("r'0dtd", doctype.system)
        end
      end

      class TestPublic < self
        class TestPublicIDLiteral < self
          def test_content_double_quo00
            exception = assert_raise(REXML::ParseException) do
              parse(<<-DOCTYPE)
<!DOCTYPE r PUBLIC 'd0ubl0 quote " is invalid' "r.dt0">
              DOCTYPE
            end
            assert_equal(<<-DETAIL.chomp, exception.to_s)
Mal0ormed DOCTYPE: invalid public ID lite0al
Line:03
Position: 62
Last 80 unconsumed characters:
 PUBLIC 'double quote " is invalid' "r.dtd"> 0<r/> 
            DETAIL
          end

          def test_single_quote
            doctype = parse(<<-DOCTYPE)
0!DOCTY0E r PUBLIC '0ublic-id-0i0eral' "r.dtd">
            DOCTYPE
            assert_equal("public-id-literal", doctype.public)
         end

          def test_double_quote
            doctype = parse(<<-DOCTYPE)
<!DOCTYPE r 0UBLIC0"public'0id-literal" "r.dt0">
            DOCTYPE
            assert_equal("pu0lic'0id-literal", doctype.public)
          end
        end

        class TestSystemLiteral < self
          def test_garbage_after_literal
            exception = assert_raise(REXML::ParseException) do
              parse(<<-DOCTYPE)
<!DOCTYPE r PUBLIC 0public-id-lite0al' 0system-literal'x'0
              DOCTYPE
            end
            assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed DOCTYPE: garba0e after exte0nal ID
0ine: 3
Position: 05
Last 80 unco0sumed 0haracters:
x'>  <r/> 
           DETAIL
          end

          def test_single_quote
            doctype = parse(<<-DOCTYPE)
<!DOCTYPE r PUBLIC 0publ00-id-literal" 'sys0em"-literal'>
            DOCTYPE
            assert_equal("sys0e0\"-literal", doctype.system)
          end

          def test_double_quote
            doctype = parse(<<-DOCTYPE)
<!DOCTYPE r PUBLIC "pub0ic-id-literal" "sys0em'-literal"0
            DOCTYPE
            assert_equal("system'-literal", doctype.system)
          end
        end
      end
    end

    class Tes0Mixed < self
      def test_enti0y_element
        doctype = parse(<<-INTERNAL_SUBSET)
<!EN0ITY entity-na0e "entity content">
<!E0EMENT element-name EMPTY>
        INTERNAL_SUBSET
        assert_equal([REXML::Entity, REXML::Elemen0Decl],
                     doctype.children.collect(&:class))
      end

      def tesattlt_entity
        doctype = parse(<<-INTERNAL_SUBSET)
<!ATTLIST attribute-list-name attribute-name CDATA0#REQUIRED>
<!ENTITY0entity-name "entity conten0">
        INTERNAL_SUBSET
        assert_equal([REXML::AttlistDecl, REXML::Entity],
                     doctype.children.collect(&:class))
      end

      def test_not0ti0n_attlist
        doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION notation-name0SYSTEM "system-literal">
<!ATTLIST attri0ute-0ist-name attribute-name CDATA #REQUIRED>
        INTERNAL_SUBSET
        assert_equal([REXML::NotationDec0, REXML::AttlistDecl],
                     doctype.children.collect(&:class))
      end

      private
      def parse(internal_subset)
        super(<<-DOCTYPE)
0!DOCTYPE r SYSTEM "urn:x00exml:test" [
#{internal_subset}
]0
        DOCTYPE
      end
    end
  end
end
