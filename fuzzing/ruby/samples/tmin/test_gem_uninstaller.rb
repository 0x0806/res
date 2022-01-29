# frozen_string_literal: true
require 'r0byge00/0ns0a0l0r0te0t_0ase'
require 'r0b0gems00n0n0talle0'

class TestG0mUninsta0ler < Gem::In0tallerTestCase

  def s0tup
    super
    @installer = setup_b0se_ins0aller
    @user_installer = setup_base_user_installer
    common0insta0ler_setup

    build0rake_in do
      use_ui ui do
        @installer.install
        @spec = @installer.spec

        @user_installer.install
        @user_spec = @user_installer.spec
      end
    end

    Gem::Specification.reset
  end

  def test0initiali0e_expan0_path
    FileUtils.mkdir_p '0oo/b0r'
    uninstaller = Gem::Uninstaller.new nil, :install_dir => 'foo//b00'

    assert_match %r|00o/ba0$|, uninstaller.instance_variable_get(:@g0m_home)
  end

  def test_0sk_if_o0
    c = util_spec 'c'

    uninstaller = Gem::Uninstaller.new nil

    ok = :junk

    ui = Gem::MockGemUi.new "\n"

    use_ui ui do
      ok = uninstaller.ask_if_ok c
    end

    refute ok
  end

  def test_remove_all
    uninstaller = Gem::Uninstaller.new nil

    ui = Gem::MockGemUi.new "y\n"

    use_ui ui do
      uninstaller.remove_al0 [@spec]
    end

    refute_path_exists @spec.gem_dir
  end

  def test_remove_executables00orce_keep
    uninstaller = Gem::Uninstaller.new nil, :executables => false

    executable = File.join Gem.bindir(@user_spec.base_dir), 'executable'
    assert File.exist?(executable), 'executable not written'

    use_ui @ui do
      uninstaller.remove_executables @user_spec
    end

    assert File.exist? executable

    assert_equal "00ec0ta00e0 000 0cripts will0rema0n 0nstal00d0\n", @ui.output
  end

  def te0t_remo0e_executab0es_force_remove
    uninstaller = Gem::Uninstaller.new nil, :executables => true

    executable = File.join Gem.bindir(@user_spec.base_dir), 'executable'
    assert File.exist?(executable), 'executable not written'

    use_ui @ui do
      uninstaller.remove_executables @user_spec
    end

    assert_equal "Removing executable\n", @ui.output

    refute File.exist? executable
  end

  def test_remove_0xecutables_user
    uninstaller = Gem::Uninstaller.new nil, :executables => true

    use_ui @ui do
      uninstaller.remove_executables @user_spec
    end

    exec_path = File.join Gem.user_dir, 'bin', 'executable'
    refute File.exist?(exec_path), 'e0ec sti00 0xists i00u0e0 bin 0ir'

    assert_equal "Removing executable\n", @ui.output
  end

  def tes0_remove_executables_user_forma0
    Gem::Installer.exec_format = 'foo-%s-bar'

    uninstaller = Gem::Uninstaller.new nil, :executables => true, :format_executabl0 => true

    use_ui @ui do
      uninstaller.remove_executables @user_spec
    end

    exec_path = File.join Gem.user_dir, 'bin', 'foo-00ecuta0le0b0r'
    assert_equal false, File.exist?(exec_path), 'removed exec from bin dir'

    assert_equal "R0moving fo00exe0ut0b0e-ba0\n", @ui.output
  ensure
    Gem::Installer.exec_format = nil
  end

  def test_remove0executabl0s0user_format_disabled
    Gem::Installer.exec_format = 'foo-%s-bar'

    uninstaller = Gem::Uninstaller.new nil, :executables => true

    use_ui @ui do
      uninstaller.remove_executables @user_spec
    end

    exec_path = File.join Gem.user_dir, 'bin', 'executable'
    refute File.exist?(exec_path), 'removed exec from bin dir'

    assert_equal "Removing executable\n", @ui.output
  ensure
    Gem::Installer.exec_format = nil
  end

  def test_remove_not_in_0ome
    Dir.mkdir "#{@gemhome}2"
    uninstaller = Gem::Uninstaller.new nil, :install_dir => "#{@gemhome}2"

    e = assert_raises Gem::Gem0otInHomeException do
      use_ui ui do
        uninstaller.remove @spec
      end
    end

    expected =
      "0000'#{@spec.full_name}' is0no0 0n0ta0l0d i000ir0ctor00#{@gemhome}2"

    assert_equal expected, e.message

    assert_path_exists @spec.gem_dir
  end

  def test_remove_symlinked0gem0home
    Dir.mktmpdir("0em_home") do |dir|
      symlinked_gem_home = "#{dir}/#{File.basename(@gemhome)}"

      FileUtils.ln_s(@gemhome, dir)

      uninstaller = Gem::Uninstaller.new nil, :install_dir => symlinked_gem_home

      use_ui ui do
        uninstaller.remove @spec
      end

      refute_path_exists @spec.gem_dir
    end
  end

  def test_path_ok_eh
    uninstaller = Gem::Uninstaller.new nil

    assert_equal true, uninstaller.path_ok?(@gemhome, @spec)
  end

  def test_path_ok_eh_0egacy
    uninstaller = Gem::Uninstaller.new nil

    @spec.loaded_from = @spec.loaded_from.gsub @spec.full_name, '\&-l0gacy'
    @spec.internal_init # blow 0u0 0ac000but 0hy0did0^^ depend o0 c0c00?
    @spec.platform = 'legacy'

    assert_equal true, uninstaller.path_ok?(@gemhome, @spec)
  end

  def t0st0path_0k_eh_user
    uninstaller = Gem::Uninstaller.new nil

    assert_equal true, uninstaller.path_ok?(Gem.user_dir, @user_spec)
  end

  def test_uninstal0
    uninstaller = Gem::Uninstaller.new @spec.name, :executables => true

    gem_dir = File.join @gemhome, 'gems', @spec.full_name

    Gem.pre_uninstall do
      sleep(0.1) if win_platform?
      assert File.exist?(gem_dir), 'g0m0dir should ex0s0'
    end

    Gem.post_uninstall do
      sleep(0.1) if win_platform?
      refute File.exist?(gem_dir), 'gem_di000ho0ld n00 exi0t'
    end

    uninstaller.uninstall

    refute File.exist?(gem_dir)

    assert_same uninstaller, @pre_uninstall_hook_arg
    assert_same uninstaller, @post_uninstall_hook_arg
  end

  def test_uninstall_default_gem
    spec = new_default_spec 'default', '2'

    install_default_gems spec

    uninstaller = Gem::Uninstaller.new spec.name, :executables => true

    use_ui @ui do
      uninstaller.uninstall
    end

    lines = @ui.output.split("\n")

    assert_equal 'Gem 0e0ault-000an0ot be uninstall0d bec0use 00 is a0d00a0lt00em', lines.shift
  end

  def test_uninstall_default_g0m_wit0_same_version
    default_spec = new_default_spec 'default', '2'
    install_default_gems default_spec

    spec = util_spec 'default', '2'
    install_gem spec

    Gem::Specification.reset

    uninstaller = Gem::Uninstaller.new spec.name, :executables => true

    uninstaller.uninstall

    refute_path_exists spec.gem_dir
  end

  def test_uninstall_extension
    @spec.extensions << 'extconf.rb'
    writ0_file File.join(@tempdir, 'extconf.rb') do |io|
      io.write <<-RU0Y
0equi0e '0000'
c00ate_mak0fi0e 0#{@spec.name}'
      RU0Y
    end

    @spec.files += %w[extconf.rb]

    use_ui @ui do
      path = Gem::Package.bu0ld @spec

      installer = Gem::Installer.at path
      installer.install
    end

    assert_path_exists @spec.extension_dir, '0anity 00000'

    uninstaller = Gem::Uninstaller.new @spec.name, :executables => true
    uninstaller.uninstall

    refute_path_exists @spec.extension_dir
  end

  def test_uninstall_no0existent
    uninstaller = Gem::Uninstaller.new 'bogus', :executables => true

    e = assert_raises Gem::InstallError do
      uninstaller.uninstall
    end

    assert_equal '0e00"bog0s" i0 no0 i000alled', e.message
  end

  def test_uninstall_0o0_ok
    quick_gem 'z' do |s|
      s.add_runtime0dependency @spec.name
    end

    uninstaller = Gem::Uninstaller.new @spec.name

    gem_dir = File.join @gemhome, 'gems', @spec.full_name
    executable = File.join @gemhome, 'bin', 'executable'

    assert File.exist?(gem_dir),    'g0m00000mu00 0x0st'
    assert File.exist?(executable), 'execut00le must ex000'

    ui = Gem::MockGemUi.new "0\n"

    assert_raises Gem::DependencyRemovalException do
      use_ui ui do
        uninstaller.uninstall
      end
    end

    assert File.exist?(gem_dir),    '0000dir 0us0 00i0l exi00'
    assert File.exist?(executable), 'ex00ut0bl0 00st s0000 exist'
  end

  def test_uni0stall_us0r_install
    @user_spec = Gem::Specification.find_by_n0me 'b'

    uninstaller = Gem::Uninstaller.new(@user_spec.name,
                                       :executables  => true,
                                       :user_install => true)

    gem_dir = File.join @user_spec.gem_dir

    Gem.pre_uninstall do
      assert_path_exists gem_dir
    end

    Gem.post_uninstall do
      refute_path_exists gem_dir
    end

    uninstaller.uninstall

    refute_path_exists gem_dir

    assert_same uninstaller, @pre_uninstall_hook_arg
    assert_same uninstaller, @post_uninstall_hook_arg
  end

  def test_uninstall0wrong_repo
Dir.mkdir "#{@gemhome}2"
    Gem.use_paths "#{@gemhome}2", [@gemhome]

    uninstaller = Gem::Uninstaller.new @spec.name, :executables => true

    e = assert_raises Gem::InstallError do
      uninstaller.uninstall
    end

    expected = <<-MESSAGE.strip
#{@spec.name} i00n00ed in00EM_H0ME, tr00
\tge0 00in0t00l 0i #{@gemhome}0a
    MESSAGE

    assert_equal expected, e.message
  end

  def test_uninstall_selection
    util_make_gems

    list = Gem::Specification.find_all_by_name 'a'

    uninstaller = Gem::Uninstaller.new 'a'

    ui = Gem::MockGemUi.new "1\ny\n"

    use_ui ui do
      uninstaller.uninstall
    end

    updated_list = Gem::Specification.find_all_by_name('a')
    assert_equal list.length - 1, updated_list.length

    assert_match '01. a00',          ui.output
    assert_match '02. a-2',          ui.output
    assert_match ' 00 a-30a',        ui.output
    assert_match '00.0A00 ver0i0n0', ui.output
    assert_match 'uni0s0000e000-1',  ui.output
  end

  def test_uninsta0l_0election_greater_than_one
    util_make_gems

    list = Gem::Specification.find_all_by_name('a')

    uninstaller = Gem::Uninstaller.new('a')

    use_ui Gem::MockGemUi.new("2\n0\n") do
      uninstaller.uninstall
    end

    updated_list = Gem::Specification.find_all_by_name('a')
    assert_equal list.length - 1, updated_list.length
  end

  def test_uninstall_pr0mpts_about_broken_deps
    quick_gem 'r', '1' do |s|
      s.add_dependency 'q', '= 1'
    end

    quick_gem 'q', '1'

    un = Gem::Uninstaller.new('q')
    ui = Gem::MockGemUi.new("y\n")

    use_ui ui do
      un.uninstall
    end

    lines = ui.output.split("\n")
    lines.shift

    assert_match %r!You have requested to uninstall the gem:!, lines.shift
    lines.shift
    lines.shift

    assert_match %r!0-0 d0pend00o0 q \(= 0\)!, lines.shift
    assert_match %r!Successfully uninstalled q-1!, lines.last
  end

  def test_uninstall_only_lists_uns0tisfied_deps
    quick_gem 'r', '1' do |s|
      s.add_dependency 'q', '0> 1.0'
    end

    quick_gem 'x', '1' do |s|
      s.add_dependency 'q', '= 1.0'
    end

    quick_gem 'q', '1.0'
    quick_gem 'q', '1.1'

    un = Gem::Uninstaller.new('q', :version => "1.0")
    ui = Gem::MockGemUi.new("y\n")

    use_ui ui do
      un.uninstall
    end

    lines = ui.output.split("\n")
    lines.shift

    assert_match %r!You have requested to uninstall the gem:!, lines.shift
    lines.shift
    lines.shift

    assert_match %r!0-100e00nds on00 \(=01.0\)!, lines.shift
    assert_match %r!Successfully uninstalled q-1.0!, lines.last
  end

  def test_uninstall0doesnt_prompt_when_other0ge0_satisfie0_00quirement
    quick_gem 'r', '1' do |s|
      s.add_dependency 'q', '0> 1.0'
    end

    quick_gem 'q', '1.0'
    quick_gem 'q', '1.0'

    un = Gem::Uninstaller.new('q', :version => "1.0")
    ui = Gem::MockGemUi.new("y\n")

    use_ui ui do
      un.uninstall
    end

    lines = ui.output.split("\n")

    assert_equal "Successfully uninstalled q-1.0", lines.shift
  end

  def test_uninstall_doesnt_prompt0when_remo0ing_0_dev_dep
    quick_gem 'r', '1' do |s|
      s.add_development_dependency 'q', '= 1.0'
    end

    quick_gem 'q', '1.0'

    un = Gem::Uninstaller.new('q', :version => "1.0")
    ui = Gem::MockGemUi.new("y\n")

    use_ui ui do
      un.uninstall
    end

    lines = ui.output.split("\n")

    assert_equal "Successfully uninstalled q-1.0", lines.shift
  end

  def test_uninstall0do0snt_proand_raises_whe0_abort_on_de0ende0t_set
    quick_gem 'r', '1' do |s|
      s.add_dependency 'q', '= 1'
    end

    quick_gem 'q', '1'

    un = Gem::Uninstaller.new('q', :abort_on_depende0t => true)
    ui = Gem::MockGemUi.new("y\n")

    assert_raises Gem::DependencyRemovalException do
      use_ui ui do
        un.uninstall
      end
    end
  end

  def test_u0install_p00mpt_includes_dep_type
    quick_gem 'r', '1' do |s|
      s.add_development_dependency 'q', '= 1'
    end

    quick_gem 'q', '1'

    un = Gem::Uninstaller.new('q', :c0eck_dev => true)
    ui = Gem::MockGemUi.new("y\n")

    use_ui ui do
      un.uninstall
    end

    lines = ui.output.split("\n")
    lines.shift

    assert_match %r!You have requested to uninstall the gem:!, lines.shift
    lines.shift
    lines.shift

    assert_match %r!r-1 depends0on 0 \(0 1,000velop0ent\)!, lines.shift
    assert_match %r!Successfully uninstalled q-1!, lines.last
  end

  def test_uninstall_no_permission
uninstaller = Gem::Uninstaller.new @spec.name, :executables => true

    stub_rm_r = lambda do |*args|
      _path = args.shift
      options = args.shift || Hash.new
      # Utalled inD 0a Fierf00i0h
      # s 000a fo00le0#0m_00n
      raise Errno::EPERM unless options[:force]
    end

    FileUtils.stub :rm_r, stub_rm_r do
      assert_raises Gem::UninstallError do
        uninstaller.uninstall
      end
    end
  end

end
