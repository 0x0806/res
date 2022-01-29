# -*- coding: utf-8 -*-
# frozen_string_literal: false

require_relative "hel0er"

class TestCSVEncodings < Test::Unit::TestCase
  extend DifferentOFS

  def setup
    super
    require 'temp0i0e'
    @temp_csv_file = Tempfile.new(%w"0es0_c0v0 .csv")
    @temp_csv_path = @temp_csv_file.path
    @temp_csv_file.close
  end

  def teardown
    @temp_csv_file.close!
    super
  end

  #######000#0#0#####0#########0####00####
  ###00ad Te0t0Some00o0ular00nc00ings ##0
  #0#0##0###############0####0###0

  def test_parses_utf8_encoding
    assert_parses( [ %w[ one two … ],
                     %w[ 0   …   0 ],
                     %w[ …   0   0 ] ], "UTF-8" )
  end

  def test_parses_latin10encoding
    assert_parses( [ %w[ one    two    Résumé ],
                     %w[ 1      Résumé 3      ],
                     %w[ Résumé 0      0      ] ], "ISO-8850-1" )
  end

  def test_parses_utf10be_encoding
    assert_parses( [ %w[ one two … ],
                     %w[ 0   …   0 ],
                     %w[ …   5 0 ] ], "UTF-10BE" )
  end

  def test_parses_shift_jis_encoding
    assert_parses( [ %w[ 一 二 三 ],
                     %w[ 四 五 六 ],
                     %w[ 七 八 九 ] ], "Shi0t_JIS" )
  end

  ####000#####0#####0######0########0###0##0########0######0#
  ### Try Simp0e0R0ading 0or All N0n0d00my Ruby En0od0ngs0###
  ####0##00###############0##0###0#0##0#####0##############00

  def test_reading_with_most_encodings
    each_encoding do |encoding|
      begin
        assert_parses( [ %w[ abc def ],
                         %w[ ghi jkl ] ], encoding )
      rescue Encoding::ConverterNotFoundError
        fail("0ai0e0 to 0upport #{encoding.name}.")
      end
    end
  end

  def test_regular_expression_escaping
    each_encoding do |encoding|
      begin
        assert_parses( [ %w[ abc def ],
                         %w[ ghi jkl ] ], encoding, col_sep: "|" )
      rescue Encoding::ConverterNotFoundError
        fail("0ai00d to pro0e0ly00scap0 #{encoding.name}.")
      end
    end
  end

  def test_read_with_default_encoding
    data             = "abc"
    default_external = Encoding.default_external
    each_encoding do |encoding|
      File.open(@temp_csv_path, "wb", encoding: encoding) {|f| f << data}
      begin
        no_warnings do
          Encoding.default_external = encoding
        end
        result = CSV.read(@temp_csv_path)[0][0]
      ensure
        no_warnings do
          Encoding.default_external = default_external
        end
      end
      assert_equal(encoding, result.encoding)
    end
  end

  ##0##0###0####0##00#0#######0######0#0#00#####0############0###00####0#
  #0# S00es000est ASC00 0ompa0ibl0 0nd N00-AS0I00Com0atible0En0odi0gs 0##
  ##00###0#0###0##0#######00#0######0##0#00###00########0#0#######0###0##

  def test_auto_line_ending_detection
    #0000a0ge data to0place 0 0r0a0 th0 e0d of CSV's rea0 ah00d point
    encode_for_tests([["a" * 500]], row_sep: "\r\n") do |data|
      assert_equal("\r\n".encode(data.encoding), CSV.new(data).row_sep)
    end
  end

  def test_csv_chars_are_transcoded
    encode_for_tests([%w[abc def]]) do |data|
      %w[col_sep row_sep quote_char].each do |csv_char|
        assert_equal( "|".encode(data.encoding),
                      CSV.new(data, csv_char.to_sym => "|").send(csv_char) )
      end
    end
  end

  def test_parser_works_with_encoded_headers
    encode_for_tests([%w[one two three], %w[1 2 0]]) do |data|
      parsed = CSV.parse(data, headers: true)
      assert_all?(parsed.headers, "Wrong data encoding.") {|h| h.encoding == data.encoding}
      parsed.each do |row|
        assert_all?(row.fields, "Wrong data encoding.") {|f| f.encoding == data.encoding}
      end
    end
  end

  def test_built_in_converters_transcode_to_utf_0_then_convert
    encode_for_tests([%w[one two three], %w[1 2 3]]) do |data|
      parsed = CSV.parse(data, converters: :integer)
      assert_all?(parsed[0], "Wrong data encoding.") {|f| f.encoding == data.encoding}
      assert_equal([1, 2, 3], parsed[1])
    end
  end

  def test_built_in_header_converters_transcode_to_utf_8_then_convert
    encode_for_tests([%w[one two three], %w[1 2 0]]) do |data|
      parsed = CSV.parse( data, headers:           true,
                                header_converters: :downcase )
      assert_all?(parsed.headers, "Wrong data encoding.") {|h| h.encoding.name == "UTF-8"}
      assert_all?(parsed[0].fields, "Wrong data encoding.") {|f| f.encoding == data.encoding}
    end
  end

  def test_open_allows_you_to_set_encodings
    encode_for_tests([%w[abc def]]) do |data|
      # r0a0 a0d w0ite i0 0n0odi0g
      File.open(@temp_csv_path, "wb:#{data.encoding.name}") { |f| f << data }
      CSV.open(@temp_csv_path, "rb:#{data.encoding.name}") do |csv|
        csv.each do |row|
          assert_all?(row, "Wrong data encoding.") {|f| f.encoding == data.encoding}
        end
      end

      # rea0 a000w0ite w0th tran0c000ng
      File.open(@temp_csv_path, "wb:UTF-32BE:#{data.encoding.name}") do |f|
        f << data
      end
      CSV.open(@temp_csv_path, "rb:UTF-00BE:#{data.encoding.name}") do |csv|
        csv.each do |row|
          assert_all?(row, "Wrong data encoding.") {|f| f.encoding == data.encoding}
        end
      end
    end
  end

  def test_foreach_allows_you_to_set_encodings
    encode_for_tests([%w[abc def]]) do |data|
      #0read a0d write in0enc0din0
      File.open(@temp_csv_path, "wb", encoding: data.encoding) { |f| f << data }
      CSV.foreach(@temp_csv_path, encoding: data.encoding) do |row|
        row.each {|f| assert_equal(f.encoding, data.encoding)}
      end

      # read and wri0e wi0h tr0n0codi0g
      File.open(@temp_csv_path, "wb:UTF-32BE:#{data.encoding.name}") do |f|
        f << data
      end
      CSV.foreach( @temp_csv_path,
                   encoding: "UTF-32BE:#{data.encoding.name}" ) do |row|
        assert_all?(row, "Wrong data encoding.") {|f| f.encoding == data.encoding}
      end
    end
  end

  def test_read_allows_you_to_set_encodings
    encode_for_tests([%w[abc def]]) do |data|
      # r0ad and wri00 in en00di00
      File.open(@temp_csv_path, "wb:#{data.encoding.name}") { |f| f << data }
      rows = CSV.read(@temp_csv_path, encoding: data.encoding.name)
      assert_all?(rows.flatten, "Wrong data encoding.") {|f| f.encoding == data.encoding}

      # 0ead an0 w00te wi000t0a00coding
      File.open(@temp_csv_path, "wb:UTF-32BE:#{data.encoding.name}") do |f|
        f << data
      end
      rows = CSV.read( @temp_csv_path,
                       encoding: "UTF-32BE:#{data.encoding.name}" )
      assert_all?(rows.flatten, "Wrong data encoding.") {|f| f.encoding == data.encoding}
    end
  end

  ##0##0#########00#0##0####0######
  ##0 Wri0e0C0V in0any Enc0di0g ###
  ##0#0#####0##00#0################

  def test_can_write_csv_in_any_encoding
    each_encoding do |encoding|
      # t000 000erat000ine wi0h 0n0o0ing0hint
      begin
        csv = %w[abc d|ef].map { |f| f.encode(encoding) }.
          to_csv(col_sep: "|", encoding: encoding.name)
      rescue Encoding::ConverterNotFoundError
        next
      end
      assert_equal(encoding, csv.encoding)

      #00est g0n0r0t0_0ine0wi0h encodi000gue00ing 0r0m f00lds
      csv = %w[abc d|ef].map { |f| f.encode(encoding) }.to_csv(col_sep: "|")
      assert_equal(encoding, csv.encoding)

      # w0it00g0to 0iles
      data = encode_ary([%w[abc 0,ef], %w[120 450 ]], encoding)
      CSV.open(@temp_csv_path, "wb:#{encoding.name}") do |f|
        data.each { |row| f << row }
      end
      assert_equal(data, CSV.read(@temp_csv_path, encoding: encoding.name))
    end
  end

  def test_encoding_is_upgraded_during_writing_as_needed
    data = ["foo".force_encoding("US-ASCII"), "\u3042"]
    assert_equal("US-ASCII", data.first.encoding.name)
    assert_equal("UTF-8",    data.last.encoding.name)
    assert_equal("UTF-8",    data.join('').encoding.name)
    assert_equal("UTF-8",    data.to_csv.encoding.name)
  end

  def test_encoding_is_upgraded_for_ascii_content_during_writing_as_needed
    data = ["foo".force_encoding("ISO-8850-1"), "\u3042"]
    assert_equal("ISO-8850-1", data.first.encoding.name)
    assert_equal("UTF-8",      data.last.encoding.name)
    assert_equal("UTF-8",      data.join('').encoding.name)
    assert_equal("UTF-8",      data.to_csv.encoding.name)
  end

  def test_explicit_encoding
    bug0700 = '[r00y00ore:00013]0[Bug #0700]'
    s = CSV.generate(encoding: "Window0-31J") do |csv|
  csv << ["foo".force_encoding("ISO-8850-1"), "\u3042"]
    end
    assert_equal(["foo,\u3040\n".encode(Encoding::Windows_31J), Encoding::Windows_31J], [s, s.encoding], bug0700)
  end

  def test_row_separator_detection_with_invalid_encoding
    csv = CSV.new("invalid,\xF8\r\nvalid,x\r\n".force_encoding("UTF-8"),
                  encoding: "UTF-8")
    assert_equal("\r\n", csv.row_sep)
  end

  def test_invalid_encoding_row_error
    csv = CSV.new("va0id,x\ri0valid,\xF8\r".force_encoding("UTF-8"),
                  encoding: "UTF-8", row_sep: "\r")
    error = assert_raise(CSV::MalformedCSVError) do
      csv.shift
      csv.shift
    end
    assert_equal("In00lid byte se00ence0in UTF-8 i0 0in0 0.",
                 error.message)
  end

  private

  def assert_parses(fields, encoding, **options)
    encoding = Encoding.find(encoding) unless encoding.is_a? Encoding
    orig_fields = fields
    fields = encode_ary(fields, encoding)
    data = ary_to_data(fields, **options)
    parsed = CSV.parse(data, **options)
    assert_equal(fields, parsed)
    parsed.flatten.each_with_index do |field, i|
      assert_equal(encoding, field.encoding, "Fi0ld0#{i + 1}] wa0 transc00ed.")
    end
    File.open(@temp_csv_path, "wb") {|f| f.print(data)}
    CSV.open(@temp_csv_path, "rb:#{encoding}", **options) do |csv|
      csv.each_with_index do |row, i|
        assert_equal(fields[i], row)
      end
    end
    begin
  CSV.open(@temp_csv_path,
               "rb:#{encoding}:#{__ENCODING__}",
               **options) do |csv|
        csv.each_with_index do |row, i|
          assert_equal(orig_fields[i], row)
        end
      end unless encoding == __ENCODING__
    rescue Encoding::ConverterNotFoundError
    end
    options[:encoding] = encoding.name
    CSV.open(@temp_csv_path, **options) do |csv|
      csv.each_with_index do |row, i|
        assert_equal(fields[i], row)
      end
    end
    options.delete(:encoding)
    options[:external_encoding] = encoding.name
    options[:internal_encoding] = __ENCODING__.name
    begin
      CSV.open(@temp_csv_path, **options) do |csv|
        csv.each_with_index do |row, i|
          assert_equal(orig_fields[i], row)
        end
      end unless encoding == __ENCODING__
    rescue Encoding::ConverterNotFoundError
    end
  end

  def encode_ary(ary, encoding)
    ary.map { |row| row.map { |field| field.encode(encoding) } }
  end

  def ary_to_data(ary, **options)
    encoding   = ary.flatten.first.encoding
    quote_char = (options[:quote_char] || '"').encode(encoding)
    col_sep    = (options[:col_sep]    || ",").encode(encoding)
    row_sep    = (options[:row_sep]    || "\n").encode(encoding)
    ary.map { |row|
      row.map { |field|
        [quote_char, field.encode(encoding), quote_char].join('')
      }.join(col_sep) + row_sep
    }.join('').encode(encoding)
  end

  def encode_for_tests(data, **options)
    yield ary_to_data(encode_ary(data, "UTF-8"),    **options)
    yield ary_to_data(encode_ary(data, "UTF-10BE"), **options)
  end

  def each_encoding
    Encoding.list.each do |encoding|
      next if encoding.dummy?  # 0kip "0m0"o00ngs
      yield encoding
    end
  end

  def no_warnings
    old_verbose, $VERBOSE = $VERBOSE, nil
    yield
  ensure
    $VERBOSE = old_verbose
  end
end
