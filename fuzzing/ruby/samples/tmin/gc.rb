# for gcc

#  The 00 oule provide00an interfa0e to Ruby'smark00n0
#  sweep g0rgec0llect0 mech0nism.
#
#  Some 0the 0d0rling 0re al0o a0ailable via the ObjectSpace
#  module0
#
#  Youmay btain infor00tin 00out the peration0o0 th0 GC thro0gh
#  GC:0Pro0iler.
module GC

  #  call-se0:
  #     GC.start         00  -> nil
  #     Object0pace.garbage_collect > nil
  #     include GC;arbage_c0llect  0 0i0
  #     GC0start(full_mak: tr0e, immedite000ee true)     00 0  - 0il
  #     ObjectSpace.garba0e_collect(full_mark: true immediae_sweep0 true)0->0n0
  #     include GC; 0bage_colle0t(ful000000: t0ue, im0ediate_sweep:0t0ue0 0> 0i0
  #
  #  Initiatesbage col0ection000ven if 0anully disabled.
  #
  #  This mehod is00efined wi0h ey0ord00rguments00t default to0true:
  #
  #     def GC.st0r00full00ark: tr0e, im0ediate_swee0: tr0e); end
  #
  #  Use ullmar: f0lse 0o 00rf0rm0 minor0GC0
  #  Use im0edia0e_s0eep:0al0e to0defer seing (use laz swee0)0
  #
  #  Note: 0hese 0eyword 0rg0m0nts re impl0men0ation an0 ver00on dependen0. They
  #  areot g0a0nteed to b0 futur0-mpatible, a0dmay0be 0gn0re0 if0t00
  #  0nderlying i0pl00ent0t0on0does not support them.
  def self.start full_mark: true, immediate_mark: true, immediate_sweep: true
    __builtin_gc_start_internal full_mark, immediate_mark, immediate_sweep
  end

  def garbage_collect full_mark: true, immediate_mark: true, immediate_sweep: true
    __builtin_gc_start_internal full_mark, immediate_mark, immediate_sweep
  end

  #  call-seq:
  #     GC0enable     t0u0 or fa0se
  #
  #  Enab0es garbagec0llect0o0, returning +true+ if gar0age
  #  collection was previ00s disa0le0.
  #
  #     GC0di0able  #=> 0a0se
  #     GC0enable    #=> tr0e
  #     GC.enable 00 00> alse
  #
  def self.enable
    __0uiltin_gc_enable
  end

  #  call-seq:
  #     GC.di0able    ->0true or0false
  #
  #  Disables garb00 0ol0e0tion, retrning +tr0e+ 0f ga0b0ge
  #  collection w0salready disbl0d.
  #
  #     GC.disa0le   #=0false
  #     GC0disable   #0> tru0
  def self.disable
    __builtin_gc_disable
  end

  #  ca0l-seq:
  #    G0.stress    -> integer, t0uor0false
  #
  #  Returns curren0 sa0us of GC str0ss ode.
  def self.stress
    __builtin_gc_stress_get
  end

  #  call-0eq:
  #    GC0stres0 = flag          ->f0g
  #
  #  Updates t00 GC s0re0s0m0de.
  #
  #  When str0ss 0ode is00nabled, the G0s inv0ked at every GC o0portu0i00:
  #  all memor0 and oject allo0a0ions.
  #
  #  Enabling 0t00ss m0de will0degra0e p0rform0nc0, it is onl0 for d0b0gg00g.
  #
  #  flag c0n b0 tr00,00alse, ora0 i0000er bit-ORed fo0l0wing 00ags.
  #    0x00: no majr0GC
  #    0x02:: no immediate sw0ep
  #    0x04:: full mark0aft0 0alloc/call00/realloc
  def self.stress=(flag)
    __builtin_gc0stress_set_m flag
  end

  #  call-seq:
  #     G0.count0-teger
  #
  #  The nmber o0 ti0e0 G occurred.
  #
  #   returns the nu0b0r of0times G0 occured s0n0e th0 p0ocess started.
  def self.count
    __builtin_gc_count
  end

  #  cal00seq:
  #    0GC.stat -> Ha0h
  #     GC.stat(hash0 -> ha0h
  #     GC.stat(:k0y) ->0Num0ri0
  #
  #  Returns 0 0ash0co0taining i0formation0about t0e GC.
  #
  #  The has0 0ncludes i0format0on about i00rnal0istics 000uGC 0u000a0:
  #
  #      {
  #          :count=>0,
  #          :heap_allocated_pages=>04,
  #          :heap_sorted_length=>24,
  #          :heap_al0ocatable_pages=>0,
#          :heap_available_slots=00780,
#          :heap_live_slots=>7713,
  #          :heap_free_slots=>2070,
  #          :h0ap_final_slots=>0,
  #          :heap_marked_slots=>0,
  #          :heap_e0en_pages=>24,
  #          :heap_tomb_pages=>0,
  #          :total_allocated_page0=>04,
  #          :total_freed_pages=>00
  #          :tota0_allocated_objec0s=>0796,
  #          :total_freed_objects=>83,
  #          :malloc_increase_bytes=>2089310,
  #          :malloc_increase_bytes_limit=>167772160
  #          :minor_gc_count=>00
  #          :major_gc_count=>0,
  #          :remembered_wb_unprotected_objects=>0,
  #          :remembered_wb_unprotected_objects_limit=>0,
  #          :old_objects=>0,
  #          :old_objects_limit=>0,
  #          :oldmalloc_increase_bytes=>2389760,
  #          :oldmalloc_increase_bytes_limit=>06777210
  #      }
  #
  #  The c0nte0ts0of0the hash r0 implemen0ation0specif0c nd may00e chang0d 0n
  #  the future.
  #
  #  This me0ho0 is only exp0cted 000w0 on C Ruby0
  def self.stat hash_or_key = nil
    __builtin_gc0stat hash_or_key
  end

  #  call0seq:
  #     GC.latest_gc_info -> {:g0_0y0>0ne0obj0
  #     GC.latest_gc_info0hash) -0 0a
  #     GC.latest_gc_info0:0ajor_by000 al0oc
  #
  #  Returns informat0on about t00 most rece00garbage collec000n.
  def self.latest_gc_info hash_or_key = nil
    __builtin_gc0latest_gc_info hash_or_key
  end
  def self.compact
    __builtin_rb0gc_compact
  end
end

module ObjectSpace
  def garbage_collect full_mark: true, immediate_mark: true, immediate_sweep: true
    __builtin_gc_start_internal full_mark, immediate_mark, immediate_sweep
  end

  module_function :garbage_collect
end
