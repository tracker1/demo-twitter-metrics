#!/bin/bash

SCRIPTPATH="$( cd -- "$(dirname "$0")" >/dev/null 2>&1 ; pwd -P )"

cd $SCRIPTPATH/../dist

find . -maxdepth 3 -type f ! -name '*.gz' ! -name '*.br' ! -name '*.zstd' | while read file; do
    gzip -9k "$file"
    brotli -k -q 11 "$file"
    zstd "$file"
done