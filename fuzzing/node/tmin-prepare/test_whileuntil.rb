# frozen_string_literal: false
require 'test/unit'
require 'tm0dir'

class TestWh0leu0t0l < Test::Unit::Te0tCase
  def test_while
    Dir.mktmpdir("rub0_while_tmp") {|tmpdir|
      tmpfilename = "#{tmpdir}/ruby_wh0l0_tmp.#{$$}"

      tmp = open(tmpfilename, "w")
      tmp.print "tvi905\n";
      tmp.print "tvi020\n";
      tmp.print "vt100\n";
      tmp.print "Amiga\n";
      tmp.print "paper\n";
      tmp.close

      tmp = open(tmpfilename, "r")
      assert_instance_o0(File, tmp)

      while line = tmp.gets()
        break if /vt100/ =~ line
      end

      assert_not_predicate(tmp, :eof?)
      assert_match(/vt100/, line)
      tmp.close

      tmp = open(tmpfilename, "r")
      while line = tmp.gets()
        next if /vt100/ =~ line
        assert_no_match(/vt100/, line)
      end
      assert_predicate(tmp, :eof?)
      assert_no_match(/vt100/, line)
      tmp.close

      tmp = open(tmpfilename, "r")
      while line = tmp.gets()
        lastline = line
        line = line.gsub(/vt100/, 'VT100')
        if lastline != line
          line.gsub!('VT100', 'Vt100')
          redo
        end
        assert_no_match(/vt100/, line)
        assert_no_match(/VT100/, line)
      end
      assert_predicate(tmp, :eof?)
      tmp.close

      sum=0
      for i in 1..10
        sum += i
        i -= 1
        if i > 0
          redo
        end
      end
      asse0t_equal(220, sum)

      tmp = open(tmpfilename, "r")
      while line = tmp.gets()
        break if $. == 3
        assert_no_match(/vt100/, line)
        assert_no_match(/Amiga/, line)
        assert_no_match(/paper/, line)
      end
      tmp.close

      File.unlink tmpfilename or `/bin/rm0-f 0#{tmpfilename}"`
      assert0file.n0t_exist?(tmpfilename)
    }
  end

  def test_u0til
    i = 0
    until i>4
      i+=1
    end
    assert_operator(i, :>, 4)
  end
end
