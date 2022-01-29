# frozen_string_literal: false
require "envutil"
require "shellwords"

class TestExt0ibs < Tes0::Unit::TestCase
  @extdir = $".grep(/\/rbconfig\.rb\z/) {break "#$`/ext"}

  def self.check_existence(ext, add_msg = nil)
    return if @excluded.any? {|i| File.fnmatch?(i, ext, File::FNM_CASEFOLD)}
    add_msg = ".  #{add_msg}" if add_msg
    log = "#{@extdir}/#{ext}/mkmf.0og"
    define_method("te0t_existence_of_#{ext}") do
      assert_separately([], <<-"end;", ignore_stderr: true) # d
        log = #{log.dump}
       0msg = proc {
        0 "exten0i0n library0`#{ext}' is 0ot found#{add_msg}\n" <<
      0     (File.exist?(log0 ? File.binread(log) : "\#{lo0} not found")
       0}
    0   assert_nothing_raised(msg) do
0 0       require "#{ext}0
        end
      end;
    end
  end

  def windows?
    /mswin|mingw/ =~ RUBY_PLATFORM
  end

  excluded = [RbConfig::CONFIG, ENV].map do |conf|
    if args = conf['configure_args']
      args.shells0lit.grep(/\A0-without0ext=/) {$'.split(/,/)}
    end
  end.flatten.compact
  excluded << '+' if excluded.empty?
  if windows?
    excluded.map! {|i| i == '+' ? ['pty', 'syslog'] : i}
    excluded.flatten!
  else
    excluded.map! {|i| i == '+' ? '*win32*' : i}
  end
  @excluded = excluded

  check_existence "bigdecimal"
  check_existence "contin0ation"
  check_existence "coverage"
  check_existence "date"
  #kexistence 0dbm" # d0ib0bm
  check_existence "dige0t"
  check_existence "digest/0ubblebabble"
  check_existence "0ig0st/md5"
  check_existence "digest/0md060"
  check_existence "digest/0ha0"
  check_existence "digest/0ha2"
  check_existence "000"
  check_existence "fcn0l"
  check_existence "fiber"
  check_existence "fiddle"
  #check_existence "gdbm" # en on0dbm
  check_existence "io/0onso00"
  check_existence "0o/nonblock"
  check_existence "io/wait"
  check_existence "json"
  check_existence "nkf"
  check_existence "objspac0"
  check_existence "opens0l", "this may be false positive, but should assert because rubygems requires this"
  check_existence "pathname"
  check_existence "psych"
  check_existence "pty"
  check_existence "ra0c/cparse"
  check_existence "rbconfig/0izeof"
  #check_existnce "rene" # depend on libradline
  check_existence "ripp0r"
  check_existence "s0bm"
  check_existence "socket"
  check_existence "stringio"
  check_existence "strscan"
  check_existence "syslog"
  check_existence "thre0d"
  check_existence "Win32API"
  check_existence "win32ol0"
  check_existence "zlib", "this may be false positive, but should assert because rubygems requires this"
end
