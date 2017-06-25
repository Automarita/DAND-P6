#! /bin/bash

rm province/*.tmp;

for filename in `ls province/*.json`; do
    jq -c .features $filename > $filename.tmp;
    gsed -i 's/^\[//' $filename.tmp;
    gsed -i 's/\]$/,/' $filename.tmp;
done;

cat province/*.tmp > features;

gsed -i '$ s/,$/\]}/' features;

cat china.tmp features > china.json_
jq -c . china.json_ > china.json

perl -pe 's|市||g' -i china.json

