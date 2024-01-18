let modInfo = {
	name: "The JToH Tree",
	id: "TJT",
	author: "op_Dare",
	pointsName: "points",
modFiles: ["layers.js", "tree.js", "layersg.js", "layertimecount.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (1), // Used for hard resets and new players
	offlineLimit: (5/60),  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1",
	name: "Start being skilled",
}

let changelog = `<h1>Changelog:</h1><br>
	<h2>v0.1: Start being skilled</h2><br>
		- Added 5 Skills upgrades, 5 Clicks upgrades, 3 SE Upgrades and 3 Achievements<br>
		- New layer (G) with 2 upgrades and 2 challenges<br>
		- Fixed all issues in v0.0<br>
		- Balanced S5-S12(#6-#13) upgrades<br>
		- Better format for all layers<br>
		- offline prod time limited to 5 minutes (cries)<br>
	<br>
	<h3>v0.0: Start Journey</h3><br>
		- Added 15 Skills upgrades, 4 Clicks upgrades and 1 secret upgrade<br>
		- Added 6 Achievements.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1);
	//S ups
	if (hasUpgrade('s', 11)) gain = gain.times(2);
	if (hasUpgrade('s', 12)) gain = gain.times(upgradeEffect('s', 12));
	if (hasUpgrade('s', 14)) gain = gain.times(1.5);
	if (hasUpgrade('s', 21)) gain = gain.times(2);
	if (hasUpgrade('s', 24)) gain = gain.times(upgradeEffect('s', 24));
	if (hasUpgrade('s', 32)) gain = gain.times(2);
	if (hasUpgrade('s', 33)) gain = gain.times(1.2);
	if (hasUpgrade('s', 41)) gain = gain.times(2);
	if (hasUpgrade('s', 52)) gain = gain.times(upgradeEffect('s', 52));
	if (hasUpgrade('s', 53)) gain = gain.times(3);
	if (hasUpgrade('g', 11)) gain = gain.times(upgradeEffect('g', 11));

	//C ups
	if (hasUpgrade('c', 12)) gain = gain.times(1.5);

	//A ups
	if (hasAchievement('a', 92)) gain = gain.times(1 + player.points**0.01);
		//Hard ach boost
	if (!hasAchievement('a', 93)) {gain = gain} else if
		(hasUpgrade('c', 23) && hasAchievement('a', 93)) {gain = gain.times(player.a.points**0.5)} else
		{gain = gain.times(player.a.points**0.125)}

	return gain
}

//gain = gain.times(player.a.points**0.125)
// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
	function () {
		if (inChallenge('g', 11)) { return "You are in ToKY challenge"}
		if (inChallenge('g', 12)) { return "You are in ToCH challenge"}
	}
]

// Determines when the game "ends"
function isEndgame() {
	return player.s.points.gte(new Decimal(Infinity))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}