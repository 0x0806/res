It is used to negotiate compatibility between the server and the client.

There is a method, described here, and reproduced for completeness, but I would not recommend it, as it would need to be repeated every time the software is updated.

    Copy the file /usr/sbin/sshd to /tmp.

    # cp /usr/sbin/sshd /tmp

    Find the location of text OpenSSH in it using the strings command. Look for text SSH-2.0-OpenSSH_5.x since it is the version showed in telnet output.

    # cd /tmp
    # strings -t d -a -n 7 sshd | grep -i ssh-2
    521008 OpenSSH-2.0*,OpenSSH-2.1*,OpenSSH_2.1*,OpenSSH_2.2*

    Remove the 521008 line from the above output using the dd command.

    # dd if=./sshd bs=1 skip=521008 count=11 | od -A n -c
    11+0 records in
    11+0 records out
       O   p   e   n   S   S   H   -   2   .   0
    11 bytes (11 B) copied, 0.000208606 s, 52.7 kB/s

    # dd if=./sshd bs=1 count=521008 of=sshd.1
    521008+0 records in
    521008+0 records out
    521008 bytes (521 kB) copied, 1.46733 s, 355 kB/s

    # dd if=./sshd bs=1 skip=521008 count=11 of=sshd.2
    11+0 records in
    11+0 records out
    11 bytes (11 B) copied, 0.00032878 s, 33.5 kB/s

    # dd if=./sshd bs=1 skip=521008 count=999999999 of=sshd.3
    131808+0 records in
    131808+0 records out
    131808 bytes (132 kB) copied, 0.368016 s, 358 kB/s

    OpenSSH_5.x is now cut and copied to sshd.2 file.

    Check the content of sshd.2 file using the od command.

    # od -A n -c sshd.2
    O   p   e   n   S   S   H   _   2   .   0

    Write the text "ItsHidden" to sshd.2 and check the file size change before and after.

    # ls -l sshd.2 -rw-r--r-- 1 root root 11 May  6 14:11 sshd.2 
    # print -n ItsHidden > sshd.2 
    # ls -l sshd.2 -rw-r--r-- 1 root root 11 May  6 14:12 sshd.2

    Combine all the above sshd files to sshd.new.

    # cat sshd.* > sshd.new

    Give execute permission sshd.new and replace the sshd binary with sshd.new.

    # chmod 755 ./sshd.new
    # cp /usr/sbin/sshd /usr/sbin/sshd.bak
    # rm /usr/sbin/sshd
    # cp /tmp/sshd.new /usr/sbin/sshd

    Restart the sshd service and test the outcome with telnet command.

    # service sshd stop
    # ps aux | grep -i sshd
    # kill -9 <pid_sshd>
    # service sshd restart
    # telnet localhost 22

Not a very elegant or maintainable solution, though.
