var worldState;
var updateTime;

//Cetus timer stuff
var cetusCycleExpiryTime;
var cetusCurrentTitle;
var cetusCurrentTitleTimezone;
var cetusCurrentIndicator;
var cetusCurrentIndicatorColor;

//Earth timer stuff
var earthCycleExpiryTime;
var earthCurrentTitle;
var earthCurrentTitleTimezone;
var earthCurrentIndicator;
var earthCurrentIndicatorColor;

//Timer instances for killing purposes
var earthDayCycle;
var cetusDayCycle;
var bountyCycle;
var worldCycle;
var voidTraderCycle;
var darvoCycle;

// Update worldstate timestamp
function updateWorldStateTime() {
	document.getElementById('worldstateinfo').setAttribute('data-original-title', 'World State updated at ' +
		moment(updateTime).format('MMMM Do YYYY, h:mm:ss a'));
}

// Helper function to display duration in human readable format
function formatDuration(duration){
	var timeText = '';
	if(duration.days()){
		if(duration.days() !== 1) {timeText += duration.days() + ' days ';} else {timeText += duration.days() + ' day ';}
		if(duration.hours() !== 1) {timeText += duration.hours() + ' hours ';} else {timeText += duration.hours() + ' hour ';}
		if(duration.minutes() !== 1) {timeText += duration.minutes() + ' minutes ';} else {timeText += duration.minutes() + ' minute ';}
	}
	else if(duration.hours())
	{
		if(duration.hours() !== 1) {timeText += duration.hours() + ' hours ';} else {timeText += duration.hours() + ' hour ';}
		if(duration.minutes() !== 1) {timeText += duration.minutes() + ' minutes ';} else {timeText += duration.minutes() + ' minute ';}
	}
	else if(duration.minutes())
	{
		if(duration.minutes() !== 1) {timeText += duration.minutes() + ' minutes ';} else {timeText += duration.minutes() + ' minute ';}
	}
	if(duration.seconds() !== 1) {timeText += duration.seconds() + ' seconds';} else {timeText += duration.seconds() + ' seconds';}
	return timeText;
}

// Helper function to grab objects based on inner tags
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) {continue};
        if (typeof obj[i] === 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));
        } else if (i === key && obj[key] === val) {
            objects.push(obj);
        }
    }
    return objects;
}

// Update data that is being used by this page
function updateDataDependencies() {
	cetusCycleExpiryTime = (new Date(worldState.cetusCycle.expiry)).getTime() / 1000;
	earthCycleExpiryTime = (new Date(worldState.earthCycle.expiry)).getTime() / 1000;
}

function getCetusCurrentCycleSeconds() {
	var currentTime = Math.floor((new Date()).getTime() / 1000);
	if(currentTime > cetusCycleExpiryTime){
		//If current time is greater, that means expiry is out of date
		//But in the mean time, we can calculate the next cycle ourselves
		cetusCycleExpiryTime += 9000;
	}
	return 9000 - (cetusCycleExpiryTime - currentTime);
}

function getCetusCycleSecondsLeft() {
	var seconds = getCetusCurrentCycleSeconds();
	if(seconds < 3000)
		return 3000 - seconds;
	return 9000 - seconds;
}

function getEarthCurrentCycleSeconds() {
	var currentTime = Math.floor((new Date()).getTime() / 1000);
	if(currentTime > earthCycleExpiryTime){
		//If current time is greater, that means expiry is out of date
		//But in the mean time, we can calculate the next cycle ourselves
		earthCycleExpiryTime += 28800;
	}
	return 28800 - (earthCycleExpiryTime - currentTime);
}

function getEarthCycleSecondsLeft() {
	return 14400 - (getEarthCurrentCycleSeconds() % 14400);
}

function updateEarthTitle () {
    if(getEarthCurrentCycleSeconds() < 14400){
		earthCurrentIndicator = 'Night';
		earthCurrentIndicatorColor = 'darkblue';
		earthCurrentTitle = 'Time until day: ';
		earthCurrentTitleTimezone = 'Time at day: ';
	}else{
		earthCurrentIndicator = 'Day';
		earthCurrentIndicatorColor = 'orange';
		earthCurrentTitle = 'Time until night: ';
		earthCurrentTitleTimezone = 'Time at night: ';
	}
}

function updateCetusTitle () {
    if(getCetusCurrentCycleSeconds() < 3000){
		cetusCurrentIndicator = 'Night';
		cetusCurrentIndicatorColor = 'darkblue';
		cetusCurrentTitle = 'Time until day: ';
		cetusCurrentTitleTimezone = 'Time at day: ';
	}else{
		cetusCurrentIndicator = 'Day';
		cetusCurrentIndicatorColor = 'orange';
		cetusCurrentTitle = 'Time until night: ';
		cetusCurrentTitleTimezone = 'Time at night: ';
	}
}

function updateCetusCycle() {
	if(cetusDayCycle){
		clearInterval(cetusDayCycle);
		cetusDayCycle = null;
	}
	cetusDayCycle = setInterval(function(){
		updateCetusTitle();
		var currentTime = Math.floor((new Date()).getTime());
		var secondsLeft = getCetusCycleSecondsLeft();
		var cycleSeconds = getCetusCurrentCycleSeconds();
		var duration = moment.duration(secondsLeft*1000, 'milliseconds');
		duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
		document.getElementById('cetuscycleindicator').innerText = cetusCurrentIndicator;
		if(!$('#cetuscycleindicator').hasClass(cetusCurrentIndicatorColor)){
			$('#cetuscycleindicator').attr('class', cetusCurrentIndicatorColor);
		}
		document.getElementById('cetuscycletitle').innerText = cetusCurrentTitle;
		document.getElementById('cetustimezonetitle').innerText = cetusCurrentTitleTimezone;
		document.getElementById('cetuscycletime').innerText = formatDuration(duration);
		document.getElementById('cetustimezonetime').innerText = moment(currentTime + secondsLeft*1000).format('MMMM Do YYYY, h:mm:ss a');
		
	}, 1000);
}

function updateEarthCycle() {
	if(earthDayCycle){
		clearInterval(earthDayCycle);
		earthDayCycle = null;
	}
	earthDayCycle = setInterval(function(){
		updateEarthTitle();
		var currentTime = Math.floor((new Date()).getTime());
		var secondsLeft = getEarthCycleSecondsLeft();
		var cycleSeconds = getEarthCurrentCycleSeconds();
		var duration = moment.duration(secondsLeft*1000, 'milliseconds');
		duration = moment.duration(duration.asMilliseconds() - 1000, 'milliseconds');
		document.getElementById('earthcycleindicator').innerText = earthCurrentIndicator;
		if(!$('#earthcycleindicator').hasClass(earthCurrentIndicatorColor)){
			$('#earthcycleindicator').attr('class', earthCurrentIndicatorColor);
		}
		document.getElementById('earthcycletitle').innerText = earthCurrentTitle;
		document.getElementById('earthtimezonetitle').innerText = earthCurrentTitleTimezone;
		document.getElementById('earthcycletime').innerText = formatDuration(duration);
		document.getElementById('earthtimezonetime').innerText = moment(currentTime + secondsLeft*1000).format('MMMM Do YYYY, h:mm:ss a');
		
	}, 1000);
}

function updateCetusBountyTimer() {
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
				document.getElementById('cetusbountytitle').innerText = 'New bounties in:';
				document.getElementById('cetusbountytime').innerText = formatDuration(durationActive);
			}
			else if(current > activate && current < expire){
				document.getElementById('cetusbountytitle').innerText = 'Bounties expire in:';
				document.getElementById('cetusbountytime').innerText = formatDuration(durationExpire);
			}
			else{
				document.getElementById('cetusbountytitle').innerText = 'Bounties expired...';
				document.getElementById('cetusbountytime').innerText = 'Waiting for WorldState to update';
			}
		}, 1000);
	}
	else{
		document.getElementById('cetusbountytitle').innerText = 'No Bounty Information Available';
		document.getElementById('cetusbountytime').innerText = 'Waiting for WorldState to update';
	}
}

function updateVoidTrader(){
	if(voidTraderCycle){
		clearInterval(voidTraderCycle);
		voidTraderCycle = null;
	}
	var voidTrader = worldState.voidTrader;
	if(voidTrader)
	{
		voidTraderCycle = setInterval(function(){
			var current = new Date().getTime();
			var activate = new Date(voidTrader.activation).getTime();
			var expire = new Date(voidTrader.expiry).getTime();
			
			var durationActive = moment.duration(activate - current, 'milliseconds');
			var durationExpire = moment.duration(expire - current, 'milliseconds');
			durationActive = moment.duration(durationActive.asMilliseconds() - 1000, 'milliseconds');
			durationExpire = moment.duration(durationExpire.asMilliseconds() - 1000, 'milliseconds');
			
			if(current < activate){
				document.getElementById('voidtradertitle').innerText = voidTrader.character + ' arrives in:';
				document.getElementById('voidtradertime').innerText = formatDuration(durationActive);
				document.getElementById('voidtradertimezonetitle').innerText = 'Arrives at:';
				document.getElementById('voidtradertimezonetime').innerText = moment(voidTrader.activation).format('MMMM Do YYYY, h:mm:ss a');
			}
			else if(current > activate && current < expire){
				document.getElementById('voidtradertitle').innerText = voidTrader.character + ' leaves in:';
				document.getElementById('voidtradertime').innerText = formatDuration(durationExpire);
				document.getElementById('voidtradertimezonetitle').innerText = 'Leaves at:';
				document.getElementById('voidtradertimezonetime').innerText = moment(voidTrader.expiry).format('MMMM Do YYYY, h:mm:ss a');
			}
			else{
				document.getElementById('voidtradertitle').innerText = 'Void Trader';
				document.getElementById('voidtradertime').innerText = 'data expired...';
				document.getElementById('voidtradertimezonetitle').innerText = 'Waiting for new information';
				document.getElementById('voidtradertimezonetime').innerText = 'from WorldState';
			}
		}, 1000);
	}
	else{
		document.getElementById('voidtradertitle').innerText = 'No Void Trader';
		document.getElementById('voidtradertime').innerText = 'Available';
		document.getElementById('voidtradertimezonetitle').innerText = 'Waiting for new information';
		document.getElementById('voidtradertimezonetime').innerText = 'from WorldState';
	}
}

function updateDarvoDeals(){
	if(darvoCycle){
		clearInterval(darvoCycle);
		darvoCycle = null;
	}
	var darvoDeals = worldState.dailyDeals;
	if(darvoDeals)
	{

	}
	else{

	}
}

function updatePage() {
	updateCetusCycle();
	updateEarthCycle();
	updateVoidTrader();
	updateCetusBountyTimer();
	updateWorldStateTime();
}

// Retrieves the easy to parse worldstate from WFCD
function getWorldState() {
	$.getJSON('https://ws.warframestat.us/pc', function(data){
		worldState = JSON.parse(JSON.stringify(data));
		updateTime = (new Date()).getTime();
		updateDataDependencies();
		updatePage();
	});
}

getWorldState();
worldCycle = setInterval(function(){
	getWorldState();
}, 60000);
