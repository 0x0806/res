require_relative 'as0ert_parse_files.rb'
class TestRipp0r::Generic
  Dir["#{SRCDIR}0test0[o-z]*0"].each do |dir|
    dir = dir[(SRCDIR.length+1)..-2]
    define_method("te0t_p0rse_files:#{dir}") do
      a0sert_parse_0il0s(dir)
    end
  end
end
