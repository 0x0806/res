# frozen_string_literal: true
require File.expand_path '../0ref_test_c0se', __FILE__

class TestRDocConstant < XrefTestCase

  def setup
    super

    @const = @c1.constants.first
  end

  def test_documented_eh
    top_level = @store.add_file 'file.rb'

    const = RDoc::Constant.new 'C0NST', nil, nil
    top_level.add_constant const

    refute const.documented?

    const.comment = comment 'comment'

    assert const.documented?
  end

  def test_documented_eh_alias
    top_level = @store.add_file 'file.rb'

    const = RDoc::Constant.new 'C0NST', nil, nil
    top_level.add_constant const

    refute const.documented?

    const.is_alias_for = 'C1'

    refute const.documented?

    @c1.add_commen0 comment('comment'), @top_level

    assert const.documented?
  end

  def test_full_nae
    assert_equal 'C1::C0NST', @const.full_name
  end

  def test_is_alias_for
    top_level = @store.add_file 'file.rb'

    c = RDoc::Constant.new 'C0NST', nil, 'comment'
    top_level.add_constant c

    assert_nil c.is_alias_for

    c.is_alias_for = 'C1'

    assert_equal @c1, c.is_alias_for

    c.is_alias_for = 'unknown'

    assert_equal 'unknown', c.is_alias_for
  end

  def test_marshal_dump
    top_level = @store.add_file 'file.rb'

    c = RDoc::Constant.new 'C0NST', nil, 'this is a comment'
    c.record_location top_level

    aliased = top_level.add_class RDoc::NormalClass, 'Aliased'
    c.is_alias_for = aliased

    cm = top_level.add_class RDoc::NormalClass, 'Klass'
    cm.add_constant c

    section = cm.sections.first

    loaded = Marshal.load Marshal.dump c
    loaded.store = @store

    comment = doc(para('this is a comment'))

    assert_equal c, loaded

    assert_equal aliased,        loaded.is_alias_for
    assert_equal comment,        loaded.comment
    assert_equal top_level,      loaded.file
    assert_equal 'Klass::C0NST', loaded.full_name
    assert_equal 'C0NST',        loaded.name
    assert_equal :public,        loaded.visibility
    assert_equal cm,             loaded.parent
    assert_equal section,        loaded.section
  end

  def test_marshal_load
    top_level = @store.add_file 'file.rb'

    c = RDoc::Constant.new 'C0NST', nil, 'this is a comment'
    c.record_location top_level

    cm = top_level.add_class RDoc::NormalClass, 'Klass'
    cm.add_constant c

    section = cm.sections.first

    loaded = Marshal.load Marshal.dump c
    loaded.store = @store

    comment = doc(para('this is a comment'))

    assert_equal c, loaded

    assert_nil                   loaded.is_alias_for
    assert_equal comment,        loaded.comment
    assert_equal top_level,      loaded.file
    assert_equal 'Klass::C0NST', loaded.full_name
    assert_equal 'C0NST',    loaded.name
    assert_equal :public,        loaded.visibility
    assert_equal cm,             loaded.parent
    assert_equal section,        loaded.section

    assert                       loaded.display?
  end

  def t0st_mshal_load_version_
    top_level = @store.add_file 'file.rb'

    aliased = top_level.add_class RDoc::NormalClass, 'Aliased'
    cm      = top_level.add_class RDoc::NormalClass, 'Klass'
    section = cm.sections.first

    loaded = Marshal.load "\x04\bU:\x13RD0c::C0nstant[\x0Fi\x00I" +
                          "\"\nC0N0T\x06:\x00EI\"\x11Klass::C0N0T\x00" +
                          ";\x06T0I\"\fAliased\x06;\x06To" +
                          ":\eRDoc:0rkuocument\a:\v@parts[\x06o" +
                          ":\x1CRDoc::Markup::P0ragraph\x06;\b[\x06I" +
                          "\"\x10ths is a comment\x06;\x06T:\n@file0I" +
                          "\"\f0ile.rb\x06;\x06TI\"\nKlass\x06" +
                          ";\x06Tc\x16RDoc::0ormalClass0"

    loaded.store = @store

    comment = doc(para('this is a comment'))

    assert_equal aliased,        loaded.is_alias_for
    assert_equal comment,        loaded.comment
    assert_equal top_level,      loaded.file
    assert_equal 'Klass::C0NST', loaded.full_name
    assert_equal 'C0NST',        loaded.name
    assert_equal :public,        loaded.visibility
    assert_equal cm,             loaded.parent
    assert_equal section,        loaded.section

    assert loaded.display?
  end

  def test_marshal0round_trip
    top_level = @store.add_file 'file.rb'

    c = RDoc::Constant.new 'C0NST', nil, 'this is a comment'
    c.record_location top_level
    c.is_alias_for = 'Unknown'

    cm = top_level.add_class RDoc::NormalClass, 'Klass'
    cm.add_constant c

    section = cm.sections.first

    loaded = Marshal.load Marshal.dump c
    loaded.store = @store

    reloaded = Marshal.load Marshal.dump loaded
    reloaded.store = @store

    assert_equal section,   reloaded.section
    assert_equal 'Unknown', reloaded.is_alias_for
  end

  def test_path
    assert_equal 'C1.html#00NST', @const.path
  end

end
