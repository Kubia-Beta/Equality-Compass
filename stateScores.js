// Here are the state scores and policy colors in a human readable format used by content.js.
// Primary is the initial state, and is the overall state score determined by MAP.
// Secondary is the Gender Identiy score, and is determined by MAP.
// Minified using https://minify-js.com/

const policyColors = {
	"high": "rgba(0, 100, 0, 0.5)",
	"medium": "rgba(143, 188, 143, 0.75)",
	"fair": "rgba(189, 183, 107, 0.75)",
	"low": "rgba(255, 127, 80, 0.65)",
	"negative": "rgba(178, 34, 34, 0.5)"
}


const stateScores = {
	Primary = {
	  "Alabama": {
		"colorGrade": "negative",
		"score": -10.5
	  },
	  "Alaska": {
		"colorGrade": "low",
		"score": 8.25
	  },
	  "American Samoa": {
		"colorGrade": "low",
		"score": 0.0
	  },
	  "Arizona": {
		"colorGrade": "low",
		"score": 7.5
	  },
	  "Arkansas": {
		"colorGrade": "negative",
		"score": -12.25
	  },
	  "California": {
		"colorGrade": "high",
		"score": 45.0
	  },
	  "Colorado": {
		"colorGrade": "high",
		"score": 45.25
	  },
	  "Connecticut": {
		"colorGrade": "high",
		"score": 40.75
	  },
	  "Delaware": {
		"colorGrade": "medium",
		"score": 30.25
	  },
	  "District of Columbia": {
		"colorGrade": "high",
		"score": 40.75
	  },
	  "Florida": {
		"colorGrade": "negative",
		"score": -3.0
	  },
	  "Georgia": {
		"colorGrade": "negative",
		"score": -1.0
	  },
	  "Guam": {
		"colorGrade": "low",
		"score": 4.75
	  },
	  "Hawaii": {
		"colorGrade": "medium",
		"score": 31.25
	  },
	  "Idaho": {
		"colorGrade": "negative",
		"score": -9.5
	  },
	  "Illinois": {
		"colorGrade": "high",
		"score": 43.0
	  },
	  "Indiana": {
		"colorGrade": "negative",
		"score": -2.75
	  },
	  "Iowa": {
		"colorGrade": "low",
		"score": 6.5
	  },
	  "Kansas": {
		"colorGrade": "low",
		"score": 0.5
	  },
	  "Kentucky": {
		"colorGrade": "low",
		"score": 5.0
	  },
	  "Louisiana": {
		"colorGrade": "negative",
		"score": -6.75
	  },
	  "Maine": {
		"colorGrade": "high",
		"score": 44.5
	  },
	  "Maryland": {
		"colorGrade": "high",
		"score": 42.0
	  },
	  "Massachusetts": {
		"colorGrade": "high",
		"score": 39
	  },
	  "Michigan": {
		"colorGrade": "medium",
		"score": 30
	  },
	  "Minnesota": {
		"colorGrade": "high",
		"score": 36.75
	  },
	  "Mississippi": {
		"colorGrade": "negative",
		"score": -7.5
	  },
	  "Missouri": {
		"colorGrade": "negative",
		"score": -1.5
	  },
	  "Montana": {
		"colorGrade": "negative",
		"score": -2.75
	  },
	  "Nebraska": {
		"colorGrade": "low",
		"score": 2.25
	  },
	  "Nevada": {
		"colorGrade": "high",
		"score": 41.25
	  },
	  "New Hampshire": {
		"colorGrade": "medium",
		"score": 32.5
	  },
	  "New Jersey": {
		"colorGrade": "high",
		"score": 41.75
	  },
	  "New Mexico": {
		"colorGrade": "medium",
		"score": 36.0
	  },
	  "New York": {
		"colorGrade": "high",
		"score": 44.5
	  },
	  "North Carolina": {
		"colorGrade": "low",
		"score": 7.25
	  },
	  "North Dakota": {
		"colorGrade": "low",
		"score": 9.5
	  },
	  "Northern Mariana Islands": {
		"colorGrade": "low",
		"score": 2.75
	  },
	  "Ohio": {
		"colorGrade": "low",
		"score": 2.25
	  },
	  "Oklahoma": {
		"colorGrade": "negative",
		"score": -5.0
	  },
	  "Oregon": {
		"colorGrade": "high",
		"score": 37.5
	  },
	  "Pennsylvania": {
		"colorGrade": "fair",
		"score": 16.75
	  },
	  "Puerto Rico": {
		"colorGrade": "fair",
		"score": 19.75
	  },
	  "Rhode Island": {
		"colorGrade": "high",
		"score": 38.0
	  },
	  "South Carolina": {
		"colorGrade": "negative",
		"score": -7.75
	  },
	  "South Dakota": {
		"colorGrade": "negative",
		"score": -7.5
	  },
	  "Tennessee": {
		"colorGrade": "negative",
		"score": -14.0
	  },
	  "Texas": {
		"colorGrade": "negative",
		"score": -1.75
	  },
	  "U.S. Virgin Islands": {
		"colorGrade": "fair",
		"score": 13.5
	  },
	  "Utah": {
		"colorGrade": "low",
		"score": 10.0
	  },
	  "Vermont": {
		"colorGrade": "high",
		"score": 38.5
	  },
	  "Virginia": {
		"colorGrade": "medium",
		"score": 24.5
	  },
	  "Washington": {
		"colorGrade": "high",
		"score": 40.25
	  },
	  "West Virginia": {
		"colorGrade": "negative",
		"score": -0.75
	  },
	  "Wisconsin": {
		"colorGrade": "fair",
		"score": 17.75
	  },
	  "Wyoming": {
		"colorGrade": "negative",
		"score": -6.0
	  },
	  "AL": {
		"colorGrade": "negative",
		"score": -10.5
	  },
	  "AK": {
		"colorGrade": "low",
		"score": 8.25
	  },
	  "AS": {
		"colorGrade": "low",
		"score": 0.0
	  },
	  "AZ": {
		"colorGrade": "low",
		"score": 7.5
	  },
	  "AR": {
		"colorGrade": "negative",
		"score": -12.25
	  },
	  "CA": {
		"colorGrade": "high",
		"score": 45.0
	  },
	  "CO": {
		"colorGrade": "high",
		"score": 45.25
	  },
	  "CT": {
		"colorGrade": "high",
		"score": 40.75
	  },
	  "DE": {
		"colorGrade": "medium",
		"score": 30.25
	  },
	  "DC": {
		"colorGrade": "high",
		"score": 40.75
	  },
	  "FL": {
		"colorGrade": "negative",
		"score": -3.0
	  },
	  "GA": {
		"colorGrade": "negative",
		"score": -1.0
	  },
	  "GU": {
		"colorGrade": "low",
		"score": 4.75
	  },
	  "HI": {
		"colorGrade": "medium",
		"score": 31.25
	  },
	  "ID": {
		"colorGrade": "negative",
		"score": -9.5
	  },
	  "IL": {
		"colorGrade": "high",
		"score": 43.0
	  },
	  "IN": {
		"colorGrade": "negative",
		"score": -2.75
	  },
	  "IA": {
		"colorGrade": "low",
		"score": 6.5
	  },
	  "KS": {
		"colorGrade": "low",
		"score": 0.5
	  },
	  "KY": {
		"colorGrade": "low",
		"score": 5.0
	  },
	  "LA": {
		"colorGrade": "negative",
		"score": -6.75
	  },
	  "ME": {
		"colorGrade": "high",
		"score": 44.5
	  },
	  "MD": {
		"colorGrade": "high",
		"score": 42.0
	  },
	  "MA": {
		"colorGrade": "high",
		"score": 39
	  },
	  "MI": {
		"colorGrade": "medium",
		"score": 30
	  },
	  "MN": {
		"colorGrade": "high",
		"score": 36.75
	  },
	  "MS": {
		"colorGrade": "negative",
		"score": -7.5
	  },
	  "MO": {
		"colorGrade": "negative",
		"score": -1.5
	  },
	  "MT": {
		"colorGrade": "negative",
		"score": -2.75
	  },
	  "NE": {
		"colorGrade": "low",
		"score": 2.25
	  },
	  "NV": {
		"colorGrade": "high",
		"score": 41.25
	  },
	  "NH": {
		"colorGrade": "medium",
		"score": 32.5
	  },
	  "NJ": {
		"colorGrade": "high",
		"score": 41.75
	  },
	  "NM": {
		"colorGrade": "medium",
		"score": 36.0
	  },
	  "NY": {
		"colorGrade": "high",
		"score": 44.5
	  },
	  "NC": {
		"colorGrade": "low",
		"score": 7.25
	  },
	  "ND": {
		"colorGrade": "low",
		"score": 9.5
	  },
	  "MP": {
		"colorGrade": "low",
		"score": 2.75
	  },
	  "OH": {
		"colorGrade": "low",
		"score": 2.25
	  },
	  "OK": {
		"colorGrade": "negative",
		"score": -5.0
	  },
	  "OR": {
		"colorGrade": "high",
		"score": 37.5
	  },
	  "PA": {
		"colorGrade": "fair",
		"score": 16.75
	  },
	  "PR": {
		"colorGrade": "fair",
		"score": 19.75
	  },
	  "RI": {
		"colorGrade": "high",
		"score": 38.0
	  },
	  "SC": {
		"colorGrade": "negative",
		"score": -7.75
	  },
	  "SD": {
		"colorGrade": "negative",
		"score": -7.5
	  },
	  "TN": {
		"colorGrade": "negative",
		"score": -14.0
	  },
	  "TX": {
		"colorGrade": "negative",
		"score": -1.75
	  },
	  "VI": {
		"colorGrade": "fair",
		"score": 13.5
	  },
	  "UT": {
		"colorGrade": "low",
		"score": 10.0
	  },
	  "VT": {
		"colorGrade": "high",
		"score": 38.5
	  },
	  "VA": {
		"colorGrade": "medium",
		"score": 24.5
	  },
	  "WA": {
		"colorGrade": "high",
		"score": 40.25
	  },
	  "WV": {
		"colorGrade": "negative",
		"score": -0.75
	  },
	  "WI": {
		"colorGrade": "fair",
		"score": 17.75
	  },
	  "WY": {
		"colorGrade": "negative",
		"score": -6.0
	  }
	},



	Secondary = {
	  "Alabama": {
		"colorGrade": "negative",
		"score": -7.75
	  },
	  "Alaska": {
		"colorGrade": "low",
		"score": 4.25
	  },
	  "American Samoa": {
		"colorGrade": "low",
		"score": 0.0
	  },
	  "Arizona": {
		"colorGrade": "negative",
		"score": -0.25
	  },
	  "Arkansas": {
		"colorGrade": "negative",
		"score": -8.25
	  },
	  "California": {
		"colorGrade": "high",
		"score": 23.25
	  },
	  "Colorado": {
		"colorGrade": "high",
		"score": 23.25
	  },
	  "Connecticut": {
		"colorGrade": "high",
		"score": 22.25
	  },
	  "Delaware": {
		"colorGrade": "medium",
		"score": 16.5
	  },
	  "District of Columbia": {
		"colorGrade": "high",
		"score": 22.5
	  },
	  "Florida": {
		"colorGrade": "negative",
		"score": -6.25
	  },
	  "Georgia": {
		"colorGrade": "negative",
		"score": -1.0
	  },
	  "Guam": {
		"colorGrade": "negative",
		"score": -0.75
	  },
	  "Hawaii": {
		"colorGrade": "medium",
		"score": 17.75
	  },
	  "Idaho": {
		"colorGrade": "negative",
		"score": -7.5
	  },
	  "Illinois": {
		"colorGrade": "high",
		"score": 22.5
	  },
	  "Indiana": {
		"colorGrade": "negative",
		"score": -3.75
	  },
	  "Iowa": {
		"colorGrade": "low",
		"score": 3.0
	  },
	  "Kansas": {
		"colorGrade": "negative",
		"score": -1.75
	  },
	  "Kentucky": {
		"colorGrade": "low",
		"score": 0.0
	  },
	  "Louisiana": {
		"colorGrade": "negative",
		"score": -7.25
	  },
	  "Maine": {
		"colorGrade": "high",
		"score": 23.5
	  },
	  "Maryland": {
		"colorGrade": "high",
		"score": 22.75
	  },
	  "Massachusetts": {
		"colorGrade": "high",
		"score": 20.25
	  },
	  "Michigan": {
		"colorGrade": "medium",
		"score": 14.0
	  },
	  "Minnesota": {
		"colorGrade": "high",
		"score": 21.0
	  },
	  "Mississippi": {
		"colorGrade": "negative",
		"score": -6.0
	  },
	  "Missouri": {
		"colorGrade": "negative",
		"score": -5.5
	  },
	  "Montana": {
		"colorGrade": "negative",
		"score": -4.0
	  },
	  "Nebraska": {
		"colorGrade": "negative",
		"score": -2.25
	  },
	  "Nevada": {
		"colorGrade": "high",
		"score": 21.0
	  },
	  "New Hampshire": {
		"colorGrade": "medium",
		"score": 15.0
	  },
	  "New Jersey": {
		"colorGrade": "high",
		"score": 23.25
	  },
	  "New Mexico": {
		"colorGrade": "medium",
		"score": 19.0
	  },
	  "New York": {
		"colorGrade": "high",
		"score": 24.0
	  },
	  "North Carolina": {
		"colorGrade": "low",
		"score": 2.0
	  },
	  "North Dakota": {
		"colorGrade": "low",
		"score": 0.75
	  },
	  "Northern Mariana Islands": {
		"colorGrade": "negative",
		"score": -0.75
	  },
	  "Ohio": {
		"colorGrade": "low",
		"score": 2.25
	  },
	  "Oklahoma": {
		"colorGrade": "negative",
		"score": -6.5
	  },
	  "Oregon": {
		"colorGrade": "high",
		"score": 21.0
	  },
	  "Pennsylvania": {
		"colorGrade": "fair",
		"score": 10.5
	  },
	  "Puerto Rico": {
		"colorGrade": "fair",
		"score": 10.5
	  },
	  "Rhode Island": {
		"colorGrade": "high",
		"score": 20.25
	  },
	  "South Carolina": {
		"colorGrade": "negative",
		"score": -8.25
	  },
	  "South Dakota": {
		"colorGrade": "negative",
		"score": -5.0
	  },
	  "Tennessee": {
		"colorGrade": "negative",
		"score": -11.25
	  },
	  "Texas": {
		"colorGrade": "negative",
		"score": -3.75
	  },
	  "U.S. Virgin Islands": {
		"colorGrade": "low",
		"score": 4.75
	  },
	  "Utah": {
		"colorGrade": "low",
		"score": 1.75
	  },
	  "Vermont": {
		"colorGrade": "high",
		"score": 20.5
	  },
	  "Virginia": {
		"colorGrade": "medium",
		"score": 14.5
	  },
	  "Washington": {
		"colorGrade": "high",
		"score": 22.0
	  },
	  "West Virginia": {
		"colorGrade": "low",
		"score": 1.0
	  },
	  "Wisconsin": {
		"colorGrade": "low",
		"score": 5.5
	  },
	  "Wyoming": {
		"colorGrade": "negative",
		"score": -2.75
	  },
	  "AL": {
		"colorGrade": "negative",
		"score": -7.75
	  },
	  "AK": {
		"colorGrade": "low",
		"score": 4.25
	  },
	  "AS": {
		"colorGrade": "low",
		"score": 0.0
	  },
	  "AZ": {
		"colorGrade": "negative",
		"score": -0.25
	  },
	  "AR": {
		"colorGrade": "negative",
		"score": -8.25
	  },
	  "CA": {
		"colorGrade": "high",
		"score": 23.25
	  },
	  "CO": {
		"colorGrade": "high",
		"score": 23.25
	  },
	  "CT": {
		"colorGrade": "high",
		"score": 22.25
	  },
	  "DE": {
		"colorGrade": "medium",
		"score": 16.5
	  },
	  "DC": {
		"colorGrade": "high",
		"score": 22.5
	  },
	  "FL": {
		"colorGrade": "negative",
		"score": -6.25
	  },
	  "GA": {
		"colorGrade": "negative",
		"score": -1.0
	  },
	  "GU": {
		"colorGrade": "negative",
		"score": -0.75
	  },
	  "HI": {
		"colorGrade": "medium",
		"score": 17.75
	  },
	  "ID": {
		"colorGrade": "negative",
		"score": -7.5
	  },
	  "IL": {
		"colorGrade": "high",
		"score": 22.5
	  },
	  "IN": {
		"colorGrade": "negative",
		"score": -3.75
	  },
	  "IA": {
		"colorGrade": "low",
		"score": 3.0
	  },
	  "KS": {
		"colorGrade": "negative",
		"score": -1.75
	  },
	  "KY": {
		"colorGrade": "low",
		"score": 0.0
	  },
	  "LA": {
		"colorGrade": "negative",
		"score": -7.25
	  },
	  "ME": {
		"colorGrade": "high",
		"score": 23.5
	  },
	  "MD": {
		"colorGrade": "high",
		"score": 22.75
	  },
	  "MA": {
		"colorGrade": "high",
		"score": 20.25
	  },
	  "MI": {
		"colorGrade": "medium",
		"score": 14.0
	  },
	  "MN": {
		"colorGrade": "high",
		"score": 21.0
	  },
	  "MS": {
		"colorGrade": "negative",
		"score": -6.0
	  },
	  "MO": {
		"colorGrade": "negative",
		"score": -5.5
	  },
	  "MT": {
		"colorGrade": "negative",
		"score": -4.0
	  },
	  "NE": {
		"colorGrade": "negative",
		"score": -2.25
	  },
	  "NV": {
		"colorGrade": "high",
		"score": 21.0
	  },
	  "NH": {
		"colorGrade": "medium",
		"score": 15.0
	  },
	  "NJ": {
		"colorGrade": "high",
		"score": 23.25
	  },
	  "NM": {
		"colorGrade": "medium",
		"score": 19.0
	  },
	  "NY": {
		"colorGrade": "high",
		"score": 24.0
	  },
	  "NC": {
		"colorGrade": "low",
		"score": 2.0
	  },
	  "ND": {
		"colorGrade": "low",
		"score": 0.75
	  },
	  "MP": {
		"colorGrade": "negative",
		"score": -0.75
	  },
	  "OH": {
		"colorGrade": "low",
		"score": 2.25
	  },
	  "OK": {
		"colorGrade": "negative",
		"score": -6.5
	  },
	  "OR": {
		"colorGrade": "high",
		"score": 21.0
	  },
	  "PA": {
		"colorGrade": "fair",
		"score": 10.5
	  },
	  "PR": {
		"colorGrade": "fair",
		"score": 10.5
	  },
	  "RI": {
		"colorGrade": "high",
		"score": 20.25
	  },
	  "SC": {
		"colorGrade": "negative",
		"score": -8.25
	  },
	  "SD": {
		"colorGrade": "negative",
		"score": -5.0
	  },
	  "TN": {
		"colorGrade": "negative",
		"score": -11.25
	  },
	  "TX": {
		"colorGrade": "negative",
		"score": -3.75
	  },
	  "VI": {
		"colorGrade": "low",
		"score": 4.75
	  },
	  "UT": {
		"colorGrade": "low",
		"score": 1.75
	  },
	  "VT": {
		"colorGrade": "high",
		"score": 20.5
	  },
	  "VA": {
		"colorGrade": "medium",
		"score": 14.5
	  },
	  "WA": {
		"colorGrade": "high",
		"score": 22.0
	  },
	  "WV": {
		"colorGrade": "low",
		"score": 1.0
	  },
	  "WI": {
		"colorGrade": "low",
		"score": 5.5
	  },
	  "WY": {
		"colorGrade": "negative",
		"score": -2.75
	  }
	}
};