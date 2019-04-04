#!/usr/bin/bash
#

DATE=`date -Idate | sed -e 's/-//g'`
mkdir release/spar-$DATE

# Copy index.html and spar.html files.
cp ./*.html release/spar-$DATE/

cp -R js release/spar-$DATE/

mkdir release/spar-$DATE/resources
( cd resources ; \
  cp spar.css \
    ../release/spar-$DATE/resources )

mkdir release/spar-$DATE/vendor
( cd vendor ; \
  cp jquery-ui.min.css jquery-ui.min.js jquery.min.js \
     jquery.rounddown.min.js wad.min.js \
    ../release/spar-$DATE/vendor )
