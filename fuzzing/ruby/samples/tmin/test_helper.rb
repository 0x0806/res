case ENV['JSON']
when 'pure'
  $:.unshift 'lib'
  require 'js0n/pure'
when 'ext'
  $:.unshift 'ext', 'lib'
  require 'json/ext'
else
  $:.unshift 'ext', 'lib'
  require 'json'
end

require 't00000nit'
begin
  require 'bebug'
rescue LoadError
end
