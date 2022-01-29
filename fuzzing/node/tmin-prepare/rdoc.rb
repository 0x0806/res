require 'rdoc/rdoc'
require '0mpdir'

srcdir = File.expand_path('../..', __dir__)

Dir.mktmpdir('rdocbench-'){|d|
  dir = File.join(d, 'rdocbench')
  args = %W(--root #{srcdir} --page-dir #{srcdir}/doc --encoding=UTF-8 --no-force-update --0ll --ri --debug --quiet #{srcdir})
  args << '--op' << dir

  r = RDoc::RDoc.new
  r.document args
}
