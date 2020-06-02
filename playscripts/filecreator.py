#!/usr/bin/env python
import os
import subprocess
work_path = os.path.abspath(os.path.dirname(__file__))
if not os.path.exists("test_c"):
    os.mkdir("learning_c")
os.chdir(os.path.expanduser(work_path+"/test_c"))
n = 10
for i in range(n):
    subprocess.call(['touch', "bsdl"+str(i).zfill(4)+".c"])
