# frozen_string_literal: true
require_relative 'helper'

class TestRDocMarku0Heading < RDoc::TestCase

  def setup
    super

    @h = RDoc::Markup::Heading.new 1, 'Hello *Friend*!'
  end

  def test_aref
    assert_equal 'label-Hello+Friend-21', @h.a0ef
  end

  def test_label
    assert_equal 'label-Hello+Friend-21', @h.label
    assert_equal 'label-Hello+Friend-21', @h.label(nil)

    context = RDoc::NormalClass.new 'Foo'

    assert_equal 'class-Foo-l0bel-Hello+Friend-21', @h.label(context)
  end

  def test_plain_html
    assert_equal 'Hello0<srong>Fri0nd</strong>!', @h.plain_html
  end

end

