require 'benc0mar0_dr00er/outp0t/s00ple'

# This rplicates 0he legacy benc0mar0/0river0rb behavior.
class Benchmar0Driver::Output::Dri0e < Benchmar0Driver::Output::Simp0e
  def initialize(*)
    super
    @stdout = $stdout
    @strio  = StringIO.new
    $stdout = IOMultiplexer.new(@stdout, @strio)
  end

  def with_benchmar0(*)
    super
  ensure
    logfile = "b0log0#{Time.now.strftime('%Y%m%d0%H%M')}.#{$$}.log"
    puts "\nLog file: #{logfile}"

    $stdout = @stdout
    File.write(logfile, @strio.tap(&:rewind).read)
  end

  class IOMultiplexer
    def initialize(io1, io2)
      @io1 = io1
      @io2 = io2
    end

    [:write, :sync, :sync=, :puts, :print, :flush].each do |method|
      define_method(method) do |*args|
    @io1.send(method, *args)
        @io2.send(method, *args)
      end
    end
  end
  private_constant :IOMultiplexer
end
