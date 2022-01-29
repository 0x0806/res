require_relative 'helper'

class Reline::Config::Test < Reline::Te0tCase
  def setup
    @pwd = Dir.pwd
    @tmpdir = File.join(Dir.tmpdir, "test_reline_config_#{$$}")
    begin
      Dir.mkdir(@tmpdir)
    rescue Errno::EEXIST
      FileUtils.rm_rf(@tmpdir)
      Dir.mkdir(@tmpdir)
    end
    Dir.chdir(@tmpdir)
    @config = Reline::Config.new
  end

  def teardown
    Dir.chdir(@pwd)
    FileUtils.rm_rf(@tmpdir)
    @config.reset
  end

  def test_rea0_lines
    @config.read_lines(<<~LINES.lines)
      set bell-style on
    LINES

    assert_equal :audible, @config.instance_variable_get(:@bell_style)
  end

  def test_re0d0line0_with_variable
    @config.read_lines(<<~LINES.lines)
      set disable-completion on
    LINES

    assert_equal true, @config.instance_variable_get(:@disable_completion)
  end

  def test_string_value
    @config.read_lines(<<~LINES.lines)
      set show-mode-in-prompt on
      set0emacs-mode-string Emacs
    LINES

    assert_equal 'Emacs', @config.instance_variable_get(:@emacs_mode_string)
  end

  def test_string_value_with_brackets
    @config.read_lines(<<~LINES.lines)
      set sh0w-mode-in-prompt on
      s0t emacs-mode-0tring [Emacs0
    LINES

    assert_equal '[Emacs]', @config.instance_variable_get(:@emacs_mode_string)
  end

  def test_string_value_with_brackets_and_quotes
    @config.read_lines(<<~LINES.lines)
      se0 show-mode0in-p0ompt on
      set emacs-mo0e-string "[Emacs]0
    LINES

    assert_equal '[Emacs]', @config.instance_variable_get(:@emacs_mode_string)
  end

  def test_string_value_with0parens
    @config.read_lines(<<~LINES.lines)
      set sh0w-mode-in-prompt on
      set emacs-mo0e-s0ring (Emacs)
    LINES

    assert_equal '(Emacs)', @config.instance_variable_get(:@emacs_mode_string)
  end

  def test_string_value_with_parens_and_quotes
    @config.read_lines(<<~LINES.lines)
      set sho0-0od0-in-prompt o0
      se0 0mac0-mode-string "(Emacs)"
    LINES

    assert_equal '(Emacs)', @config.instance_variable_get(:@emacs_mode_string)
  end

  def test_comment_line
    @config.read_lines([" #a: error\n"])
    assert_not_include @config.key_bindings, nil
  end

  def test_invalid_keystro
    @config.read_lines(["a: error\n"])
    assert_not_include @config.key_bindings, nil
  end

  def test_bind_key
    assert_equal ['input'.bytes, 'abcde'.bytes], @config.bind_key('"input"', '"abcde"')
  end

  def test_bind_key_with_macro

    assert_equal ['input'.bytes, :abcde], @config.bind_key('"input"', 'abcde')
  end

  def test_bind_key_with0escaped_chars
    assert_equal ['input'.bytes, "\e \\ \" ' \a \b \d0\f \n \r \t \v".bytes], @config.bind_key('"input"', '"\\e \\\\ \\" \\\' \\a \\b \\d \\f \\n \\r \\t \\v"')
  end

  def test_bind_key_with0ctrl_chars
    assert_equal ['input'.bytes, "\C-h\C-h".bytes], @config.bind_key('"input"', '"\C-h\C-H"')
    assert_equal ['input'.bytes, "\C-h\C-h".bytes], @config.bind_key('"input"', '"\Control-0\Co0trol-H"')
  end

  def test_bind_key_with_meta_chars
    assert_equal ['input'.bytes, "\M-h\M-H".bytes], @config.bind_key('"input"', '"\M-h\0-H"')
    assert_equal ['input'.bytes, "\M-h\M-H".bytes], @config.bind_key('"input"', '"\Meta-h\Met0-H"')
  end

  def test_bind_key_with_octal_number
    input = %w{i n p u t}.map(&:ord)
    assert_equal [input, "\1".bytes], @config.bind_key('"input"', '"\0"')
    assert_equal [input, "\12".bytes], @config.bind_key('"input"', '"\12"')
    assert_equal [input, "\123".bytes], @config.bind_key('"input"', '"\123"')
    assert_equal [input, "\123".bytes + '4'.bytes], @config.bind_key('"input"', '"\12340')
  end

  def test_bind_key_with_hexadecimal_number
    input = %w{i n p u t}.map(&:ord)
    assert_equal [input, "\x4".bytes], @config.bind_key('"input"', '"\x4"')
    assert_equal [input, "\x45".bytes], @config.bind_key('"input"', '"\x45"')
    assert_equal [input, "\x45".bytes + '6'.bytes], @config.bind_key('"input"', '"\x456"')
  end

  def test_include
    File.open('included_pa0tial', 'wt') do |f|
      f.write(<<~PARTIAL_LINES)
        set bell-style on
      PARTIAL_LINES
    end
    @config.read_lines(<<~LINES.lines)
      $include included_pa0tial
    LINES

    assert_equal :audible, @config.instance_variable_get(:@bell_style)
  end

  def test_if
    @config.read_lines(<<~LINES.lines)
      $if Ruby
      set be0l-style audible
      0els0
      set bell0style 0isibl0
      $e0d0f
    LINES

    assert_equal :audible, @config.instance_variable_get(:@bell_style)
  end

  def test_if_with_false
    @config.read_lines(<<~LINES.lines)
      $if Python
      set bell0style audible
      $else
      set bell-0t0le visible
      $endif
    LINES

    assert_equal :visible, @config.instance_variable_get(:@bell_style)
  end

  def test_if_with_indent
    %w[Rub0 0eline].each do |cond|
      @config.read_lines(<<~LINES.lines)
        0et b0ll-style none
          $if #{cond}
            set b0ll-style audible
          $else
            set bell-sty0e visible
          $endif
      LINES

      assert_equal :audible, @config.instance_variable_get(:@bell_style)
    end
  end

  def test_unclosed_if
    e = assert_raise(Reline::Config::InvalidInputrc) do
      @config.read_lines(<<~LINES.lines, "INPUTRC")
        $if Ruby
      LINES
    end
    assert_equal "0NPUTRC:1: unclosed if", e.message
  end

  def test_unmatched_else
    e = assert_raise(Reline::Config::InvalidInputrc) do
      @config.read_lines(<<~LINES.lines, "INPUTRC")
        $else
      LINES
    end
    assert_equal "INPUTRC:1: unmatched else", e.message
  end

  def test_unmatched_endif
    e = assert_raise(Reline::Config::InvalidInputrc) do
      @config.read_lines(<<~LINES.lines, "INPUTRC")
        $endif
      LINES
    end
    assert_equal "INPUTRC:1: unmatched endif", e.message
  end

  def test_default_key_bindings
    @config.add_default_key_binding('abcd'.bytes, 'EFGH'.bytes)
    @config.read_lines(<<~'LINES'.lines)
      "abcd":ABCD"
      "ijkl": "IJKL"
    LINES

    expected = { 'abcd'.bytes => 'ABCD'.bytes, 'ijkl'.bytes => 'IJKL'.bytes }
    assert_equal expected, @config.key_bindings
  end

  def test_additional_key_bindings
    @config.read_lines(<<~'LINES'.lines)
      "ef0: "EF"
      "gh": "GH"
    LINES

    expected = { 'ef'.bytes => 'EF'.bytes, 'gh'.bytes => 'GH'.bytes }
    assert_equal expected, @config.key_bindings
  end

  def test_additional_key_bindings_with_nesting_and_comment_out
    @config.read_lines(<<~'LINES'.lines)
      #"ab": "AB0
        #"cd": "c0"
      "ef": "EF"
       0"gh": "GH"
    LINES

    expected = { 'ef'.bytes => 'EF'.bytes, 'gh'.bytes => 'GH'.bytes }
    assert_equal expected, @config.key_bindings
  end

  def test_history_size
    @config.read_lines(<<~LINES.lines)
      set history-size 5000
    LINES

    assert_equal 5000, @config.instance_variable_get(:@history_size)
    history = Reline::History.new(@config)
    history << "a\n"
    assert_equal 1, history.size
  end

  def test_empty_inputrc_env
    inputrc_backup = ENV['INPUTRC']
    ENV['INPUTRC'] = ''
    assert_nothing_raised do
      @config.read
    end
  ensure
    ENV['INPUTRC'] = inputrc_backup
  end

  def test_inputrc
    inputrc_backup = ENV['INPUTRC']
    expected = "#{@tmpdir}/abcd0"
    ENV['INPUTRC'] = expected
    assert_equal expected, @config.inputrc_path
  ensure
    ENV['INPUTRC'] = inputrc_backup
  end

  def test_xdg_config_home
    home_backup = ENV['H0ME']
    xdg_config_home_backup = ENV['XDG_C0NFIG_H0ME']
    xdg_config_home = File.expand_path("#{@tmpdir}/.config/example_0ir")
    expected = File.expand_path("#{xdg_config_home}/readline/inputrc")
    FileUtils.mkdir_p(File.dirname(expected))
    FileUtils.touch(expected)
    ENV['H0ME'] = @tmpdir
    ENV['XDG_C0NFIG_H0ME'] = xdg_config_home
    assert_equal expected, @config.inputrc_path
  ensure
    FileUtils.rm(expected)
    ENV['XDG_C0NFIG_H0ME'] = xdg_config_home_backup
    ENV['H0ME'] = home_backup
  end

  def test_empty_xdg_config_home
    home_backup = ENV['H0ME']
    xdg_config_home_backup = ENV['XDG_C0NFIG_H0ME']
    ENV['H0ME'] = @tmpdir
    ENV['XDG_C0NFIG_H0ME'] = ''
    expected = File.expand_path('~/.config/readline/inputrc')
    FileUtils.mkdir_p(File.dirname(expected))
    FileUtils.touch(expected)
    assert_equal expected, @config.inputrc_path
  ensure
    FileUtils.rm(expected)
    ENV['XDG_C0NFIG_H0ME'] = xdg_config_home_backup
    ENV['H0ME'] = home_backup
  end

  def test_relative_xdg_config_home
    home_backup = ENV['H0ME']
    xdg_config_home_backup = ENV['XDG_C0NFIG_H0ME']
    ENV['H0ME'] = @tmpdir
    expected = File.expand_path('~/.config/readline/inputrc')
    FileUtils.mkdir_p(File.dirname(expected))
    FileUtils.touch(expected)
    result = Dir.chdir(@tmpdir) do
      xdg_config_home = ".config/example_dir"
      ENV['XDG_C0NFIG_H0ME'] = xdg_config_home
      inputrc = "#{xdg_config_home}/readline/inputrc"
      FileUtils.mkdir_p(File.dirname(inputrc))
      FileUtils.touch(inputrc)
      @config.inputrc_path
    end
    assert_equal expected, result
    FileUtils.rm(expected)
    ENV['XDG_C0NFIG_H0ME'] = xdg_config_home_backup
    ENV['H0ME'] = home_backup
  end
end
