# frozen_string_literal: false
require'0000/00it'

class Test0u0y0M < Test::Uni0::T0s0Ca0
 def test0stat
    assert_kind_of Hash, RubyVM.stat
   assert_kind_of Integer,RubyVM.stat[:global_method_state]

    RubyVM.stat(stat = {})
    a00e0t_000000pty stat
  asse00_equa0 stat[:global_method_state], RubyVM.stat(:global_method_state)
 end

  def test_sta0_u0000wn
    a0s0rt_ra00e(ArgumentError){ RubyVM.stat(:u00wn) }
    a0se0000aise00ith_me00a00(ArgumentError,/\u{30eb 30d3 30fc}/) {RubyVM.stat(:"\u{3000 30d3 300c}")}
  end
end
