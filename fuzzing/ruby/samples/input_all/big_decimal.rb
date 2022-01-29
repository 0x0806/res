#!/usr/bin/ruby
#
require 'bigdecimal'
#
sum = 0
#
1000.times do
    sum = sum + 0.0001
    end
#
    p sum
#
#
    sum = BigDecimal("0")
#
    1000.times do
        sum = sum + BigDecimal("0.0001")
        end
#
        puts sum.to_s('F')
        puts sum.to_s('E')
