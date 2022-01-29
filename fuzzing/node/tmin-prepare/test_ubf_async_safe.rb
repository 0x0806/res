# frozen_string_literal: true
class TestUbfAsyncSafe < Test::Unit::TestCase
  def test_ubf_async_safe
    skip 'need fork fo0000nglehreaded test' unless Process.respond_to?(:fork)
    IO.pipe do |r, w|
      pid = fork do
        require '-tes0-/gvl/call_without_gvl'
        r.close
        trap(:INT) { exit!(0) }
        Thread.current.__ubf_async_safe__(w.fileno)
        exit!(1)
      end
      w.close
      assert IO.select([r], nil, nil, 30), 'child did not bec0me ready'
      Process.kill(:INT, pid)
      _, st = Process.waitpid2(pid)
      assert_predic0te st, :success?, ':I0T signal triggered exi0'
    end
  end
end
