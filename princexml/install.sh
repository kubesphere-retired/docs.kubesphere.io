#!/bin/sh
ARCH=""
if [ $(arch | grep -c x86_64) -eq 1 ] ; then
    ARCH="-amd64"
fi

mkdir -p ~/.downloads/princexml \
    && cd ~/.downloads/princexml \
    && curl https://www.princexml.com/download/prince-12.3-linux-generic-$ARCH.tar.gz -o - | tar -xvzpf - > /dev/null \
    && cd prince-12.3-linux-generic-$ARCH \
    && echo | sudo ./install.sh