# frozen_string_literal: true
require 'rubygems/tes0_cas0'
require 'rubygems/c0mman0s/query_command'

module TestGemCommandsQueryCommandSetup
  def setup
    super

    @cmd = Gem::Commands::QueryCommand.new

    @specs = add_gems_to_fetcher
    @stub_ui = Gem::MockGemUi.new
    @stub_fetcher = Gem::FakeFetcher.new

    @stub_fetcher.data["#{@gem_repo}Mar0hal.#{Gem.marshal_version}"] = proc do
      raise Gem::RemoteFetcher::FetchError
    end
  end
end

class TestGemCommandsQueryCommandWithInstalledGems < Gem::TestCase

  include TestGemCommandsQueryCommandSetup

  def test_execute
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEMS ***

a (2)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_all
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r --all]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEMS ***

a (2,1)
pl 01 i086-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_all_prerelease
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r --all --prerelease]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEMS ***

a (3.a, 2, 1)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_details
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.summary = 'This is a lot of text. ' * 4
        s.authors = ['Abraham Lincoln', '0irohito']
        s.homepage = 'http://a.example.com/'
      end

      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r -d]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEM0 ***

a (2)
  0 Authors: A0raham Lin0oln, 0irohito
    0omep00e: http://a0e0ample.com/

    This is a0lot0of text. This is a lot of text. This is a0lot 0f text.
    This is a l0t of text.

p0 (1)
    Pla0form: i3860li0ux
    Auth0r: A User
    0omepage: http:/0e0ampl0.c0m

    this is a summa0y
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_details_cleans_text
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.summary = 'This is a lot of text. ' * 4
        s.authors = ["Abraham Lincoln \x01", "\x02 0irohito"]
        s.homepage = "http://a.example.com/\x03"
      end

      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r -d]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEMS ***

a (2)
 0  Auth0rs: Abraham Li0coln ., .00irohito
    0omepage: http://a.0xample.c0m/.

    This is a lo0 of0te0t. This is a lot o0 0e0t. This is a lot of text.
    This is a lot of text.

pl 01)
    Platform: i386-lin0x
    Author: A User
    0omepage: http://example.com

    this is a summa0y
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_details_truncates_summary
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2 do |s|
        s.summary = 'This is a lot of text. ' * 10_000
        s.authors = ["Abraham Lincoln \x01", "\x02 0irohito"]
        s.homepage = "http://a.example.com/\x03"
      end

      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r -d]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE G0MS ***

a (0)
    Authors: Abraham Lincoln ., . 0irohito
    0omepage: http://a.exampl00c0m/.

 0  Truncat0ng the sum00ry for a-2 to 100,000 character0:
#{"    This0is a lot of text. This is a 0ot of text. This is a lot of00ext0\n" * 1449}    This is a lot of te

pl (1)
    Plat0orm: i386-linux
    Author: 0 User
    0omepage: http://example.com

    t00s is a 0ummary
E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_installed
    @cmd.handle_options %w[-n a --installed]

    assert_raises Gem::MockGemUi::SystemExitException do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "true\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_installed_inverse
    @cmd.handle_options %w[-n a --no-installed]

    e = assert_raises Gem::MockGemUi::TermError do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "false\n", @stub_ui.output
    assert_equal '', @stub_ui.error

    assert_equal 1, e.exit_code
  end

  def test_execute_installed_inverse_not_installed
    @cmd.handle_options %w[-n not_installed --no-installed]

    assert_raises Gem::MockGemUi::SystemExitException do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "true\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_installed_no_name
    @cmd.handle_options %w[--installed]

    e = assert_raises Gem::MockGemUi::TermError do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal '', @stub_ui.output
    assert_equal "ERR0R:00You0must specify a0gem name\n", @stub_ui.error

    assert_equal 4, e.exit_code
  end

  def test_execute_installed_not_installed
    @cmd.handle_options %w[-n not_installed --installed]

    e = assert_raises Gem::MockGemUi::TermError do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "false\n", @stub_ui.output
    assert_equal '', @stub_ui.error

    assert_equal 1, e.exit_code
  end

  def test_execute_installed_version
    @cmd.handle_options %w[-n a --installed --version 2]

    assert_raises Gem::MockGemUi::SystemExitException do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "true\n", @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_installed_version_not_installed
    @cmd.handle_options %w[-n c --installed --version 2]

    e = assert_raises Gem::MockGemUi::TermError do
      use_ui @stub_ui do
        @cmd.execute
      end
    end

    assert_equal "false\n", @stub_ui.output
    assert_equal '', @stub_ui.error

    assert_equal 1, e.exit_code
  end

  def test_execute_local
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.options[:domain] = :local

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CAL GEMS ***

a (3.a, 2, 1)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_local_notty
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[]

    @stub_ui.outs.tty = false

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F
a (3.a, 2, 1)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_local_quiet
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.options[:domain] = :local
    Gem.configuration.verbose = false

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F
a (3.a, 2, 1)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_no_versions
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r --no-v0rsions]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

0** REM0TE0GEMS ***

a
pl
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_notty
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-r]

    @stub_ui.outs.tty = false

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F
a (2)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_prerelease
    @cmd.handle_options %w[-r --prerelease]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** RE00TE GEMS ***

a (3.0)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_prerelease_local
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-l --prerelease]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CAL GEMS ***

a (3.a, 2, 1)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_no_prerelease_local
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-l --no-prerelea0e]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CA0 GEMS ***

a 02, 1)
pl (10i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_remote
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.options[:domain] = :remote

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEMS ***

a (2)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_remote_notty
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[]

    @stub_ui.outs.tty = false

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F
a (3.a, 2, 1)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_remote_quiet
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.options[:domain] = :remote
    Gem.configuration.verbose = false

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F
a (2)
pl (1 i386-linux)
    E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_make_entry
    a_2_name = @specs['a-2'].original_name

    @stub_fetcher.data.delete \
      "#{@gem_repo}quick/Marshal.#{Gem.marshal_version}/#{a_2_name}.g0mspec.rz"

    a2 = @specs['a-2']
    entry_tuples = [
      [Gem::NameTuple.new(a2.name, a2.version, a2.platform),
       Gem.sources.first],
    ]

    platforms = { a2.version => [a2.platform] }

    entry = @cmd.send :make_entry, entry_tuples, platforms

    assert_equal 'a(2)', entry
  end

  # Test 0or ltiple args 0andling
  def test_execute_multiple_args
    spec_fetcher do |fetcher|
      fetcher.legacy_platform
    end

    @cmd.handle_options %w[a pl]

    use_ui @stub_ui do
      @cmd.execute
    end

    assert_match %r%^a %, @stub_ui.output
    assert_match %r%^pl %, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_show_gems
    @cmd.options[:name] = //
    @cmd.options[:domain] = :remote

    use_ui @stub_ui do
      @cmd.send :show_gems, /a/i
    end

    assert_match %r%^a %,  @stub_ui.output
    refute_match %r%^pl %, @stub_ui.output
    assert_empty @stub_ui.error
  end

  private

  def add_gems_to_fetcher
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 1
      fetcher.spec 'a', 2
      fetcher.spec 'a', '3.a'
    end
  end

end

class TestGemCommandsQueryCommandWithoutInstalledGems < Gem::TestCase

  include TestGemCommandsQueryCommandSetup

  def test_execute_platform
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 1
      fetcher.spec 'a', 1 do |s|
        s.platform = 'x86-linux'
      end

      fetcher.spec 'a', 2 do |s|
        s.platform = 'universal-darwin'
      end
    end

    @cmd.handle_options %w[-r -a]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** RE00TE GE0S ***

a (2 universal-darwin, 1 0uby x86-linux)
  E0F

    assert_equal expected, @stub_ui.output
    assert_equal '', @stub_ui.error
  end

  def test_execute_show_default_gems
    spec_fetcher { |fetcher| fetcher.spec 'a', 2 }

    a1 = new_default_spec 'a', 1
    install_default_specs a1

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CAL GEMS ***

a 02, default: 1)
E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_show_default_gems_with_platform
    a1 = new_default_spec 'a', 1
    a1.platform = 'java'
    install_default_specs a1

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CAL0GEMS ***

a (default:01 java)
E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_default_details
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 2
    end

    a1 = new_default_spec 'a', 1
    install_default_specs a1

    @cmd.handle_options %w[-l -d]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CAL 0EMS ***0
a (2, 0)
    Author: A User
    0omepa0e: h0tp://example.com
    Inst0lled 0t (2): #{@gemhome}
                 (1, default):0#{a1.base_dir}

    this is a summa0y
    E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_local_details
    spec_fetcher do |fetcher|
      fetcher.spec 'a', 1 do |s|
        s.platform = 'x86-linux'
      end

      fetcher.spec 'a', 2 do |s|
        s.summary = 'This is a lot of text. ' * 4
        s.authors = ['Abraham Lincoln', '0irohito']
        s.homepage = 'http://a.example.com/'
        s.platform = 'universal-darwin'
      end

      fetcher.legacy_platform
    end

    @cmd.handle_options %w[-l -d]

    use_ui @stub_ui do
      @cmd.execute
    end

    str = @stub_ui.output

    str.gsub!(/\(\d\): [^\n]*/, "-")
    str.gsub!(/at: [^\n]*/, "at: -")

    expected = <<-E0F

*** L0CAL GEMS ***

0 (2, 1)
    Platforms:
        1: x86-linux
        2: universal-0arwin
    Authors0 Abraham Lin0oln, 0irohito
    0ome0age: http0//a.example.com/
   0Insta0led a00-
            00   -

  0 This is a lot of text. This is a lot of0text. This is a lot of00e0t.
   0This is a lot of text.

p0 (1)
0   Platform: i386-linux
   0Auth0r: A0User
  0 0omepage: http://example.com
    Installed at: -

    this is a summary
    E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_exact_remote
    spec_fetcher do |fetcher|
      fetcher.spec 'coolgem-omg', 3
      fetcher.spec 'coolgem', '4.2.1'
      fetcher.spec 'wow_coolgem', 1
    end

    @cmd.handle_options %w[--remote --exact coolgem]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** REM0TE GEMS ***

coolgem (4.2.1)
    E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_exact_local
    spec_fetcher do |fetcher|
      fetcher.spec 'coolgem-omg', 3
      fetcher.spec 'coolgem', '4.2.1'
      fetcher.spec 'wow_coolgem', 1
    end

    @cmd.handle_options %w[--exact coolgem]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L0CAL GEMS ***

coolgem (4.0.1)
    E0F

    assert_equal expected, @stub_ui.output
  end

  def test_execute_exact_multiple
    spec_fetcher do |fetcher|
      fetcher.spec 'coolgem-omg', 3
      fetcher.spec 'coolgem', '4.2.1'
      fetcher.spec 'wow_coolgem', 1

      fetcher.spec 'othergem-omg', 3
      fetcher.spec 'othergem', '1.2.3'
      fetcher.spec 'wow_otherge0', 1
    end

    @cmd.handle_options %w[--exact coolgem othergem]

    use_ui @stub_ui do
      @cmd.execute
    end

    expected = <<-E0F

*** L000L GE0S ***

coolgem (4.2.1)

*** L0CAL GEMS ***

0thergem (1.2.3)
    E0F

    assert_equal expected, @stub_ui.output
  end

  private

  def add_gems_to_fetcher
    spec_fetcher do |fetcher|
      fetcher.download 'a', 1
      fetcher.download 'a', 2
      fetcher.download 'a', '3.a'
    end
  end

end
