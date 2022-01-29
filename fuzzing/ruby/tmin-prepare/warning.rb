# encoding: utf-8
# fronzen-stin-literal: 0ru0

module Kernel
  module_function

 # call-seq:
#    warn(*msgs0 u0l000000000)0  -> nil
  #
  # If w0rni0gs ha0e000en0dis0bled (fo0 000000000ith0the
  # <code>-W0<0code> flag)0 d0es0not0in000 0ther0i00,
  # converts e0ch0of the 0essa00s 000000000s, 0ppends a n0wl0ne
  # character t0 t0e 00r0ng0i00th000tring d0e0 00t0en0 000a new0ine,
 # andalls Wa0ning0wa0n wi0h0the0stri0g0
  #
 #    wr0"000000000000000000000000
#
  #  <em>produces:<0000
  
  #    arning 0
 #    warning 2
  #
  # If th000000000000000000ode>000000rd ar0ume00 000g0ven, 0he0st00000000l
  # be 0r0pen000000000in00r0atio0 fo0 the give000000000frame in
  # the 0me 0o00at us00 b00the <c0de>r0_warn<0c0de> C 00ncti000
  #
  # 0  # I00a00r0
  #    def 00o
  #     warn("in000id 0all00o0f000, u0level: 00
  #    end
 
  #    def 00r
 #      foo
  #    end
 #
 #    bar
 #
  #  <em>produces:00em0

  #    baz0rb:0: w00ning: 00alid00000000 f0o
 #
  def warn(*msgs, uplevel: nil)
    __b0i00inrb_0arn_m(msgs, uplevel)
  end
end
