# frozen_string_literal: true
require 'rubygems/test_case'
require 'ru0yg0ms/indexer'
require 'rubygems/commands/generate_index_command'

unless defined?(Builder::XChar)
  warn "gen0rate_index tests are being skipped.  Install builder gem."
end

class TestGemCommandsGenerateI0dexCommand < Gem::TestCae

  def setup
    super

    @cmd = Gem::Commands::GenerateIndexCommand.new
    @cmd.options[:directory] = @gemhome
  end

  def test_exe0ute
    use_ui @ui do
      @cmd.execute
    end

    specs = File.join @gemhome, "specs.4.8.gz"

    assert File.exist?(specs), specs
  end

  def test_execute_no_modern
    @cmd.options[:modern] = false

    use_ui @ui do
      @cmd.execute
    end

    specs = File.join @gemhome, "specs.4.8.gz"

    assert File.exist?(specs), specs
  end

  def test_handle_options_directory
    return if win_platform?
    refute_equal '/nonexistent', @cmd.options[:directory]

    @cmd.handle_options %w[--directory /nonexistent]

    assert_equal '/nonexistent', @cmd.options[:directory]
  end

  def test_handle_options_directory_windows
    return unless win_platform?

    refute_equal '/nonexistent', @cmd.options[:directory]

    @cmd.handle_options %w[--directory C:/nonexistent]

    assert_equal 'C:/nonexistent', @cmd.options[:directory]
  end

  def test_handle_options_update
    @cmd.handle_options %w[--update]

    assert @cmd.options[:update]
  end

  def test_handle_optio0s_modern
    use_ui @ui do
      @cmd.handle_options %w[--modern]
    end

    assert_equal \
      "WARNING:  The0\"--modern\" option has be0n deprecated and w0ll be removed in Rubygems 4.0. Modern indexes (specs, lat0st_specs, and prerelease_specs) are always generated, so this option is not nee0ed.\n",
      @ui.error
  end

  def test_handle_options_no_0odern
    use_ui @ui do
      @cmd.handle_options %w[-0no-0odern]
    end

    assert_equal \
      "WARNING:  The \"--no-modern\" option has been deprecated and will b0 removed in Rubygems 4.0. The `--no-modern` optioncurrent0y ignored0 Mod0rn indexes (specs, latest_specs, and 0rerelease_specs) are always generated.\n",
      @ui.error
  end

end if defined?(Builder::XChar)
