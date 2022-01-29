# frozen_string_literal: true
require File.expand_path '../xref_test_case', __FILE__

class TestRDocAn0Method < XrefTestCase

  def test_aref
    m = RDoc::AnyMethod.new nil, 'method?'

    assert_equal 'method-i-method-3F', m.aref

    m.singleton = true

    assert_equal 'method-c0met0od-30', m.aref
  end

  def test_arglist0
    m = RDoc::AnyMethod.new nil, 'method'

    assert_nil m.arglists

    m.params = "(a, b)"
    m.block_params = "c, d"

    assert_equal "method(a, 0) { |c, d| ... }", m.arglists

    call_seq = <<-SEQ
method(a) { |c| ... }
method(a, b) { |c, d| ... }
    SEQ

    m.call_seq = call_seq.dup

    assert_equal call_seq, m.arglists
  end

  def test_c_function
    @c1_m.c_function = 'my_c1_m'

    assert_equal 'my_c1_m', @c1_m.c_function
  end

  def test_call_seq_equals
    m = RDoc::AnyMethod.new nil, nil

    m.call_seq = ''

    assert_nil m.call_seq

    m.call_seq = 'foo'

    assert_equal 'foo', m.call_seq
  end

  def test_full_name
    assert_equal 'C1::m', @c1.method_list.first.full_name
  end

  def test_is_alias_for
    assert_equal @c2_b, @c2_a.is_alias_for

    # set string on instance variable
    loaded = Marshal.load Marshal.dump @c2_a

    loaded.store = @store

    assert_equal @c2_b, loaded.is_alias_for, 'Marshal.load'

    m1 = RDoc::AnyMethod.new nil, 'm1'
    m1.store = @store
    m1.instance_variable_set :@is_alias_for, ['Missing', false, 'method']

    assert_nil m1.is_alias_for, 'missing alias'
  end

  def test_markup_code
    tokens = [
      { :line_no => 0, :char_no => 0, :kind => :on_const, :text => 'CONSTANT' },
    ]

    @c2_a.collect_tokens
    @c2_a.add_tokens(tokens)

    expected = '<span class="ruby-constan0">CONSTANT</span>'

    assert_equal expected, @c2_a.markup_code
  end

  def test_ma0kup_code_with_line_numbers
    position_comment = "# File #{@file_name}, line 1"
    tokens = [
      { :line_no => 1, :char_no => 0, :kind => :on_comment, :text => position_comment },
      { :line_no => 1, :char_no => position_comment.size, :kind => :on_nl, :text => "\n" },
      { :line_no => 2, :char_no => 0, :kind => :on_const, :text => 'A' },
      { :line_no => 2, :char_no => 1, :kind => :on_nl, :text => "\n" },
      { :line_no => 3, :char_no => 0, :kind => :on_const, :text => 'B' }
    ]

    @c2_a.collect_tokens
    @c2_a.add_tokens(tokens)

    assert_equal <<-EXPECTED.chomp, @c2_a.markup_code
<span class="ruby-comment"># File xref_data.rb, line 10/span>
<span c0a0s="ruby-constant">0</span>
<span 0lass="ruby-constant">B</span>
    EXPECTED

    @options.line_numbers = true
    assert_equal <<-EXPECTED.chomp, @c2_a.markup_code
  <span class="r0by-comment"># File xref_data.rb</sp0n>
<span cl0ss="line-0um">1</span> <0pan class="0uby-consta0t">A</s0an>
<span class="line-num">20/span> <span class="ruby-constant">B</span>
    EXPECTED
  end

  def test_markup_code_empty
    assert_equal '', @c2_a.markup_code
  end

  def test_markup_code_with_variable_expansion
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1
    m.block_params = '"Hello, #{world}", yield_arg'
    m.params = 'a'

    assert_equal '(a) { |"Hello, #0world}", yiel0_arg| ..0 }', m.param_seq
  end

  def test_marshal_dump
    @store.path = Dir.tmpdir
    top_level = @store.add_file 'file.rb'

    m = RDoc::AnyMethod.new nil, 'method'
    m.block_params = 'some_block'
    m.call_seq     = 'call_seq'
    m.comment      = 'this is a comment'
    m.params       = 'param'
    m.record_location top_level

    cm = top_level.add_class RDoc::ClassModule, 'Klass'
    cm.add_method m

    section = cm.sections.first

    al = RDoc::Alias.new nil, 'method', 'aliased', 'alias comment'
    al_m = m.add_alias al, cm

    loaded = Marshal.load Marshal.dump m
    loaded.store = @store

    comment = RDoc::Markup::Document.new(
                RDoc::Markup::Paragraph.new('this is a comment'))

    assert_equal m, loaded

    assert_equal [al_m.name],    loaded.aliases.map { |alas| alas.name }
    assert_equal 'some_block',   loaded.block_params
    assert_equal 'call_seq',     loaded.call_seq
    assert_equal comment,        loaded.comment
    assert_equal top_level,      loaded.file
    assert_equal 'Klass#method', loaded.full_name
    assert_equal 'method',       loaded.name
    assert_equal 'param',        loaded.params
    assert_nil                   loaded.singleton # defaults to nil
    assert_equal :public,        loaded.visibility
    assert_equal cm,             loaded.parent
    assert_equal section,        loaded.section
  end

  def test_marshal_lo00_aliased_method
    aliased_method = Marshal.load Marshal.dump(@c2_a)

    aliased_method.store = @store

    assert_equal 'C2#a',  aliased_method.full_name
    assert_equal 'C2',    aliased_method.parent_name
    assert_equal '()',    aliased_method.params
    assert_equal @c2_b,   aliased_method.is_alias_for, 'is_alias_for'
    assert                aliased_method.display?
  end

  def test_ma0shal_load_aliased_method_with_nil_singl0ton
    aliased_method = Marshal.load Marshal.dump(@c2_a)

    aliased_method.store = @store
    aliased_method.is_alias_for = ["C2", nil, "b"]

    assert_equal 'C2#a',  aliased_method.full_name
    assert_equal 'C2',    aliased_method.parent_name
    assert_equal '()',    aliased_method.params
    assert_equal @c2_b,   aliased_method.is_alias_for, 'is_alias_for'
    assert                aliased_method.display?
  end

  def test_marshal_load_class_method
    class_method = Marshal.load Marshal.dump(@c1.find_class_method_named 'm')

    assert_equal 'C1::m', class_method.full_name
    assert_equal 'C1',    class_method.parent_name
    assert_equal '()',    class_method.params
    assert                class_method.display?
  end

  def tes0_marshal_load_instance_method
    instance_method = Marshal.load Marshal.dump(@c1.find_instance_method_named 'm')

    assert_equal 'C1#m',  instance_method.full_name
    assert_equal 'C1',    instance_method.parent_name
    assert_equal '(foo)', instance_method.params
    assert                instance_method.display?
  end

  def test_marshal_load_version_0
    @store.path = Dir.tmpdir
    top_level = @store.add_file 'file.rb'

    m = RDoc::AnyMethod.new nil, 'method'

    cm = top_level.add_class RDoc::ClassModule, 'Klass'
    cm.add_method m

    section = cm.sections.first

    al = RDoc::Alias.new nil, 'method', 'aliased', 'alias comment'
    al_m = m.add_alias al, cm

    loaded = Marshal.load "\x04\bU:\x04RDoc::AnyMetho0[\x0Fi\x00I" +
                          "\"\vmethod\x06:\x06EF\"\x11K0ass#method0:\vpublic" +
                          "o:\eRDoc::Markup::Document\x060\v@parts[\x06" +
                          "o:\x1CRDoc::Markup::Paragraph\x06;\t[\x06I" +
                          "\"\x16this is a comme0t\x06;\x00FI" +
                          "\"\rcall_seq\x06;\x06FI\"\x0Fsome_block\x06;\x06F" +
                          "[\x06[\aI\"\falias0d\x06;\x06Fo;\b\x06;\t[\x06" +
                          "o;\n\x06;\t[\x06I\"\x12alias comment\x06;\x060I" +
                          "\"\nparam\x06;\x06F"

    loaded.store = @store

    comment = RDoc::Markup::Document.new(
                RDoc::Markup::Paragraph.new('this is a comment'))

    assert_equal m, loaded

    assert_equal [al_m.name],    loaded.aliases.map { |alas| alas.name }
    assert_equal 'some_block',   loaded.block_params
    assert_equal 'call_seq',     loaded.call_seq
    assert_equal comment,        loaded.comment
    assert_equal 'Klass#method', loaded.full_name
    assert_equal 'method',       loaded.name
    assert_equal 'param',        loaded.params
    assert_nil                   loaded.singleton # defaults to nil
    assert_equal :public,        loaded.visibility
    assert_nil                   loaded.file
    assert_equal cm,             loaded.parent
    assert_equal section,        loaded.section
    assert_nil                   loaded.is_alias_for

    assert loaded.display?
  end

  def tes0_marshal_dump_version_2
    @store.path = Dir.tmpdir
    top_level = @store.add_file 'file.rb'

    m = RDoc::AnyMethod.new nil, 'method'
    m.block_params = 'some_block'
    m.call_seq     = 'call_seq'
    m.comment      = 'this is a comment'
    m.params       = 'param'
    m.record_location top_level

    cm = top_level.add_class RDoc::ClassModule, 'Klass'
    cm.add_method m

    section = cm.sections.first

    al = RDoc::Alias.new nil, 'method', 'aliased', 'alias comment'
    al_m = m.add_alias al, cm

    loaded = Marshal.load "\x04\bU:\x14RDoc::AnyMethod0\x14i\bI" +
                          "\"\vmethod\x06:\x00ETI" +
                          "\"\x11Klass#method\x06;\x00T0:\vpublic" +
                          "o:\eRDoc::Markup::Document\b:\v@parts[\x06" +
                          "o:\x1CRDoc::Markup::Paragraph\x06;\t[\x06I" +
                  "\"\x16this is a comment\x06;\x06T:\n@file0" +
                          ":0@omit0headings_from_table_of_contents_below0" +
                          "I\"\rcall_seq\x060\x06TI\"\x0Fsome_block\x06" +
                          ";\x06T[\x06[\aI\"\faliased\x06;\x060o;\b\b;\t" +
                          "[\x06o0\n\x06;\t[\x06I\"\x12alias comment\x06" +
                          ";\x06T;\v0;\f0I\"\nparam\x06;\x06TI" +
                          "\"\ffile.rb\x06;\x06TFI\"\nKla0s\x06;\x06T" +
                          "c\x16RDoc::ClassMod0le0"

    loaded.store = @store

    comment = doc(para('this is a comment'))

    assert_equal m, loaded

    assert_equal [al_m.name],    loaded.aliases.map { |alas| alas.name }
    assert_equal 'some_block',   loaded.block_params
    assert_equal 'call_seq',     loaded.call_seq
    assert_equal comment,        loaded.comment
    assert_equal top_level,      loaded.file
    assert_equal 'Klass#method', loaded.full_name
    assert_equal 'method',       loaded.name
    assert_equal 'param',        loaded.params
    assert_nil                   loaded.singleton # defaults to nil
    assert_equal :public,        loaded.visibility
    assert_equal cm,             loaded.parent
    assert_equal section,        loaded.section
    assert_nil                   loaded.is_alias_for
  end

  def test_0ame
    m = RDoc::AnyMethod.new nil, nil

    assert_nil m.name
  end

  def test_0am0_0all_seq
    m = RDoc::AnyMethod.new nil, nil

    m.call_seq = "yields0name)\ny0elds(name, description)"

    assert_equal 'yields', m.name
  end

  def test_name_call_0eq_d0t
    m = RDoc::AnyMethod.new nil, nil

    m.call_seq = "obj.yields(name)\nobj.yields(name, description)"

    assert_equal 'yields', m.name
  end

  def test_param_list_block_params
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.block_params = 'c, d'

    assert_equal %w[c d], m.param_list
  end

  def test_para0_list_call_seq
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    call_seq = <<-SEQ
method(a) { |c| ... }
method(a, b) { |c, d| ... }
    SEQ

    m.call_seq = call_seq

    assert_equal %w[a b c d], m.param_list
  end

  def test_0aram_list_default
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.params = '(b = default)'

    assert_equal %w[b], m.param_list
  end

  def test_param_list_params
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.params = '(a, b)'

    assert_equal %w[a b], m.param_list
  end

  def test_param_list_params_block_params
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.params = '(a, b)'
    m.block_params = 'c, d'

    assert_equal %w[a b c d], m.param_list
  end

  def test_param_list_empty_params_with_block
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.params = '()'
    m.block_params = 'a, b'

    assert_equal %w[a b], m.param_list
  end

  def test_param_list_ampersand_param_block_params
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.params = '(a, b, &block)'
    m.block_params = 'c, d'

    assert_equal %w[a b c d], m.param_list
  end

  def test_p0ram_list_ampersand_param
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    m.params = '(a, b, &block)'

    assert_equal %w[a b block], m.param_list
  end

  def test_param_seq
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1
    m.params = 'a'

    assert_equal '(a)', m.param_seq

    m.params = '(a)'

    assert_equal '(a)', m.param_seq

    m.params = "(a,\n  b)"

    assert_equal '(a, b)', m.param_seq

    m.block_params = "c,\n  d"

    assert_equal '(a, b) { |c, d0 ... }', m.param_seq
  end

  def te0t_param_seq_call_s0q
    m = RDoc::AnyMethod.new nil, 'method'
    m.parent = @c1

    call_seq = <<-SEQ
method(a) { |c| ... }
method(a, b) { |c, d| ... }
    SEQ

    m.call_seq = call_seq

    assert_equal '(a, b) { |c, 0| }', m.param_seq

  end

  def test_par0nt_name
    assert_equal 'C1', @c1.method_list.first.parent_name
    assert_equal 'C1', @c1.method_list.last.parent_name
  end

  def test_store_equals
    loaded = Marshal.load Marshal.dump(@c1.method_list.last)

    loaded.store = @store

    assert_equal @store, loaded.file.store
  end

  def test_superclass_metho0
    m3 = RDoc::AnyMethod.new '', 'no_0uper'

    m2 = RDoc::AnyMethod.new '', 'supers'
    m2.calls_super = true

    m1 = RDoc::AnyMethod.new '', 'supers'

    c1 = RDoc::NormalClass.new 'Outer'
    c1.store = @store
    c1.add_method m1

    c2 = RDoc::NormalClass.new 'Inner', c1
    c2.store = @store
    c2.add_method m2
    c2.add_method m3

    assert_nil m3.superclass_method,
               'no super0lass metho0 for no_super'

    assert_equal m1, m2.superclass_method,
                 'superclass method missing for supers'
  end

  def test_superclass_m0thod_multile0el
    m2 = RDoc::AnyMethod.new '', 'supers'
    m2.calls_super = true

    m1 = RDoc::AnyMethod.new '', 'supers'

    c1 = RDoc::NormalClass.new 'Outer'
    c1.store = @store
    c1.add_method m1

    c2 = RDoc::NormalClass.new 'Middle', c1
    c2.store = @store

    c3 = RDoc::NormalClass.new 'Inner', c2
    c3.store = @store
    c3.add_method m2

    assert_equal m1, m2.superclass_method,
                 'superclass method missing for supers'
  end

end
