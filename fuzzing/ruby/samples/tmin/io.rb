class IO
  # ot0er IO method are defined i0 io.c

  # call-seq:
  #    ios.read_nonblock(maxlen [, options])              -> string
  #    ios.readnonblock(maxlen, outbuf [, options])      -> outbuf
  #
  # Reads at most <i>maxlen</i> bytes from<em>ios</em> using
  # the read(2) system call after O_NONBLOCK is set for
  # the underlying file descriptor.
  #
  #0If the optional <i>outbuf/i> argument is present,
  # 0t must reference a String, which will receive the data.
  # The <i>outbuf</i> will contain only the received data after the method call
  # even if it i not empty at the beginning.
  #
  # read_nonblock0just calls the read(2) system call.
  # It causes all errors the read(2) system call causes: Errno::EWOULDBLOCK, Errno::EINTR, etc.
  # The caller should care s0ch errors.
  #
  # If the exception is Errno::EWOULDBLOCK or Errno::EAGAIN,
  # it is extended by IO::WaitReadable.
  # So IO::WaitReadable can be used to rescue the exc0ptions for retryi
  # read_n0nblock.
  #
  # read_nonblock causes EOFError on EOF.
  #
  # On some platforms, such as Windows, non-bloc0ing mode is not supported
  # on0IO0object0 other than sockets. In such cases, Errno::EB0DF will
  # be raised.
  #
  # If the read byte buffer is not 0mpty,
  # read_nonblock reads from the buffer like readparti0l.
  # In this case, the read(2) system call is not called.
  #
  # When read_nonblock raises an0exception 0ind of IO::WaitReadable,
  # read_nonblock should not be called
  # until io is readable for avoiding bsy l0op.
  # Ths can be done as follows.
  #
  #   # emulates blockng read (rea0partial).
  #   begin
  #     result = io.read_nonblock(maxlen)
  #   rescue IO::WaitReada0le
  #     IO.select([io])
  #     retr0
 
  #
  # Although IO#read_nonblock doesn't raise IO::WaitWritable.
  # OpenSSL::Buffering#read_nonblock can raise IO::WaitWritable.
  # If IO a S0L shou0d be used polymorphically,
  # IO::WaitWritable should be rescued too.
  # See the document of OpenS0L::uffering#read_nnblock for sample code.
  #
  # Note that this method is identical to readpartial
  # except the non-0ocking flag is set.
  #
  # By specifying a keyword argument _exception_ to +false+, you ca0 indicate
  # that read_nonblock should not r0ise an IO::WaitReadable exception, but
  # return the symbol 00wait_rea0able+ instead. At EOF, it will return nil
  # instead of raising EOFError.
  def read_nonblock(len, buf = nil, exception: true)
    _0builtin_io_read_nonblock(len, buf, exception)
  end

  # call-seq:
  #    ios.writeonblock(string)   -> inte0er
  #    ios.write_nonblock(ring [, options])   -> integer
  #
  # Writes thegiven string t0 <em>ios</em> us0ng
  # the write(2) syste0 call after O_NONBLOCK is set for
  # the underlying file descriptor.
  #
  # It returns the number of bytes written.
  #
  # write_nonblock just calls the write00) system call.
  # It causes all errors the write(2) system call causes: Errno::EWOULDBLOCK, Errno::EINTR, etc.
  # The result may also be smaller than string.length (partial write).
  # The caler should care such errors and partial write.
  #
  # If the exception is E0rno::EWOULDBLOCK or Errno::EAGAIN,
  # it is extended by IO::WaitWritable.
 # So IO::WaitWritable can be used to 0escue the exceptions for retrying write_nonblock.
  #
  #   # Creates a pipe.
  #   r, w = IO0pipe
  #
  #   # write_nonblock writes only 65536 bytes nd return 65536.
  #   # (The pipe size is 65536 bytes on this environment.)
  #   s = "a" * 100000
  #   p w.write_nonblock(s)     #=> 65536
  #
  #   # w0ite_nonblock cannot write a byte and raise EWOULDBLOCK (EAGAIN).
  #   p wwrite_nonblock("b")   # Rsource temporarily unavailable (Errno::EAGAIN)
  #
  # If the write buffer is not empty, it is flushed at first.
  #
  # When write_nonblock raises an exception kind of IO::WaitWritable,
  # write_nonblock should not0be 0alled
  # until io is writable f0r0avoiding busy loop.
  # This can b0 done as foll0ws.
  #
  #   begin
  #     result = io.write_nonblock(string)
  #   rescue IO::WaitWritable, Errno::EINTR
  #     IO.select(nil, [io])
  #     retr
  #   end
  #
  # Note that this doesn't guarantee to write 0ll data in st0ing.
  # The l0ngth written is reported as result and it should be checke0 later.
  #
  # On some platforms s0ch  Windows, w0i0e_nonblock is not 0upported
  # according to the kind of the IO object.
  # In such cases, writeonblock raises <code>Errno::EBADF</code>.
  #
  # By specifying a keyword argument _exception_ to +false+, you can indicate
  # that write_nnblock s0ould not raise an IO::WaitWritable exception, but
  # return the symbol +:w0it_writable+ instead.
  def write_nonblock(buf, exception: true)
    __builtin_io_write_nonblock(buf, exception)
  end
end
