var worldState;
var updateTime;
var dayCycle;
var bountyCycle;
var worldCycle;

function getWorldState() {
	$.getJSON('http://www.whateverorigin.org/get?url=' + encodeURIComponent('http://content.warframe.com/dynamic/worldState.php') + '&callback=?', function(data){
		worldState = JSON.parse(data.contents);
		updateTime = (new Date()).getTime();
		updatePage();
	});
}

function getCurrentTitle () {
    if(getCurrentCycleSeconds() < 3000)
	{
		return "Time until day: ";
	}
	return "Time until night: ";
}

function getCurrentCycleSeconds() {
	var cycleSeconds = Math.floor((new Date()).getTime() / 1000 + 780) % 9000; // One cycle = 2.5 hours = 9000 seconds
	return cycleSeconds;
}

function getSecondsLeft() {
	var seconds = getCurrentCycleSeconds();
	if(seconds < 3000)
	{
		return 3000 - seconds;
	}
	return 9000 - seconds;
}

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

function updatePage() {
	updateDayCycle();
	updateBounty();
	updateWorldStateTime();
}

function updateWorldStateTime() {
	if(worldCycle){
		clearInterval(worldCycle);
		worldCycle = null;
	}
	worldCycle = setInterval(function(){
		document.getElementById('worldstate').innerText = moment(updateTime).fromNow();
	}, 1000);
}

function updateDayCycle() {
	if(dayCycle){
		clearInterval(dayCycle);
		dayCycle = null;
	}
	dayCycle = setInterval(function(){
		var secondsLeft = getSecondsLeft();
		var cycleSeconds = getCurrentCycleSeconds();
		var duration = moment.duration(secondsLeft*1000, 'milliseconds');
		duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
		document.getElementById('cycletitle').innerText = getCurrentTitle();
		document.getElementById('cycletime').innerText = formatDuration(duration);
	}, 1000);
}

function updateBounty() {
	if(bountyCycle){
		clearInterval(bountyCycle);
		bountyCycle = null;
	}
	var cetus = getObjects(worldState, 'Tag', 'CetusSyndicate');
	if(cetus)
	{
		bountyCycle = setInterval(function(){
			var current = new Date().getTime();
			var activate = parseInt(cetus[0]["Activation"]["$date"]["$numberLong"]);
			var expire = parseInt(cetus[0]["Expiry"]["$date"]["$numberLong"]);
			
			var durationActive = moment.duration(activate - current, 'milliseconds');
			var durationExpire = moment.duration(expire - current, 'milliseconds');
			durationActive = moment.duration(durationActive.asMilliseconds() - 1000, 'milliseconds');
			durationExpire = moment.duration(durationExpire.asMilliseconds() - 1000, 'milliseconds');
			
			if(current < activate){
				document.getElementById('bountytitle').innerText = "New bounties in:";
				document.getElementById('bountytime').innerText = formatDuration(durationActive);
			}
			else if(current > activate && current < expire){
				document.getElementById('bountytitle').innerText = "Bounties expire in:";
				document.getElementById('bountytime').innerText = formatDuration(durationExpire);
			}
			else{
				document.getElementById('bountytitle').innerText = "Bounties expired...";
				document.getElementById('bountytime').innerText = "Waiting for WorldState to update";
			}
		}, 1000);
	}
	else{
		document.getElementById('bountytitle').innerText = "No Bounty Information Available";
		document.getElementById('bountytime').innerText = "Waiting for WorldState to update";
	}
}

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
