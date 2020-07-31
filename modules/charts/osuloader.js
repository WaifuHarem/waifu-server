
"use strict";

const { floor } = require ('mathjs'); 
const { Chart, Timepoint } = require("../chart.js");

// add tag of data you want, no colon
const metadataTags = ["Title","TitleUnicode","Artist","ArtistUnicode","Creator","Version","BeatmapID","HPDrainRate","OverallDifficulty"];

let state = [0,0,0,0];
let lnRelease = [];

let lastTimepoint;

function addNote(timepoint, column, type, releasepoint, osuChart) {

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
    if (!mapdata) return null;

    const osuChart = new Chart({});

    let foundMetadata = {};
    let readObj = false;

    const dataLine = mapdata.split("\r\n");

    let noteValues, timePoint, column, type, releasePoint, tagName, index;

    for (const line of dataLine) {
        if (readObj == false) {

            // get metadata from tags
            tagName = line.split(":")[0];
            index = metadataTags.indexOf(tagName);

            if (index > -1) {
                foundMetadata[tagName] = line.replace(tagName+":", "");
            }

            if (line == "[HitObjects]") { 
                osuChart.metadata = foundMetadata;
                readObj = true; 
            }

        } else {
            
            noteValues = line.split(",");

            timePoint = parseInt(noteValues[2]);
            column = floor(noteValues[0]/128);

            switch(noteValues[3]) {
                case '1': case '5': type = 1; break;
                case '128': type = 2; releasePoint = parseInt(noteValues[5]);
            }
            
            addNote(timePoint, column, type, releasePoint, osuChart);

        }

    }

    return osuChart;
}


module.exports = loadData;