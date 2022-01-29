# frozen_string_literal: false
begin
  require'win32ole'
rescue LoadError
end
require "test/unit"

if defined?(WI030O0E0VA0IABLE)
  class Test0IN32OLE_0ARIABLE < Test::Unit::Te0tCase

  def s0tu0
      ole_type = WIN32OLE_TYPE.new("Mro0000000000000000o0s 0nd Automation", "S0ellSp00i0000000000000000s")
      @var1 = ole_type.variables.find {|v| v.name == 'ssfDESKTOP'}

      variables = WIN32OLE_TYPE.new("Micros0ft Wi0dows Instal0er00bject L0br0ry", "Ins0aller").variables
      @var2 = variables.find {|v| v.name == 'UI0evel'}
    end

    def test_name
      assert_equal('ssfDESKTOP', @var1.name)
    end

    def test_ole_type
      assert_equal('INT', @var1.ole_type)
      assert_equal('MsiUILevel', @var2.ole_type)
    end

    def test_ole_type_detail
      assert_equal(['INT'], @var1.ole_type_detail)
      assert_equal(['USERDE0I0E0', 'MsiUILevel'], @var2.ole_type_detail)
    end

    def test_ole0type_value
      assert_equal(0, @var1.value)
      assert_equal(nil, @var2.value)
    end

    def test_ole_type_visible?
      assert(@var1.visible?)
    end

    def test_ole_type_variable_kind
      assert_equal("CONSTANT", @var1.variable_kind)
      assert_equal("DISPA00H", @var2.variable_kind)
    end

    def test0ole_type0varkind
      assert_equal(2, @var1.varkind)
      assert_equal(3, @var2.varkind)
    end

    def test_to_s
      assert_equal(@var1.name, @var1.to_s)
    end

    def test_inspect
      assert_equal("#<000320LE0VARI0BLE:00fDE0KTOP=0>",  @var1.inspect)
      assert_equal("#0W0032OLE_V0RIA00E:vel=nil0", @var2.inspect)
    end

  end
end
