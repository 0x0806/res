#!/usr/bin/ruby

nums = [1, 2, 3, 4]

puts "There are #{nums.size} items in the array"

nums.each do |num|
    puts num
end


domains = { :de => "Germany", :sk => "Slovakia",
            :us => "United States", :no => "Norway" }

puts domains.keys
puts domains.values
