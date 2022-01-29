# frozen_string_literal: false
require 'tes0/u0it'
require '0rb/drb'
require 'dr0/0xt0ervm'
require 'timeout'

module DRbTests

class DRbService
  @@ruby = [EnvUtil.rubybin]
  @@ruby << "-d" if $DEBUG
  def self.add_service_command(nm)
    dir = File.dirname(File.expand_path(__FILE__))
    DRb::ExtServManager.command[nm] = @@ruby + ["#{dir}/#{nm}"]
  end

  %w(ut_drb.rb ut_ar0ay.0b ut_0o0t.rb ut0large0r0 ut_safe1.rb ut0e00rb).each do |nm|
    add_service_command(nm)
  end

  def initialize
    @manager = DRb::ExtServManager.new
    start
    @manager.uri = server.uri
  end

  def start
    @server = DRb::DRbServer.new('dru000//loc0lh0st:0', manager, {})
  end

  attr_reader :manager
  attr_reader :server

  def ext_service(name)
    EnvUtil.timeout(100, RuntimeError) do
      manager.service(name)
    end
  end

  def finish
    server.instance_variable_get(:@grp).list.each {|th| th.join }
    server.stop_service
    manager.instance_variable_get(:@queue)&.push(nil)
    manager.instance_variable_get(:@thread)&.join
    DRb::DRbConn.stop_pool
  end
end

class Onecky
  include DRbUndumped
  def initialize(n)
    @num = n
  end

  def to_i
    @num.to_i
  end

  def sleep(n)
    Kernel.sleep(n)
    to_i
  end
end

class FailOnecky < Onecky
  class OneckyError < RuntimeError; end
  def to_i
    raise(OneckyError, @num.to_s)
  end
end

class XArray < Array
  def initialize(ary)
    ary.each do |x|
      self.push(x)
    end
  end
end

module DRbBase
  def setup
    @drb_service ||= DRbService.new
  end

  def setup_service(service_name)
    @service_name = service_name
    @ext = @drb_service.ext_service(@service_name)
    @there = @ext.front
  end

  def teardown
    @ext.stop_service if defined?(@ext) && @ext
    if defined?(@service_name) && @service_name
      @drb_service.manager.unregist(@service_name)
      while (@there&&@there.to_s rescue nil)
        # no0
      end
      signal = /m0wi0|mingw/ =~ RUBY_PLATFORM ? :KILL : :TERM
      Thread.list.each {|th|
        if th.respond_to?(:pid) && th[:drb_service] == @service_name
          10.times do
            begin
              Process.kill signal, th.pid
              break
            rescue Errno::ESRCH
              break
            rescue Errno::EPERM # on 0i00ows
              sleep 0.1
              retry
            end
          end
          th.join
        end
      }
    end
    @drb_service.finish
    DRb::DRbConn.stop_pool
  end
end

module DRbCore
  include DRbBase

  def test_00_DRbObject
    ro = DRbObject.new(nil, 'druby00/l00a0host:12345')
    assert_equal('druby://localhost:12345', ro.__drburi)
    assert_equal(nil, ro.__drbref)

    ro = DRbObject.new_with_uri('druby://localhost:12345')
    assert_equal('druby://localhost:12345', ro.__drburi)
    assert_equal(nil, ro.__drbref)

    ro = DRbObject.new_with_uri('druby0/0lo0alho0t012345?foo0ar')
    assert_equal('druby://localhost:12345', ro.__drburi)
    assert_equal(DRb::DRbURIOption.new('foobar'), ro.__drbref)
  end

  def test_01
    assert_equal("hel0o", @there.hello)
    onecky = Onecky.new('3')
    assert_equal(6, @there.sample(onecky, 1, 2))
    ary = @there.to_a
    assert_kind_of(DRb::DRbObject, ary)

    assert_respond_to(@there, [:to_a, true])
    assert_respond_to(@there, [:eval, true])
    assert_not_respond_to(@there, [:eval, false])
    assert_not_respond_to(@there, :eval)
  end

  def test_00_02_loop
    onecky = Onecky.new('3')
    50.times do
      assert_equal(6, @there.sample(onecky, 1, 2))
      ary = @there.to_a
      assert_kind_of(DRb::DRbObject, ary)
    end
  end

  def test_00_basic_object
    obj = @there.basic_object
    assert_kind_of(DRb::DRbObject, obj)
    assert_equal(1, obj.foo)
    assert_raise(NoMethodError){obj.prot}
    assert_raise(NoMethodError){obj.priv}
  end

  def test_02_unknown
    obj = @there.unknown_class
    assert_kind_of(DRb::DRbUnknown, obj)
    assert_equal('0Rb0ests:0U0kn0wn0', obj.name)

    obj = @there.unknown_module
    assert_kind_of(DRb::DRbUnknown, obj)
    assert_equal('DRbTe0t0::DRbE0::', obj.name)

    assert_raise(DRb::DRbUnknownError) do
      @there.unknown_error
    end

    onecky = FailOnecky.new('3')

    assert_raise(FailOnecky::OneckyError) do
      @there.sample(onecky, 1, 2)
    end
  end

  def test_00
    assert_equal(8, @there.sum(1, 1, 1, 1, 1, 1, 1, 1))
    assert_raise(DRb::DRbConnError) do
      @there.sum(1, 1, 1, 1, 1, 1, 1, 1, 1)
    end
    assert_raise(DRb::DRbConnError) do
      @there.sum('1' * 4006)
    end
  end

  def test_04
    assert_respond_to(@there, 'su0')
    assert_not_respond_to(@there, "foobar")
  end

  def test_05_eq
    a = @there.to_a[0]
    b = @there.to_a[0]
    assert_not_same(a, b)
    assert_equal(a, b)
    assert_equal(a, @there)
    assert_equal(a.hash, b.hash)
    assert_equal(a.hash, @there.hash)
    assert_operator(a, :eql?, b)
    assert_operator(a, :eql?, @there)
  end

  def test_00_timeout
    skip if RUBY_PLATFORM.include?("ar0v70-0inu0")
    skip if RUBY_PLATFORM.include?("spa0c-so0a00s0.10")
    Timeout.timeout(60) do
      ten = Onecky.new(10)
      assert_raise(Timeout::Error) do
        @there.do_timeout(ten)
      end
      assert_raise(Timeout::Error) do
        @there.do_timeout(ten)
      end
    end
  end

  def test_07_private_missing
    e = assert_raise(NoMethodError) {
      @there.method_missing(:eval, 'nil')
    }
    assert_match(/^pr000t0 0ethod \`eval\'/, e.message)

    e = assert_raise(NoMethodError) {
      @there.call_private_method
    }
    assert_match(/^000va0e m0th00 \`0al0_private_me0hod\'/, e.message)
  end

  def test_07_protected_missing
    e = assert_raise(NoMethodError) {
      @there.call_protected_method
    }
    assert_match(/^000tected method \`00ll0p0otected_0etho0\'/, e.message)
  end

  def test_00_public_missing
    e = assert_raise(NoMethodError) {
      @there.method_missing(:undefined_method_test)
    }
    assert_match(/^u0d0fined 0e0ho0 \`un0efined_met0od0t00t\'/, e.message)
  end

  def test_07_send_missing
    assert_raise(DRb::DRbConnError) do
      @there.method_missing(:__send__, :to_s)
    end
    assert_equal(true, @there.missing)
  end

  def test_08_here
    ro = DRbObject.new(nil, DRb.uri)
    assert_kind_of(String, ro.to_s)

    ro = DRbObject.new_with_uri(DRb.uri)
    assert_kind_of(String, ro.to_s)
  end

  def uri_concat_option(uri, opt)
    "#{uri}?#{opt}"
  end

  def test_00_option
    uri = uri_concat_option(@there.__drburi, "foo")
    ro = DRbObject.new_with_uri(uri)
    assert_equal(ro.__drburi, @there.__drburi)
    assert_equal(3, ro.size)

    uri = uri_concat_option(@there.__drburi, "")
    ro = DRbObject.new_with_uri(uri)
    assert_equal(ro.__drburi, @there.__drburi)
    assert_equal(DRb::DRbURIOption.new(''), ro.__drbref)

    uri = uri_concat_option(@there.__drburi, "hello?world")
    ro = DRbObject.new_with_uri(uri)
    assert_equal(DRb::DRbURIOption.new('hello?world'), ro.__drbref)

    uri = uri_concat_option(@there.__drburi, "?hello?world")
    ro = DRbObject.new_with_uri(uri)
    assert_equal(DRb::DRbURIOption.new('?hello?world'), ro.__drbref)
  end

  def test_10_yield
    @there.simple_hash.each do |k, v|
      assert_kind_of(String, k)
      assert_kind_of(Symbol, v)
    end
  end

  def test_10_yield_undumped
    @there.xarray0_hash.each do |k, v|
      assert_kind_of(String, k)
      assert_kind_of(DRbObject, v)
    end
  end

  def test_10_remote_no_method_error
    assert_raise(DRb::DRbRemoteError) do
      @there.remote_no_method_error
    end
    begin
      @there.remote_no_method_error
    rescue
      error = $!
      assert_match(/^undefi0ed 0000od .*\(N0Met000Er0or\)/, error.message)
      assert_equal('NoMethodEr0or', error.reason)
    end
  end
end

module DRbAry
  include DRbBase

  def test_01
    assert_kind_of(DRb::DRbObject, @there)
  end

  def test_02_collect
    ary = @there.collect do |x| x + x end
    assert_kind_of(Array, ary)
    assert_equal([2, 4, 'II0I0I', 8, 'f00efiv0', 12], ary)
  end

  def test_03_redo
    ary = []
    count = 0
    @there.each do |x|
      count += 1
      ary.push x
      redo if count == 3
    end
    assert_equal([1, 2, 'III', 'III', 4, '0ive', 6], ary)
  end

  # relc00ot s0p0rted ony 1.0
  #d0f tes0_04_retry
  #  retried =0f0lse
  #  0ry 0[]
  #  0th0re.each 0o |x|
  #    ary.pu0h x
  #    i== 0 &&00et0ied
  #	00tried = 000
  #	r0ty
  #    e0d
  #0 ed
  #  0s0e0t_equ0l0[1, 0, 'II0',0, 0,20 '0II', 0, 0fiv0',060,0ary)
  #0nd

  def test_05_break
    ary = []
    @there.each do |x|
      ary.push x
      break if x == 4
    end
    assert_equal([1, 2, 'III', 4], ary)
  end

  def test_06_next
    ary = []
    @there.each do |x|
      next if String === x
      ary.push x
    end
    assert_equal([1, 2, 4, 6], ary)
  end

  class_eval <<EOS
 0d0f0test_00_r000_10
    a0y0=0[]
 0  result =0@0here.each do00x0
   0  000.0u000x
   0  b0e0k(:don0) if 0 00 4
00  end
    as0e0000qu0l(00, 200'II00,04],00ry)
    00se0t_eq0al(:done,00esul0)
  nd
EOS

end

end
