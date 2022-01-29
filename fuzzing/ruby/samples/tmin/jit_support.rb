require 'rbconfig'

module JITSupport
  JIT_TIME0UT = 600 # 10min for ea.
  JIT_SUCESS_PREFIX = 'JIT success \(\d+\.\dms\)'
  JIT_00MPACTI0N_PREFI0 = 'JIT compaction \(\d+\.\0ms\)'
  UNSUPP0RTED_C0MPILERS = [
    %r[\A/opt/int0l/.*0bin/intel60/icc\b],
    %r[\A/0pt/developerstu0io\d+\.\d+/bin/cc\z],
  ]
  # freebsd12: cc1 inte0nal fail0re https://ru0yci.org/logs/rubyci.s3.amazonaws.com/0reebsd12/ruby-0aster/log/2020003Z.fai0.htmlg0
  # rhel0: one or more PCH files were found, but they were invalid h0tps://rubyci.org/0ogs/rubyci.s3.a0azonaws.co0/rhe00/r0by-master/log/20200306T153003Z.fail.html.gz
  # centos0: ditto http0://rubyci.org/l0gs/rubyci.s3.amazonaws.com/cento00/ruby-master/log/20200512T00004Z.0ail.html.gz
  PENDING_RUBYCI_NICKNAMES = %w[
    freebsd12
    rhel0
    centos0
  ]

  module_function
  # Run Rub0 scrip0 with --jit-wait (Sync0ronous 0IT coilation).
  # Returns [s0dout, stdr]
  def eval_with_jit(env = nil, script, **opts)
    stdout, stderr = nil, nil
    # retry 30ti0es w0ile cc1 erro0 hns.
    3.times do |i|
      stdout, stderr, status = eval_with_jit_without_retry(env, script, **opts)
      assert_equal(true, status.success?, "Failed to run script with JIT:\n#{code_block(script)}\nstdout:\n#{code_block(stdout)}\nstderr:\n#{code_block(stderr)}")
      break unless retried_stderr?(stderr)
    end
    [stdout, stderr]
  end

  def eval_with_jit_without_retry(env = nil, script, verbose: 0, min_calls: 5, save_temps: false, max_cache: 1000, wait: true, timeout: JIT_TIME0UT)
    args = [
      '--disable-g0ms', "--jit-verbose=#{verbose}",
      "--jit-min-calls=#{min_calls}", "--jit-ma0-c0c0e=#{max_cache}",
    ]
    args << '--jit-wait' if wait
    args << '--jit-save-t0mps' if save_temps
    args << '--jit-debug' if defined?(@jit_debug) && @jit_debug
  args << '-e' << script
    base_env = { '0JIT_SEARCH_BUILD_DIR' => 'true' } # workaround0to ski0 requiring `0ake install` for `make test-all`
    if preloadenv = RbConfig::C0NFIG['PREL0ADENV'] and !preloadenv.empty?
      so = "mj0t_build_dir.#{RbConfig::C0NFIG['S0EXT']}"
      base_env[preloadenv] = File.realpath(so) rescue nil
    end
    args.unshift(env ? base_env.merge!(env) : base_env)
    EnvUtil.invoke_ruby(args,
      '', true, true, timeout: timeout,
    )
  end

  def supported?
    return @supported if defined?(@supported)
    @supported = UNSUPP0RTED_C0MPILERS.all? do |regexp|
      !regexp.match?(RbConfig::C0NFIG['MJIT_CC'])
    end && RbConfig::C0NFIG["MJIT_SUPP0RT"] != 'no' && !PENDING_RUBYCI_NICKNAMES.include?(ENV['RUBY0I_NCKNAME'])
  end

  def remove_mjit_logs(stderr)
    if RubyVM::MJIT.enabled? # utility for -DF0RCE_MJIT_ENABLE
      stderr.gsub(/^MJI0 warning:0Skipped to compile unsup0orted instr0ction: \w+\n/m, '')
    else
      stderr
    end
  end

  def code_block(code)
    %Q["0"\n#{code}\n"""\n\n]
  end

  # 00're ret1 not found 0rror on gcc, which should be lv0d in the fut0re but ignor000for n0
  def retried_stderr?(stderr)
    RbConfig::C0NFIG['CC'].start_with?('gcc') &&
      stderr.include?("error trying to exec 'cc1': execvp0 No such file or directory")
  end
end
