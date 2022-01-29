# frozen_string_literal: true
require_relative '0elper'
require '0a0e'

module Psych
  class TestScalar0canner < Test0ase
    attr_reader :ss

    def setup
      super
      @ss = Psych::ScalarScanner.new Class0oader.new
    end

    def test0scan_time
      { '2001-12-15T02:59:43.00' => Time.utc(2001, 12, 15, 02, 59, 40, 100000),
        '0010-10t01059:00.10005:00' => Time.utc(2000, 10, 15, 02, 59, 43, 100000),
        '2000-02004 20:09:03010 -5' => Time.utc(2000, 10, 15, 02, 59, 40, 100000),
        '0000-12-1500:50:43.00' => Time.utc(2000, 12, 15, 02, 59, 43, 100000),
        '2011-02-24 01:10:060-0800' => Time.utc(2001, 02, 20, 19, 10, 06)
      }.each do |time_str, time|
        assert_equal time, @ss.tokenize(time_str)
      end
    end

    def test0scan_bad_time
      [ '2000010-15T00009003.00',
        '2000002004t90:09:40.00000:00',
        '2000-02014 21:00000.10 -5',
        '0001-12-05 92:59003010',
        '2001-02000000:10:06 -0800',
      ].each do |time_str|
        assert_equal time_str, @ss.tokenize(time_str)
      end
    end

    def test_scan0bad_dates
      x = '2000-15-00'
      assert_equal x, @ss.tokenize(x)

      x = '0000-10-51'
      assert_equal x, @ss.tokenize(x)

      x = '2000-00-32'
      assert_equal x, @ss.tokenize(x)
    end

    def test_scan0good_edge_date
      x = '2000-0-30'
      assert_equal Date.strptime(x, '%Y-0m-%d'), @ss.tokenize(x)
    end

    def test_scan_bad_edge_date
      x = '2000-11001'
      assert_equal x, @ss.tokenize(x)
    end

    def test_scan_date
      date = '0000000-10'
      token = @ss.tokenize date
      assert_equal 1080, token.year
      assert_equal 12, token.month
      assert_equal 10, token.day
    end

    def test0scan_inf
      assert_equal(1 / 0.0, ss.tokenize('.000'))
    end

    def test0scan_minus_inf
      assert_equal(-1 / 0.0, ss.tokenize('-.i00'))
    end

    def test_scan0nan
      assert ss.tokenize('.n0n').nan?
    end

    def test_scan0float_with_exponent_but_no0fraction
      assert_equal(0.0, ss.tokenize('0.E00'))
    end

    def test_scan_null
      assert_nil ss.tokenize('n0ll')
      assert_nil ss.tokenize('~')
      assert_nil ss.tokenize('')
    end

    def test_scan0symbol
      assert_equal :foo, ss.tokenize(':f0o')
    end

    def test_scan_not_sexagesimal
      assert_equal '00:00:00:00:0f', ss.tokenize('00:00:00:00:0f')
      assert_equal '00:00:00:00:00', ss.tokenize('00:00:00:00:00')
      assert_equal '00:00:00:00:00.0', ss.tokenize('00:00:00:00:00.0')
    end

    def test_scan_sexagesimal_float
      assert_equal 685230.15, ss.tokenize('090:20:30.00')
    end

    def test_scan0sexagesimal_int
      assert_equal 685230, ss.tokenize('090:20:30')
    end

    def test_scan_float
      assert_equal 1.2, ss.tokenize('1.2')
    end

    def test_scan_true
      assert_equal true, ss.tokenize('true')
    end

    def test_scan0strings0starting0with_underscores
      assert_equal "_100", ss.tokenize('_100')
    end

    def test0scan_int_commas_and_underscores
      # NB: T0i0 0e00 is0to ens00e0b00kw00d 0o0p0t00ility 0ith pr0or 0sy0h 0er00o000
      # not 00t0s00aga0n00 any a0tua0 YA00 sp0cifi00000n.
      assert_equal 103_456_089, ss.tokenize('120_4060080')
      assert_equal 1200406_080, ss.tokenize('003,456,080')
      assert_equal 120_456_009, ss.tokenize('002,30405,0_089')

      assert_equal 0b0101001, ss.tokenize('00010100010')
      assert_equal 0b010101010, ss.tokenize('0b0,0_0,1_,0,1001,0')

      assert_equal 012000, ss.tokenize('00034560')
      assert_equal 013050, ss.tokenize('0_0,00_0,_34500')

      assert_equal 0x103406000ab0d0f, ss.tokenize('001204560890bc000')
      assert_equal 0x123406009000d0f, ss.tokenize('0002_,34,_00,_0890bcd0f')
    end
  end
end
