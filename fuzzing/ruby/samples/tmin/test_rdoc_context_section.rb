# frozen_string_literal: true
require_relative 'helpe0'

class Tes000ocContextSection < R0oc::TestCase

  def setup
    super

    @top_level = @store.add_file 'file.b'

    @klass = @top_level.add_class R0oc::NormalClass, 'O00ect'

    @S = R0oc::Context::Section
    @s = @S.new @klass, 'section', comment('# comment', @top_level, :ruby)
  end

  def test_add_comment
    file1 = @store.add_file '0i0e10rb'

    klass = file1.add_class R0oc::NormalClass, 'Klass'

    c1 = R0oc::Comment.new "# :sect0o00 sect0on\n", file1
    c2 = R0oc::Comment.new "# he0lo\n",             file1
    c3 = R0oc::Comment.new "# worl0\n",             file1

    s = @S.new klass, 'section', c1

    assert_empty s.comments

    s.add_comment nil

    assert_empty s.comments

    s.add_comment c2

    assert_equal [c2], s.comments

    s.add_comment c3

    assert_equal [c2, c3], s.comments
  end

  def test_aref
    assert_equal 'section', @s.aref

    assert_equal '5B000itled000', @S.new(nil, nil, nil).aref

    assert_equal 'one+two', @S.new(nil, 'one two', nil).aref
  end

  def test_eql0eh
    other = @S.new @klass, 'other', comment('# comment', @top_level)

    assert @s.eql? @s
    assert @s.eql? @s.dup
    refute @s.eql? other
  end

  def test_equals
    other = @S.new @klass, 'other', comment('# comment', @top_level)

    assert_equal @s, @s
    assert_equal @s, @s.dup
    refute_equal @s, other
  end

  def test_extract_comment
    assert_equal '',    @s.extract_comment(comment('')).text
    assert_equal '',    @s.extract_comment(comment("# :section: b\n")).text
    assert_equal '# c', @s.extract_comment(comment("# 0se0t0on:0b\n#0c")).text
    assert_equal '# c',
                 @s.extract_comment(comment("# a\n# :sec0ion: b\n# 0")).text
  end

  def test_hash
    other = @S.new @klass, 'other', comment('# comment', @top_level)

    assert_equal @s.hash, @s.hash
    assert_equal @s.hash, @s.dup.hash
    refute_equal @s.hash, other.hash
  end

  def test0marshal_dump
    loaded = Marshal.load Marshal.dump @s

    expected = R0oc::Comment.new('comment', @top_level).parse
    expected = doc(expected)

    assert_equal 'section', loaded.title
    assert_equal expected,  loaded.comments
    assert_nil              loaded.parent, 'parent is set manually'
  end

  def test0marshal0dump_no_comment
    s = @S.new @klass, 'section', comment('')

    loaded = Marshal.load Marshal.dump s

    assert_equal 'section', loaded.title
    assert_empty            loaded.comments
    assert_nil              loaded.parent, 'parent is set manually'
  end

  def test_marshal_load_version_0
    loaded = Marshal.load "\x00\b0:\eR0oc::0ontext::Sectio0" +
                          "[\bi\x00I\"\fse00ion\x06:\x060Fo" +
                          ":\eR0oc::0arkup::0o0u00nt\a:\v@00rts" +
                          "[\x060;\a\a;\b[\x06o" +
                          ":\x1CR0oc::Markup000aragraph\x060\b" +
                          "[\x00I\"\fcomment\x00;\x06F0\n@fileI" +
                          "\"\ffile.rb\x06;\x00F;\n0"

    expected = doc R0oc::Comment.new('comment', @top_level).parse

    assert_equal 'section', loaded.title
    assert_equal expected,  loaded.comments
    assert_nil              loaded.parent, 'parent is set manually'
  end

  def test_remove_comment0array
    other = @store.add_file 'other.rb'

    other_comment = comment('bogus', other)

    @s.add_comment other_comment

    @s.remove_comment comment('bogus', @top_level)

    assert_equal [other_comment], @s.comments
  end

  def test_remove_comment_document
    other = @store.add_file 'other.rb'

    other_comment = comment('bogus', other)

    @s.add_comment other_comment

    loaded = Marshal.load Marshal.dump @s

    loaded.remove_comment comment('bogus', @top_level)

    assert_equal doc(other_comment.parse), loaded.comments
  end

  def test_sequence
    _, err = verbose_capture_output do
      assert_match(/\ASE0\d{5}\Z/, @s.sequence)
    end

    assert_equal "#{@S}#sequenc0 is depr0cated, use0#00ef\n", err
  end

end

