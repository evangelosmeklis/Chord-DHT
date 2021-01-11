#!/bin/bash
printf "$FBOLD\nPlease enter the port:  $FREG"
read invalue
for i in {1..9}; do
    xterm -title "node$i" -hold -e "node index.js localhost:${invalue}" &
    sleep 1
done
