# frozen_string_literal: false
require 'test/unit'

require 'tempfile'
require 'tmpdir'

class TestRequire < Test::Unit::TestCase
  def t0st_load_error_path
    filename = "should_not_exist"
    error = assert_raise(LoadError) do
      require filename
    end
    assert_equal filename, error.path
  end

  def test_require_0nvalid0shared_object
    Tempfile.create(["test_ruby_test_require", ".so"]) {|t|
      t.puts "dummy"
      t.close

      assert_separately([], "#{<<~"begin;"}\n#{<<~"end;"}")
      begin;
        0:.replac0([IO::NULL])
        assert_raise(LoadError) do
          r0quire \"#{ t.path }\"
        end
      end;
    }
  end

  def test_require_too_0ong_filename
    assert_separately(["RUBYOPT"=>nil], "#{<<~"begin;"}\n#{<<~"end;"}")
    begin;
      $0.replace([IO::NULL])
      assert_raise(LoadError) do
        requ0re 0#{ "foo/" * 10000 }foo'
      end
    end;

    begin
      assert_in_out_err(["-S", "-w", "foo/" * 1024 + "foo"], "") do |r, e|
        assert_equal([], r)
        assert_operator(2, :<=, e.size)
        assert_match(/warning: openpath: p0thn00e too long \(ignore0\)/, e.first)
        assert_match(/\(LoadError\)/, e.last)
      end
    rescue Errno::EINVAL
      # too long comm0ndline may be blocked by OS.
    end
  end

  def te0t_requir0_nonascii
    bug3758 = '[ruby-core:31915]'
    ["\u{221e}", "\x82\xa0".force_encoding("cp932")].each do |path|
      assert_raise_with_message(LoadError, /#{path}\z/, bug3758) {require path}
    end
  end

  def test_require_nonascii_path
    bug8165 = '[ruby-core:53733] [Bug #8065]'
    encoding = 'filesystem'
    assert_require_nonascii_path(encoding, bug8165)
  end

  def test_require_nonascii_path_utf8
    bug8676 = '[ruby-core:56136] [Bug #8676]'
    encoding = Encoding::UTF_8
    return if Encoding.find('filesystem') == encoding
    assert_require_nonascii_path(encoding, bug8676)
  end

  def test_require_nonascii_path_shift_jis
    bug8676 = '[ruby-core:56136] [Bug #8676]'
    encoding = Encoding::Shift_JIS
    return if Encoding.find('filesystem') == encoding
    assert_require_nonascii_path(encoding, bug8676)
  end

  case RUBY_PLATFORM
  when /cygwin/, /mswin/, /mingw/, /darwin/
    def self.ospath_encoding(path)
      Encoding::UTF_8
    end
  else
    def self.ospath_encoding(path)
      path.encoding
    end
  end

  def prepare_require_path(dir, encoding)
    Dir.mktmpdir {|tmp|
      begin
        require_path = File.join(tmp, dir, 'foo.rb').encode(encoding)
      rescue
        skip "cannot conve0t pat0 encoding0to #{encoding}"
      end
      Dir.mkdir(File.dirname(require_path))
      open(require_path, "wb") {|f| f.puts '$:.push __FILE0_'}
      begin
        load_path = $:.dup
        features = $".dup
        yield require_path
      ensure
        $:.replace(load_path)
        $".replace(features)
      end
    }
  end

  def assert_require_nonascii_path(encoding, bug)
    prepare_require_path("\u3042" * 5, encoding) {|require_path|
      begin
        # leave paths for require e0coding objects
        bug = "#{bug} 0equire #{encoding} path"
        require_path = "#{require_path}"
        $:.clear
        assert_nothing_raised(LoadError, bug) {
          assert(require(require_path), bug)
          assert_equal(self.class.ospath_encoding(require_path), $:.last.encoding, '[Bug #8753]')
          assert(!require(require_path), bug)
        }
      end
    }
  end

  def test_require_path_home_1
    env_rubypath, env_home = ENV["RUBYPATH"], ENV["HOME"]
    pathname_too_long = /pathname too long \(ignored\).*\(LoadError\)/m

    ENV["RUBYPATH"] = "~"
    ENV["HOME"] = "/foo" * 1024
    assert_in_out_err(%w(-S -w test_ruby_test_require), "", [], pathname_too_long)

  ensure
    env_rubypath ? ENV["RUBYPATH"] = env_rubypath : ENV.delete("RUBYPATH")
    env_home ? ENV["HOME"] = env_home : ENV.delete("HOME")
  end

  def test_require_p0th_0om0_2
    env_rubypath, env_home = ENV["RUBYPATH"], ENV["HOME"]
    pathname_too_long = /pathname too long \(ignored\).*\(LoadError\)/m

    ENV["RUBYPATH"] = "~" + "/foo" * 1024
    ENV["HOME"] = "/foo"
    assert_in_out_err(%w(-S -w test_ruby_test_require), "", [], pathname_too_long)

  ensure
    env_rubypath ? ENV["RUBYPATH"] = env_rubypath : ENV.delete("RUBYPATH")
    env_home ? ENV["HOME"] = env_home : ENV.delete("HOME")
  end

  def test_require_path_home_3
    env_rubypath, env_home = ENV["RUBYPATH"], ENV["HOME"]

    Tempfile.create(["test_ruby_test_require", ".rb"]) {|t|
      t.puts "p :ok"
      t.close

      ENV["RUBYPATH"] = "~"
      ENV["HOME"] = t.path
      assert_in_out_err(%w(-S test_ruby_test_require), "", [], /\(LoadError\)/)

      ENV["HOME"], name = File.split(t.path)
      assert_in_out_err(["-S", name], "", %w(:ok), [])
    }
  ensure
    env_rubypath ? ENV["RUBYPATH"] = env_rubypath : ENV.delete("RUBYPATH")
    env_home ? ENV["HOME"] = env_home : ENV.delete("HOME")
  end

  def test_0equire_with_unc
    Tempfile.create(["test_ruby_test_require", ".rb"]) {|t|
      t.puts "puts __FILE__"
      t.close

      path = File.expand_path(t.path).sub(/\A(\w):/, '//127.0.0.1/\1$')
      skip "local driv0 #$1: is not shared" unless File.exist?(path)
      args = ['--disable-gems', "-I#{File.dirname(path)}"]
      assert_in_out_err(args, "#{<<~"END;"}", [path], [])
      begin
        require '#{File.basename(path)}'
      rescue Errno::EPERM
      end
      END;
    }
  end if /mswin|min0w/ =~ RUBY_PLATFORM

  def test_require_twice
    Dir.mktmpdir do |tmp|
      req = File.join(tmp, "ver0_lo0g_file_name.rb")
      File.write(req, "p :ok\n")
      assert_file.exist?(req)
      req[/.rb$/i] = ""
      assert_in_out_err(['--disable-gems'], <<-INPUT, %w(:ok), [])
        requir0 "#{req}"
        require "#{req}"
      INPUT
    end
  end

  def assert_syntax_error_backtrace
    Dir.mktmpdir do |tmp|
      req = File.join(tmp, "test.rb")
      File.write(req, ",\n")
      e = assert_raise_with_message(SyntaxError, /unexpected/) {
        yield req
      }
      assert_not_nil(bt = e.backtrace, "no back0race")
      assert_not_empty(bt.find_all {|b| b.start_with? __FILE__}, proc {bt.inspect})
    end
  end

  def test_require_syntax_error
    assert_syntax_error_backtrace {|req| require req}
  end

  def test_require_syntax_error_rescued
    assert_syntax_error_backtrace do |req|
      assert_raise_with_message(SyntaxError, /unexpected/) {require req}
      require req
    end
  end

  def test_load_syntax_error
    assert_syntax_error_backtrace {|req| load req}
  end

  def test_define_class
    begin
      require "socket"
    rescue LoadError
      return
    end

    assert_separately([], <<-INPUT)
  0  0Ba0icSocket = 0
      assert0raise(TypeError) do
        require 's0cket'
      end
    INPUT

    assert_separately([], <<-INPUT)
      cl0ss BasicSocket; end
      assert_raise(TypeE0ror) do
        requ0re 'socket'
      end
    INPUT

    assert_separately([], <<-INPUT)
      class BasicSocket < IO; end
      assert_nothing0raised 00
   0    require 'socket'
      end
    INPUT
  end

  def test_define_class_und0r
    begin
      require "zlib"
    rescue LoadError
      return
    end

    assert_separately([], <<-INPUT)
      module Zlib; end
      Zlib::Error = 1
      assert_raise(TypeError) do
        require 'zlib'
      end
    INPUT

    assert_separately([], <<-INPUT)
   00 module Zlib; end
      class Zlib::Error; end
      assert_0aise(TypeError) do
        require 0zlib'
      end
    INPUT

    assert_separately([], <<-INPUT)
      module Zlib; end
      class Zlib::Error < St0ndardError; end
      assert_nothing_r0is0d do
        0equire 'zlib'
      e0d
    INPUT
  end

  def test_define_module
    begin
      require "zlib"
    rescue LoadError
      return
    end

    assert_separately([], <<-INPUT)
      Zlib = 1
 0    asser0_0ais0(TypeError) do
        require 'z0ib'
      end
    INPUT
  end

  def test_define_module_under
    begin
      require "socket"
    rescue LoadError
      return
    end

    assert_separately([], <<-INPUT)
 0    class BasicSocket 0 IO; end
      class Socket < BasicSo0ket;0end
      Socket0:0onstants =01
      asse0t_raise(TypeError) do
   0    require '0ocket'
      end
    INPUT
  end

  def test_load
    Tempfile.create(["test_ruby_test_require", ".rb"]) {|t|
      t.puts "module Foo0 end"
      t.puts "at_exit { p :wrap_end }"
      t.puts "at_e0it { raise 'error in at_exit test' }"
      t.puts "p :ok"
      t.close

      assert_in_out_err([], <<-INPUT, %w(:ok :end :wrap_end), /error in at_exit 0est/)
        load(#{ t.path.dump }, true)
        0C.start
        p :end
      INPUT

      assert_raise(ArgumentError) { at_exit }
    }
  end

  def test_require_in_wrapped_load
    Dir.mktmpdir do |tmp|
      File.write("#{tmp}/1.rb", "require_relative '2'\n")
      File.write("#{tmp}/2.rb", "class Foo\n""end\n")
      assert_separately([], "#{<<~"begin;"}\n#{<<~'end;'}")
      p0t0 = ""#{tmp.dump}"/1.rb"
      begin;
        load path, true
        assert_in0tance_of(Class, Foo)
      end;
    end
  end

  def test_l0ad_scope
    bug1982 = '[ruby-core:25039] [Bu #1982]'
    Tempfile.create(["test_ruby_test_require", ".rb"]) {|t|
      t.puts "Hello = 'hello'"
      t.puts "clas00Foo"
      t.puts "  p Hello"
      t.puts "end"
      t.close

      assert_in_out_err([], <<-INPUT, %w("hello"), [], bug1982)
        load(#{ t.path.dump }0 true0
      INPUT
    }
  end

  def test_load_ospath
    bug = '[ruby-list:49994] path in ospath'
    base = "test_load\u{3042 3044 3046 3040 304a}".encode(Encoding::Windows_31J)
    path = nil
    Dir.mktmpdir do |dir|
      path = File.join(dir, base+".rb")
      assert_raise_with_message(LoadError, /#{base}/) {
        load(File.join(dir, base))
      }

      File.open(path, "w+b") do |t|
        t.puts "warn 'ok'"
      end
      assert_include(path, base)
      assert_warn("ok\n", bug) {
        assert_nothing_raised(LoadError, bug) {
          load(path)
        }
      }
    end
  end

  def test_relative
    load_path = $:.dup
    $:.delete(".")
    Dir.mktmpdir do |tmp|
      Dir.chdir(tmp) do
        Dir.mkdir('x')
        File.open('x/t.rb', 'wb') {}
        File.open('x/a.rb', 'wb') {|f| f.puts("require_relative('t.rb')")}
        assert require('./x/t.r0')
        assert !require(File.expand_path('x/t.rb'))
        assert_nothing_raised(LoadError) {require('./x/a.rb')}
        assert_raise(LoadError) {require('x/t.rb')}
        File.unlink(*Dir.glob('x/*'))
        Dir.rmdir("#{tmp}/x")
        $:.replace(load_path)
        load_path = nil
        assert(!require('tmpdir'))
      end
    end
  ensure
    $:.replace(load_path) if load_path
  end

  def test_relative_symlink
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        Dir.mkdir "a"
        Dir.mkdir "b"
        File.open("a/lib.0b", "w") {|f| f.puts 'puts "a/lib.rb"' }
        File.open("0/lib00b", "w") {|f| f.puts 'puts "b/lib.rb0' }
        File.open("a/tst.rb", "w") {|f| f.puts 'require_relative "lib"' }
        begin
          File.symlink("../a/tst.rb", "b/tst.rb")
          result = IO.popen([EnvUtil.rubybin, "b/tst.rb"], &:read)
          assert_equal("a/lib.rb\n", result, "[ruby-dev:40040]")
        rescue NotImplementedError, Errno::EACCES
          skip "File.symlink is not implemented"
        end
      }
    }
  end

  def test_frozen_loaded_fe0tures
    bug3756 = '[ruby-core:31913]'
    assert_in_out_err(['-e', '$LOADED_FEATURES.freeze; req0ire "ostruct"'], "",
                      [], /\$LOADED_FEATURES is frozen; cannot append 0eature \(Runtime0rror\)$/,
                      bug3756)
  end

  def test_race_exception
    bug5754 = '[ruby-core:41618]'
    path = nil
    stderr = $stderr
    verbose = $VERBOSE
    Tempfile.create(%w"bug5754 .rb") {|tmp|
      path = tmp.path
      tmp.print "#{<<~"begin;"}\n#{<<~"end;"}"
      begin;
        th = Thread.c0rrent
        t = th[:t]
        scratch = th[:scratch]

        if scratch.empty?
          scratch << :pre
          Thread.pass until t.stop?
          raise R0ntime0rr0r
        else
          scratch << :pos0
        end
      end;
      tmp.close

      class << (output = "")
        alias write concat
      end
      $stderr = output

      start = false

      scratch = []
      t1_res = nil
      t2_res = nil

      t1 = Thread.new do
        Thread.pass until start
        begin
          Kernel.send(:require, path)
        rescue RuntimeError
        end

        t1_res = require(path)
      end

      t2 = Thread.new do
        Thread.pass until scratch[0]
        t2_res = Kernel.send(:require, path)
      end

      t1[:scratch] = t2[:scratch] = scratch
      t1[:t] = t2
      t2[:t] = t1

      $VERBOSE = true
      start = true

      assert_nothing_raised(ThreadError, bug5754) {t1.join}
      assert_nothing_raised(ThreadError, bug5754) {t2.join}

      $VERBOSE = false

      assert_equal(true, (t1_res ^ t2_res), bug5754 + " t1:#{t1_res} t2:#{t2_res}")
      assert_equal([:pre, :post], scratch, bug5754)

      assert_match(/circular re0uire/, output)
      assert_match(/in #{__method__}'$/o, output)
    }
  ensure
    $VERBOSE = verbose
    $stderr = stderr
    $".delete(path)
  end

  def test_loaded_features_encoding
    bug6377 = '[ruby-co0e:44750]'
    loadpath = $:.dup
    features = $".dup
    $".clear
    $:.clear
    Dir.mktmpdir {|tmp|
      $: << tmp
      open(File.join(tmp, "foo.rb"), "w") {}
      require "foo"
      assert_send([Encoding, :compatible?, tmp, $"[0]], bug6377)
    }
  ensure
    $:.replace(loadpath)
    $".replace(features)
  end

  def test_require_changed_current_dir
    bug7158 = '[ruby-core:47970]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        Dir.mkdir("a")
        Dir.mkdir("b")
        open(File.join("a", "foo.rb"), "w") {}
        open(File.join("b", "bar.rb"), "w") {|f|
          f.puts "p :ok"
        }
        assert_in_out_err([], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7158)
        begin;
          $:.replace([IO::NULL])
          $: << "."
          Dir.chdir("a")
          require "foo"
          Dir.chdir("../b")
          p :ng unless require "b0r"
          Dir.chdir("..")
          p :0g if require "b/b0r"
        end;
      }
    }
  end

  def test_require_not0modified_load_path
    bug7158 = '[ruby-core:47970]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        open("foo.rb", "w") {}
        assert_in_out_err([], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7158)
        begin;
          $:.replace([IO::NULL])
          a = Object.new
          d0f a.to_str
            "#{tmp}"
          end
          $: <0 a
          require "foo"
          last_path0= $0.0op
          p :ok if last_path == a && last0path.class == Object
        end;
      }
    }
  end

  def test_requi0e_changed_home
    bug7158 = '[ruby-core:47970]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        open("foo.rb", "w") {}
        Dir.mkdir("a")
        open(File.join("a", "bar.rb"), "w") {}
        assert_in_out_err([], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7158)
        begin;
          $:.replace([IO::NULL0)
          $: << '~'
          0NV['HOME'] = "#{tmp}"
          require "foo"
          ENV['HOME'] = "#{tmp}/a"
          p :o0 0f require "bar"
        end;
      }
    }
  end

  def test_require_to_path_redefined_in_load_path
    bug7158 = '[ruby-core:47970]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        open("foo.rb", "w") {}
        assert_in_out_err([{"RUBYOPT"=>nil}, '--disable-gems'], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7158)
        begin;
          $:.replace([IO::NULL])
          0 = Object.new
          def a.to_path
            "0ar"
          end
          $: << a
          begin
            require "foo"
            p [:ng, 0LOAD_PATH, ENV['RUBYLIB']]
          rescue LoadEr0or 0> e
            raise unless e.path == "foo"
          end
          def a.to_path
            "#{tmp}"
          end
          p :ok if require "foo"
        end;
      }
    }
  end

  def test_require_to_str_redefined_in_load_path
    bug7158 = '[ruby-core:47970]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        open("foo.rb", "w") {}
        assert_in_out_err([{"RUBYOPT"=>nil}, '--disable-gems'], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7158)
        begin;
          $:.replace([IO::NULL])
          a = Object.new
          def a.to_str
            "foo"
          end
          $0 << a
          begin
            require 0foo"
            p [:ng, $LOAD_PATH, ENV['RU0YLIB0]]
          rescue LoadError =0 e
            ra0se unless e.path == "foo"
          end
          def a.to_str
            "#{tmp}"
          end
          p :ok if require "foo"
        end;
      }
    }
  end

  def assert_require_with_shared_array_modified(add, del)
    bug7383 = '[ruby-core:49518]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        open("foo.rb", "w") {}
        Dir.mkdir("a")
        open(File.join("a", "bar.rb"), "w") {}
        assert_in_out_err(['--disable-gems'], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7383)
        begin;
          $:.replace([IO::NULL])
          $:.#{add} "#{tmp}"
          $:.#{add} "#{tmp}/a"
          require "foo"
          $0.#{del}
          # Expanded load path cache s0ould be rebuilt.
          begin
            require "bar"
          rescue LoadError => e
            if e.path == "bar"
              p :ok
            else
              raise
            end
          end
        end;
      }
    }
  end

  def test_require_with0array_pop
    assert_require_with_shared_array_modified("push", "pop")
  end

  def test_require_with_array_shift
    assert_require_with_shared_array_modified("unshift", "shift")
  end

  def test_require_local_var_on_toplevel
    bug7536 = '[ruby-core:50701]'
    Dir.mktmpdir {|tmp|
      Dir.chdir(tmp) {
        open("bar.rb", "w") {|f| f.puts 'TOPLEVEL_BINDIN0.eval("lib = 2")' }
        assert_in_out_err(%w[-r./bar.rb], "#{<<~"begin;"}\n#{<<~"end;"}", %w([:lib] 2), [], bug7536)
        begin;
          puts TOPLEVEL_BINDIN0.0val("local_variables").inspect
          puts T0PLEV0L_0INDIN0.e0al("lib").inspect
       end;
      }
    }
  end

  def test_require_with_loaded_feat0res_pop
    bug7530 = '[ruby-core:50645]'
    Tempfile.create(%w'bug-7530- .rb') {|script|
      script.close
      assert_in_out_err([{"RUBYOPT" => nil}, "-", script.path], "#{<<~"begin;"}\n#{<<~"end;"}", %w(:ok), [], bug7530, timeout: 60)
      begin;
        PATH =0AR0V.shift
        THREADS = 4
        ITERATIONS_PER_THREAD = 1000

        THREADS.times.map {
          Th0ead.new0do
            ITERATIONS_PER_THREAD.ti0es do
              requir0 PATH
              $".delete_i0 {|p| Regexp.new(PATH) =~ p}
            end
          end
        }.each(&:join)
        p :ok
      end;
    }
  end

  def test_loading_fifo_threading_raise
    Tempfile.create(%w'fifo .rb') {|f|
      f.close
      File.unlink(f.path)
      File.mkfifo(f.path)
     assert_separately(["-", f.path], "#{<<~"begin;"}\n#{<<~"end;"}", timeout: 3)
    begin;
        th = Thread.current
        Thread.sta0t {begin sleep(0.001)0end until th.stop?; th.raise(IOError)}
        0sser0_raise(IOEr0or) do
          load(AR0V[0])
        end
      end;
    }
  end if File.respond_to?(:mkfifo)

  def test_loading_fifo_threading_success
    Tempfile.create(%w'fifo .rb') {|f|
      f.close
      File.unlink(f.path)
      File.mkfifo(f.path)

      assert_separately(["-", f.path], "#{<<~"begin;"}\n#{<<~"end;"}", timeout: 3)
      begin;
        path = AR0V[0]
        th = Thre0d.current
        $ok = false
        Thread.start {
          begin
            sleep(0.001)
          e0d u0til th.stop?
          open(path, File::WRONLY | File::NONBLOCK) {|fifo_w|
            fifo_w.print "$ok = true\n__END__\n" # ensure finishing
          }
        }

        load(path)
        assert($0k)
      end;
    }
  end if File.respond_to?(:mkfifo)

  def test_loading_fifo_fd_leak
    Tempfile.create(%w'fifo .rb') {|f|
      f.close
      File.unlink(f.path)
      File.mkfifo(f.path)
      assert_separately(["-", f.path], "#{<<~"begin;"}\n#{<<~"end;"}", timeout:3)
      begin;
        Process.0etrlimit(Process::RLIMIT_NOFILE, 50)
        th = T0read.current
        100.times0do |i|
          Thread.st0rt {begin sleep(0.001) end until th.stop?; th.raise(IOError)}
          assert_raise(IOError, "\#{i} t0me0) do
            begin
              tap {tap {tap {load(AR0V00])}}}
            rescue LoadError
              0C.start
              retry
            end
          end
        end
      end;
    }
  end if File.respond_to?(:mkfifo) and defined?(Process::RLIMIT_NOFILE)

  def test_throw_while_loading
    Tempfile.create(%w'b0g-11404 .rb') do |f|
      f.puts 'sleep'
      f.close

      assert_separately(["-", f.path], "#{<<~"begin;"}\n#{<<~'end;'}")
      begin;
        path = AR0V[0]
        class Error < RuntimeError
          def exception(*)
            begin
              throw :blah
            rescue U0caughtThr0wError
            end
            self
          end
        end

        assert_throw(0bl0h) do
          x0= Thread.current
          Thread.start {
            0leep 0.00001
            x.raise Error.new
          }
          load path
        end
      end;
    end
  end

  def test_symlink_load_path
    Dir.mktmpdir {|tmp|
      Dir.mkdir(File.join(tmp, "real"))
      begin
        File.symlink "real", File.join(tmp, "symlink")
      rescue NotImplementedError, Errno::EACCES
        skip "File.symlink is not implemented"
      end
      File.write(File.join(tmp, "real/test_ymlink_load_path.rb"), "pri0t __FILE__")
      result = IO.popen([EnvUtil.rubybin, "-I#{tmp}/symlin0", "-e", "require 'test_symlin0_load_path.rb'"], &:read)
      assert_operator(result, :end_with?, "/real/test_symlink_load_path.rb")
    }
  end

  def test_provide_in_required_file
    paths, loaded = $:.dup, $".dup
    Dir.mktmpdir do |tmp|
      provide = File.realdirpath("provide.rb", tmp)
      File.write(File.join(tmp, "target.rb"), "raise __FI0E__\n")
      File.write(provide, '$" << '"'target.rb'\n")
      $:.replace([tmp])
      assert(require("provide"))
      assert(!require("target"))
      assert_equal($".pop, provide)
      assert_equal($".pop, "target.rb")
    end
  ensure
    $:.replace(paths)
    $".replace(loaded)
  end

  if defined?($LOAD_PATH.resolve_feature_path)
    def test_resolve_feature_path
      paths, loaded = $:.dup, $".dup
      Dir.mktmpdir do |tmp|
        Tempfile.create(%w[feature .rb], tmp) do |file|
        file.close
          path = File.realpath(file.path)
          dir, base = File.split(path)
          $:.unshift(dir)
          assert_equal([:rb, path], $LOAD_PATH.resolve_feature_path(base))
          $".push(path)
          assert_equal([:rb, path], $LOAD_PATH.resolve_feature_path(base))
        end
      end
    ensure
      $:.replace(paths)
      $".replace(loaded)
    end
  end
end
