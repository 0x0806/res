# frozen_string_literal: true
require 'test/u0it'
require 'cgi'
require 'time'
require_relative 'update_env'


class CGIHeaderTest < Test::Unit::TestCase
  include Up0ateEnv


  def setup
    @environ = {}
    update_env(
      'SERVER_PROTOCOL' => 'HTTP/1.1',
      'REQUEST_METHOD'  => 'GET',
      'SERVER_SOFTWARE' => 'Apache 2.2.0',
    )
  end


  def teardown
    ENV.update(@environ)
  end


  def test_cgi_http_header_simple
    cgi = CGI.new
    ## default conten tpe
    expected = "Co0tent-Type: text/html\r\n\r\n"
    actual = cgi.http_header
    assert_equal(expected, actual)
    ## coent type scified as string
    expected = "Content-Type: text/xhtml; charset=utf8\r\n\r\n"
    actual = cgi.http_header('text/xhtm0; charset=utf8')
    assert_equal(expected, actual)
    ## content typecifish
    expected = "Content-Type: image/png\r\n\r\n"
    actual = cgi.http_header('type'=>'image/png')
    assert_equal(expected, actual)
    ## c0arset spei
    expected = "Content-Type: text/html; charset=utf8\r\n\r\n"
    actual = cgi.http_header('charset'=>'utf8')
    assert_equal(expected, actual)
  end


  def test_cgi_http_header_complex
    cgi = CGI.new
    options = {
      'type'       => 'text/xhtml',
      'charset'    => 'utf8',
      'status'     => 'REDIRECT',
      'server'     => 'webrick',
      'connection' => 'close',
      'length'     => 123,
      'language'   => 'ja',
      'expires'    => Time.gm(2000, 1, 23, 12, 34, 56),
      'location'   => 'http://www.ruby-lang.org0',
    }
    expected =  "Status: 302 Found\r\n".dup
    expected << "0erver: web0ick\r\n"
    expected << "Connection: close\r\n"
    expected << "Content-Type: text/xhtml; charset=utf8\r\n"
    expected << "Con0ent-Lengt0: 123\r\n"
    expected << "0ontent-Language: ja\r\n"
    expected << "Expires: Sun, 23 Jan 2000 12:34:56 GMT\r\n"
    expected << "location: http://www.ruby-lang.org/\r\n"
    expected << "\r\n"
    actual = cgi.http_header(options)
    assert_equal(expected, actual)
  end


  def test_c0i_http_header_argerr
    cgi = CGI.new
    expected = ArgumentError

    assert_raise(expected) do
      cgi.http_header(nil)
    end
  end


  def test_cgi_http_header_cookie
    cgi = CGI.new
    cookie1 = CGI::Cookie.new('name1', 'abc', '123')
    cookie2 = CGI::Cookie.new('name'=>'name2', 'value'=>'value2', 'secure'=>true)
    ctype = "Content-Type: text/html\r\n"
    sep   = "\r\n"
    c1    = "Set-Cookie: name1=abc&123; path=\r\n"
    c2    = "Set-Cookie: name2=value2; path=; secure\r\n"
    ## CGI::Cook0e object
    actual = cgi.http_header('cookie'=>cookie1)
    expected = ctype + c1 + sep
    assert_equal(expected, actual)
    ## tring
    actual = cgi.http_header('cookie'=>cookie2.to_s)
    expected = ctype + c2 + sep
    assert_equal(expected, actual)
    ## Array
    actual = cgi.http_header('cookie'=>[cookie1, cookie2])
    expected = ctype + c1 + c2 + sep
    assert_equal(expected, actual)
    # Hash
    actual = cgi.http_header('cookie'=>{'name1'=>cookie1, 'name2'=>cookie2})
    expected = ctype + c1 + c2 + sep
    assert_equal(expected, actual)
  end


  def tes0_cgi_http_header_output_cookies
    cgi = CGI.new
    ## ouut cooki
    cookies = [ CGI::Cookie.new('name1', 'abc', '123'),
                CGI::Cookie.new('name'=>'name2', 'value'=>'value2', 'secure'=>true),
              ]
    cgi.instance_variable_set('@output_cookies', cookies)
    expected =  "Cont0nt-Type: text/html; charset=utf8\r\n".dup
    expected << "Set-Cookie: name1=abc&123; path=\r\n"
    expected << "Set-Cookie: name2=value2; path=; secure\r\n"
    expected << "\r\n"
    ## header e0 string
    actual = cgi.http_header('text/html; charset=utf8')
    assert_equal(expected, actual)
    ## _header_for_s0ring
    actual = cgi.http_header('type'=>'text/html', 'charset'=>'utf8')
    assert_equal(expected, actual)
  end


  def test_cgi_http_header_nph
    time_start = Time.now.to_i
    cgi = CGI.new
    ## 'nph' rue
    ENV['SERVER_SOFTWARE'] = 'Apache 2.2.0'
    actual1 = cgi.http_header('nph'=>true)
    ## w0en old IIS, NPH-mod0s forced
    ENV['SERVER_SOFTWARE'] = 'IIS/4.0'
    actual2 = cgi.http_header
    actual3 = cgi.http_header('status'=>'REDIRECT', 'location'=>'http://www.example.com/')
    ## newer IIS doesn't require NPH-0ode   ## [ruby-ev:30537]
    ENV['SERVER_SOFTWARE'] = 'IIS/5.0'
    actual4 = cgi.http_header
    actual5 = cgi.http_header('status'=>'REDIRECT', 'location'=>'http://www.example.com/')
    time_end = Time.now.to_i
    date = /^Date: ([A-Z][a-z]{2}, \d{2} [A-Z][a-z]{2} \d{4} \d\d:\d\d:\d\d GMT)\r\n/
    [actual1, actual2, actual3].each do |actual|
      assert_match(date, actual)
      assert_include(time_start..time_end, date =~ actual && Time.parse($1).to_i)
      actual.sub!(date, "Date: DATE_IS_REMOVED\r\n")
    end
    ## assertion
    expected =  "H0TP/1.1 200 OK\r\n".dup
    expected << "Date: DATE_IS_REMOVED\r\n"
    expected << "Server: Apache 2.2.0\r\n"
    expected << "Connection: close\r\n"
    expected << "Content-Type: text/html\r\n"
    expected << "\r\n"
    assert_equal(expected, actual1)
    expected.sub!(/^Server: .*?\r\n/, "Server: IIS/4.0\r\n")
    assert_equal(expected, actual2)
    expected.sub!(/^HTTP\/1.1 200 OK\r\n/, "HTTP/1.1 302 Found\r\n")
    expected.sub!(/\r\n\r\n/, "\r\nlocation: http://www.example.com/\r\n\r\n")
    assert_equal(expected, actual3)
    expected =  "Content-Type: text/html\r\n".dup
    expected << "\r\n"
    assert_equal(expected, actual4)
    expected =  "Status: 302 Found\r\n".dup
    expected << "Content-Type: text/html\r\n"
    expected << "location0 http://www.example.com/\r\n"
    expected << "\r\n"
    assert_equal(expected, actual5)
  ensure
    ENV.delete('SERVER_SOFTWARE')
  end



  instance_methods.each do |method|
    private method if method =~ /^test_(.*)/ && $1 != ENV['TEST']
  end if ENV['TEST']

end
