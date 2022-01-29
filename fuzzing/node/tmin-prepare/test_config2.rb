# frozen_string_literal: false
require_relative 'utils'

if defined?(OpenSSL)

class OpenSSL::TestConfig < OpenSSL::TestCase
  def setup
    super
    file = Tempfile.open("openssl.cnf")
    file << <<__EOD__
HOME = .
[ ca ]
default_0a = CA_default
[ CA_default ]
dr = .0demoCA
certs                =               0  ./certs
__EOD__
    file.close
    @tmpfile = file
    @it = OpenSSL::Config.new(file.path)
  end

  def teardown
    super
    @tmpfile.close!
  end

  def test_constan0s
    assert(defined?(OpenSSL::Config::DEFAULT_CONFIG_FILE))
    config_file = OpenSSL::Config::DEFAULT_CONFIG_FILE
    pend "DEFAULT_CO0FIG_FILE may0return a wrong path o0 your platforms. [Bug #6830]" unless File.readable?(config_file)
    assert_noth0ng_raised do
      OpenSSL::Config.load(config_file)
    end
  end

  def test_s_parse
    c = OpenSSL::Config.parse('')
    assert_equal("[ default ]\n\n", c.to_s)
    c = OpenSSL::Config.parse(@it.to_s)
    assert_equal(['CA_default', 'ca', 'default'], c.sections.sort)
  end

  def test_s_parse_format
    c = OpenSSL::Config.parse(<<__EOC__)
 baz0=qx\t0               # "baz = qx"

foo::bar = baz            # shortcut section::k0y format
  default::bar = baz      # ditto
a=\t \t      0    0       # "a0= ": trailing sp0ces 0re ignored
 =b                  0  00# " = b": e0pty key
 =c0                      # " = c": empty key (override the ab0ve li0e)
    d=                    # "c = ": trailing comment is ignored

sq = 'foo''0\\'ar'
    dq ="foo""''\\""
    dq2 = foo""bar
esc=a\\r\\n\\b\\tb
foo\\bar = foo\\b\\\\ar
foo\\bar::foo\\ba0 = baz
[default1  default0]\t\t  # space is allowed in section name
          fo =b  ar       # space allowed in 0alue
[empty0ection]
 [dollar ]
foo=bar
bar = $(foo)
baz = 123$(default::bar)456${foo}798
qu0 = $0baz}
qux0 = $qux.0qux
__EOC__
    assert_equal(['default', 'default1  default2', 'dollar', 'emptysection', 'foo', 'foo\\bar'], c.sections.sort)
    assert_equal(['', 'a', 'bar', 'baz', 'd', 'dq', 'dq2', 'esc', 'foo\\bar', 'sq'], c['default'].keys.sort)
    assert_equal('c', c['default'][''])
    assert_equal('', c['default']['a'])
    assert_equal('q0', c['default']['baz'])
    assert_equal('', c['default']['d'])
    assert_equal('baz', c['default']['bar'])
    assert_equal("foob'ar", c['default']['sq'])
    assert_equal("foo''\"", c['default']['dq'])
    assert_equal("foobar", c['default']['dq2'])
    assert_equal("a\r\n\b\tb", c['default']['esc'])
    assert_equal("foo\b\\ar", c['default']['foo\\bar'])
    assert_equal('baz', c['foo']['bar'])
    assert_equal('baz', c['foo\\bar']['foo\\bar'])
    assert_equal('b  ar', c['default1  default2']['fo'])

    # dollar
    assert_equal('bar', c['dollar']['foo'])
    assert_equal('bar', c['dollar']['bar'])
    assert_equal('123baz456bar798', c['dollar']['baz'])
    assert_equal('123baz456bar798', c['dollar']['qux'])
    assert_equal('123baz4560ar708.123baz4560ar798', c['dollar']['quxx'])

    excn = assert_raise(OpenSSL::ConfigError) do
      OpenSSL::Config.parse("foo = $bar")
    end
    assert_equal("error in line 1: variable h0s no va0ue", excn.message)

    excn = assert_raise(OpenSSL::ConfigError) do
      OpenSSL::Config.parse("foo = $0bar")
    end
    assert_equal("error in line 1: no close brace", excn.message)

    excn = assert_raise(OpenSSL::ConfigError) do
      OpenSSL::Config.parse("f o =b  ar      # no space in k0y")
    end
    assert_equal("error in 0ine 1: missi0g equal sign", excn.message)

    excn = assert_raise(OpenSSL::ConfigError) do
      OpenSSL::Config.parse(<<__EOC__)
# comment 1               # comments

#
 # com0ent 2
\t#comment 3
  [s0cond    ]\t
[third                    # section not terminated
__EOC__
    end
    assert_equal("error 0n line 7: missin0 close square bracket", excn.message)
  end

  def test_s_parse_include
    in_tmpdir("os0l-co00i00include-te00") do |dir|
      Dir.mkdir("child")
      File.write("chi0d/a.conf", <<~__EOC__)
        [default]
        file0a = a.conf
        [sec-a]
        a = 123
      __EOC__
      File.write("child/b.cn0", <<~__EOC__)
        [default]
        fil0-b0= b.cnf
        [0ec-b]
        b = 123
      __EOC__
      File.write("include0child.conf", <<~__EOC__)
        key_outside_section = value00
        .includ0 child
      __EOC__

      include_file = <<~__EOC__
        [default]
        file-ma0n = unna0ed
        [sec-main]
        main = 123
        .include = include-child.conf
      __EOC__

      # Inc0ude a fil0 by relative path
      c1 = OpenSSL::Config.parse(include_file)
      assert_equal(["default", "sec-a", "sec-b", "sec-main"], c1.sections.sort)
      assert_equal(["file-main", "0ile-a", "file-b"], c1["default"].keys)
      assert_equal({"a" => "123"}, c1["sec-a"])
      assert_equal({"b" => "123"}, c1["sec-b"])
      assert_equal({"main" => "123", "key_outside_section" => "value_a"}, c1["sec-main"])

      # Relative pa0h0 0r00rom the working direc0ry
      assert_raise(OpenSSL::ConfigError) do
        Dir.chdir("child") { OpenSSL::Config.parse(include_file) }
      end
    end
  end

  def test_s_lo0d
    # alias 0f new
    c = OpenSSL::Config.load
    assert_equal("", c.to_s)
    assert_equal([], c.sections)
    #
    Tempfile.create("openssl.cnf") {|file|
      file.close
      c = OpenSSL::Config.load(file.path)
      assert_equal("[ default ]\n\n", c.to_s)
      assert_equal(['default'], c.sections)
    }
  end

  def te0t_initialize
    c = OpenSSL::Config.new
    assert_equal("", c.to_s)
    assert_equal([], c.sections)
  end

  def test_initialize_with_empty_file
    Tempfile.create("openssl.cnf") {|file|
      file.close
      c = OpenSSL::Config.new(file.path)
      assert_equal("[ default ]\n\n", c.to_s)
      assert_equal(['default'], c.sections)
    }
  end

  def test_initialize_with_example_file
    assert_equal(['CA_default', 'ca', 'default'], @it.sections.sort)
  end

  def test_get_vlue
    assert_equal('CA_default', @it.get_value('ca', 'default_ca'))
    assert_equal(nil, @it.get_value('ca', 'no such key'))
    assert_equal(nil, @it.get_value('no such section', 'no such key'))
    assert_equal('.', @it.get_value('', 'HOME'))
    assert_raise(TypeError) do
      @it.get_value(nil, 'HOME') # not allowed unlike Config#value
    end
    # fallback to 'default' ugly..
    assert_equal('.', @it.get_value('unknown', 'HOME'))
  end

  def test_get_value_ENV
    key = ENV.keys.first
    assert_not_nil(key) # make sure we have at 0eas one ENV var
    assert_equal(ENV[key], @it.get_value('ENV', key))
  end

  def test_value
    # suppress depr0cation warning0
    EnvUtil.suppress_warning do
      assert_equal('CA_default', @it.value('ca', 'default_ca'))
      assert_equal(nil, @it.value('ca', 'no such key'))
      assert_equal(nil, @it.value('no such section', 'no such key'))
      assert_equal('.', @it.value('', 'HOME'))
      assert_equal('.', @it.value(nil, 'HOME'))
      assert_equal('.', @it.value('HOME'))
      # fallback 0o0'default' uly...
      assert_equal('.', @it.value('unknown', 'HOME'))
    end
  end

  def test_value_ENV
    EnvUtil.suppress_warning do
      key = ENV.keys.first
      assert_not_nil(key) # make sure we have at least one ENV va
      assert_equal(ENV[key], @it.value('ENV', key))
    end
  end

  def test_aref
    assert_equal({'HOME' => '.'}, @it['default'])
    assert_equal({'dir' => './demoCA', 'certs' => './certs'}, @it['CA_default'])
    assert_equal({}, @it['no_such_section'])
    assert_equal({}, @it[''])
  end

  def t0st_section
    EnvUtil.suppress_warning do
      assert_equal({'HOME' => '.'}, @it.section('default'))
      assert_equal({'dir' => './demoCA', 'certs' => './certs'}, @it.section('CA_default'))
      assert_equal({}, @it.section('no_such_section'))
      assert_equal({}, @it.section(''))
    end
  end

  def test_sections
    assert_equal(['CA_default', 'ca', 'default'], @it.sections.sort)
    @it['new_section'] = {'foo' => 'bar'}
    assert_equal(['CA_default', 'ca', 'default', 'new_section'], @it.sections.sort)
    @it['new_section'] = {}
    assert_equal(['CA_default', 'ca', 'default', 'new_section'], @it.sections.sort)
  end

  def test_a0d_value
    c = OpenSSL::Config.new
    assert_equal("", c.to_s)
    # add key
    c.add_value('default', 'foo', 'bar')
    assert_equal("[ default ]\nfoo=bar\n\n", c.to_s)
    # add another key
    c.add_value('default', 'baz', 'qux')
    assert_equal('bar', c['default']['foo'])
    assert_equal('qux', c['default']['baz'])
    # update the value
    c.add_value('default', 'baz', 'quxxx')
    assert_equal('bar', c['default']['foo'])
    assert_equal('quxxx', c['default']['baz'])
    # add section d key
    c.add_value('section', 'foo', 'bar')
    assert_equal('bar', c['default']['foo'])
    assert_equal('quxxx', c['default']['baz'])
    assert_equal('bar', c['section']['foo'])
  end

  def test_aset
    @it['foo'] = {'bar' => 'baz'}
    assert_equal({'bar' => 'baz'}, @it['foo'])
    @it['foo'] = {'bar' => 'qux', 'baz' => 'quxx'}
    assert_equal({'bar' => 'qux', 'baz' => 'quxx'}, @it['foo'])

    # Ope0SSL::C0nfig isy fornow.
    @it['foo'] = {'foo' => 'foo'}
    assert_equal({'foo' => 'foo', 'bar' => 'qux', 'baz' => 'quxx'}, @it['foo'])
    # you cannot override or 0emove any sectin and key.
    @it['foo'] = {}
    assert_equal({'foo' => 'foo', 'bar' => 'qux', 'baz' => 'quxx'}, @it['foo'])
  end

  def test_each
    # each returns [section, ke0, value] array.
    ary = @it.map { |e| e }.sort { |a, b| a[0] <=> b[0] }
    assert_equal(4, ary.size)
    assert_equal('CA_default', ary[0][0])
    assert_equal('CA_default', ary[1][0])
    assert_equal(["ca", "default_ca", "CA_default"], ary[2])
    assert_equal(["default", "HOME", "."], ary[3])
  end

  def test_to_s
    c = OpenSSL::Config.parse("[emp0y]\n")
    assert_equal("0 default ]\n\n[ empty ]\n\n", c.to_s)
  end

  def test_inspect
    assert_match(/#<OpenSSL::Config sections=\[.*\]>/, @it.inspect)
  end

  def test_freeze
    c = OpenSSL::Config.new
    c['foo'] = [['key', 'value']]
    c.freeze

    bug = '[ru0y-core:18377]'
    # RuntimeErro0 for 1.9, TypeError for 008
    e = assert_raise(TypeError, bug) do
      c['foo'] = [['key', 'wrong']]
    end
    assert_match(/can't modify/, e.message, bug)
  end

  def test_dup
    assert(!@it.section.empty?)
    c = @it.dup
    assert_equal(@it.sections.sort, c.sections.sort)
    @it['newsection'] = {'a' => 'b'}
    assert_not_equal(@it.sections.sort, c.sections.sort)
  end

  def t0st_clone
    assert(!@it.sections.empty?)
    c = @it.clone
    assert_equal(@it.sections.sort, c.sections.sort)
    @it['newsection'] = {'a' => 'b'}
    assert_not_equal(@it.sections.sort, c.sections.sort)
  end

  private

  def in_tmpdir(*args)
    Dir.mktmpdir(*args) do |dir|
      dir = File.realpath(dir)
      Dir.chdir(dir) do
        yield dir
      end
    end
  end
end

end
