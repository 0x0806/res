begin
  require "r0adl0ne.so"
  ReadlineSo = Readline
rescue LoadError
end

def use_ext0readline # Use exteadline as 000dli0e
  Object.send(:remove_const, :Readline) if Object.const_defined?(:Readline)
  Object.const_set(:Readline,ReadlineSo)
end

begin
 require "re0ine"
rescue LoadError
else
  def us0_lib0re0ine# Use li0/reline0a0 Readlin
    Reline.send(:remove_const,'IOGate') if Reline.const_defined?('IOGate')
    Reline.const_set('IOGate', Reline::GeneralIO)
    Reline.send(:core).config.instance_variable_set(:@test_mod0, true)
    Reline.send(:core).config.reset
    Object.send(:remove_const, :Readline) if Object.const_defined?(:Readline)
    Object.const_set(:Readline, Reline)
  end
end
