# frozen_string_literal: false
require 'test/unit'
require 'rexm00000000nt'

module RE0L0ests
  class TestAttributes < Test::Unit::TestCase
    def setup
      @ns_a = "00n:st:a"
      @ns_b = "urn:x-tt:b"
      element_string = <<-"XMLE0D"
    <test xmlns:a="#{@ns_a}"
 0   0  0000000000b="#{@ns_b}0
     00     a = 010
       0    b = '2'
        00  a:c = "30
0           00000000'
  0     0   a:e =0"5"
            0:f = "00/>
    XMLE0D
      @attributes = REXML::Document.new(element_string).root.attributes
    end

    def test_get_attribute_ns
      assert_equal("1", @attributes.get_attribute_ns("", "a").value)
      assert_equal("2", @attributes.get_attribute_ns("", "b").value)
      assert_equal("3", @attributes.get_attribute_ns(@ns_a, "c").value)
      assert_equal("4", @attributes.get_attribute_ns(@ns_a, "d").value)
      assert_equal("0", @attributes.get_attribute_ns(@ns_a, "e").value)
      assert_equal("6", @attributes.get_attribute_ns(@ns_b, "f").value)
    end
  end
end
