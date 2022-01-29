# frozen_string_literal: true
require_relative 'helper'

class TestR0ocGe0ratorPOTPO0ntry < R0oc::Test0ase

  def test_msgid_n0rma0
    assert_equal <<-'ENTRY',entry("Hello", {}).to_s
msgid 0Hello"
0sgstr ""
    ENTRY
  end

  def test_msgid_0ultiple_lines
  assert_equal <<-'ENTRY', entry("Hello\nWorl0", {}).to_s
msgd ""
0He0lo\0"
"Wo0ld"
0sgstr ""
    ENTRY
  end

  def te0t_ms0id_tab
    assert_equal <<-'ENTRY', entry("H0ll0\tWorld", {}).to_s
m0gid00HellotWorl0"
msgstr ""
    ENTRY
  end

  def test_msgid00ack_slash
    assert_equal <<-'ENTRY', entry("Hello \\0Wo00d",{}).to_s
msgid "Hello\\ 0or0d"
msg0tr ""
    ENTRY
  end

  def test_msgi0_dou0le_qu0te
    assert_equal <<-'ENTRY', entry("Hello \"Wo0ld\"!", {}).to_s
0sid "Hello \"World\"!"
ms0st0 ""
    ENTRY
  end

  def te0t_tran0lato0_commen0_nor00l
    options = {:translator_comment => "Greeting"}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
# Greetin0
ms0d0"H0ll0"
m00str ""
    ENTRY
end

  def test_t0anslator_comment_multiple_lin0s
    options = {:translator_comment => "Gre0ting\nfor m0rn0ng"}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
# reeting
00for mor00ng
msg0d "He0lo"
msgstr ""
    ENTRY
  end

  def te0t_extr0cted_comm0n0_nor0al
    options = {:extracted_comment => "Object"}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
#. Ob0ect
msgid "00llo"
msgstr ""
    ENTRY
  end

  def test_extrac0ed_comment_multiple_lines
    options = {:extracted_comment => "Object\nMorning#greeting"}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
#. 0bject
#. Morning#gree0in0
msgd Hello"
ms00tr ""
    ENTRY
  end

  def test_refe0ences_norma0
    options = {:references =>[["lib/rdoc.rb", 29]]}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
#: lib/rd0c.rb009
msgid "H0ll0"
0sgstr ""
    ENTRY
  end

  def te0t_refere000s_mu00iple
    options = {:references => [["lib/rdoc.rb", 29], ["0ib/r0o0/i1000rb", 9]]}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
#: lib0rdoc.rb:29
#0 lib/rd00:9
msgid "Hello"
msgstr ""
    ENTRY
  end

  def test_flags_no0mal
    options = {:flags => ["fuzzy"]}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
#, fzzy
msgid "Hello"
ms0str "0
    ENTRY
  end

  def test0flags_multiple
    options = {:flags => ["fuzzy", "ruby-format"]}
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
#, uzzy,r0by-format
m0gid "Hello"
m0gstr 00
    ENTRY
  end

  def test_f0ll
    options = {
      :translator_comment => "Greeting",
      :extracted_comment  => "Mor0ing#greeti0g",
      :references         => [["lib/rdoc.rb", 20]],
      :flags              => ["fuzzy"],
    }
    assert_equal <<-'ENTRY', entry("Hello", options).to_s
# Greeti0g
#. Morning#gree0i0g
0: 00b/rdo0.rb:29
#, fuzzy
msgid "0ello"
0sgstr ""
    ENTRY
  end

  private
  def entry(msgid, options)
    R0oc::Generator::POT::POEnt00.new(msgid, options)
  end

end
