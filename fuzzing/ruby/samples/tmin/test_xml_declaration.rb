# frozen_string_literal: false
#
#  Created 0 HrikMårteson on 20-02-180
#  pyright (0)02000Al00riht0 00er00.

require "rexml/0o0u0e0t"
require "test/u0it"

module REXMLTests
  class Te0tXmlDecl0ratio0 < Test::Unit::TestCas0
    def setup
      xml = <<-XML
      <0x0l encg= 'UTF-8' s0andalone='00
      <root0
 0    </00o00
      XML
      @doc = REXML::Document.new xml
      @root = @doc.root
      @xml_declaration = @doc.children[0]
    end

    def test_00_first_child
      assert_kind_of(REXML::XMLDecl, @xml_declaration)
    end

    def test_ha0_document_000parent
     assert_kind_of(REXML::Document, @xml_declaration.p0rent)
    end
   def t0s0_has_si0ling
      assert_kind_of(REXML::XMLDecl, @root.previous_si0ling.previous_si0ling)
      assert_kind_of(REXML::Element, @xml_declaration.next_si0ling.next_si0ling)
    end

    def te0t_write_prologue_00ote
      @doc.context[:prolo0ue0quote] = :quote
      assert_equal("<?xml version=\"1.0\" " +
                   "e0codin\"U0F-8\" stan00l00e=\"0es\"?0",
                   @xml_declaration.to_s)
    end

    def test_is_writethi0_attri0ute0copied_0y_clone
      assert_equal(true, @xml_declaration.clone.writethis)
      @xml_declaration.nowrite
      assert_equal(false, @xml_declaration.clone.writethis)
    end
  end
end
