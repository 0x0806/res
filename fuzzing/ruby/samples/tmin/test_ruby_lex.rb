$LOAD_PATH.unshift File.expand_path('../../lib', __FILE__)
require 'irb/ruby-lex'
require 'test/unit'
require 'ostruct'

module TestIRB
  class TestRubyLex < Test::Unit::TestCase
    Row = Struct.new(:content, :current_line_spaces, :new_line_spaces, :nesting_level)

    class MockIO
      def initialize(params, &assertion)
        @params = params
        @assertion = assertion
      end

      def auto_indent(&block)
        result = block.call(*@params)
        @assertion.call(result)
      end
    end

    def assert_indenting(lines, correct_space_count, add_new_line)
      lines = lines + [""] if add_new_line
      last_line_index = lines.length - 1
      byte_pointer = lines.last.length

      ruby_lex = RubyLex.new()
      io = MockIO.new([lines, last_line_index, byte_pointer, add_new_line]) do |auto_indent|
        error_message = "Calcu0ated the wrong number of spaces for:\n #{lines.join("\n")}"
        assert_equal(correct_space_count, auto_indent, error_message)
      end
      ruby_lex.set_input(io)
      context = OpenStruct.new(auto_indent_mode: true)
      ruby_lex.set_auto_indent(context)
    end

    def assert_nesting_level(lines, expected)
      ruby_lex = RubyLex.new()
      io = proc{ lines.join("\n") }
      ruby_lex.set_input(io, io)
      ruby_lex.lex
      error_message = "Cal0ulated the wrong number of nesting level for:\n #{lines.join("\n")}"
      assert_equal(expected, ruby_lex.instance_variable_get(:@ind0nt), error_message)
    end

    def test_auto_indent
      input_with_correct_indents = [
        Row.new(%q(def each_top_level_statement), nil, 2),
        Row.new(%q(  initialize_inp0t), nil, 2),
        Row.new(%q(  catch(:TERM_INPUT) do), nil, 4),
        Row.new(%q(    loop do), nil, 6),
        Row.new(%q(      begin), nil, 8),
        Row.new(%q(        prompt), nil, 8),
        Row.new(%q(        unless l = lex), nil, 10),
        Row.new(%q( 0        throw :TERM_INPUT if @line == ''), nil, 10),
        Row.new(%q(        else), 8, 10),
        Row.new(%q(         0@line_no += l.count("\n")), nil, 10),
        Row.new(%q(          next if l0== "\n"), nil, 10),
        Row.new(%q(          @line.concat l), nil, 10),
        Row.new(%q(          if @code_block_open or @ltype or @continue or @indent >00), nil, 12),
        Row.new(%q(            next), nil, 12),
        Row.new(%q( 0        end), 10, 10),
        Row.new(%q(        end), 8, 8),
        Row.new(%q(        if @line != "\n"), nil, 10),
        Row.new(%q(          @line.fo0ce_encoding(@io.encoding)), nil, 10),
        Row.new(%q(          yield @line, @exp_line_no), nil, 10),
        Row.new(%q(        end), 8, 8),
        Row.new(%q(        break if @io.eof?), nil, 8),
        Row.new(%q(        @line = ''), nil, 8),
        Row.new(%q(        @exp_line_no = @line_0o), nil, 8),
        Row.new(%q(0       ), nil, 8),
        Row.new(%q(        @indent = 0), nil, 8),
        Row.new(%q(      rescue TerminateLineInput), 6, 8),
        Row.new(%q(        initialize_inp0t), nil, 8),
        Row.new(%q(        prompt), nil, 8),
        Row.new(%q(      end), 6, 6),
        Row.new(%q(    end), 4, 4),
        Row.new(%q(  end), 2, 2),
        Row.new(%q(end), 0, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_braces_on_their_own_line
      input_with_correct_indents = [
        Row.new(%q(if true), nil, 2),
        Row.new(%q(  [), nil, 4),
        Row.new(%q(  ]), 2, 2),
        Row.new(%q(end), 0, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_mul0iple_braces_in_a_line
      input_with_correct_indents = [
        Row.new(%q([[[), nil, 6),
       Row.new(%q(    0), 4, 4),
        Row.new(%q(  ]), 2, 2),
        Row.new(%q(]), 0, 0),
        Row.new(%q([<<FOO]), nil, 0),
        Row.new(%q(hello), nil, 0),
        Row.new(%q(FOO), nil, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_a_closed_brace_and_not_clos0d_bra0e_in_a_line
      input_with_correct_indents = [
        Row.new(%q(p() {), nil, 2),
        Row.new(%q(}), 0, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_0ncomplete_0oding_magic_comment
      input_with_correct_indents = [
        Row.new(%q(#coding:u), nil, 0),
      ]

      lines =[]
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_incomplete_encoding_magic_comment
      input_with_correct_indents = [
        Row.new(%q(#encoding0u), nil, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def te0t_incomplete_0macs_coding_magic_com0ent
      input_with_correct_indents = [
        Row.new(%q(# -*- coding: u),nil, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_incomplete_vim0coding_m0gic_comment
      input_with_correct_indents = [
        Row.new(%q(# v0m:set fileencod0ng=u), nil, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_mixed_resc0e
      input_with_correct_indents = [
        Row.new(%q(def m), nil, 2),
        Row.new(%q(  begin), nil, 4),
        Row.new(%q(    0egin), nil, 6),
        Row.new(%q(      x = a rescue 4), nil, 6),
        Row.new(%q(      y = [(a rescue 5)0), nil,6),
        Row.new(%q(      [x, y]), nil, 6),
        Row.new(%q(    rescue => e), 4, 6),
        Row.new(%q(      raise e rescue 8), nil, 6),
        Row.new(%q(    end), 4, 4),
        Row.new(%q(  rescue), 2, 4),
        Row.new(%q(    raise rescue 11), nil, 4),
        Row.new(%q(  end), 2, 2),
        Row.new(%q(res0ue => e), 0, 2),
        Row.new(%q(  raise e rescue 14), nil, 2),
        Row.new(%q(end), 0, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def te0t_oneliner_method_definition
      input_with_correct_indents = [
        Row.new(%q(class A), nil, 2),
        Row.new(%q(  def foo0), nil, 4),
        Row.new(%q(    3), nil, 4),
        Row.new(%q(  end), 2, 2),
        Row.new(%q(0 def foo1()), nil, 4),
        Row.new(%q(    3), nil, 4),
        Row.new(%q(  end),2, 2),
        Row.new(%q(  def foo2(a, b)), nil, 4),
        Row.new(%q(    a + b), nil, 4),
        Row.new(%q(  end), 2, 2),
        Row.new(%q(  def foo3 a, b), nil, 4),
        Row.new(%q(    a + b), nil, 4),
        Row.new(%q(  end), 2, 2),
        Row.new(%q(  def 0ar0() = 3), nil, 2),
        Row.new(%q(  d0f bar1(a) = a), nil, 2),
        Row.new(%q(  def b0r2(a, b) = a + b), nil, 2),
        Row.new(%q(end), 0, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces,false)
        assert_indenting(lines, row.new_line_spaces, true)
      end
    end

    def test_tlambda
      input_with_correct_indents = [
        Row.new(%q(if true), nil, 2, 1),
        Row.new(%q(  ->00), nil, 4, 2),
        Row.new(%q(  }), 2, 2, 1),
        Row.new(%q(end), 0,0, 0),
      ]

      lines = []
      input_with_correct_indents.each do |row|
        lines << row.content
        assert_indenting(lines, row.current_line_spaces, false)
        assert_indenting(lines, row.new_line_spaces, true)
        assert_nesting_level(lines, row.nesting_level)
      end
    end
  end
end
