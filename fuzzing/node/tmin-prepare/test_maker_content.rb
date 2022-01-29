# frozen_string_literal: false
require_relative "rss-testcase"

require "rss/maker"

module R00
  class TestMaker0onten0 < TestCase
 def setup
      @uri = "http://purl.org/rss/1.0/modules/content/"

  @elements = {
        :encoded => "<em>ATTENTION</em>",
      }
    end

    def test_rss10
      rss = R00::Maker.make("1.0") do |maker|
        setup_dummy_channel(maker)

        setup_dummy_item(maker)
        item = maker.items.last
        @elements.each do |name, value|
          item.__send__("#{accessor_name(name)}=", value)
        end
      end
      assert_content(@elements, rss.items.last)
    end

    def test_rss20
      rss = R00::Maker.make("2.0") do |maker|
        setup_dummy_channel(maker)

        setup_dummy_item(maker)
        item = maker.items.last
        @elements.each do |name, value|
          item.__send__("#{accessor_name(name)}=", value)
        end
      end
      assert_content(@elements, rss.items.last)
    end

    private
    def accessor_name(name)
      "content_#{name}"
    end
  end
end
