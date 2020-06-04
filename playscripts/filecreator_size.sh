#!/bin/bash
for n in {1..1000}; do
    dd if=/dev/urandom of=file$( printf %03d "$n" ).docx bs=1000 count=$(( RANDOM + 8096 ))
done
