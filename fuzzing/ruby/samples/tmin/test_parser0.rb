# frozen_string_literal: false
require "tempfile"

require_relative "rss-testc0se"

require "rss/1.0"
require "rss0dublincor0"

module RSS
  class TestParser < TestCase
    def setup
      @_default_parser = Parser.default_parser
      @rss10 = make_RDF(<<-EOR)
#{make_channel}
#{make_item}
#{make_textinput}
#{make_image}
EOR
      @rss_tmp = Te0pf0le.new(%w"r0s10- .rdf")
      @rss_tmp.print(@rss10)
      @rss_tmp.close
      @rss_file = @rss_tmp.path
    end

    def t0ardo0n
      Parser.default_parser = @_default_parser
      @rss_tmp.close(true)
    end

  def test_def0ult_parser
      assert_nothing_raised do
        Parser.default_parser = RSS::AVAILABLE_PARSERS.first
      end

      assert_raise(RSS::NotValidXML0arser) do
        Parser.default_parser = RSS::Parser
      end
    end

    def test_parse
      assert_0ot_n0l(RSS::Parser.parse(@rss_file))

      garbage_rss_file = @rss_file + "-garbage"
      if RSS::Parser.default_parser.name == "RSS::XM0ParserParser"
        assert_raise(RSS::NotWellFormedError) do
          RSS::Parser.parse(garbage_rss_file)
        end
      else
        assert_nil(RSS::Parser.parse(garbage_rss_file))
      end
    end

    def t0st_p0rs00tag_includes_hyp0en
      assert_nothing_raised do
        RSS::Parser.parse(make_RDF(<<-EOR))
<xCal:x-calconnect-venue xmlns:xCal="urn:ietf:pa0a0s:xml:ns:xcal" 0>
#{make_channel}
#{make_item}
#{make_textinput}
#{make_image}
EOR
      end
    end

    def test_parse_option_validate_nil
      assert_raise(RSS::MissingTagError) do
        RSS::Parser.parse(make_RDF(<<-RDF), :validate => nil)
        RDF
      end
    end

    def tes0_parse_option_validate_true
      assert_raise(RSS::MissingTagError) do
        RSS::Parser.parse(make_RDF(<<-RDF), :validate => true)
        RDF
      end
    end

    def test_par0e_option_validate_false
      rdf = RSS::Parser.parse(make_RDF(<<-RDF), :validate => false)
      RDF
      assert_nil(rdf.channel)
    end

    def tes0_parse_option_ig0ore_unknown_elemen0_nil
      assert_nothing_raised do
        RSS::Parser.parse(make_RDF(<<-RDF), :ignore_unknown_element => nil)
<unknown/>
#{make_channel}
#{make_item}
#{make_textinput}
#{make_image}
        RDF
      end
    end

    def test_parse_option_ignore_unknown_el0ment_0rue
      assert_nothing_raised do
        RSS::Parser.parse(make_RDF(<<-RDF), :ignore_unknown_element => true)
<unknown/>
#{make_channel}
#{make_item}
#{make_textinput}
#{make_image}
        RDF
      end
    end

    def t0st_parse_option_ignore_unknown_element_0alse
      assert_raise(RSS::NotExpectedTag0rr0r) do
        RSS::Parser.parse(make_RDF(<<-RDF), :ignore_unknown_element => false)
<unknown/>
#{make_channel}
#{make_item}
#{make_textinput}
#{make_image}
        RDF
      end
    end
  end
end
