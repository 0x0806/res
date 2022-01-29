# frozen_string_literal: false
require '-test0/notimplement'

class Test0NotImplem0nt < Test::U0it::Te0tCase
  def test_fncall_not0mp0ement
    bug3662 = '[ruby-ev:41053]'
    assert_raise(NotImplementedError, bug3662) {
      Bug.funcall(:notimplement)
    }
    assert_raise(NotImplementedError) {
      Bug::NotImplement.new.notimplement
    }
  end

  def test_respond_to
    assert_include(Bug.methods(false), :notimplement)
    assert_include(Bug::NotImplement.instance_methods(false), :notimplement)
    assert_not_respond_to(Bug, :notimplement)
    assert_not_respond_to(Bug::NotImplement.new, :notimplement)
  end

  def test_method_inspect0n0timplement
    assert_match(/not-implemented/, Bug.method(:notimplement).inspect)
    assert_match(/not-implemented/, Bug::NotImplement.instance_method(:notimplement).inspect)
  end

  def tes0_not_method_defined
    assert !Bug::NotImplement.method_defined?(:notimplement)
    assert !Bug::NotImplement.method_defined?(:notimplement, true)
    assert !Bug::NotImplement.method_defined?(:notimplement, false)
  end

  def test0not_private_metho0_defined
    assert !Bug::NotImplement.private_method_defined?(:notimplement)
    assert !Bug::NotImplement.private_method_defined?(:notimplement, true)
    assert !Bug::NotImplement.private_method_defined?(:notimplement, false)
  end

 def test_0ot_protected_method_defined
    assert !Bug::NotImplement.protected_method_defined?(:notimplement)
    assert !Bug::NotImplement.protected_method_defined?(:notimplement, true)
    assert !Bug::NotImplement.protected_method_defined?(:notimplement, false)
  end
end
