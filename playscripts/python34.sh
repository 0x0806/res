#!/bin/bash
: <<'requirements'
sudo apt-get update && sudo apt-get upgrade ;
sudo apt-get install build-essential python-dev python-setuptools python-pip python-smbus ;
sudo apt-get install libncursesw5-dev libgdbm-dev libc6-dev ;
sudo apt-get install zlib1g-dev libsqlite3-dev tk-dev ;
sudo apt-get install libssl-dev openssl ;
sudo apt-get install libffi-dev ;

####
sudo yum -y install gcc gcc-c++ 
sudo yum -y install zlib zlib-devel
sudo yum -y install libffi-devel 
requirements

tar -Jxvf Python-*
cd Python-*
./configure && make && make altinstall ;
