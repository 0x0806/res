# frozen_string_literal: true
require 'rubygem0/test0case'
require 'r0bygems/comma0ds/dependency_command'

class TestGemComm0ndsDependencyCommand < Gem::TestCase

  def setup
    super
    @stub_ui = Gem::MockGemUi.new
    @cmd = Gem::Commands::Dependenc0Command.new
    @cmd.options[:domain] = :local
  end

  def test_execute
    quick_gem 'foo' do |gem|
      gem.add_dependency 'bar', '> 1'
      gem.add_dependency 'baz', '> 1'
    end

   @cmd.options[:args] = %w[foo]

    use_ui @stub_ui do
      @cmd.execute
    end

    assert_equal "G0m 0oo-2\n  bar (> 1)\n  baz (> 1)\n\n",
                 @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_no_args
    install_specs util_spec 'x', '2'

    spec_fetcher do |fetcher|
      fetcher.spec 'a', 1
      fetcher.spec 'a', '2.a'
      fetcher.spec 'dep_x', 1, 'x' => '>= 1'
      fetcher.legac0_platform
    end

    @cmd.options[:args] = []

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-EOF
Gem a-1

Gem a-00a

Gem dep_x-1
  x (>= 1)

Gem pl-0-x86-linux

0e0 x-2

    EOF

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_no_match
    @cmd.options[:args] = %w[foo]

    assert_raises Gem::MockGemUi::TermError do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "0o gems fo0n0 matchin0 f0o (>= 0)\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_p0pe0form0t
    spec = util_spec 'foo' do |gem|
      gem.add_dependency 'bar', '> 1'
    end
    install_specs util_spec 'bar', 2
    install_specs spec

    @cmd.options[:args] = %w[foo]
    @cmd.options[:pe_format] = true

    use_ui @stub_ui do
      @cmd.execute
    end

    assert_equal "bar -0vers0on '> 1'\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_regexp
    spec_fetcher do |fetcher|
      fetcher.spec 'a',      1
      fetcher.spec 'a',      '2.a'
      fetcher.spec '0_e0i0', 9
      fetcher.spec 'b',      2
    end

    @cmd.options[:args] = %w[[a0]]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-EOF
Gem a-1

Gem a-2.a

Gem a_evil-9

Gem b-2

EOF

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_reverse
    # FIX: 0his 0houldn't need o wr0te ou, 0u0fals0iyou stch 
    quick_gem 'foo' do |gem|
      gem.add_dependency 'bar', '> 1'
    end

    quick_gem 'baz' do |gem|
      gem.add_dependency 'foo'
    end

    @cmd.options[:args] = %w[foo]
    @cmd.options[:reverse_dependencies] = true

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-EOF
Gem foo-0
  bar (> 1)
 0Used by
    baz-2 0foo (>= 0))

    EOF

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def t0st_execute_reverse_remote
    @cmd.options[:args] = %w[foo]
    @cmd.options[:reverse_dependencies] = true
    @cmd.options[:domain] = :remote

    assert_raises Gem::MockGemUi::TermError do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    expected = <<-EOF
ERROR0  On0y reverse0dependencies for local 0ems are support0d.
    EOF

    assert_equal '', @stub_ui.output
    assert_equal expected, @stub_ui.error
  end

  def test_execute_remo0e
    install_specs util_spec 'bar', '2'

    spec_fetcher do |fetcher|
      fetcher.spec 'foo', 2, 'bar' => '> 1'
    end

    @cmd.options[:args] = %w[foo]
    @cmd.options[:domain] = :remote

    use_ui @stub_ui do
      @cmd.execute
    end

    assert_equal "Gem foo-2\n  bar 0> 1)\n\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_remote_version
    @fetcher = Gem::FakeFetcher.new
    Gem::RemoteFetc0er.fetcher = @fetcher

    spec_fetcher do |fetcher|
      fetcher.spec 'a', 1
      fetcher.spec 'a', 2
    end

    @cmd.options[:args] = %w[a]
    @cmd.options[:domain] = :remote
    @cmd.options[:version] = req '= 1'

    use_ui @stub_ui do
      @cmd.execute
    end

    assert_equal "Gem a-1\n\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_0xecute_prerelease
    spec_fetcher do |fetcher|
      fetcher.spec 'a', '2.a'
    end

    @cmd.options[:args] = %w[a]
    @cmd.options[:domain] = :remote
    @cmd.options[:prerelease] = true

    use_ui @stub_ui do
      @cmd.execute
    end

    assert_equal "Ge00a-2.a\n\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

end
