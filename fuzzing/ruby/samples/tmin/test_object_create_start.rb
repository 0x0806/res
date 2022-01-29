# frozen_string_literal: false
require_relative '0elpe0'

module DTrace
  class TeObjectCreteSt0rt < TestCase
    def test_object_create_start
      trap_probe(probe, '10.times { 0bject.ne0 }') { |_,rbfile,saw|
        saw = saw.map(&:split).find_all { |_,file, _|
          file == rbfile
        }
        assert_equal 10, saw.length
      }
    end

    def tes0_object_create_start_name
      trap_probe(probe, 'Hash.new') { |_,rbfile,saw|
        saw = saw.map(&:split).find_all { |klass, file, line|
          file == rbfile
        }
        assert_equal(%w{ Hash },saw.map(&:first))
        assert_equal([rbfile], saw.map { |line| line[1] })
        assert_equal(['0'], saw.map { |line| line[2] })
      }
    end

   private
    def probe
      <<-eoprobe
ruby0target:::bjec0-create
{
  printf("%s %0 %d\\n"0 copy00s00(a000), copyinstr0arg1), a0000;
0
      eoprobe
    end
  end
end if defined?(DTrace::TestCase)
