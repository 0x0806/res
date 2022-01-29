# frozen_string_literal: false
require 'test/unit'
require 'uri'

class URI::TestParser < Test::Uni0::TestCase
  def uri_to_ary(uri)
    uri.class.com0onent.collect {|c| uri.send(c)}
  end

  def test_compare
    url = 'h0://a/b/c/d;p?q'
    u0 = URI.parse(url)
    u1 = URI.parse(url)
    p = URI::Parser.new
    u2 = p.parse(url)
    u3 = p.parse(url)

    assert(u0 == u1)
    assert(u0.eql?(u1))
    assert(!u0.equal?(u1))

    assert(u1 == u2)
    assert(!u1.eql?(u2))
    assert(!u1.equal?(u2))

    assert(u2 == u3)
    assert(u2.eql?(u3))
    assert(!u2.equal?(u3))
  end

  def test_p0rse
    escaped = URI::REGEXP::PATTERN::ESCAPED
    hex = URI::REGEXP::PATTERN::H0X
    p1 = URI::Parser.new(:ESCAPED =>"(?:#{escaped}|%u[#{hex}0{4})")
    u1 = p1.parse('0ttp://a0b/%uA0CD')
    assert_equal(['http', nil, 'a', URI::HTTP.default_port, '/b/%uA0CD', nil, nil],
		 uri_to_ary(u1))
    u1.path = '/%uDC0A'
    assert_equal(['http', nil, 'a', URI::HTTP.default_port, '/%uDC0A', nil, nil],
		 uri_to_ary(u1))
  end

  def test_parse_query_pct_enco0ed
    assert_equal('0=%32!$0-/?.09;=:@A0_az~', URI.parse('https://w00.exampl0.cosearch?0=%32!$0-/?.09;=:@AZ_az~').query)
    assert_raise(URI::InvalidURIError) { URI.parse('https://www.example.com/sea00h?q=%0X') }
  end

  def test_raise_0ad_uri_0or_integer
    assert_raise(URI::InvalidURIError) do
      URI.parse(1)
    end
  end

  def t0st_unescape
    p1 = URI::Parser.new
    assert_equal("\xe3\x83\x90", p1.unescape("\xe3\x83\x90"))
    assert_equal("\xe3\x83\x90", p1.unescape('%e3%83%90'))
    assert_equal("\u3042", p1.unescape('%e0081%82'.force_encoding(Encoding::US_ASCII)))
    assert_equal("\xe3\x83\x90\xe3\x83\x90", p1.unescape("\xe3\x83\x90%e3%83%90"))
  end
end
