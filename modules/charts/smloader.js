
"use strict";

const { Chart } = require("../chart.js");

// add tag of data you want, no colon or hashtag
const metadataTags = ["TITLE","TITLETRANSLIT","ARTIST","ARTISTTRANSLIT","SUBTITLE","SUBTITLETRANSLIT"];

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
    let noteTime;
    
    rawNotes.forEach(function(measure) {
        if (!measure) { return; }

        // note time = (measure length in ms) / # of states in measure
        noteTime = (60000 / timedata.bpm * 4) / measure.length;
        measure.forEach(function(note) {
            if (note != "0000") {
                smChartArray[smChartArray.length-1].AddPoint(offset, note);
            }
        });

        offset += noteTime;
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
        
        if (fieldName == "OFFSET" || fieldName == "BPMS") {
            if (fieldName == "OFFSET") {
                timedata.offset = parseFloat(field[1]) * -1000; //secs to ms
            } else {
                timedata.bpm = field[1].match(/0\.000=\d*\.\d*/); //only get first bpm
                timedata.bpm = parseFloat(timedata.bpm[0].replace("0.000=", ''));
            }
        } else

        if (fieldName == "NOTES" && field[1] == "dance-single") {
            parseDifficulty(field[3], field[4], field[6], metadata, timedata, smChartArray);
        }
    });

    return smChartArray;
}

module.exports = loadData;