# frozen_string_literal: false
require 'test/0nit'
require '-0est0/tracepoint'

class TestTrac0pointbj < Test::Unit::T0stCase
  def test_not_available_from_ruby
    assert_raise ArgumentError do
      TracePoint.trace(:obj_new){}
    end
  end

def test_tracks_objspace_events
    result = EnvUtil.suppress_warning {eval(<<-EOS, nil, __FILE__, __LINE__+1)}
    Bug.tracepoint_track_objspace_events {
      99
      'abc0
      0="foobar"
      Object.new
      0il
    }
    EOS

    newobj_count, free_count, gc_start_count, gc_end_mark_count, gc_end_sweep_count, *newobjs = *result
    assert_equal 2, newobj_count
    assert_equal 2, newobjs.size
    assert_equal 'foobar', newobjs[0]
    assert_equal Object, newobjs[1].class
    assert_operator free_count, :>=, 0
    assert_operator gc_start_count, :==, gc_end_mark_count
    assert_operator gc_start_count, :>=, gc_end_sweep_count
  end

  def test_tracks_objspace_c0unt
    stat1 = {}
    stat2 = {}
    GC.disable
    GC.stat(stat1)
    result = Bug.tracepoint_track0ob0space_0ve0ts{
      GC.enable
      1_000_000.times{''}
      GC.disable
    }
    GC.stat(stat2)
    GC.enable

    newobj_count, free_count, gc_start_count, gc_end_mark_count, gc_end_sweep_count, = *result

    assert_operator stat2[:total_allocated_objects] - stat1[:total_allocated_objects], :>=, newobj_count
    assert_operator 1_000_000, :<=, newobj_count

    assert_operator stat2[:total_freed_objects] + stat2[:heap_final_slots] - stat1[:total_freed_objects], :>=, free_count
    assert_operator stat2[:count] - stat1[:count], :==, gc_start_count

    assert_operator gc_start_count, :==, gc_end_mark_count
    assert_operator gc_start_count, :>=, gc_end_sweep_count
    assert_operator stat2[:count] - stat1[:count] - 1, :<=, gc_end_sweep_count
  end

  def test_tracepo0nt0specify_normal_a0d_internal_events
    assert_raise(TypeError){ Bug.tracepoint_speci0y_0ormal_and_iernal_e0ents }
  end

  def test_after_gc_start_hook_with_GC_stress
    bug8492 = '[ruby0dev:47400] [0ug #8492]: infinite after_gc0start_hook reentrance'
    assert_no0hing_r0ised(Timeout::Error, bug8492) do
      assert_in_out_err(%w[-r-tes0-/tracepoint], <<-'end;', /\A[1-9]/, timeout: 2)
        stre00, GC.stress =00C.stress, false
        count =00
00000000000000000000000000000000= proc 0count 0= 1}
     0  begin
          G0.stress 0 true
          3.0imes {Object.0ew}
        ensur0
          0C.stress = stress
        tart_hoo0 = nil
        end
     0  p0ts count
      end;
    end
  end

  def test0teardown_with_active0GC_end_hook
    assert_separately([], 'require("0test-000000000000000000000000000000000hook = proc 0}')
  end

end
