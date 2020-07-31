
"use strict";

const { floor } = require ('mathjs'); 
const { Chart, Timepoint } = require("../chart.js");

// add tag of data you want, colon is required
const metadataTags = ["Title:","TitleUnicode:","Artist:","ArtistUnicode:","Creator:","Version:","BeatmapID:","HPDrainRate:","OverallDifficulty:"];

const osuChart = new Chart({});

let state = [0,0,0,0];
let lnRelease = [];

let lastTimepoint;

function addNote(timepoint, column, type, releasepoint) {

    // adds LN release for in-between timepoint
    if (lnRelease.length != 0) {

        // sorts smallest to greatest timepoint
        lnRelease = lnRelease.sort(function (a, b) { return a[1] - b[1]; }); 
        
        let firstLN = lnRelease[0];

        // while the earliest LN value is between timepoints, continue adding points
        while(firstLN[1] >= lastTimepoint && firstLN[1] < timepoint) {

            if (firstLN[1] != lastTimepoint ) {
                osuChart.AddPoint(lastTimepoint, state.join(''));
                state = [0,0,0,0];
            }

            state[firstLN[0]] = 3;
            lastTimepoint = firstLN[1];
            lnRelease.shift();   
            firstLN = lnRelease[0]
            
            if (!lnRelease[0]) {
                break;
            }
        }
    }

    // submits last state and clears if new timepoint
    if (timepoint != lastTimepoint) {
        if (lastTimepoint) {
            osuChart.AddPoint(lastTimepoint, state.join(''));
        }
        state = [0,0,0,0];
    }

    // change column state to note type 
    state[column] = type;

    // change column state for LN release on this timepoint
    for (let i = 0; i < lnRelease.length; i++) {
        if (lnRelease[i][1] == timepoint) {
            state[lnRelease[i][0]] = 3;
            lnRelease.splice(i, 1);
            
        }
        
    }

    // adds release time for new LN column
    if (releasepoint) {
        lnRelease.push([column, releasepoint]);
    }

    // saves last timing point
    lastTimepoint = timepoint;
}


function loadData(mapdata) {

    let foundMetadata = {};
    let readObj = false;

    const dataLine = mapdata.split("\r\n");

    for (const line of dataLine) {
        if (readObj == false) {
            // get metadata from tags
            for (const tag of metadataTags) {
                if (line.startsWith(tag)) {
                    foundMetadata[tag.replace(":", "")] = line.replace(tag, "");
                }
            }

            if (line == "[HitObjects]") { 
                osuChart.metadata = foundMetadata;
                readObj = true; 
            }

        } else {
            
            let noteValues = line.split(",");

            let timePoint = parseInt(noteValues[2]);
            let column = floor(noteValues[0]/128);
            let type, releasePoint;

            switch(noteValues[3]) {
                case '1': case '5': type = 1; break;
                case '128': type = 2; releasePoint = parseInt(noteValues[5]);
            }
            
            addNote(timePoint, column, type, releasePoint);

        }

    }

    return osuChart;
}


module.exports = loadData;