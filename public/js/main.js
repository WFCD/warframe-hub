var worldState;
var updateTime;

//Cetus timer stuff
var cetusCycleExpiryTime;
var cetusCycleEndTimestamp;
var cetusCurrentTitle;
var cetusCurrentTitleTimezone;
var cetusCurrentIndicator;
var cetusCurrentIndicatorColor;

//Timer instances for killing purposes
var dayCycle;
var bountyCycle;
var worldCycle;

// Retrieves the easy to parse worldstate from WFCD
function getWorldState() {
	$.getJSON('https://ws.warframestat.us/pc', function(data){
		worldState = JSON.parse(JSON.stringify(data));
		updateTime = (new Date()).getTime();
		updateDataDependencies();
		updatePage();
	});
}

// Update data that is being used by this page
function updateDataDependencies() {
	cetusCycleExpiryTime = (new Date(worldState.cetusCycle.expiry)).getTime() / 1000;
}

function updateCetusTitle () {
    if(getCurrentCycleSeconds() < 3000){
		cetusCurrentIndicator = "Night";
		cetusCurrentIndicatorColor = "darkblue";
		cetusCurrentTitle = "Time until day: ";
		cetusCurrentTitleTimezone = "Time at day: "
	}else{
		cetusCurrentIndicator = "Day";
		cetusCurrentIndicatorColor = "orange";
		cetusCurrentTitle = "Time until night: ";
		cetusCurrentTitleTimezone = "Time at night: "
	}
}

function getCurrentCycleSeconds() {
	var currentTime = Math.floor((new Date()).getTime() / 1000);
	if(currentTime > cetusCycleExpiryTime){
		//If current time is greater, that means expiry is out of date
		//But in the mean time, we can calculate the next cycle ourselves
		cetusCycleExpiryTime += 9000;
	}
	return 9000 - (cetusCycleExpiryTime - currentTime);
}

function getSecondsLeft() {
	var seconds = getCurrentCycleSeconds();
	if(seconds < 3000)
		return 3000 - seconds;
	return 9000 - seconds;
}

function updatePage() {
	updateCetusCycle();
	updateCetusBounty();
	updateWorldStateTime();
}

function updateWorldStateTime() {
	document.getElementById('worldstate').innerText = moment(updateTime).format('MMMM Do YYYY, h:mm:ss a');
}

function updateCetusCycle() {
	if(dayCycle){
		clearInterval(dayCycle);
		dayCycle = null;
	}
	dayCycle = setInterval(function(){
		updateCetusTitle();
		var currentTime = Math.floor((new Date()).getTime());
		var secondsLeft = getSecondsLeft();
		var cycleSeconds = getCurrentCycleSeconds();
		var duration = moment.duration(secondsLeft*1000, 'milliseconds');
		duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
		document.getElementById('cetuscycleindicator').innerText = cetusCurrentIndicator;
		if(!$('#cetuscycleindicator').hasClass(cetusCurrentIndicatorColor)){
			$('#cetuscycleindicator').attr("class", cetusCurrentIndicatorColor);
		}
		document.getElementById('cetuscycletitle').innerText = cetusCurrentTitle;
		document.getElementById('cetustimezonetitle').innerText = cetusCurrentTitleTimezone;
		document.getElementById('cetuscycletime').innerText = formatDuration(duration);
		document.getElementById('cetustimezonetime').innerText = moment(currentTime + secondsLeft*1000).format('MMMM Do YYYY, h:mm:ss a');
		
	}, 1000);
}

function updateCetusBounty() {
	if(bountyCycle){
		clearInterval(bountyCycle);
		bountyCycle = null;
	}
	var cetusBlock = getObjects(worldState, 'syndicate', 'Ostrons');
	if(cetusBlock)
	{
		var cetus = cetusBlock[0];
		bountyCycle = setInterval(function(){
			var current = new Date().getTime();
			var activate = new Date(cetus.activation).getTime();
			var expire = new Date(cetus.expiry).getTime();
			
			var durationActive = moment.duration(activate - current, 'milliseconds');
			var durationExpire = moment.duration(expire - current, 'milliseconds');
			durationActive = moment.duration(durationActive.asMilliseconds() - 1000, 'milliseconds');
			durationExpire = moment.duration(durationExpire.asMilliseconds() - 1000, 'milliseconds');
			
			if(current < activate){
				document.getElementById('cetusbountytitle').innerText = "New bounties in:";
				document.getElementById('cetusbountytime').innerText = formatDuration(durationActive);
			}
			else if(current > activate && current < expire){
				document.getElementById('cetusbountytitle').innerText = "Bounties expire in:";
				document.getElementById('cetusbountytime').innerText = formatDuration(durationExpire);
			}
			else{
				document.getElementById('cetusbountytitle').innerText = "Bounties expired...";
				document.getElementById('cetusbountytime').innerText = "Waiting for WorldState to update";
			}
		}, 1000);
	}
	else{
		document.getElementById('cetusbountytitle').innerText = "No Bounty Information Available";
		document.getElementById('cetusbountytime').innerText = "Waiting for WorldState to update";
	}
}

// Helper function to grab objects based on inner tags
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i == key && obj[key] == val) {
            objects.push(obj);
        }
    }
    return objects;
}

// Helper function to display duration in human readable format
function formatDuration(duration){
	var timeText = "";
	if(duration.hours())
	{
		if(duration.hours() > 1) {timeText += duration.hours() + " hours ";} else {timeText += duration.hours() + " hour ";}
	}
	if(duration.minutes())
	{
		if(duration.minutes() > 1) {timeText += duration.minutes() + " minutes ";} else {timeText += duration.minutes() + " minute ";}
	}
	if(duration.seconds() > 1) {timeText += duration.seconds() + " seconds";} else {timeText += duration.seconds() + " seconds";}
	return timeText;
}

getWorldState();
setInterval(function(){
	getWorldState();
}, 30000);
