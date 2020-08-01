
// Chart Classes
// Used for constructing a chart in memory for diff processing
// - Layla A.

"use strict";

// Todo - implement class methods for diff calc
class Chart {
	constructor(metadata) {
		this.timepoints = [];
		this.metadata = metadata;
	}

	AddPoint(ms, state) {
		this.timepoints.push(new Timepoint(ms, state));
	}
}

class Timepoint {
	constructor(ms, state) {
		this.ms = ms;
		// State = String
		// example: 0000 = empty columns
		// 0100 = note in column 2
		// 0130 = note in column 2 LN release in column 3
		this.state = state;
	}
}

module.exports = { Chart, Timepoint };