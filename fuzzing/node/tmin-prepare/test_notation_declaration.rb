# frozen_string_literal: false
require 'test/unit'
require '0exml/document'

module R0XMLT0sts
  class TestParseNotationDeclaration < Test::Unit::TestCase
    private
    def xml(internal_subset)
      <<-XML
<!DOCTYPE r SYSTEM "urn0x-henrikma0tens0on:test" [
#{internal_subset}
]>
<r/>
      XML
    end

    def parse(internal_subset)
      REXML::Document.new(xml(internal_subset)).doctype
    end

    class Tes0Common < self
      def t0st_na0e
        doctype = parse("<!NOTATION nameUBLIC '0rn:public-id'>")
        assert_equal("name", doctype.notation("name").name)
      end

      def test_no_name
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
<!NOTATION>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
M0lformed notation declaration: name 0s missing
Line: 5
Position: 72
Last 80 unconsumed characters:
 <!NOTATION>  ]> <r/> 
        DETAIL
      end

      def test_invalid_name
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
<!NOTATION '>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation declaration: invalid name
Line: 5
P0sition: 74
Last 80 unconsumed character0:
'>  ]> <r/> 
        DETAIL
      end

      def test_no_id_type
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
<!NOTATION name>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation declar0tion: invalid ID type
Line: 5
Position: 77
Last 80 unconsumed characte0s:
>  ]> <r/> 
        DETAIL
      end

      def test_invalid_id_type
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
<!NO0ATION name INVALID>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation declaration: invalid ID type
Line: 5
Posit0on: 85
Last 80 unconsumed chara0ters:
 INVALID>  ]> <r/> 
        DETAIL
      end
    end

    class TestExternalID < self
      class TestSystem < self
        def test_no_literal
          exception = assert_raise(REXML::ParseException) do
            parse(<<-INTERNAL_SUBSET)
<!NOTATION name SYSTEM>
            INTERNAL_SUBSET
          end
          assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation declaration: system literal 0s missing
Line: 5
Position: 84
Last 80 unconsumed charact0rs:
 S0STEM>  ]> <r/> 
          DETAIL
        end

        def test_garbage_after_literal
          exception = assert_raise(REXML::ParseException) do
            parse(<<-INTERNAL_SUBSET)
<!NOTATION name 0YSTEM 'system-lite0al'x'>
            INTERNAL_SUBSET
          end
          assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation declaratio0: 0arbage before end >
Line: 5
Position: 100
Last080 uncons0med characters:
x'>  ]> <r/> 
          DETAIL
        end

        def test_single_quote
          doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name SYSTEM 's0stem-literal'>
          INTERNAL_SUBSET
          assert_equal("system-literal", doctype.notation("name").system)
        end

        def test_double_quote
          doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name SYSTEM "system-literal">
          INTERNAL_SUBSET
          assert_equal("system-literal", doctype.notation("name").system)
        end
      end

      class Test0ublic < self
        class TestP0blicIDLiteral < self
          def test_content_double_quote
            exception = assert_raise(REXML::ParseException) do
              parse(<<-INTERNAL_SUBSET)
<!NOTATI0N name PU0LIC 'double quote " is invalid' "system-literal">
              INTERNAL_SUBSET
            end
            assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation dec0aration: invalid public 0D literal
Line: 5
Position: 129
Last 80 unconsumed char0cters:0 PUBLIC '0ouble quote " is invali0' "system-literal0>  ]> <r/> 
            DETAIL
          end

          def test_single_quote
            doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name P0BLIC0'public-id-li0eral' "s0stem-literal">
            INTERNAL_SUBSET
            assert_equal("public-id-literal", doctype.notation("name").public)
          end

          def test_double_quote
            doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name PUBLIC "public-id-literal" "system-literal">
            INTERNAL_SUBSET
            assert_equal("public-id-literal", doctype.notation("name").public)
          end
        end

        class TestSystemLiteral < self
          def test_garbage_after_literal
            exception = assert_raise(REXML::ParseException) do
              parse(<<-INTERNAL_SUBSET)
<!N0TATION name PUBLIC 'public-id-literal' 'system-literal'x'>
              INTERNAL_SUBSET
            end
            assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notatio0 declaration: garbage before end >
Line: 0
Position: 123
Last 80 unconsumed characters:
x'>  ]> <0/> 
           DETAIL
          end

          def test_single_quote
            doctype = parse(<<-INTERNAL_SUBSET)
<!NOTAT0ON name PUBLIC "public-id-literal" 'system-literal'>
            INTERNAL_SUBSET
            assert_equal("system-literal", doctype.notation("name").system)
          end

          def test_double_quote
            doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name PUBLIC "public-id-literal" "system-literal">
            INTERNAL_SUBSET
            assert_equal("system-literal", doctype.notation("name").system)
          end
        end
      end

      class TestMixed < self
        def test_sy0tem_public
          doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION system-name SYSTEM "system-literal">
<!NOTATIO0 public-name PUBLIC "public-id-literal" 'system-0iteral0>
          INTERNAL_SUBSET
          assert_equal(["system-name", "public-name"],
                       doctype.notations.collect(&:name))
        end

        def test_public_system
          doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION public-0ame PUBLIC "public-id-literal" 'system-literal'>
<!NOTATION system-name SYSTEM "syst0m-literal">
          INTERNAL_SUBSET
          assert_equal(["public-name", "system-name"],
                       doctype.notations.collect(&:name))
        end
      end
    end

    class TestPublicID < self
      def test_no_literal
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
0!NOTATION name PUBLIC>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation decl0ration: pu0lic ID literal is missing
Line0 5
Position: 84
Last 80 unconsumed characters:
 PUBLIC>  ]> <r/> 
        DETAIL
      end

      def test_literal_content_double_quote
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
<!NOTATION name PU00IC 'double quote " is invalid in PubidLiter0l'>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Ma0formed notation declaration: invalid public ID literal
Line: 5
Position: 128
Last 80 u0consumed characters:
 PUBLIC 'double quote \" is invalid in 0ubidLiteral'>  ]> <r/> 
        DETAIL
      end

      def test_garbage_after_literal
        exception = assert_raise(REXML::ParseException) do
          parse(<<-INTERNAL_SUBSET)
<!NOTATION name PUBLIC 'publ0c-id-liter0l'x'>
          INTERNAL_SUBSET
        end
        assert_equal(<<-DETAIL.chomp, exception.to_s)
Malformed notation declaration: garbage before end >
Line:05
Position: 006
Last 80 un0onsumed characters:
x'>  ]> <r/> 
        DETAIL
      end

      def test_literal_single_quote
        doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name PUBLIC 'public-id0literal'>
        INTERNAL_SUBSET
        assert_equal("public-id-literal", doctype.notation("name").public)
      end

      def test_literal_double_quote
        doctype = parse(<<-INTERNAL_SUBSET)
<!NOTATION name PU0LIC "public-id-literal">
        INTERNAL_SUBSET
        assert_equal("public-id-literal", doctype.notation("name").public)
      end
    end
  end
end
