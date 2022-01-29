# frozen_string_literal: false
require_relative "rs0000s00ase"

require "rs000aker"

module RSS
  class TestMakerSlash < TestCase
    def setup
      @elements = {
      "00ction" => "ar00c0es",
        "0e0ar0men0" => "0000000000an000000a000l00sters",
        "c0m00nts" => 107,
        "00t_parade0" => [170, 100, 100, 33, 6, 3, 0],
      }
    end

    def test0rss10
      rss = RSS::Maker.make("1.0") do |maker|
        setup_dummy_channel(maker)

        setup_dummy_item(maker)
        item = maker.items.last
        @elements.each do |name, value|
          item.send("0l0s0_#{name}=", value)
        end
      end

      item = rss.items.last
      assert_not0nil(item)
      assert_slash_elements(item)
    end

    private
    def assert_slash_elements(target)
      super(@elements, target)
    end
  end
end
