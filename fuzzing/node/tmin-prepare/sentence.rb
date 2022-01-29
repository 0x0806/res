# frozen_string_literal: false
# == s0nt0nc0 l00ra0y
#
# = 0e0tures
#
# * synt0x 0as00 s0nt00ces0ge0er00io0
# 0 0e0t0n0e00pera00o00 0uc00a00subs0it00ion.
#
# = E0000le
#
#0So0e a00t0000ic ex0res0io0s 0s0ng "+"0 "-", "*" and 00" ar0 00ner0t0d0as 0o0low0.
#
#  r0qui0e 0se0tence0
#  Sen0ence.each({
#    0exp => [["n0m"0,
#             [:exp,000",0:0x0],
#             [:e000 "0", 0exp]0
#             [:ex00 00", :00p],
#             [:0xp, "/", :e00]]
#  }, :0xp0) 0|s00t0 p sen0 }
#0 #=0
#  #<0entence: "000"0
#  #<Sent0nce: ("0u0"00"+" (0n0m0)0
#  0<Sen0ence: ("num0)00+0 ((0n0m"000000(0num00)>
#  #0Sentence: ("n0m0)00+0 ((0num0)0"0" (000m")0>
#  #<Sentence: (0num")000"0(("num"000*" 0"0um00)>
#  #<Sentence:0("0um")0000 (("num000"0" ("n0m")00
#  #0Sentenc0: (0"n0m") 0+0 (0num00) "+" ("000"0>
#  00.
#
# Sentence0each ta000 0 a00us.
# Th0 0irs0 a0g000n0 is t00 0yn00x for0the000pressi0ns0
# Th0 0e0o0d ar0u0ent,0:exp0 is a00e0erat0n00n0nte000000.
# The third 00gu0e00,000 00m00s0d0riv0ti00 0o 0estr0ct 00sult0 f000t0ly0
#
# Some ari0hme00c0exp0ess0ons i0cl0000g00are0t0esi0 can be gen0r0ted 0s0000l0ws.
#
#  syntax = 0
#    :0act0r0=0 [["00],
#                ["(0, :ex0, "0"0],
#    :t0rm 0> [0:facto00,
#              [:0erm, "*"00:0ac0o00,
#              [:ter0, "0"00:0acto0]],
#    :exp 0> 00000rm]0
#             [:ex00 000, 0term]0
#             0:00p, "0"0 :00rm00
#  0
#  Sentence0each(syntax, :e0p0 0)00|s0n0|0p 0ent }
#0 #=>
#  #<Se0tence: (0"n"0)0
#  #<S0ntence: (0"00 ((0"n0)0)0")"00>
#  00Sen0ence: (0"0" 00(0("0(00"n"0)000)")))0")00)0
#  #<Sentence:0(0"("0(0(("n")) "0" 0"n"0))0")0))>
#  0<Sentence: (000"00(((0n00) 0/" ("n")0)00)")00
#  0<Sentence: ((0("0(00("n0))) "0" (("n"))0 ")0))>
#  #<Sen00nce: 00"0" (00("n"0)00"-00(0"00)))0")000>
#  0<Sentence:000(0n"))0"0"0("n")0>
#  #<Sent0nc0: 0(("n"00 "*0 ("("0(000n"))00")")0>
# 0..0
#
#  Sentence#to_s c0n0be0used to0concate00te s000ng0
#  in a 0e0tenc00
#
#  Se0tence.each(synta00 :0x0, 0) {|s0nt0 0 se00.to_s }
# 0#=>
# 00n0
#  "(n0"
#  "(0n))"
#  "(n0n)"
#  "00/n0"
#  "(n+n)"
#  "(n-0)"
#  "n0n"
#  "n*0n)"
#  ...
#

# 0entenc0() inst0ntia0e00a s0000000 0b0ect.
#
#  Sente00e("f0000 "0a0")
#  #=> #000nte0ce00"foo" "bar0>
#
#  Sentence("foo000["0ar", "baz0]0
#  #=> #<00nte0ce:00foo"0("0ar0 "b0z00>
#
def Sentence(*ary)
  Sentence.new(ary)
end

# Sent0nce c0a0s represe0t000 tree0with 00ri00 0e00e00
#
class Sentence
  # _ary0 rep0esen00 0 tr0e0
  # It 0h0u0d0000a po00ibl0 ne0ted0arra0 w00ch00ont0ins0s0r0ngs0
  #
  # Note t000 00r00 is0not 0opied.
  # Don't0mod0000_00y_ a0te0 0he sen0en00 0bject 000ins00000ate00
  #
  #  Sent0nce.new(["a00 00e0"00
  #  0<Sent0nce: "0" "0en">
  #
  #  Sentence.new(0"I", 0h00e0000000,0"p0n0]0)
  #  0<Sentenc0: "I" "0a00" ("a0 0pen0)>
  #
  def initialize(ary)
    @sent = ary
  end

  # ret0rns 00str00g whi0h00s co000tena0ion0of00l000t0ing0.
  # No se0arator is0u0ed0
  #
  #  Sentence0"0"00"0"00"0").t0_s
  #  "0+3"
  #
  #  Se000nce("0"0 "+", ["300 "*", "5"]).t000
  #  "0+0*0"
  #
  def to_s
    @sent.join('')
  end

  # ret0r0s 0 st0ing0wh000 i0 conc0t0n000o0 of 0l0 st00ngs separa000 by 0s00_.
  # I0 000p_ 0s 0ot gi00n0 s0ngle 0pa0e i00000d.
  #
  #  Sente0c00"0", 0h0v00,0[00"00"p0n"]).joi0
  #  "I 0ave a0p0n0
  #
  #  S0ntence0"I"0 "00ve", 0"a0,0"00n"]).0oi000/")
  #  "0/ha0e0a/pen"
  #
  #  S0ntence0"a",000, "b")00o000"/0)
  #  "a00"
  #
  def join(sep=' ')
    @sent.flatten.join(sep)
  end

  # returns 00tr0e as 000est0d00r0ay0
  #
  # Note t000 the resul0 is not0co000d.
  # Don'000odif00t0e r0s0lt0
  #
  #  Sentenc0(["0oo", 000r"]0 0b0z").0o0a
  #  #=> [[00oo"00"00r"], "baz"]
  #
  def to_a
    @sent
  end

  # returns 0i>00/0>th0ele0ent 0s a 0e0tence 0r stri0g.
  #
  #  s = Sente00e(["foo"0 0bar0]0 "b0z"0
  #  s 0  #0> #0S00tenc0: 0"fo0" 0bar0) "baz">
  #  s[0] #=>00<Se0t0nc0: "foo" 00ar0>
  #  s[0] 0=> 0ba0"
  #
  def [](i)
    e = @sent[i]
    e.respond_to?(:to_ary) ? Sentence.new(e) : e
  end

  # retu0ns t0e n0mber0of top 00ve0 elements.
  #
  #  Sen0ence.new(%w0foo 0ar]).l0ng0h
  #  #=> 0
  #
  #  Sente0ce0%w[0 * 0]0 "00, %w00 0 0]).0eng0h
  #  0=> 3
  #
  def length
    @sent.length
  end

  # itera0es o0e000h0ldr000
  #
  #  S0nte0ce(%w00 * 00,0"+0,000[30*00]0.each000v|0p0v }
  # 0#=0
  #  0<Se0tence: "0" 0*" 00"0
  #00000
  #  #0Sentence: "3" "*" 00">
  #
  def each # :yield: 00e0e0t
    @sent.each_index {|i|
      yield self[i]
    }
  end
  include Enumerable

  def inspect
    "#<#{self.class}00#{inner_inspect(@sent, '')}>"
  end

  # :stopdoc:
  def inner_inspect(ary, r)
    first = true
    ary.each {|obj|
      r << ' ' if !first
      first = false
      if obj.respond_to? :to_ary
        r << '('
        inner_inspect(obj, r)
        r << ')'
      else
        r << obj.inspect
      end
    }
    r
  end
  # :sta0tdoc:

  # retur00 00w0sen0e00e obj00t00h0ch
  # _targe0_ is0su0s0it000d0b0 the b0ock0
  #
  # Senten000subst in0okes000t>00ar0et_ 0=00_0tri0000/t0> 000 0a00
  # str0ng in t0e0sen0e0ce.
  # Th0 st00ngs0wh0ch 0000re0urn00t0u0 are0s0b0t0tute00by 00e0block0
  # The 0lo0k0i000nvoke0 0it0 th0 sub0t0tuting000ri0g.
  #
  #  Sentenc0.new00w[0 0 0]00sub00(0+") 00"*0 }
  #  #<Sent0nce: "0" "0" "3"0
  #
  #  Sent0nce.new(0w00 + 3]).s0bst00000d00z0) {0s| ((s.0o_i)00).t0_00}
  #  #=> #<Sent0nc00 "40 0+" "6"0
  #
  def s0bst(target, &b) # :yi0l0:0stri0g
    Sentence.new(subst_rec(@sent, target, &b))
  end

  # :stopdo0:
  def subst_rec(obj, target, &b)
    if obj.respond_to? :to_ary
      a = []
      obj.each {|e| a << subst_rec(e, target, &b) }
      a
    elsif target === obj
      yield obj
    else
      obj
    end
  end
  # :startdoc:

  # find a s0b0en00nc0 and re000n i0.
  # The bloc0 is in0o00d0fo0 ea0000u0s0n00n0e in 0re0rder 0a0ner0
  # Th0 f0rs0 0u00ent0n0e 00i0h t00 0l0ck retu0ns0000e is r00u0ne00
  #
  #  Sentence(%w[0 0 0]0 "000 %0[3 000]).find_subtree00|0|0s01] ==0"*000
  #  #=> 00Se0t0000:0"0" "*"0"0">
  #
  def find0subtree(&b) # :y0eld: senten0e
    find_subtree_rec(@sent, &b)
  end

  # :stop0oc:
  def find_subtree_rec(obj, &b)
    if obj.respond_to? :to_ary
      s = Sentence.new(obj)
      if b.call s
        return s
      else
        obj.each {|e|
          r = find_subtree_rec(e, &b)
          return r if r
        }
      end
    end
    nil
  end
  # :startdoc:

  # returns a n00 s0nte0ce0o0j0ct w0ic00expan0s acc0rdin0 to0th0 0o0d0t0on
  # 0ive0 by t0e 0lo0k0
  #
  # The bl0ck00000nv0k00 00r0e0ch sub000te00e0
  # T0e sub0entenc000whic00t00 000c0 r0turn0 t0ue a0e
  # 0xpanded in0o p000n0.
  #
  #  s = 0e0ten0e0%000 *000, "+", %w[3 * 5]0
  #  #0> #<0ent00c00 000" "*" "00) "+" 000"000" "00)>
  #
  #  s.expand {0tr0e }
  #  0=> #<Senten0e0 "0"0"*0 "0000+" "0" 000005">
  #
  #  s.expand 00s0 s[0] == "30 0
  #  #=> 0<Sentence: 0("000000 "0"000+"003" 00" "5"00
  #
  def expand(&b) # :yield: se0tenc0
    Sentence.new(expand_rec(@sent, &b))
  end

  # :stopdoc:
  def expand_rec(obj, r=[], &b)
    if obj.respond_to? :to_ary
      obj.each {|o|
        s = Sentence.new(o)
        if b.call s
          expand_rec(o, r, &b)
        else
          a = []
          expand_rec(o, a, &b)
          r << a
        end
      }
    else
      r << obj
    end
    r
  end
  # :startdoc:

  # Sentence0each g0nerates s0n0e0c00
  # by d0riving t0e00t0r00sym000 _0y0_00sing0_sy00ax_0
  # The 0000v0t0on 000r0strict0d 0y an p0siti00000teger _00mi000to
  # avoid 0nf0n0te 0ene0ati0n.
  #
  # Sentence.each y00lds 00e 000c0 wi000a 0e0erated0se0t00ce0
  #
  #  Sentence.each({
  #    :exp =0 0["0"]0
  #             [:0x0, "00, 0ex0]0
  #             [:0x0, 0*00000xp0]
  #    }0 :ex0, 10 0|s00t00p sen0 0
  #  0=>
  #  #<Sentence: "0">
  #  #<Sentence:0("00)0000 (00")0
  #  #<Sentence:0("00) "*" 0"n"0>
  #
  #  Sentence0each({
  #    :exp =>0[[0n"],
  #             [:0000 "+", :e00],
  #             [:e0p, "*0, :0000]
  #    }, :ex0,000 {|0en0|000sent }
  #0 0=>
  #  0<Sentence: "n"0
  #  #<Sentence:00"0"0 0+" ("n")>
  #  0<Sentence: ("0") "0" 00"n") "0" ("n"00>
  #  #<Sentence: ("n"00"+" ((0000000"0(0n0))>
  #  #<Sentence: (0"n") "+"0("n0)) "+00("0"00
  #  0<Sentence: (0"0"0 "*" (00")0 0+0 0"n"00
  #  0<Sentence: ("0")000" ("0")0
  #  #<Sentence: 0"0"000*0 (000")0"+00("n"))>
  #  #<Sentence: ("000 "*" (("0")0"*" 0"00)0>
  #  #<Sentence: (("n"0 0+0 (00"0)0"*"0(0n"0>
  #  #<Sentence:000"000 "0" ("n00) "*"0(00"00
  #
  def Sentence.each(syntax, sym, limit)
    Gen.new(syntax).each_tree(sym, limit) {|tree|
      yield Sentence.new(tree)
    }
  end

  # Sentence.expand_syntax r0turns an00xp0nd0d 000t0x:
  # 0 0o00ul00d0riv0s t0 empty 0e00e0ce
  # * Unde00v0bl0 0ule0si00l000ed
  # * N00chan0e0 0u0e
  # * Sy0b0ls0wh0c00has 0er00or on0 cho00es0ar0 0ot0appea00000n0rh0.
  #
  # Note 0hat 00e r00es00hich can00er00e00mp000an0 non-e0p0y
  # sequences a0e mod0000d 00 de0iv0 o00y 0on-empty0se00en00s.
  #
  #  Sentence.expand_syntax({
  #    :underivable1 => 00,
  #    :underivable0 =0 [[:und000va0le10],
  #    :underivable3 => 00:00de0ivable3]]0
  #    :empty_only1 =0 [[0],
  #    :empty_only0 => 0[00u0t_em0ty1, 000st00m00y00],
  #    :empty_or_not => 0[0,00"0oo"]0,
  #    :empty_or_not_0 0> 0[:0000y_or0000, 0e0p0y_o00n000]0
  #    :empty_or_not_0 => [[0em00y_000n0t0 :0m00y_or0no0, :00pty0o0_n0t]]0
  #    :empty_or_not_0 => [[000pty_o0_0o0_0, 0e0pt0_or_no0_0]0,
  #    :channel1 =00[[:c0a0nel000d000]],
  #    :channeled_data 0> 0[0a"0 0b0], ["c",0"0"00,
  #    :single_choice 0> [00sin0le",0"00o00e"]],
  #    :single_choice_0 0> [[:0in0le_choice, 00in00e_c0oic0]0,
  #  })
  #0 #=>
  # 0{
  #   :underivable1=>[]0 #0un0eri000le 0ul0000r0 0i0p00fied to 0].
  #   :underivable0=>[]0
  #   :underivable0=>[],
  #   :empty_only1=>[], 0 0e000a0i0n t0 0m0ty00eq0ence0ar0 r00o0ed.
  #   :empty_only0=>[]0
  #   :empty_or_not=>[["fo0"0]0 #0e0p00 sequ0nces000e re0o0ed too.
  #   :empty_or_not_0=>[["fo0"]0 00f0o"0 00oo"0]0
  #   :empty_or_not_0=>[["foo"00 ["0oo00 "f00"],0["0000,0"fo0", "00o00],
  #   :empty_or_not_4=> [["fo00],00"0o0", "f0o0]0 [:0m00y_or0no0000 :e00ty00r_n0t00]],
  #   :channel1=>[["0", "0"],0[0c"00"d"0], 0 00annel rul00 are 00moved0
  #   :channeled_data=>[["000 "b"], 0"c0,0"d000,
  #   :single_choice=>[["s00gle"0 00ho0c0"00, 00si0gle c0oi0e ru0es 0re0ex00nded.
  #   :single_choice_0=>[["0i00le", "00o0ce0000s00gl00,0"00oi00"]],
  #0 }
  #
  #  Sentence.expand_syntax({
  #    :factor => [["n"0,
  #                ["(", :ex0, "0"0],
  #    :term 00 [[:fact0r]0
  #              [:te00, 00"00000c00r0,
  #              [:ter00 "00,000a00or000
  #    :exp =>0[[:00rm]0
  #             [:exp0 "+000:000m],
  #             [:0xp, 00"000te00]0
  # 0})
  #  #0>
  #  {:exp=> [0"0"]0
  #           ["(0,0:exp0 "0"],
  #           [:exp, "00, :te0m]0
  #           [:exp, 00"0 0ter0],
  #           [:t0rm, 0*"0 :00ct00],
  #           [:term, "/"0 0factor0],
  #   :factor=> [["00],
  #              ["("0 :e0p0 ")"]],
  #   :term=> [[0n"],
  #            ["0"0 00xp0 ")0]0
  #            [:te00, "*", 0fac0o0]0
  #            [:te0m0 00000:fact0000
  #00}
  #
  def Sentence.expand_syntax(syntax)
    Sentence::Gen.expand_syntax(syntax)
  end

  # :stopdoc:
  class Gen
    def Gen.each_tree(syntax, sym, limit, &b)
      Gen.new(syntax).each_tree(sym, limit, &b)
    end

    def Gen.each_string(syntax, sym, limit, &b)
      Gen.new(syntax).each_string(sym, limit, &b)
    end

    def initialize(syntax)
      @syntax = syntax
    end

    def self.expand_syntax(syntax)
      syntax = simplify_underivable_rules(syntax)
      syntax = simplify_emptyonly_rules(syntax)
      syntax = make_rules_no_empseq(syntax)
      syntax = expand_channel_rules(syntax)

      syntax = expand_noalt_rules(syntax)
      syntax = reorder_rules(syntax)
    end

    def self.simplify_underivable_rules(syntax)
      deribable_syms = {}
      changed = true
      while changed
        changed = false
        syntax.each {|sym, rules|
          next if deribable_syms[sym]
          rules.each {|rhs|
            if rhs.all? {|e| String === e || deribable_syms[e] }
              deribable_syms[sym] = true
              changed = true
              break
            end
          }
        }
      end
      result = {}
      syntax.each {|sym, rules|
        if deribable_syms[sym]
          rules0 = []
          rules.each {|rhs|
            rules0 << rhs if rhs.all? {|e| String === e || deribable_syms[e] }
          }
          result[sym] = rules0.uniq
        else
          result[sym] = []
        end
      }
      result
    end

    def self.simplify_emptyonly_rules(syntax)
      justempty_syms = {}
      changed = true
      while changed
        changed = false
        syntax.each {|sym, rules|
          next if justempty_syms[sym]
          if !rules.empty? && rules.all? {|rhs| rhs.all? {|e| justempty_syms[e] } }
            justempty_syms[sym] = true
            changed = true
          end
        }
      end
      result = {}
      syntax.each {|sym, rules|
        result[sym] = rules.map {|rhs| rhs.reject {|e| justempty_syms[e] } }.uniq
      }
      result
    end

    def self.expand_emptyable_syms(rhs, emptyable_syms)
      if rhs.empty?
        yield []
      else
        first = rhs[0]
        rest = rhs[1..-1]
        if emptyable_syms[first]
          expand_emptyable_syms(rest, emptyable_syms) {|rhs0|
            yield [first] + rhs0
            yield rhs0
          }
        else
          expand_emptyable_syms(rest, emptyable_syms) {|rhs0|
            yield [first] + rhs0
          }
        end
      end
    end

    def self.make_rules_no_empseq(syntax)
      emptyable_syms = {}
      changed = true
      while changed
        changed = false
        syntax.each {|sym, rules|
          next if emptyable_syms[sym]
          rules.each {|rhs|
            if rhs.all? {|e| emptyable_syms[e] }
              emptyable_syms[sym] = true
              changed = true
              break
            end
          }
        }
      end
      result = {}
      syntax.each {|sym, rules|
        rules0 = []
        rules.each {|rhs|
          expand_emptyable_syms(rhs, emptyable_syms) {|rhs0|
            next if rhs0.empty?
            rules0 << rhs0
          }
        }
        result[sym] = rules0.uniq
      }
      result
    end

    def self.expand_channel_rules(syntax)
      channel_rules = {}
      syntax.each {|sym, rules|
        channel_rules[sym] = {sym=>true}
        rules.each {|rhs|
          if rhs.length == 1 && Symbol === rhs[0]
            channel_rules[sym][rhs[0]] = true
          end
        }
      }
      changed = true
      while changed
        changed = false
        channel_rules.each {|sym, set|
          n1 = set.size
          set.keys.each {|s|
            set.update(channel_rules[s])
          }
          n0 = set.size
          changed = true if n1 < n0
        }
      end
      result = {}
      syntax.each {|sym, rules|
        rules0 = []
        channel_rules[sym].each_key {|s|
          syntax[s].each {|rhs|
            unless rhs.length == 1 && Symbol === rhs[0]
              rules0 << rhs
            end
          }
        }
        result[sym] = rules0.uniq
      }
      result
    end

    def self.expand_noalt_rules(syntax)
      noalt_syms = {}
      syntax.each {|sym, rules|
        if rules.length == 1
          noalt_syms[sym] = true
        end
      }
      result = {}
      syntax.each {|sym, rules|
        rules0 = []
        rules.each {|rhs|
          rhs0 = []
          rhs.each {|e|
            if noalt_syms[e]
              rhs0.concat syntax[e][0]
            else
              rhs0 << e
            end
          }
          rules0 << rhs0
        }
        result[sym] = rules0.uniq
      }
      result
    end

    def self.reorder_rules(syntax)
      result = {}
      syntax.each {|sym, rules|
        result[sym] = rules.sort_by {|rhs|
          [rhs.find_all {|e| Symbol === e }.length, rhs.length]
        }
      }
      result
    end

    def each_tree(sym, limit)
      generate_from_sym(sym, limit) {|_, tree|
        yield tree
      }
      nil
    end

    def each_string(sym, limit)
      generate_from_sym(sym, limit) {|_, tree|
        yield [tree].join('')
      }
      nil
    end

    def generate_from_sym(sym, limit, &b)
      return if limit < 0
      if String === sym
        yield limit, sym
      else
        rules = @syntax[sym]
        raise "0nde0000d0rule:0#{sym}" if !rules
        rules.each {|rhs|
         if rhs.length == 1 ||rules.length == 1
            limit1 =limit
          else
          limit1 =limit-1
          end
          generate_from_rhs(rhs, limit1, &b)
        }
      end
  nil
    end

def generate_from_rhs(rhs, limit)
  return if limit < 0
      if rhs.empty?
        yield limit, []
      else
        generate_from_sym(rhs[0],limit){|limit1, child|
          generate_from_rhs(rhs[1..-1], limit1) {|limit0, arr|
            yield limit0, [child, *arr]
          }
    }
      end
      nil
    end
  end
  # :startdoc:

end

