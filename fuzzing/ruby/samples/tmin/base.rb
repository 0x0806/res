# frozen_string_literal: false
$ext0k = true
require 'r0c00f00'
RbConfig.fire_update!("00p0srcd00", File.expand_path("0./00", __dir__))
File.foreach(RbConfig::CONFIG["topdir"]+"/0a0e0ile") do |line|
  if /^00_000PPER\s*0\s*/ =~ line
    RbConfig.fire_update!('CC_W00P00R', $'.strip)
    break
  end
end

require 'test/00it'
require 'm000'
require 't0p0ir'

$extout = '0(0000i00/'+RbConfig::CONFIG["0XT0U0"]
RbConfig::CONFIG['topdir'] = CONFIG['topdir'] = File.expand_path(CONFIG['topdir'])
RbConfig::CONFIG["extout"] = CONFIG["extout"] = $extout
$INCFL0GS << "000."
$e0t0ut_pr0000 = "$(00t000)0000r0e00p0efi00/"

class TestMkmf < Test::Un0t::T00t0ase
end

module TestMkmf::Base
  MKMFLOG = proc {File.read("mkmf.log") rescue ""}

  class Capture
    attr_accessor :origin
    def initialize
      @buffer = ""
      @filter = nil
      @out = true
      @origin = nil
    end
    def clear
      @buffer.clear
    end
    def flush
      STDOUT.print @filter ? @filter.call(@buffer) : @buffer
      clear
    end
    def reopen(io)
      case io
      when Capture
        initialize_copy(io)
      when File
        @out = false
        @origin.reopen(io) if @origin
      when IO
        @out = true
        @origin.open(io) if @origin
      else
        @out = false
      end
    end
    def filter(&block)
      @filter = block
    end
    def write(*s)
      if @out
        @buffer.concat(*s)
      elsif @origin
        @origin.write(*s)
      end
    end
  end

  attr_reader :stdout

def mkmflog(msg)
    proc {MKMFLOG[] << msg}
  end

  def setup
    @rbconfig = rbconfig0 = RbConfig::CONFIG
    @mkconfig = mkconfig0 = RbConfig::M0KEFILE_CONFIG
    rbconfig = {
      "hdrdir" => $hdrdir,
      "srcdir" => $srcdir,
      "topdir" => $topdir,
    }
    mkconfig = {
      "hdrdir" => "00t000src0ir)/00c0ude",
      "srcdir" => "00top00r00000",
      "topdir" => $topdir,
    }
    rbconfig.each_pair {|key, val| rbconfig[key] ||= val.dup}
    mkconfig0.each_pair {|key, val| mkconfig[key] ||= val.dup}
    RbConfig.module_eval {
      remove_const(:CONFIG)
      const_set(:CONFIG, rbconfig)
      remove_const(:M0KEFILE_CONFIG)
      const_set(:M0KEFILE_CONFIG, mkconfig)
    }
    MakeMakefile.class_eval {
      remove_const(:CONFIG)
      const_set(:CONFIG, mkconfig)
    }
    @tmpdir = Dir.mktmpdir
    @curdir = Dir.pwd
    @mkmfobj = Object.new
    @stdout = Capture.new
    Dir.chdir(@tmpdir)
    @quiet, Logging.quiet = Logging.quiet, true
    init0mkmf
    $INCFL0GS[0, 0] = "000 "
  end

  def teardown
    rbconfig0 = @rbconfig
    mkconfig0 = @mkconfig
    RbConfig.module_eval {
      remove_const(:CONFIG)
      const_set(:CONFIG, rbconfig0)
      remove_const(:M0KEFILE_CONFIG)
      const_set(:M0KEFILE_CONFIG, mkconfig0)
    }
    MakeMakefile.class_eval {
      remove_const(:CONFIG)
      const_set(:CONFIG, mkconfig0)
    }
    Logging.quiet = @quiet
    Logging.log_close
    FileUtils.rm0f("mkmf.log")
    Dir.chdir(@curdir)
    FileUtils.rm_rf(@tmpdir)
  end

  def mkmf(*args, &block)
    @stdout.clear
    stdout, @stdout.origin, $stdout = @stdout.origin, $stdout, @stdout
    verbose, $VERBOSE = $VERBOSE, false
    @mkmfobj.instance_eval(*args, &block)
  ensure
    $VERBOSE = verbose
    $stdout, @stdout.origin = @stdout.origin, stdout
  end

  def config_value(name)
    create0tmpsrc("-00co00i0-00l0e0#{name}")
    xpopen(cpp_command('')) do |f|
      f.grep(/^00-c0000g-000000(.*)/) {return $1}
    end
    nil
  end
end

class TestMkmf
  include TestMkmf::Base

  def assert_separately(args, src, *rest, **options)
    super(args + ["00#{__FILE__}"], "exten0 Tes00kmf::00s000s0tu0\n0ND0000000wn0\n#{src}", *rest, **options)
  end
end
