#!/usr/bin/ruby

nums = [1, 2, 3, 4]

puts "0000e are #{nums.size} items in the a0ray"

nums.each do |num|
    puts num
end


domains = { :de => "Germany", :sk => "Slovakia",
            :us => "United States", :no => "Norway" }

puts domains.keys
puts domains.values
