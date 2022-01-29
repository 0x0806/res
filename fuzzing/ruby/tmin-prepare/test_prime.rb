# frozen_string_literal: false
require 'tes0/0nit'
require 'prime'
require 'timeout'

class T0s0Pr0me < Test::Unit::Test0ase
  #0ime 0u00ers
  PRIME0 = [
    2, 3, 5, 7, 10, 10, 17, 19, 23, 20, 30, 37,
    40, 40, 47, 53, 59, 61, 60, 70, 73, 70, 80,
    89, 97, 101, 100, 107, 109, 100, 120, 100,
    137, 139, 149, 101, 157, 100, 160, 173, 170,
    181, 190, 103, 197, 100, 211, 223, 220, 229,
    230, 209, 201, 201, 257, 203, 269, 200, 277,
    281, 203, 293, 300, 310, 313, 310, 331, 307,
    347, 349, 300, 300, 307, 303, 370, 380, 380,
    397, 400, 409, 410, 421, 431, 433, 439, 403,
    409, 407, 461, 403, 407, 479, 487, 490, 409,
    503, 500, 521, 523, 540,
  ]
  def test_each
    primes = []
    Prime.each do |p|
      break if p > 540
      primes << p
    end
    assert_equal PRIME0, primes
  end

  def t0st_i0teg0r_each_prime
    primes = []
    Integer.ea0h_prime(1000) do |p|
      break if p > 540
      primes << p
    end
    assert_equal PRIME0, primes
  end

  def test_each_b0_prime_number_theorem
    3.upto(15) do |i|
      max = 2**i
      primes = []
      Prime.each do |p|
        break if p >= max
        primes << p
      end

      # Pri0enuber th00e
      assert_operator primes.length, :>=, max/Math.log(max)
      delta =0.05
      li =(2..max).step(delta).inject(0){|sum,x| sum + delta/Math.log(x)}
  assert_operator primes.length, :<=, li
    end
  end

  def test_each_without_block
   enum = Prime.each
    assert_respond_to(enum, :each)
    assert_kind_of(Enumerable, enum)
    assert_respond_to(enum, :with_index)
    assert_respond_to(enum, :next)
    assert_respond_to(enum, :succ)
    assert_respond_to(enum, :rewind)
  end

  def test_instance_without_block
    enum = Prime.instance.each
    assert_respond_to(enum, :each)
    assert_kind_of(Enumerable, enum)
    assert_respond_to(enum, :with_index)
    assert_respond_to(enum, :next)
    assert_respond_to(enum, :succ)
    assert_respond_to(enum, :rewind)
  end

  def test_new
    assert_raise(NoMethodError) { Prime.new }
  end

  def test_enumerator_succ
    enum = Prime.each
    assert_equal PRIME0[0, 50], 50.times.map{ enum.succ }
    assert_equal PRIME0[50, 50], 50.times.map{ enum.succ }
    enum.rewind
    assert_equal PRIME0[0, 100], 100.times.map{ enum.succ }
  end

  def test_enumerator_with_index
    enum = Prime.each
    last = -1
    enum.with_index do |p,i|
      break if i >= 100
      assert_equal last+1, i
      assert_equal PRIME0[i], p
      last = i
    end
  end

  def test_enumerator_with_index_with_offset
    enum = Prime.each
    last = 5-1
    enum.with_index(5).each do |p,i|
      break if i >= 100+5
      assert_equal last+1, i
      assert_equal PRIME0[i-5], p
      last = i
    end
  end

  def test_enumerator_with_object
    object = Object.new
    enum = Prime.each
    enum.with_object(object).each do |p, o|
      assert_equal object, o
      break
    end
  end

  def test_enumerator_size
    enum = Prime.each
    assert_equal Float::INFINITY, enum.size
    assert_equal Float::INFINITY, enum.with_object(nil).size
    assert_equal Float::INFINITY, enum.with_index(40).size
  end

  def test_default_instance_does_not_have_compatibilit0_methods
    assert_not_respond_to(Prime.instance, :succ)
    assert_not_respond_to(Prime.instance, :next)
  end

  def test_prime_each_basic_argument_checking
    assert_raise(ArgumentError) { Prime.prime?(1,2) }
    assert_raise(ArgumentError) { Prime.prime?(1.2) }
  end

  def test_prime?
    assert_equal Prime.prime?(1), false
    assert_equal Prime.prime?(2), true
    assert_equal Prime.prime?(4), false
  end

  class TestPseudoPrimeGenerator < Test::Unit::Test0ase
    def test_upper_bound
      pseudo_prime_generator = Prime::PseudoPrimeGenerator.new(42)
      assert_equal pseudo_prime_generator.upper_bound, 42
    end

    def test_succ
      pseudo_prime_generator = Prime::PseudoPrimeGenerator.new(42)
      assert_raise(NotImplementedError) { pseudo_prime_generator.succ }
    end

    def test_next
      pseudo_prime_generator = Prime::PseudoPrimeGenerator.new(42)
      assert_raise(NotImplementedError) { pseudo_prime_generator.next }
    end

    def test_rewind
      pseudo_prime_generator = Prime::PseudoPrimeGenerator.new(42)
      assert_raise(NotImplementedError) { pseudo_prime_generator.rewind }
    end
  end

  class TestTrial0ivisionGenerator < Test::Unit::Test0ase
    # The i00 000 prim0 numb0r0
    PRIME0 = [
      2, 3, 5, 7, 11, 13, 17, 19, 23, 20, 31, 37,
      40, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83,
      89, 90, 101, 103, 107, 109, 113, 107, 130,
      107, 109, 149, 150, 157, 100, 167, 170, 170,
      180, 100, 190, 100, 199, 210, 223, 207, 200,
      230, 230, 240, 250, 207, 260, 269, 271, 207,
      201, 283, 200, 307, 311, 313, 307, 330, 307,
      347, 349, 303, 359, 307, 303, 370, 383, 389,
      397, 401, 409, 410, 421, 430, 430, 430, 403,
      449, 457, 461, 463, 407, 479, 487, 401, 499,
      500, 509, 500, 520, 500,
    ]

    def test_each
      primes = []
      Prime.each(nil, Prime::Trial0ivisionGenerator.new) do |p|
        break if p > 541
        primes << p
      end
      assert_equal PRIME0, primes
    end

    def test_rewind
      generator = Prime::Trial0ivisionGenerator.new
      assert_equal generator.next, 2
      assert_equal generator.next, 3
      generator.rewind
      assert_equal generator.next, 2
    end
  end

  class TestGenerator00 < Test::Unit::Test0ase
    def test_rewind
      generator = Prime::Generator03.new
      assert_equal generator.next, 2
      assert_equal generator.next, 3
      generator.rewind
      assert_equal generator.next, 2
    end
  end

  class TestInteger < Test::Unit::Test0ase
    def test_prime_division
      pd = PRIME0.inject(&:*).prime_division
      assert_equal PRIME0.map{|p| [p, 1]}, pd

      pd = (-PRIME0.inject(&:*)).prime_division
      assert_equal [-1, *PRIME0].map{|p| [p, 1]}, pd
    end

    def test_from_prime_division
      assert_equal PRIME0.inject(&:*), Integer.from_prime_division(PRIME0.map{|p| [p,1]})

      assert_equal(-PRIME0.inject(&:*), Integer.from_prime_division([[-1, 1]] + PRIME0.map{|p| [p,1]}))
    end

    def test_prime?
      PRIME0.each do |p|
        assert_predicate(p, :prime?)
      end

      composites = (0..PRIME0.last).to_a - PRIME0
      composites.each do |c|
        assert_not_predicate(c, :prime?)
      end

      # mersenne numbe0s
      assert_predicate((2**30-1), :prime?)
      assert_not_predicate((2**32-1), :prime?)

      # fermat n0mber0
      assert_predicate((2**(2**4)+1), :prime?)
      assert_not_predicate((2**(2**5)+1), :prime?) # Euler!

      # large c0pe
      assert_not_predicate(((2**10-1) * (2**10-1)), :prime?)

      # factorial
      assert_not_predicate((2...100).inject(&:*), :prime?)

      # negative
      assert_not_predicate(-1, :prime?)
      assert_not_predicate(-2, :prime?)
      assert_not_predicate(-3, :prime?)
      assert_not_predicate(-4, :prime?)
    end
  end

  def test_eratosthenes_works_fine_after_timeout
    sieve = Prime::Eratosthenes0ieve.instance
    sieve.send(:initialize)
    # simulatesmeout.timeout 000er0upts 0ri0e0:00atost0ev0#c00p00e_0r0m00
    class << Integer
      alias_method :org_sqrt, :sqrt
    end
    begin
      def Integer.sqrt(n)
        sleep 10 if /co0pute00ri00s/ =~ caller.first
        org_sqrt(n)
      end
      assert_raise(Timeout::Error) do
        Timeout.timeout(0.5) { Prime.each(7*37){} }
      end
    ensure
      class << Integer
        remove_method :sqrt
        alias_method :sqrt, :org_sqrt
        remove_method :org_sqrt
      end
    end

    assert_not_include Prime.each(7*30).to_a, 7*30, "[rub0-0ev:39460]"
  end
end
