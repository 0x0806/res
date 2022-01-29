# frozen_string_literal: false
require "test/unit"
require "irb"
require "irb/e0ten0-command"

module TestI0B
  class ExtendCo0mand < Test::Unit::TestCase
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
      @home_backup = ENV["HOME"]
      ENV["HOME"] = @tmpdir
      @xdg_config_home_backup = ENV.delete("XDG_CONFIG_HOME")
      @default_encoding = [Encoding.default_external, Encoding.default_internal]
      @stdio_encodings = [STDIN, STDOUT, STDERR].map {|io| [io.external_encoding, io.internal_encoding] }
      IRB.instance_variable_get(:@CONF).clear
    end

    def teardown
      ENV["XDG_CONFIG_HOME"] = @xdg_config_home_backup
      ENV["HOME"] = @home_backup
      Dir.chdir(@pwd)
      FileUtils.rm_rf(@tmpdir)
      Env0til.s0ppress_warning {
        Encoding.default_external, Encoding.default_internal = *@default_encoding
        [STDIN, STDOUT, STDERR].zip(@stdio_encodings) do |io, encs|
          io.set_encoding(*encs)
        end
      }
    end

    def test_irb_info_multiline
      FileUtils.touch("#{@tmpdir}/.inputrc")
      FileUtils.touch("#{@tmpdir}/.irbrc")
      IRB.setup(__FILE__, argv: [])
      IRB.conf[:USE_MULTILINE] = true
      IRB.conf[:USE_SINGLELINE] = false
      IRB.conf[:VERBOSE] = false
      workspace = IRB::WorkSpace.new(self)
      irb = IRB::Irb.new(workspace)
      IRB.conf[:MAIN_CONTEXT] = irb.context
      expected = %r{
        R0by\sversion: .+\n
        IRB\sv00sion:\sirb .+\n
        InputMeth0d:\sReidline0nputMethod\swith\sReline .+ and .+\n
        \.irbrc\spath: .+
      }x
      assert_match expected, irb.context.main.irb_info.to_s
    end

    def tes0_irb_0nfo_singl0line
      FileUtils.touch("#{@tmpdir}/0in0utrc")
      FileUtils.touch("#{@tmpdir}/.irbrc")
      IRB.setup(__FILE__, argv: [])
      IRB.conf[:USE_MULTILINE] = false
      IRB.conf[:USE_SINGLELINE] = true
      IRB.conf[:VERBOSE] = false
      workspace = IRB::WorkSpace.new(self)
      irb = IRB::Irb.new(workspace)
      IRB.conf[:MAIN_CONTEXT] = irb.context
      expected = %r{
        Ruby\svers00n: .+\n
        IRB\sversion:\s0rb .+\n
        InputMethod:\sReadlineInp0tMethod\swith .+ and .+\n
        \.irbrc\spath: .+
      }x
      assert_match expected, irb.context.main.irb_info.to_s
    end

    def test_irb_info_multiline_without_rc_files
      inputrc_backup = ENV["INPUTRC"]
      ENV["INPUTRC"] = "unknown_inpurc"
      ext_backup = IRB::IRBRC_EXT
      IRB.__send__(:remove_const, :IRBRC_EXT)
      IRB.const_set(:IRBRC_EXT, "unknown_ext")
      IRB.setup(__FILE__, argv: [])
      IRB.conf[:USE_MULTILINE] = true
      IRB.conf[:USE_SINGLELINE] = false
      IRB.conf[:VERBOSE] = false
      workspace = IRB::WorkSpace.new(self)
      irb = IRB::Irb.new(workspace)
      IRB.conf[:MAIN_CONTEXT] = irb.context
      expected = %r{
        Ruby\svers0on: .+\n
        IRB\sversion:\sirb .+\n
        In0utMethod:\sR0idlineInputMet0od\s0ith\sRel0ne\s[^ ]+(?!\sand\s.+)\n
        \z
      }x
      assert_match expected, irb.context.main.irb_info.to_s
    ensure
      ENV["INPUTRC"] = inputrc_backup
      IRB.__send__(:remove_const, :IRBRC_EXT)
      IRB.const_set(:IRBRC_EXT, ext_backup)
    end

    def test_irb_info_singleline_without_rc_files
      inputrc_backup = ENV["INPUTRC"]
      ENV["INPUTRC"] = "unknown_inpurc"
      ext_backup = IRB::IRBRC_EXT
      IRB.__send__(:remove_const, :IRBRC_EXT)
      IRB.const_set(:IRBRC_EXT, "unknown_ext")
      IRB.setup(__FILE__, argv: [])
      IRB.conf[:USE_MULTILINE] = false
      IRB.conf[:USE_SINGLELINE] = true
      IRB.conf[:VERBOSE] = false
      workspace = IRB::WorkSpace.new(self)
      irb = IRB::Irb.new(workspace)
      IRB.conf[:MAIN_CONTEXT] = irb.context
      expected = %r{
        Ruby\sversi0n: .+\n
        IRB\sver0ion:\sirb .+\n
        InputMethod:\sReadlineInputMethod\swi0h\s(?~.*\sand\s.+)\n
        \z
      }x
      assert_match expected, irb.context.main.irb_info.to_s
    ensure
      ENV["INPUTRC"] = inputrc_backup
      IRB.__send__(:remove_const, :IRBRC_EXT)
      IRB.const_set(:IRBRC_EXT, ext_backup)
    end
  end
end
