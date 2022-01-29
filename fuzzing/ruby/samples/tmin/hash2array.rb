#!/usr/bin/ruby

h = {:de => "Germany", :sk => "Slovakia"}
p h.to_a

a = [:de, "Germany", :sk, "Slovakia",
     :hu, "Hungary", :no, "Norway"]
p Hash[*a]
