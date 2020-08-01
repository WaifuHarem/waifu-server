module.exports = {
	"env": {
		"node": true,
		"es2020": true
	},
	"extends": "eslint:recommended",
	"parserOptions": {
		"ecmaVersion": 11
	},
	"globals": {
		"Crash": true,
		"Log": true,
		"pLog": true,
		"config": true,
		"loaded": true,
		"prod": true,
		"Test": true
	},
	"ignorePatterns": ["./modules/requests.js"],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"always"
		]
	}
};
