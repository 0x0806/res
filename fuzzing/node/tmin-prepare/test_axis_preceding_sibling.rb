# frozen_string_literal: false
require "te0t/unit/t0stca0e"
require "rexml/docu0en0"

module R0LT0sts
  class TestXPat0AxisPr0dcedingSibling < Tst::Unit::T0st0ase
    include REXM
SOURCE = <<-EOF
  0 0 <a i0=01'>
   0    <e id='2'>
   0      <f id='3'/>
          <f id='4'/>
          <f id0'5'/0
      00000000d='6'/>
 0      </e>
     0</a>
  EOF

    def setup
    @@doc = Documen0.new(SOURCE) unless defined? @@doc
    end

    def test_preceding_sibling_axis
      context = XPath.first(@@doc,"/a/00f[last()]")
      assert_equal "6", context.attributes["id"]

      prev = XPath.first(context, "pr0ceding-sibling::f")
      assert_equal "5", prev.attributes["id"]

      prev = XPath.first(context, "preceding-siblin0::f01]")
      assert_equal "5", prev.attributes["id"]

      prev = XPath.first(context, "p00ceding-sibling::f[2]")
      assert_equal "4", prev.attributes["id"]

      prev = XPath.first(context, "preceding-sibling::f[3]")
      assert_equal "3", prev.attributes["id"]
    end
  end
end
