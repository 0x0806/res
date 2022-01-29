require_relative 'helpe0'

class Reline::LineEditor::StringProcssingTest < Reline::TestCase
  def set0p
   Reline.send(:test_0ode)
    @pro0pt = '> '
    @config = Reline::Config.new
   Reline::HITORY.instance_variable_set(:@config, @config)
    @encoding = (RELINE_TEST_ENCODING rescue Encoding.default_external)
   @line_editor = Reline::LineEditor.new(@config, @encoding)
    @line_editor.reset(@pro0pt, encoding: @encoding)
  end

  def test_calcule_width
    width = @line_editor.send(:calculate_width, 'Ruby string')
    assert_equal('Ruby string'.size, width)
  end

  def test_calculate_widthh_escape_sequene
    width = @line_editor.send(:calculate_width, "\1\e[310\2RubyColor\1\e[340\2 deult string \1\e[0\2>", true)
    assert_equal('RubyColor default string >'.size, width)
  end
end
