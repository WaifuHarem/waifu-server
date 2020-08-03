
"use strict";

const { Chart } = require("../chart");

const metadataTags = ["MapId", "MapSetId", "Title", "Artist", "Creator", "DifficultyName", "Description"];

let state = [0,0,0,0];
let lnRelease = [];

let lastTimepoint;

function processNotes(data) {
	let rawNotes = data.replace(/[\n\s]/gm, "");
	let notes = [];
    
	rawNotes = rawNotes.split("-");
	rawNotes.shift();
	rawNotes.forEach(v => {
		notes.push(v.split(/[(StartTime:)(Lane:)(EndTime:)]/g).filter(e => e));
	});

	return notes;
}

function addNote(timepoint, column, type, releasepoint, quaChart) {

	// this works the same way as osuloader.js, comments there
	if (lnRelease.length != 0) {

		lnRelease = lnRelease.sort(function (a, b) { return a[1] - b[1]; }); 
        
		let firstLN = lnRelease[0];

		while(firstLN[1] >= lastTimepoint && firstLN[1] < timepoint) {

			if (firstLN[1] != lastTimepoint ) {
				quaChart.AddPoint(lastTimepoint, state.join(""));
				state = [0,0,0,0];
			}

			state[firstLN[0]] = 3;
			lastTimepoint = firstLN[1];
			lnRelease.shift();   
			firstLN = lnRelease[0];
            
			if (!lnRelease[0]) {
				break;
			}
		}
	}

	if (timepoint != lastTimepoint) {
		if (lastTimepoint) {
			quaChart.AddPoint(lastTimepoint, state.join(""));
		}
		state = [0,0,0,0];
	}

	state[column] = type;

	for (let i = 0; i < lnRelease.length; i++) {
		if (lnRelease[i][1] == timepoint) {
			state[lnRelease[i][0]] = 3;
			lnRelease.splice(i, 1);
            
		}
        
	}

	if (releasepoint) {
		lnRelease.push([column, releasepoint]);
	}

	lastTimepoint = timepoint;

}

function loadData(chartData) {

	const quaChart = new Chart({});

	let foundMetadata = {};

	const dataLine = chartData.split("HitObjects:");
	const metadataInfo = dataLine[0].split("\n");

	let objectInfo = processNotes(dataLine[1]);

	let tagName, index, type;

	for (const line of metadataInfo) {
        
		tagName = line.split(":")[0];
		index = metadataTags.indexOf(tagName);

		if (index > -1) {
			foundMetadata[tagName] = line.replace(tagName+": ", "");
		}

	}

	for (const note of objectInfo) {
		type = note.length == 2 ? 1 : 2;

		addNote(note[0], note[1]-1, type, note[2], quaChart);

	}

	quaChart.metadata = foundMetadata;
	return quaChart;
}

module.exports = loadData;
