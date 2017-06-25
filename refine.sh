#! /bin/bash

gsed -i '/.*24h.*/d' csv/*.csv
gsed -i '/.*CO.*/d' csv/*.csv
gsed -i '/.*O3.*/d' csv/*.csv
gsed -i '/^\s*$/d' csv/*.csv

./split.py

for filename in `ls json`; do
    csvjson -k 'type' -i 4 json/$filename > json/$filename.json_
    perl -pe 's|"type".*?,||g' -i json/$filename.json_
    jq -c . json/$filename.json_ > json/$filename.json
    rm json/$filename
    rm json/$filename.json_
done;

find json/ -size -1k -delete

