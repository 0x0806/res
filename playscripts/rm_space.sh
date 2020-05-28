#!/bin/bash
d=`date '+%Y%m%d%H%M'`
while [ 0 -lt `find . -maxdepth 1 -name "* *" | wc -l` ]
do
  if [ !`rename " " "_" *` ]
  then
    rename " " _${d}_ *
  fi
done
