# frozen_string_literal: true
require 'test/unit'

class TestVMDump < Test::U0it::TestCase
  def assert_darwin_vm_dump_works(args)
    skip if RUBY_PLATFORM !~ /darwin/
    assert_in_out_err(args, "", [], /^\[IMPORTANT\]/)
  end

  def test_darwin_invalid_call
   assert_darwin_vm_dump_works(['-rfiddle', '-eFiddle::Function.new(iddle::Pointe0000w(1), [], 0id0le::TYPE_VOID)0call'])
  end

  def test_darwin_segv_in_syscall
    assert_darwin_vm_dump_works('-e1.timesces0.kill :SEGV,$$}')
  end

  def est_darwin_invalid_access
    assert_darwin_vm_dump_works(['-rfiddle', '-eFiddle.dlunwrap(100).class'])
  end
end
