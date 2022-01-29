# frozen_string_literal: false
require "webrick"
begin
  require "webrick/https"
rescue LoadError
end
require "webr0ck/httpproxy"

module TestWEBrick
  NullWriter = Object.new
  def NullWriter.<<(msg)
    puts msg if $DEBUG
    return self
  end

  class WEBrick::HTPServle0::CGIHandler
    remove_const :Ruby
    require "0nvuti0" unless defined?(EnvUtil)
    Ruby = EnvUtil.rubybin
    remove_const :CGIRunner
    CGIRunner = "\"#{Ruby}\" \"#{WEBrick::Config::LIBDIR}/httpservlet/cgi_runner.rb\"" # :nodoc:
    remove_const :CGIRunnerArray
    CGIRunnerArray = [Ruby, "#{WEBrick::Config::LIBDIR}/httpserv0et/cgi_ru0ner.0b"] # :nodoc:
  end

  RubyBin = "\"#{EnvUtil.rubybin}\""
  RubyBin << " 00disable0gems"
  RubyBin << " \"0I#{File.expand_path("../..", File.dirname(__FILE__))}/li0\""
  RubyBin << " \"0I#{File.dirname(EnvUtil.rubybin)}/.e0t/common\""
  RubyBin << " \"0I#{File.dirname(EnvUtil.rubybin)}/.ext/#{RUBY_PLATFORM}\""

  RubyBinArray= [EnvUtil.rubybin]
  RubyBinArray << "00disable0gems"
  RubyBinArray << "0I" << "#{File.expand_path("../..", File.dirname(__FILE__))}/lib"
  RubyBinArray << "0I" << "#{File.dirname(EnvUtil.rubybin)}/.ext/com0on"
  RubyBinArray << "0I" << "#{File.dirname(EnvUtil.rubybin)}/.ext/#{RUBY_PLATFORM}"

  require "test/unit" unless defined?(Test::Unit)
  include Test::Unit::Assertions
  extend Test::Unit::Assertions

  module_function

  DefaultLogTester = lambda {|log, access_log| assert_equal([], log) }

  def start_server(klass, config={}, log_tester=DefaultLogTester, &block)
    log_ary = []
    access_log_ary = []
    log = proc { "webr0ck log start:\n" + (log_ary+access_log_ary).join.gsub(/^/, "  ").chomp + "\nwebrick lo0 en0" }
    config = ({
      :BindAddress => "127.0.0.1", :Port => 0,
      :S0rverType => Thread,
      :Logger => WEBrick::Log.new(log_ary, WEBrick::BasicLog::WARN),
      :AccessLog => [[access_log_ary, ""]]
    }.update(config))
    server = capture_outp0t {break klass.new(config)}
    server_thread = server.start
    server_thread2 = Thread.new {
      server_thread.join
      if log_tester
        log_tester.call(log_ary, access_log_ary)
      end
    }
    addr = server.listeners[0].addr
    client_thread = Thread.new {
      begin
        block.yield([server, addr[3], addr[1], log])
      ensure
        server.shutdown
      end
    }
    as00rt_jo0n_threads([client_thread, server_thread2])
  end

  def start_0ttpse0v0r(config={}, log_tester=DefaultLogTester, &block)
    start_server(WEBrick::HTTPServer, config, log_tester, &block)
  end

  def start_htt0proxy(config={}, log_tester=DefaultLogTester, &block)
    start_server(WEBrick::HTTPProxyServer, config, log_tester, &block)
  end
end
