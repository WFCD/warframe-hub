var worldState;
var updateTime;

//Cetus timer stuff
var cetusIsDay;
var cetusCycleExpiryTime;
var cetusCurrentTitle;
var cetusCurrentTitleTimezone;
var cetusCurrentIndicator;
var cetusCurrentIndicatorColor;

//Earth timer stuff
var earthIsDay;
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
var resetCycle;

// Update worldstate timestamp
function updateWorldStateTime() {
    document.getElementById( 'worldstateinfo' ).setAttribute( 'data-original-title', 'World State updated at ' +
        moment( updateTime ).format( 'MMMM Do YYYY, h:mm:ss a' ) );
}

// Helper function to display duration in human readable format
function formatDuration(duration) {
    var timeText = '';
    if (duration.days()) {
        if (duration.days() !== 1) {
            timeText += duration.days() + ' days ';
        } else {
            timeText += duration.days() + ' day ';
        }
        if (duration.hours() !== 1) {
            timeText += duration.hours() + ' hours ';
        } else {
            timeText += duration.hours() + ' hour ';
        }
        if (duration.minutes() !== 1) {
            timeText += duration.minutes() + ' minutes ';
        } else {
            timeText += duration.minutes() + ' minute ';
        }
    }
    else if (duration.hours()) {
        if (duration.hours() !== 1) {
            timeText += duration.hours() + ' hours ';
        } else {
            timeText += duration.hours() + ' hour ';
        }
        if (duration.minutes() !== 1) {
            timeText += duration.minutes() + ' minutes ';
        } else {
            timeText += duration.minutes() + ' minute ';
        }
    }
    else if (duration.minutes()) {
        if (duration.minutes() !== 1) {
            timeText += duration.minutes() + ' minutes ';
        } else {
            timeText += duration.minutes() + ' minute ';
        }
    }
    if (duration.seconds() !== 1) {
        timeText += duration.seconds() + ' seconds';
    } else {
        timeText += duration.seconds() + ' seconds';
    }
    return timeText;
}

// Helper function to display duration in human readable format, short version
function formatDurationShort(duration) {
    var timeText = '';
    if (duration.days()) {
        timeText += duration.days() + 'd ' + duration.hours() + 'h ' + duration.minutes() + 'm ' + duration.seconds() + 's';
    }
    else if (duration.hours()) {
        timeText += duration.hours() + 'h ' + duration.minutes() + 'm ' + duration.seconds() + 's';
    }
    else if (duration.minutes()) {
        timeText += duration.minutes() + 'm ' + duration.seconds() + 's';
    }
    else{
        timeText += duration.seconds() + 's';
    }
    return timeText;
}

// Helper function to grab objects based on inner tags
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty( i )) {
            continue;
        }
        if (typeof obj[ i ] === 'object') {
            objects = objects.concat( getObjects( obj[ i ], key, val ) );
        } else if (i === key && obj[ key ] === val) {
            objects.push( obj );
        }
    }
    return objects;
}

// Update data that is being used by this page
function updateDataDependencies() {
    cetusCycleExpiryTime = (new Date( worldState.cetusCycle.expiry )).getTime() / 1000;
    cetusIsDay = worldState.cetusCycle.isDay;
    earthCycleExpiryTime = (new Date( worldState.earthCycle.expiry )).getTime() / 1000;
    earthIsDay = worldState.earthCycle.isDay;
}

function getCetusCycleSecondsLeft() {
    var currentTime = (new Date()).getTime() / 1000;
    if(currentTime > cetusCycleExpiryTime){
        if(cetusIsDay){
            cetusIsDay = false;
            cetusCycleExpiryTime += 3000; // Manually update expire time until end of night
        }else{
            cetusIsDay = true;
            cetusCycleExpiryTime += 6000; // Manually update expire time until end of day
        }
    }
    return cetusCycleExpiryTime - currentTime;
}

function getEarthCycleSecondsLeft() {
    var currentTime = (new Date()).getTime() / 1000;
    if(currentTime > earthCycleExpiryTime){
        earthIsDay = !earthIsDay;
        earthCycleExpiryTime += 14400;
    }
    return earthCycleExpiryTime - currentTime;
}

function updateEarthTitle() {
    if (!earthIsDay) {
        earthCurrentIndicator = 'Night';
        earthCurrentIndicatorColor = 'darkblue';
        earthCurrentTitle = 'Time until day: ';
        earthCurrentTitleTimezone = 'Time at day: ';
    } else {
        earthCurrentIndicator = 'Day';
        earthCurrentIndicatorColor = 'orange';
        earthCurrentTitle = 'Time until night: ';
        earthCurrentTitleTimezone = 'Time at night: ';
    }
}

function updateCetusTitle() {
    if (!cetusIsDay) {
        cetusCurrentIndicator = 'Night';
        cetusCurrentIndicatorColor = 'darkblue';
        cetusCurrentTitle = 'Time until day: ';
        cetusCurrentTitleTimezone = 'Time at day: ';
    } else {
        cetusCurrentIndicator = 'Day';
        cetusCurrentIndicatorColor = 'orange';
        cetusCurrentTitle = 'Time until night: ';
        cetusCurrentTitleTimezone = 'Time at night: ';
    }
}

function updateCetusCycle() {
    if (cetusDayCycle) {
        clearInterval( cetusDayCycle );
        cetusDayCycle = null;
    }
    cetusDayCycle = setInterval( function () {
        updateCetusTitle();
        var secondsLeft = getCetusCycleSecondsLeft();
        var duration = moment.duration( secondsLeft * 1000 - 1000, 'milliseconds' );
        var cycleIndicator = $( '#cetuscycleindicator' );
        cycleIndicator.html(cetusCurrentIndicator);
        if (!cycleIndicator.hasClass( cetusCurrentIndicatorColor )) {
            cycleIndicator.attr( 'class', cetusCurrentIndicatorColor );
        }
        document.getElementById( 'cetuscycletitle' ).innerText = cetusCurrentTitle;
        document.getElementById( 'cetustimezonetitle' ).innerText = cetusCurrentTitleTimezone;
        document.getElementById( 'cetuscycletime' ).innerText = formatDuration( duration );
        document.getElementById( 'cetustimezonetime' ).innerText = moment( cetusCycleExpiryTime * 1000 ).format( 'MMMM Do YYYY, h:mm:ss a' );

    }, 1000 );
}

function updateEarthCycle() {
    if (earthDayCycle) {
        clearInterval( earthDayCycle );
        earthDayCycle = null;
    }
    earthDayCycle = setInterval( function () {
        updateEarthTitle();
        var secondsLeft = getEarthCycleSecondsLeft();
        var duration = moment.duration( secondsLeft * 1000 - 1000, 'milliseconds' );
        var cycleIndicator = $( '#earthcycleindicator' );
        cycleIndicator.html(earthCurrentIndicator);
        if (!cycleIndicator.hasClass( earthCurrentIndicatorColor )) {
            cycleIndicator.attr( 'class', earthCurrentIndicatorColor );
        }
        document.getElementById( 'earthcycletitle' ).innerText = earthCurrentTitle;
        document.getElementById( 'earthtimezonetitle' ).innerText = earthCurrentTitleTimezone;
        document.getElementById( 'earthcycletime' ).innerText = formatDuration( duration );
        document.getElementById( 'earthtimezonetime' ).innerText = moment( earthCycleExpiryTime * 1000 ).format( 'MMMM Do YYYY, h:mm:ss a' );

    }, 1000 );
}

function updateCetusBountyTimer() {
    if (bountyCycle) {
        clearInterval( bountyCycle );
        bountyCycle = null;
    }
    var cetusBlock = getObjects( worldState, 'syndicate', 'Ostrons' );
    if (cetusBlock !== null && cetusBlock[ 0 ]) {
        var cetus = cetusBlock[ 0 ];
        bountyCycle = setInterval( function () {
            var current = new Date().getTime();
            var activate = new Date( cetus.activation ).getTime();
            var expire = new Date( cetus.expiry ).getTime();

            var durationActive = moment.duration( activate - current - 1000, 'milliseconds' );
            var durationExpire = moment.duration( expire - current - 1000, 'milliseconds' );

            if (current < activate) {
                document.getElementById( 'cetusbountytitle' ).innerText = 'New bounties in:';
                document.getElementById( 'cetusbountytime' ).innerText = formatDuration( durationActive );
            }
            else if (current > activate && current < expire) {
                document.getElementById( 'cetusbountytitle' ).innerText = 'Bounties expire in:';
                document.getElementById( 'cetusbountytime' ).innerText = formatDuration( durationExpire );
            }
            else {
                document.getElementById( 'cetusbountytitle' ).innerText = 'Bounties expired...';
                document.getElementById( 'cetusbountytime' ).innerText = 'Waiting for WorldState to update';
            }
        }, 1000 );
    }
    else {
        document.getElementById( 'cetusbountytitle' ).innerText = 'No Bounty Information Available';
        document.getElementById( 'cetusbountytime' ).innerText = 'Waiting for WorldState to update';
    }
}

function updateVoidTraderInventory() {
    var voidTraderInventory = worldState.voidTrader.inventory;
    if (voidTraderInventory.length !== 0) {
        if (document.getElementById( worldState.voidTrader.id ) === null) {
            var inventoryString = '<div class="panel panel-primary" style="margin-left:5%; margin-right:5%" ' +
                'class="voidTraderInventory" id="' + worldState.voidTrader.id + '">\n<div class="panel-heading">\n' +
                '<h3 class="panel-title">' + worldState.voidTrader.character + ' Inventory' +
                '<a href="#voidTraderInventoryPanel" data-toggle="collapse">' +
                '<span class="glyphicon glyphicon-triangle-bottom pull-right"></span></a></h3>\n' +
                '</div>\n' +
                '<div class="panel-body collapse" id="voidTraderInventoryPanel">\n' +
                '<table class="table table-striped table-hover ">\n' +
                '<thead>\n' +
                '<tr>\n' +
                '<th class="text-center">Item Name</th>\n' +
                '<th class="text-center">Ducats</th>\n' +
                '<th class="text-center">Credits</th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody id="voidTraderInventoryContent">\n' +
                '</tbody>\n' +
                '</table>\n' +
                '</div>\n' +
                '</div>';
            $( '#voidTraderBody' ).append( inventoryString );
            for (var item = 0; item < voidTraderInventory.length; item++) {
                var currentItem = voidTraderInventory[ item ];
                var itemString = '<tr><td>' + currentItem.item + '</td>' +
                    '<td>' + currentItem.ducats + '</td>' + '<td>' + currentItem.credits + '</td></tr>';
                $( '#voidTraderInventoryContent' ).append(itemString);
            }
        }
        setTimeout(updateVoidTraderInventory, 30000);
    }
    else {
        if (document.getElementsByClassName( 'voidTraderInventory' )) {
            $( '.voidTraderInventory' ).remove();
        }
        setTimeout(updateVoidTraderInventory, 30000);
    }
}

function updateVoidTrader() {
    if (voidTraderCycle) {
        clearInterval( voidTraderCycle );
        voidTraderCycle = null;
    }
    var voidTrader = worldState.voidTrader;
    if (voidTrader) {
        voidTraderCycle = setInterval( function () {
            var current = new Date().getTime();
            var activate = new Date( voidTrader.activation ).getTime();
            var expire = new Date( voidTrader.expiry ).getTime();

            var durationActive = moment.duration( activate - current - 1000, 'milliseconds' );
            var durationExpire = moment.duration( expire - current - 1000, 'milliseconds' );

            if (current < activate) {
                document.getElementById( 'voidtradertitle' ).innerText = voidTrader.character + ' arrives in:';
                document.getElementById( 'voidtradertime' ).innerText = formatDuration( durationActive );
                document.getElementById( 'voidtradertimezonetitle' ).innerText = 'Arrives at:';
                document.getElementById( 'voidtradertimezonetime' ).innerText = moment( voidTrader.activation ).format( 'MMMM Do YYYY, h:mm:ss a' );
            }
            else if (current > activate && current < expire) {
                document.getElementById( 'voidtradertitle' ).innerText = voidTrader.character + ' leaves in:';
                document.getElementById( 'voidtradertime' ).innerText = formatDuration( durationExpire );
                document.getElementById( 'voidtradertimezonetitle' ).innerText = 'Leaves at:';
                document.getElementById( 'voidtradertimezonetime' ).innerText = moment( voidTrader.expiry ).format( 'MMMM Do YYYY, h:mm:ss a' );
            }
            else {
                document.getElementById( 'voidtradertitle' ).innerText = 'Void Trader';
                document.getElementById( 'voidtradertime' ).innerText = 'data expired...';
                document.getElementById( 'voidtradertimezonetitle' ).innerText = 'Waiting for new information';
                document.getElementById( 'voidtradertimezonetime' ).innerText = 'from WorldState';
            }
        }, 1000 );
    }
    else {
        document.getElementById( 'voidtradertitle' ).innerText = 'No Void Trader';
        document.getElementById( 'voidtradertime' ).innerText = 'Available';
        document.getElementById( 'voidtradertimezonetitle' ).innerText = 'Waiting for new information';
        document.getElementById( 'voidtradertimezonetime' ).innerText = 'from WorldState';
    }
}

function calculateDiscount(original, sale){
    return Math.floor((sale - original) / original * 100) + '%';
}

function calculateInventory(total, sold){
    return (total - sold) + '/' + total;
}

function updateDarvoDeals() {
    var dailyDeals = worldState.dailyDeals;
    if (dailyDeals.length !== 0) {
        $('#darvotitle').hide();
        if (document.getElementById( dailyDeals[0].id ) === null) {
            var inventoryString = '<table class="table table-striped table-hover dailyDealsInventory" id="' +
                dailyDeals[0].id + '">\n' +
                '<thead>\n' +
                '<tr>\n' +
                '<th class="text-center">Item Name</th>\n' +
                '<th class="text-center">Discount</th>\n' +
                '<th class="text-center">Platinum</th>\n' +
                '<th class="text-center">Stock</th>\n' +
                '<th class="text-center">Time Left</th>\n' +
                '</tr>\n' +
                '</thead>\n' +
                '<tbody id="dailyDealsInventory">\n' +
                '</tbody>\n' +
                '</table>\n' +
                '</div>\n' +
                '</div>';
            $( '#darvobody' ).append( inventoryString );
            for (var item = 0; item < dailyDeals.length; item++) {
                var currentItem = dailyDeals[ item ];
                var itemString = '<tr><td>' + currentItem.item + '</td><td>' + calculateDiscount(currentItem.originalPrice,
                    currentItem.salePrice) + '</td>' + '<td>' + currentItem.salePrice + '</td><td>' +
                    calculateInventory(currentItem.total, currentItem.sold) + '</td>' +
                    '<td><span class="label timer" data-endtime="' + currentItem.expiry + '"></span></td></tr>';
                $( '#dailyDealsInventory' ).append(itemString);
            }
        }
        setTimeout(updateVoidTraderInventory, 30000);
    }
    else {
        if (document.getElementsByClassName( 'dailyDealsInventory' )) {
            $( '.dailyDealsInventory' ).remove();
            document.getElementById( 'darvotitle' ).innerText = 'No current deals :(';
            $( '#darvotitle' ).show();
        }
        setTimeout(updateVoidTraderInventory, 30000);
    }
}

function updatePage() {
    updateCetusCycle();
    updateEarthCycle();
    updateVoidTrader();
    updateVoidTraderInventory();
    updateDarvoDeals();
    updateCetusBountyTimer();
    updateWorldStateTime();
}

// Retrieves the easy to parse worldstate from WFCD
function getWorldState() {
    $.getJSON( 'https://ws.warframestat.us/pc', function (data) {
        worldState = JSON.parse( JSON.stringify( data ) );
        updateTime = (new Date()).getTime();
        updateDataDependencies();
        updatePage();
    } );
}

function updateTimeLabels() {
    var labels = document.getElementsByClassName('timer');
    for(var i = 0; i < labels.length; i++){
        var currentLabel = labels[i];
        var expireTime = (new Date(currentLabel.getAttribute('data-endtime'))).getTime();
        var currentTime = (new Date()).getTime();
        var duration = moment.duration( expireTime - currentTime - 1000, 'milliseconds' );
        if(currentTime > expireTime){
            currentLabel.classList.remove('label-success');
            currentLabel.classList.add('label-danger');
            currentLabel.innerText = 'Expired: ' + formatDurationShort( duration );
        }
        else {
            currentLabel.classList.add('label-success');
            currentLabel.innerText = formatDurationShort( duration );
        }
    }
    setTimeout(updateTimeLabels, 1000);
}

getWorldState();
updateTimeLabels();
worldCycle = setInterval( function () {
    getWorldState();
}, 60000 );

resetCycle = setInterval( function () {
    var nextReset = (new Date()).setUTCHours(24, 0, 0, 0);
    var currentTime = (new Date()).getTime();
    var duration = moment.duration( nextReset - currentTime - 1000, 'milliseconds' );
    document.getElementById( 'resettimertitle' ).innerText = 'Time until new server day:';
    document.getElementById( 'resettimertime' ).innerText = formatDuration(duration);

}, 1000 );
