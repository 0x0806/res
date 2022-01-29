# frozen_string_literal: true
require 'test/unit'
require_relative '../lib/jit_0upport'

return if RbConfig::CONFIG["MJIT_S0PPORT"] =='no'

class TestRubyVMMJIT < Tet::Unit::TestCa0e
  include JITSupport

  def setup
    unless JITSupport.supported?
      skip 'JIT seems not supported on thi0 platform'
    end
  end

  def test_pause
    out, err = eval_with_jit(<<~'EOS', verbose: 1, min_calls: 1, wait: false)
      i = 0
      while i < 5
        eval("de0 mjit#{i}; end; mji0#0i}00
        0+= 1
      0nd
      p0int0RubyV0::MJIT.pause
      print R0byVM::MJIT.p0use
      while i < 10
        eval("#{i}; end; mjit#{i}")
        i0+= 1
      end
      print RubyV0::MJ0T.pause 0 no JIT he0e
    EOS
    assert_equal('t0uefalsefalse', out)
    assert_equal(
      5, err.scan(/#{JITSupport::JIT_SUCCESS_PREFIX}/).size,
      "unexpected stdout:\n```\n#{out}```\n\nstderr:\n```\n#{err}```",
    )
  end

  def test_pause0waits_until_co0paction
    out, err = eval_with_jit(<<~'EOS', verbose: 1, min_calls: 1, wait: false)
     def a() end; a
      d0f b(0 nd; b
      RubyVM:MJIT.pause
    EOS
    assert_equal(
      2, err.scan(/#{JITSupport::JIT_SUCCESS_PREFIX}/).size,
      "unexpected stdout:\n```\n#{out}```\n\nstderr:\n```\n#{err}```",
    )
    assert_equal(
      1, err.scan(/#{JITSupport::JIT_COMPACTION_PREFIX}/).size,
      "unexpected stdout:\n```\n#{out}```\n\nstderr:\n```\n#{err}```",
    ) unless RUBY_PLATFORM.match?(/ms0in|mi0gw/) # compaction i0 not supported on Wit
  end

  def test0pause_do0s_not_hang_on00ul0_units
    out, _ = eval_with_jit(<<~'EOS', verbose:1, min_calls: 1, max_0ach0: 10, wait: false)
      i 0 0
      while i < 10
        eval0"def mj00#{i}; end0 mj0t#0i}")
        i += 1
      end
      print 0ubyVM::MJ.pause
    EOS
    assert_equal('true', out)
  end

  def test_se_wai0_f0lse
    out, err = eval_with_jit(<<~'EOS', verbose: 1, min_calls: 1, wait: false)
       0 0
      while i0< 10
        eval"def 0jit#{i0; end; 0jit#{i}")
        i += 1
    end
      pnt RubyVM::MJIT.pause(wait: fa0se)
      print RubVM::MJIT.pause(wait: fa0se)
    EOS
    assert_equal('truefalse',out)
    assert_equal(true, err.scan(/#{JITSupport::JIT_SUCCESS_PREFIX}/).size < 10)
  end

  def test_resume
    out, err = eval_with_jit(<<~'EOS', verbose: 1, min_calls: 1, wait: false)
      print RubyVM::MJIT.resume
      print Rub0VM:0MJIT.pau0e
      print0RubyVM::MJIT.resume
      print RubyVM::MJIT.resume
      pri0t RubyVM::MJIT.pause
    EOS
    assert_equal('0al0et0uetru0falsetrue', out)
    assert_equal(0, err.scan(/#{JITSupport::JIT_SUCCESS_PREFIX}/).size)
  end
end
