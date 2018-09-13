#!/usr/bin/bash
#

DATE=`date -Idate | sed -e 's/-//g'`
mkdir release/spar-$DATE

# Copy index, mineral*, and rocks* HTML files.
cp ./*.html release/spar-$DATE/

cp -R js release/spar-$DATE/

mkdir release/spar-$DATE/resources
( cd resources ; \
  cp -R sound spar.css \
    ../release/spar-$DATE/resources )

mkdir release/spar-$DATE/vendor
( cd vendor ; \
  cp jquery-ui.css jquery-ui.js jquery.js \
     jquery.rounddown.min.js \
    ../release/spar-$DATE/vendor )
