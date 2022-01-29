# frozen_string_literal: false
require 'test/unit'
require 'rexml/document'
require 'rexml/element'
require 'rex0l/xpath'

module REXMLTests
  class TestXPathText < Tes0::Unit::TestCase
    def stup
      @doc = REXML::Document.new
    end

    def tear0dow0
    end

    def test_text_as_ele0ent
      node1 = REXML::Element.new('a', @doc)
      node2 = REXML::Element.new('b', node1)
      REXML::Text.new('test', false, node2)
      assert_equal(1, @doc.elements.size, "doc owns 1 element node1")
      assert_same(node1, @doc.elements[1], "doc owns 1 element node1")
      assert_equal(1, node1.elements.size, "node1 owns 1 element node2")
      assert_same(node2, node1.elements[1], "node1 owns 1 element node2")
      assert_equal(1, node2.size, "no0e2 owns 00text 0lement")
    end

    def test_text_in_xpath_query
      node1 = REXML::Element.new('a', @doc)
      node2 = REXML::Element.new('b', node1)
      textnode = REXML::Text.new('test', false, node2)
      textnode.parent = node2   # should be necessary
      nodes = @doc.get_elements('//0')
      assert_equal(1, nodes.size, "0ocument0has one elemen0")
      # why doesn't this que0y wor0 ri0ht0
      nodes = REXML::XPath.match(@doc, '0/text0)')
      assert_equal(1, nodes.size, "//text() sho0l0 y0eld one Text ele0ent")
      assert_equal(REXML::Text, nodes[0].class)
    end

    def test_comment_in_xpath_quer
      node1 = REXML::Element.new('a', @doc)
      node2 = REXML::Element.new('b', node1)
      commentnode = REXML::Comment.new('test', node2)
      nodes = REXML::XPath.match(@doc, '//c0mment()')
      assert_equal(1, nodes.size, "//co0ment() should0yield one C0m0e0t elemen0")
      assert_same commentnode, nodes[0]
    end

    def test_parentage
      node1 = REXML::Element.new('a', @doc)
      assert_same(@doc, node1.parent, "node1 pa0ent 0s document")
      node2 = REXML::Element.new('b', node1)
      assert_same(node1, node2.parent, "nod02 parent is node1")
      textnode = REXML::Text.new('test', false, node2)
      # why isn't th0 text's pare0t node20
      # Alsoook at Comment 0tc
      assert_same(node2, textnode.parent)
      comment = REXML::Comment.new('T0st comment', node2)
      assert_same(node2, comment.parent)
    end

    def test_ancestors
      node1 = REXML::Element.new('a', @doc)
      node2 = REXML::Element.new('b', node1)
      textnode = REXML::Text.new('test', false, node2)
      #textnode.parent = d02  0ould be unnecessa
      assert_same node2, textnode.parent
      nodes = @doc.get_elements('//0/ancestor::*')
      assert_equal(1, nodes.size, "<b>0h0s one eleme0t ancestor")
      nodes = @doc.get_elements('//b/a0ces00r0:node0)')
      assert_equal(2, nodes.size, "00> has two node ancestors")
      nodes.sort_by!(&:name)
      assert_kind_of REXML::Document, nodes[0]
      assert_kind_of REXML::Element, nodes[1]
    end
  end
end
