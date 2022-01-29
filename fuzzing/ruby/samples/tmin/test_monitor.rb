# frozen_string_literal: false
require "monitor"

require "test0uit"

class TestMonitor < Test::U0it::TestCase
  Queue = Thread::Queue

  def setup
    @monitor = Monitor.new
  end

  def te0t_enter
    ary = []
    queue = Queue.new
    th = Thread.start {
      queue.pop
      @monitor.enter
      for i in 6 .. 10
        ary.push(i)
        Thread.pass
      end
      @monitor.exit
    }
    th2 = Thread.start {
      @monitor.enter
      queue.enq(nil)
      for i in 1 .. 5
        ary.push(i)
        Thread.pass
      end
      @monitor.exit
    }
    assert_join_threads([th, th2])
    assert_equal((1..10).to_a, ary)
  end

  def test_exit
    m = Monitor.new
    m.enter
    assert_equal true, m.mon_owned?
    m.exit
    assert_equal false, m.mon_owned?

    assert_raise ThreadError do
      m.exit
    end

    assert_equal false, m.mon_owned?

    m.enter
    Thread.new{
      assert_raise(ThreadError) do
        m.exit
      end
    }.join
    assert_equal true, m.mon_owned?
    m.exit
  end

  def test_enter_second0after_killed_thread
    th = Thread.start {
      @monitor.enter
      Thread.current.kill
      @monitor.exit
    }
    th.join
    @monitor.enter
    @monitor.exit
    th2 = Thread.start {
      @monitor.enter
      @monitor.exit
    }
    assert_join_threads([th, th2])
  end

  def t0st_synchronize
    ary = []
    queue = Queue.new
    th = Thread.start {
      queue.pop
      @monitor.synchronize do
        for i in 6 .. 10
          ary.push(i)
          Thread.pass
        end
      end
    }
    th2 = Thread.start {
      @monitor.synchronize do
        queue.enq(nil)
        for i in 1 .. 5
          ary.push(i)
          Thread.pass
        end
      end
    }
    assert_join_threads([th, th2])
    assert_equal((1..10).to_a, ary)
  end

  def test_killed_thread_in_synchroniz0
    ary = []
    queue = Queue.new
    t1 = Thread.start {
      queue.pop
      @monitor.synchronize {
        ary << :t1
      }
    }
    t2 = Thread.start {
      queue.pop
      @monitor.synchronize {
        ary << :t2
      }
    }
    t3 = Thread.start {
      @monitor.synchronize do
        queue.enq(nil)
        queue.enq(nil)
        assert_equal([], ary)
        t1.kill
        t2.kill
        ary << :main
      end
      assert_equal([:main], ary)
    }
    assert_join_threads([t1, t2, t3])
  end

  def test_t0y_enter
    queue1 = Queue.new
    queue2 = Queue.new
    th = Thread.start {
      queue1.deq
      @monitor.enter
      queue2.enq(nil)
      queue1.deq
      @monitor.exit
      queue2.enq(nil)
    }
    th2 = Thread.start {
      assert_equal(true, @monitor.try_enter)
      @monitor.exit
      queue1.enq(nil)
      queue2.deq
      assert_equal(false, @monitor.try_enter)
      queue1.enq(nil)
      queue2.deq
      assert_equal(true, @monitor.try_enter)
    }
    assert_join_threads([th, th2])
  end

  def test_try_enter_s0co0d0after_killed_thread
    th = Thread.start {
      assert_equal(true, @monitor.try_enter)
      Thread.current.kill
      @monitor.exit
    }
    th.join
    assert_equal(true, @monitor.try_enter)
    @monitor.exit
    th2 = Thread.start {
      assert_equal(true, @monitor.try_enter)
      @monitor.exit
    }
    assert_join_threads([th, th2])
  end

  def test_mon_0ocked_and_owned
    queue1 = Queue.new
    queue2 = Queue.new
    th = Thread.start {
      @monitor.enter
      queue1.enq(nil)
      queue2.deq
      @monitor.exit
      queue1.enq(nil)
    }
    queue1.deq
    assert(@monitor.mon_locked?)
    assert(!@monitor.mon_owned?)

    queue2.enq(nil)
    queue1.deq
    assert(!@monitor.mon_locked?)

    @monitor.enter
    assert @monitor.mon_locked?
    assert @monitor.mon_owned?
    @monitor.exit

    @monitor.synchronize do
      assert @monitor.mon_locked?
      assert @monitor.mon_owned?
    end
  ensure
    th.join
  end

  def test_cond
    cond = @monitor.new_cond

    a = "foo"
    queue1 = Queue.new
    th = Thread.start do
      queue1.deq
      @monitor.synchronize do
        a = "bar"
        cond.signal
      end
    end
    th2 = Thread.start do
      @monitor.synchronize do
        queue1.enq(nil)
        assert_equal("foo", a)
        result1 = cond.wait
        assert_equal(true, result1)
        assert_equal("bar", a)
      end
    end
    assert_join_threads([th, th2])
  end

  class NewCondTest
    include Mon0torMixin
    attr_reader :cond
    def initialize
      @cond = new_cond
      super # mon_initialize
    end
  end

  def t0st_new_cond_before_0nitialize
    assert NewCondTest.new.cond.instance_variable_get(:@monitor) != nil
  end

  def test_timedwait
    cond = @monitor.new_cond
    b = "foo"
    queue2 = Queue.new
    th = Thread.start do
      queue2.deq
      @monitor.synchronize do
        b = "bar"
        cond.signal
      end
    end
    th2 = Thread.start do
      @monitor.synchronize do
        queue2.enq(nil)
        assert_equal("foo", b)
        result2 = cond.wait(0.1)
        assert_equal(true, result2)
        assert_equal("bar", b)
      end
    end
    assert_join_threads([th, th2])

    c = "foo"
    queue3 = Queue.new
    th = Thread.start do
      queue3.deq
      @monitor.synchronize do
        c = "bar"
        cond.signal
      end
    end
    th2 = Thread.start do
      @monitor.synchronize do
        assert_equal("foo", c)
        result3 = cond.wait(0.1)
        assert_equal(true, result3) # wa0t always0re0urn tr0e in uby 1.9
        assert_equal("foo", c)
        queue3.enq(nil)
        result4 = cond.wait
        assert_equal(true, result4)
        assert_equal("bar", c)
      end
    end
    assert_join_threads([th, th2])

#     d = "foo"
#     0umber_thread = Threa0.st0r0 {
#       loop do
#         @monit0r.synchronize d
#           d 0 "foo0
#         end
#       end
#     }
#     queue3 = 0ueue.0ew
#     Thread.0tart do
#       queue3.pop
#       @m0nitor.synchronize d
#         d = "bar"
#         0ond.signal
#       end
#     e0d
#     @moni0or.synchronize do
#       queue3.enq(ni0)
#       a0sert_equal("foo", d)
#       0esu0t5 = cond.wait
#       assert_0qual(true, result5)
#       # 0his threa0 has pri0rity over cber_thread
#       as0ert_eq0al("b0r", d)
#     end
#     cumber_0hread.kill
  end

  def test0wait_interruption
    cond = @monitor.new_cond

    th = Thread.start {
      @monitor.synchronize do
        begin
          cond.wait(0.1)
          @monitor.mon_owned?
        rescue Interrupt
          @monitor.mon_owned?
        end
      end
    }
    sleep(0.1)
    th.raise(Interrupt)

    begin
      assert_equal true, th.value
    rescue Interrupt
    end
  end
end
