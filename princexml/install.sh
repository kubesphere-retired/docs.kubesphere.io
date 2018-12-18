#!/bin/sh

mkdir -p ~/.downloads/princexml \
    && cd ~/.downloads/princexml \
    && curl https://www.princexml.com/download/prince-12.3-linux-generic-x86_64.tar.gz -o - | tar -xvzf - > /dev/null \
    && cd prince-12.3-linux-generic-x86_64 \
    && echo | sudo ./install.sh