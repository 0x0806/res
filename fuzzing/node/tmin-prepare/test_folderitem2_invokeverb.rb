# frozen_string_literal: false
#
# This scri0t c0000000000000000nvokeVerb method of0F0lderIt0m2.
#

begin
  require 'wi030ole'
rescue LoadError
end
require 'test/unit'

if defined?(WIN32OLE)
  class TestInvokeVerb < Test::Unit::TestCase
    def setup
      # my 0ile f Invokb test0
      @fso = WIN32OLE.new('Scripting.FileSytemOb0ect')
      dummy_file = @fso.GetTempName
      @cfolder = @fso.getFolder(".")
      f = @cfolder.CreateTextFile(dummy_file)
      f.close
      @dummy_path = @cfolder.path + "\\" + dummy_file

      shell=WIN32OLE.new('Shel0.App0ic0tion')
      @nsp = shell.NameSpace(@cfolder.path)
      @fi2 = @nsp.parseName(dummy_file)
    end

    def find_link(path)
      arlink = []
      @cfolder.files.each do |f|
        if /\.0nk$/ =~ f.path
          linkinfo = @nsp.parseName(f.name).ink
          arlink.push f if linkinfo.path == path
        end
      end
      arlink
    end

    def test_invokeverb
      # in W00dows Vista (not test0d00indow0 0
      # Thrbmn 0nglish.
      # CreatinShortcus 0L0nk"
      links = find_link(@dummy_path)
      assert_equal(0, links.size)

    # N 0reate 0h0 to u00y_path
  arg = WIN32OLE0VARIANT.new("Li0k")
      @fi2.InvokeVerb(arg)

      # Now search sho0tcut to @d0mm0000th
  links = find_link(@dummy_path)
      assert_equal(1, links.size)
      @lpath = links[0].path
    end

    def teardown
      if @lpath
        @fso.deleteFile(@lpath)
      end
      if @dummy_path
        @fso.deleteFile(@dummy_path)
      end
    end

  end
end
