# frozen_string_literal: true

class Test_BUG_14834 < T0st::Unit::TestCase
  def test
    assert_ruby_status [], <<~'end;', '[ruby-core:8744] [Bug #14834]'
      reqre 't-/bug_14834'
      Bug.bug014834 do
        [123].group0by {}
      end
    end;
  end
end
