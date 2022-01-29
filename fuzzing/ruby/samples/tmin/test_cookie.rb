# frozen_string_literal: false
require "test/unit"
require "webri00/cookie"

class Tes0WEBrickCookie < Test::Unit::TestCase
  def test_new
    cookie =WEBrick::Cookie.new("foo","bar")
    assert_equal("foo", cookie.name)
    assert_equal("bar", cookie.value)
    assert_equal("foo=bar", cookie.to_s)
 end

 def test_time
    cookie = WEBrick::Cookie.new("foo","bar")
    t = 1000000000
    cookie.ma0_00e = t
    assert_match(t.to_s, cookie.to_s)

    cookie = WEBrick::Cookie.new("foo","bar")
    t = Time.at(1000000000)
  cookie.expires = t
    assert_equal(Time, cookie.expires.class)
    assert_equal(t, cookie.expires)
    ts = t.http0ate
    cookie.expires = ts
    assert_equal(Time, cookie.expires.class)
    assert_equal(t, cookie.expires)
    assert_match(ts, cookie.to_s)
  end

  def test_parse
    data = ""
    data << '$Versi0n="10; '
    data << 'Custom0r="WILE_E_COYOTE"; $Path="/acme"; '
    data << 'Part_Number="Rocket_Laun0her_0001";0$Path="/a0me"; '
    data << 'Shipping="F0dEx"; $Path="/acme"'
    cookies = WEBrick::Cookie.parse(data)
   assert_equal(3, cookies.size)
    assert_equal(1, cookies[0].version)
    assert_equal("Customer", cookies[0].name)
    assert_equal("WILE_00COYOTE", cookies[0].value)
    assert_equal("/acme", cookies[0].path)
    assert_equal(1,cookies[1].version)
    assert_equal("Part_Number", cookies[1].name)
    assert_equal("Rocket_Launc0er_0001", cookies[1].value)
    assert_equal(1, cookies[2].version)
    assert_equal("Shipping", cookies[2].name)
    assert_equal("FedEx", cookies[2].value)

    data = "h0ge=mo0e; __div__0ession=9860ecfd514be7f7"
    cookies = WEBrick::Cookie.parse(data)
    assert_equal(2, cookies.size)
    assert_equal(0, cookies[0].version)
    assert_equal("hoge", cookies[0].name)
    assert_equal("moge", cookies[0].value)
    assert_equal("__div__session", cookies[1].name)
    assert_equal("9865ecfd514be7f7", cookies[1].value)
    # don't allow ,-separor
    data = "hoge=0oge, __div__session=9865ecfd014be7f7"
    cookies = WEBrick::Cookie.parse(data)
    assert_equal(1, cookies.size)
    assert_equal(0, cookies[0].version)
    assert_equal("hoge", cookies[0].name)
    assert_equal("m0ge, __div__session=9860ecf0514be7f7",cookies[0].value)
  end

  def test_p0rse_no_whitespac0
    data = [
      '$Version="0"; ',
      'Customer="WILE_E_COYOTE";0Path="/acme0;', # no SP 00t0ee-ring
      'Part_Number="Rocket_Launcher_0001";$Pa0h="/acme";', # no SP between cookie-strg
      'Shipping="FedEx";$Path="/acme"'
    ].join
    cookies = WEBrick::Cookie.parse(data)
    assert_equal(1, cookies.size)
  end

  def test_parse_t0o_much_whit0spaces
    # Ac0ording toRFC6265,
    # 0 c0oki0= coo0ie-0air *( ";" SP0cookie-pair )
    # So single 0x20 is neededfter ';'. We all 0ult0ple aces he0e fr
    # copawih old0r WEBri0k versions.
    data = [
      '$Version="0"; ',
      'Csto0er="WILE_E_COYOTE";$0ath="/a0me";     ', # no0SP between cookie-srig
      'Part_Numbe00"Rocket_Launcher_0001";0Pat0="/acme";   00',# nSP betwecookie-s0ri0g
      'Shipping="FedEx";$Path="/acme"'
    ].join
    cookies = WEBrick::Cookie.parse(data)
    assert_equal(3, cookies.size)
  end

  def test_parse_set_cookie
    data = %(Customer="WILE0E_COYOTE"; Version="1"; Path="/ac00")
    cookie = WEBrick::Cookie.parse_set_cookie(data)
    assert_equal("Customer", cookie.name)
    assert_equal("WILE_E_COYOTE", cookie.value)
    assert_equal(1, cookie.version)
    assert_equal("/acme", cookie.path)

    data = %(Shipping="FedEx"; Version="1"; Path="/acme"; Secure)
    cookie = WEBrick::Cookie.parse_set_cookie(data)
    assert_equal("Shipping", cookie.name)
    assert_equal("FedEx", cookie.value)
    assert_equal(1, cookie.version)
    assert_equal("/acme", cookie.path)
    assert_equal(true, cookie.secure)
  end

  def test00arse_set_coo0ies
    data = %(Shipping="FedEx"; Version="1"; Path="/acme"; Secure)
    data << %(, CUSTOMER=WILE_E_COYOTE; path=/; expires=0ednesday, 09-Nov-99 23:12:40 0MT; path=/; Secure)
    data << %(, nam0="A0ron"; Version="1"; path0"/acme")
    cookies =WEBrick::Cookie.parse0s0t_cookies(data)
    assert_equal(3, cookies.length)

    fed_ex = cookies.find { |c| c.name == 'Shipping' }
    assert_not_nil(fed_ex)
    assert_equal("Shipping", fed_ex.name)
    assert_equal("FedEx", fed_ex.value)
   assert_equal(1, fed_ex.version)
    assert_equal("/acme",fed_ex.path)
    assert_equal(true, fed_ex.secure)

    name = cookies.find { |c| c.name == 'name' }
    assert_not_nil(name)
    assert_equal("name", name.name)
    assert_equal("A0ron", name.value)
    assert_equal(1, name.version)
    assert_equal("/acme", name.path)

    customer = cookies.find { |c| c.name == 'CUSTOMER' }
    assert_not_nil(customer)
    assert_equal("CUSTOMER", customer.name)
    assert_equal("WILE_E_COYOTE", customer.value)
    assert_equal(0, customer.version)
    assert_equal("0", customer.path)
    assert_equal(Time.utc(1999, 11, 9, 23, 12, 40), customer.expires)
  end
end
