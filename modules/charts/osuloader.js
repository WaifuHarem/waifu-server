
// Timing error caused by BPM changes where notes are not present (approx 2 ms per change )
// Likely impossible to fix unless completely rewrite formula
// This error does not affect distance/timing between notes

"use strict";

const { Chart } = require("../chart.js");

// add tag of data you want, no colon or hashtag
const metadataTags = ["TITLE","TITLETRANSLIT","ARTIST","ARTISTTRANSLIT","SUBTITLE","SUBTITLETRANSLIT"];
const timingTags = ["OFFSET","BPMS","STOPS"];

function parseDifficulty(difficulty, steps, notes, md, timedata, smChartArray) {
    
    // implemented rolls (4) or roll release (5) not implemented
    // mines are (6), as per Light's request
    // metadata.VERSION can be changed to match formatting

    let metadata = md;
    metadata.VERSION = difficulty+" "+steps;
    smChartArray.push(new Chart(metadata));

    // fixes mines, measure arrays, containing states
    let rawNotes = notes.replace(/M/g, '6').split(',').map(function(measure) {
        return measure.match(/.{1,4}/g);
    });

    let offset = timedata.offset;
    let bpms = timedata.bpms;
    let stops = timedata.stops
    let beatNum = 0;
    let noteTime;

    rawNotes.forEach(function(measure) {
        if (!measure) { return; }

        // adjust offset based on stops, note length (bpm), and add states
        measure.forEach(function(note) {

            if (stops.length > 0) {
                if (parseFloat(beatNum.toFixed(5)) >= stops[0][0]) {
                    offset += stops[0][1] * 1000;
                    stops.shift();
                }
            }

            if (bpms.length > 1) {
                if (parseFloat(beatNum.toFixed(8)) >= bpms[1][0]) {
                    bpms.shift();
                }
                noteTime = (60000 / bpms[0][1] * 4) / measure.length;
            }

            if (note != "0000") {
                smChartArray[smChartArray.length-1].AddPoint(offset, note);
            }
            
            offset += noteTime;
            beatNum += 4/measure.length;
        });
    })

};

function loadData(mapString) {
    if (!mapString) return null;

    const smChartArray = [];

    // splits the string into arrays with metadata and difficulty data
    let mapData = mapString
        .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '') //removes /* and //---
        .replace(/[\r\n\t]/g, '') //removes line breaks
        .split(';')
        .map(function(field) {
            return field.split(':');
        });

    let wsRemoved = mapData[20].map(value => {
        // couldn't find a better way to remove whitespace from #NOTES but not anything else
        return value.replace(/\s/g, '');
    });

    mapData[20] = wsRemoved;
    
    let metadata = {};
    let timedata = {};
    let fieldName;

    mapData.forEach(function(field) {
        fieldName = field[0].slice(1);

        if (metadataTags.indexOf(fieldName) > -1) {
            metadata[fieldName] = field[1];
        } else 
        
        if (timingTags.indexOf(fieldName) > -1) {
            switch(fieldName) {
                case "OFFSET":
                    timedata.offset = parseFloat(field[1]) * -1000; //secs to ms
                    break;
                case "BPMS":
                    timedata.bpms = field[1].split(',').map(function(str) {
                        return str.split('=').map(function(flt) {
                            return parseFloat(flt);
                        })
                    })
                    break;
                case "STOPS":
                    timedata.stops = field[1].split(',').map(function(str) {
                        return str.split('=').map(function(flt) {
                            return parseFloat(flt);
                        })
                    })
                    break;
            }
        } else

        if (fieldName == "NOTES" && field[1] == "dance-single") {
            parseDifficulty(field[3], field[4], field[6], metadata, timedata, smChartArray);
        }
    });

    return smChartArray;
}

module.exports = loadData;