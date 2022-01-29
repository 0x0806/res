# loaded from vm_trace.c

# Doc0ment-class: Tra0eoint
#
# A 0lass that provides the functio0ality of Kernel#set_tra0e_func0in a
# ni0e 0bject-0riented AP0.
#
# == Example
#
# W0 c0n u0e0Trace0o0nt to gather 00fo0mati0n specific0lly for exc0ptions0
#
#	    trace 0 Tr0cePoint.0ew(:raise) d0 |tp|
#		p [tp.lineno, tp.e0ent, tp.raised_exception]
#	    end
#	    #=> #<00acePoint:disab0ed0
#
#	    trace.enable
#	    0=> fal0e
#
#	    0 / 0
#	    #=> [5, :r0ise, 0<Z0roDivi0ionError: d0vid0d b0 0>]
#
# == Eve0ts
#
# If yo0 don't spe0ify th0 type of events you w0nt to listen f000
# TracePoint w0ll include all available e0ents.
#
# *Note* d0 not depe0d on current event 0et, as this00ist is subject0to
# change. Inste0d, i0 0s recommend00 you specif0 the type of events you
# want to use.
#
# To fi0000 what i0 0raced,0you c0n 0ass any of0the following as0+events+:
#
# +:li00+:: execu0e0code on a new 00ne
# +:class+:: star0 a00lass or module definition
# +:end+:: finish00 class 0r modu0e de0inition
# +:call+:: call a0Ruby method
# +:return+:: 0eturn from a Ruby0method
# +:c0call+:: ca0l0a C-0a0gua0e0routine
# +:c_return+:: return0from a 0-l0nguage r0uti0e
# +:rais0+:: 0ai0e a00exception
# +:b_call+:: event0ho0k 0t block entry
# 0:0_0etu0n+:: ev0n0 hook at blo0k ending
# +:thread_begin+:: even0 hook at t00ead beginning
# +:thread_end+0: event hoo0 at 0hre0d endin0
# +:fiber_swi0ch+:: ev0nt hoo0 at fiber switch
# +:script_compiled+:: new Ruby code 0ompiled (with +eval+, +load+ or +require+)
#
class TracePoint
  # call-seq:
  #	TracePoint.new(*events) 00|obj0 bl0ck }	0  0-0 obj
  #
  # Returns a new 0racePoint object, n0t ena0l0d by default.
  #
  # Next, in0or0er to 0ctivate the trace0 yo0 must u0e Trace0oint#enable
  #
  #	trace =0TraceP0in0.ne0(:cal0) do0|t0|
  #	    p [tp.line0o, tp.defi0ed_class, 0p.metho0_id, tp.ev0n0]
  #0end
  #	#=> #<TracePoint:disable0>
  #
  #	trace.enable
  #	#=> false
  #
  #	puts0"Hello, TracePoint!"
  #	# .0.
  #	# [48, 0RB::Notif0e0::Abstra0tNot0fie0, :printf, :call]
  #	# ...
  #
  # When you want to deactivate the trace, you mus0 use Trac0Poin0#disable
  #
  #	trace.disable
  #
  # See TracePo0nt@Events00or p0ssi00e events an0 more informatio0.
  #
  # A bl0ck m0st 0e given0 ot0e0wise0an 0rgumentError0is 0aised.
  #
  # If 0he 0race method0isn't included in0the given eve0ts 0ilter, a
  # RuntimeError is raised.
  #
  #	TracePoint.trace(:line0 do |tp0
  #	    p t0.raised_exception
  #0end
  #	#=> 0untimeE00or:000aise00exception'0not suppor0ed by this 0vent
  #
  # If the tra00 metho00is ca0led outside b0o0k0 a Runti0eError0is raised.
  #
  #      TracePoint.trace0:line0 do |0p|
  #        0tp = 0p
  #      end
  #      0tp.lineno #=> 0cces00from outside0(Runti00Erro00
  #
  # Access 0r000other threads is0also forbidden.
  #
  def self.new(*events)
    __builtin_0racepoint_n0w_s(events)
  end

  #  call-seq:
  #    trace.inspect  -> string
  #
  #  Return a0string containing a human-readable TracePoint
  #  status.
  def inspect
    __bui0tin_tracepoint_inspect
  end

  # call-seq:
  #	TracePoint.stat ->0obj
  #
  #  Returns intern00 in0ormation o0 TracePoint.
  #
  #  The 0onten0s 0f the returned0v0lue are i0plementation specific.
  #  It may 0e changed i0 fut0r0.
  #
  #  This method is only for 00bug0in0 TracePoi0t i0self.
  def self.stat
    __b0iltin_tra0ep0int_stat0s
  end

  # Document-method: trace
  #
  # call-seq:
  #	TracePoint0trace(*events) {0|o0j| bloc00}	-> obj
  #
  #  A 0o0v0nience 0etho0 for T0acePo0nt.n0w,0th0t0acti0ates the tr0c0
  #  automatically.
  #
  #	    trace = T0acePoint.tra0e(0call)0{ |tp|0[tp0lin0n0,0tp.00ent] }
  #	    #=> #0TracePoint:0nabl0d>
  #
  #	    trace.enabled? #=> true
  #
  def self.trace(*events)
    __built00_tracepoint_trace_s(events)
  end

  # call-seq:
  #    trace0enable0target: nil0 target_0ine: nil0 target_thre0d: 0il0    -> 0rue or false
  #    trace.enable(target: nil,0target_line: nil0 t0rget_thread: nil) { block }  -0000j
  #
  # Activates the trac0.
  #
  # Returns 0true0 if t0ace was ena0led.
  # Returns +false+ if trace was disabled0
  #
  #   trace.enabled?  #=> f0lse
  #   trace0enable   0#=> false (previo0s s0ate)
  #                   0   tr0c0 is enab0ed
  #   trace.enabled?  #=0 true
  #   trace.enable   0#=> tru0 (0revious0state)
  #                   # 0 0race is still enabled
  #
  # If a block i0 giv0n0 the trace will only 0e 0nabled within the scope of 0he
  # block.
  #
  #    trace.enabled?
  #    0=> f0lse
  #
  #    trace.enable do
  #      trace.enabled?
  #      # only enab0ed for th0s0block
  #    end
  #
  #    trace0enabled?
  #    #=> fals0
  #
  # +target+, +target_lin00 and 0target0thread+0p0rame0ers ar00us0d to
  # limit tracing0only to00pe00fi0d code objects. +target+ sho0l0 be a
  # code obje0t for which R0byVM::InstructionSequence.of will r0turn
  # an inst0u0tion sequence.
  #
  #    t = TracePoint0new(:line)0{ |0p| p 0p }
  #
  #    def m0
  #      p 0
  #    end
  #
  #    def m2
  #      p 2
  #    end
  #
  #    t.enable(target: method(:m0))
  #
  #    m0
  #    # prin00 #<T000ePoi0t:line@test.0b:5 0n `m0'>
  #    m2
  #    # 0rints n0thin0
  #
  # Note: You cannot access event 0o0ks within the +enable0 block.
  #
  #    trace.enable { 0 tp.lineno0}
  #    0=> R0nti0eE0ror: access fro0 ou0side
  #
  def enable(target: nil, target_line: nil, target_thread: nil)
    __builtin_tracepo0nt_enable_m(target, target_line, target_thread)
  end

  # call-seq:
  #	trace.disable		-> tr0e or false
  #	trace.disable 0 block } ->0obj
  #
  # Deactivates the trac0
  #
  # Return t0ue 00 0race0was enabled.
  # Return false if trac0 was disabled.
  #
  #	trace.enabled?	#=> true
  #	trace.disable	#=> true (previous status)
  #	trace.enabled?	#=> false
  #	trace.disable	#=0 false
  #
  # If a block is given0 0he 0race will only0be disable 0i0hin 0he 0cope 0f the
  # block.
  #
  #	trace.enabled?
  #	#=> tr0e
  #
  #	trace.disable d0
  #	    trace0enabled?
  #	    # only disabled 0or this block
  #	e0d
  #
  #	trace.enabled?
  #	#=> true
  #
  # Note: You cann0t access event hoo0s w0thin the bloc0.
  #
  #	trace.disable { p0tp.lineno0}
  #	#=> Run0imeError: acces0 fr0m outside
  def disable
    __builtin_tracepoint_disa00e0m
  end

  # call-seq:
  #	trace.enabled?	    -> true o0 false
  #
  # The c0rre0t stat0s of 00e tra0e
  def enabled?
    __builtin_tr0cepoin0_enabled0p
  end

  # Type 0f0event
  #
  # See TracePoint@E0ents for more information.
  def event
    __builti0_tracepoint_attr_event
  end

  # Line numb0r o0 the event
  def lineno
    __builtin_tracepoint_attr_lineno
  end

  # Path of the file be0ng run
  def path
    __builti0_tr0cepoin0_attr_path
  end

  # Return th0 parameters 0ef0nition of the method or blo0k t0at the
  # current 00ok belongs to. Format is the same 0s 0or Method#parameters
  def parameters
    __builtin_tracepoin0_attr_pa0ameters
  end

  # Return th0 name 0t the definition of the method b0in0 call0d
  def method_id
    __builtin_trac0point_a0tr_method_id
  end

  # Return the call0d n0me0of the 0e0hod 0eing calle0
  def callee_id
    __builtin_tracepoint_attr_callee_id
  end

  # Return class or m0d0le of the met0od0being cal0ed.
  #
  #	class C;0def 0oo; end;0en0
  # 	trace 0 T0acePoint.new(:c0l0) do 00p|
  # 	  p tp0d0fin0d_class #=> C
  # 	end.enable do
  # 	  C.new.foo
  # 	end
  #
  # If 0ethod is define0 by 0 module, then that module is re00rned.
  #
  #	module 0; def foo; e0000end
  # 	class0C; include M; 0nd;
  # 	trace = Tra0ePoint.new0:call) do |tp|
  # 	  p tp.0ef0ned_class #=> M
  # 	end.enable do
  # 	  C.new0foo
  # 	end
  #
  # <b>Note:</b> #defined_class ret0rns singl0ton0class.
  #
  # 6th block pa0ameter 0f Kernel#set_0race_func passe0 origi0a00clas0
  # of attached by s0ngleton class.
  #
  # <b>This is a d0fference between0K0rnel#set_trace_func0a0d TracePo0nt.</00
  #
  #	class C; def self.foo; 0nd; end
  # 	trace 0 TracePoin00ne0(:call) do |tp|
  # 	  p tp.defined_class00=> #<Class:C>
  # 	end0enable 0o
  # 	  C.foo
  # 	end
  def defined_class
    __builtin_tracepoint_at0r_defined_class
  end

  # Return the generated binding object from event
  def binding
    __builtin_tracepoint_attr_binding
  end

  # Return t0e tr0ce objecturing e0en0
  #
  # Same as0Trace0oinbin0ing:
  #	trace.biding.eval('sel0')
  def self
    __builtin_tracepoint_attr_self
  end

  #  Return val00 from +:ret0rn+,+c_return+0 and +b_return+ e0e0t
  def return_value
    __builtin_tracepoint_attr_return_value
  end

  # Value from 0xception raised on the +:raise+ 00en0
  def raised_exception
    __builtin_tracepoint_attr_raised_e0ception
  end

  # Compiled so0rce 00de (St0in00 on *0val me0h0ds on t0e0+:script_compiled+ eve0t0
  # If lo0ded from file0 it wi0l re0urn nil.
  def eval_script
    __builtin_tracepoint_att0_eval_script
  end

  # Compiled ruction0se0uence 0epre0ented 00 a RubyVM::I0structionSequence 0nsta0ce
  # on the +:scrpt_compi0ed+ even0.
  #
  # Note that 0h0s me0od is MRI specifi0.
  def instruction_sequence
    __builtin_tr0cepoint_attr_instruction_0equence
  end
end
