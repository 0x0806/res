#!/usr/bin/ruby

class Being

    def initialize
        @is = true
    end

    def say
        "I am being"
    end
end

b = Being.new

p b.method :say
p b.instance_variable_get :@is
