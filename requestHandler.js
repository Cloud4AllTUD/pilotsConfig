/*!
    GPII pilotsConfig

    Copyright 2014 Technische Universität Dresden (TUD)
    Copyright 2014 Raising the Floor - International (RtF)
    Copyright 2014 Hochschule der Medien (HdM)

    Licensed under the New BSD license. You may not use this file except in
    compliance with this License.

    You may obtain a copy of the License at
    https://github.com/GPII/universal/blob/master/LICENSE.txt


    Acknowledgements:
    The research leading to these results has received funding from 
    the European Union's Seventh Framework Programme (FP7/2007-2013) 
    under grant agreement no. 289016.
*/
var util = require('util');
var http = require('http');
var querystring = require("querystring");
var fs = require('fs');

function start(response, postData){
	console.log("Request handler 'start' was called");
	//TODO: load html from template (split logic from content)
	var body = '<!DOCTYPE html><html lang="en">'+
	 '<head>'+
	 '<meta http-equiv="Content-Type" content="text/html; '+
	 'charset=UTF-8" />'+
	 '<title>Cloud4all Pilots Configuration Tool</title>'+
	 '</head>'+
	 '<body>'+
	 '<h1>Pilots Configuration Panel</h1>'+
	 '<h2>Select Matchmaker</h2>'+
	 '<p>Note: Cloud4all/GPII server must be started before selecting a Matchmaker.</p>'+
	 '<form action="/selectMM" method="post">'+
	 '<fieldset><legend>Select Matchmaker</legend>'+
	 'For auto-configuration scenario:<br>'+
	 '<input type="radio" name="matchmaker" id="mm_default" checked="checked" value="flat"><label for="mm_default">Rule-based Matchmaker (without solution selection option)</label><br>'+
	 '<input type="radio" name="matchmaker" id="mm_stmm" value="statistical"><label for="mm_stmm">Statistical Matchmaker</label><br>'+
//	'<p>For demo solution selection scenario:<br>'+
//	'<input type="radio" name="matchmaker" value="ruleBased">Rule-based Matchmaker<br>'+
//	'</p>'+
	 '<input type="submit" value="Set Matchmaker strategy" /></fieldset>'+
	 '</form>'+
	 // snapshot to prefs
	 '<h2>Snapshot preferences</h2>'+
	 '<form action="/snapshotToPrefs" method="post">'+
	 '<fieldset><legend id="snapshottoserver">Snapshot local settings to server</legend>'+
	 createSnapshotterSelection()+
	 '<input type="submit" value="Snapshot" aria-labelledby="snapshottoserver" />'+
	 '</fieldset></form>'+
	 // log to device
	 '<h2>Log preferences on local system</h2>'+
	 '<form action="/logging" method="post">'+
	 '<fieldset><legend id="writelocalsettingslog">Log current/settings on local file system</legend>'+
	 '<input type="submit" value="Logging" />'+
	 '</fieldset></form>'+
	 // select device spec
	 '<h2>Select Device Specification</h2><div id="selectDeviceSpec" style="float: none; clear: both;">'+
	 '<form action="/setDetailedDeviceinfo" method="post" style="width: 50%; float: left;">'+
	 '<fieldset><legend>For platform A/B scenario</legend>'+
	 createDetailedDeviceSelection()+
	 '<input type="submit" value="Set device configuration" />'+
	 '</fieldset>'+
	 '</form>\n'+

	 '<form action="/setDeviceinfo" method="post" style="width: 50%; float: left;">'+
	 '<fieldset><legend>For Demos</legend>'+
	 '<input type="radio" name="device" id="demo_SmartHouse" value="demo_SmartHouse"><label for="demo_SmartHouse">SmartHouse</label><br>'+
	 '<input type="radio" name="device" id="demo_Maavis" value="demo_Maavis"><label for="demo_Maavis">Maavis</label><br>'+
	 '<input type="radio" name="device" id="demo_GoogleChrome" value="demo_GoogleChrome"><label for="demo_GoogleChrome">Google Chrome extension</label><br>'+
	 '<input type="radio" name="device" id="demo_Library" value="demo_Library"><label for="demo_Library">WebAnywhere</label><br>'+
//	 '<input type="radio" name="device" value="demo_MultipleSolutions">Mulitple solutions in computer lab<br>'+
	 '</fieldset>\n'+
	 '<fieldset><legend>Default configuration</legend>'+
	 '<input type="radio" name="device" id="installedSolutions" value="installedSolutions"><label for="installedSolutions">Set device specification to default</label>'+
	 '</fieldset>'+
	 '<input type="submit" value="Set device configuration" />'+
	 '</form>\n</div>\n'+
	 // feedback pages 
	 '<h2 style="clear: left">Proposing a new Solution - Feedback</h2>'+
	 '<p>NVDA:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackGerman.html" target="_blank">NVDA feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackSpanish.html" target="_blank">NVDA feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackGreek.html" target="_blank">NVDA feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/NVDA/RBMMFeedbackEnglish.html" target="_blank">NVDA feedback Englisch</a><br>'+
	 '</p>'+
	 '<p>SuperNova:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackGerman.html" target="_blank">SuperNova feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackSpanish.html" target="_blank">SuperNova feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackGreek.html" target="_blank">SuperNova feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/SuperNova/RBMMFeedbackEnglish.html" target="_blank">SuperNova feedback Englisch</a><br>'+
	 '</p>'+
	 '<p>WebAnywhere:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackGerman.html" target="_blank">WebAnywhere feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackSpanish.html" target="_blank">WebAnywhere feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackGreek.html" target="_blank">WebAnywhere feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/WebAnywhere/RBMMFeedbackEnglish.html" target="_blank">WebAnywhere feedback Englisch</a><br>'+	 
	 '</p>'+
	 '<p>ORCA:<br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackGerman.html" target="_blank">ORCA feedback German</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackSpanish.html" target="_blank">ORCA feedback Spain</a><br>'+
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackGreek.html" target="_blank">ORCA feedback Greek</a><br>'+	 
	 '<a href="http://wwwpub.zih.tu-dresden.de/~loitsch/feedback/ORCA/RBMMFeedbackEnglish.html" target="_blank">ORCA feedback Englisch</a><br>'+	 	 
	 '</p>'+	 
	 '</body>'+
	 '</html>';
	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function createDetailedDeviceSelection() {
	var result = "";
	for (i in snapshotterSolutionsList) {
		var solution = snapshotterSolutionsList[i];
		var id = solution["id"];
		var name = solution["name"];
		if (!name) { name = id; }
		result += '<input type="checkbox" id="DeviceReporter_' + id + '" name="' + id + '" value="1"><label for="DeviceReporter_' + id + '">' + name + '</label><br>\n';
	}
	return result;
}

function setDetailedDeviceinfo(response, postData){
	var parsedPost = querystring.parse(postData);
	// Select solutions
	var multipleSolutionsPresent = false;
	var deviceText = '[';
	for (i in snapshotterSolutionsList) {
		var id = snapshotterSolutionsList[i]["id"];
		if (parsedPost[id] == 1) {
			if (multipleSolutionsPresent) { deviceText += ',' }
			deviceText += '{"id": "' + id + '"}'
			multipleSolutionsPresent = true;
		}
	}
	deviceText += ']';
	// Write installedSolutions.json
	fs.writeFile('../node_modules/universal/testData/deviceReporter/installedSolutions.json', deviceText, function(err) {
		if (err) {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>" + err + "</p>");
			response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();	
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Device information successfully set!</p>");
			response.write("<p>(Device info: " + deviceText + ")</p>");
			response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();	
		}
	});
}


function setDeviceinfo(response, postData){
	var device = querystring.parse(postData)["device"];
	if (device == "installedSolutions"){
		var filePath = 	'./'+ device +'.json' ;
	}
	else{
		
		var filePath = 	'../node_modules/universal/testData/deviceReporter/secondPilots/'+ device +'.json' ;
	}
	
	fs.createReadStream(filePath).pipe(fs.createWriteStream('../node_modules/universal/testData/deviceReporter/installedSolutions.json'));

	response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Device information successfully set! (" + device + ")</p>");
    response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
	response.end();	
}


function getJSONRequest (url, callback) {
	var	reply = "";

	// fetch preference set from the preference server
	http.get(url, function(res) {

		res.on('data', function(dat){
			reply += dat;
		});

		res.on('end', function () {

			callback(reply);
		});

	}).on('error', function(e) {
		console.log("Error on get request to "+url+": " + e.message);
		callback(undefined);
	});
};

function getCurrentToken (callback) {
	return getJSONRequest("http://localhost:8081/token", callback);
}

function getPreferences (token, callback) {
	return getJSONRequest("http://preferences.gpii.net/user/" + token, callback);
}

function getSnapshot (callback) {
	return getJSONRequest("http://localhost:8081/snapshot", callback);
}

function selectMM (response, postData) {
	var matchmaker = querystring.parse(postData)["matchmaker"];

	getCurrentToken(function (token) {
		if (token) {
				token = token.replace(/\s/, "");
				token = token.replace(/\[\"/, "");
				token = token.replace(/\"\]/, "");

			getPreferences(token, function (reply) {
				var preferences = JSON.parse(reply);
				if (preferences && preferences['preferences']) {
					preferences['preferences']['http://registry.gpii.org/common/matchMakerType'] = [{ "value": matchmaker}];
					saveModifiedPreferences(token, preferences['preferences'], "matchmaker successfully selected", response);
				} else {
					response.writeHead(200, {"Content-Type": "text/html"});
                    response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Error on fetching preferences!</p>");
                    response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
					response.end();
				}
			});

		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Error on fetching user token!</p>");
            response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();
		}
	});
};

function logging(response) {
	var sys = require('sys');
	var exec = require('child_process').exec;
	var path = require('path');
	
	console.log ("platform" + process.platform);
	if(process.platform === 'linux') 
		var logScript = path.join(process.cwd(), '../linux/LogLocalSettings.sh');
	
	else 
		var logScript = path.join(process.cwd(), './LogLocalSettings.cmd');
		
	fs.exists(logScript, function (exists) {
		var child = exec(logScript, function (error, stdout, stderr) {
			console.log ("logging script: " + logScript);
			console.log ("logging results: " + stdout);
			
			response.writeHead(200, {"Content-Type": "text/html"});
			response.write("<html><title>Logging results</title><body><p>Logging results: " + stdout + "</p>");
			if (stderr) {
			    response.write("<p>Error: " + stderr + "</p>");
			}
			response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();	
    });	
	});
};


function snapshotToLog(response) {
	var data = new Date();
	var timestamp = data.getDate()+'.'+data.getMonth()+'_time_'+data.getHours()+'.'+data.getMinutes();
	var path = './logs/';
	var log = { };
	//Read the currently logged in token
	getCurrentToken(function (token) {
		if (token) {
		
			getSnapshot(function (reply) {
				var snapshotted = JSON.parse(reply);
				log['token'] = token; 
				log['timestamp'] = timestamp; 
				log['preferences'] = snapshotted;
				fs.mkdir(path,function(e){
					if(!e || (e && e.code === 'EEXIST')){
						fs.writeFile('./logs/'+token+'_'+timestamp, JSON.stringify(log), function(err) {
					
							if(err) {
								console.log(err);
								response.end();
							} else {
								console.log("Logfile saved!");
								response.writeHead(200, {"Content-Type": "text/html"});
                                response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Log successfully saved in directory pilotsConfig/logs!</p>");
                                response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
								response.end();
							}
						});
					} else {
						//debug
						console.log(e);
					}
				});
			});

		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Error on fetching user token!</p>");
            response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();
		}
	});
};

function snapshotToPrefs(response, postData) {
	//Read the currently logged in token
	var parsedPost = querystring.parse(postData);
	getCurrentToken(function (token) {
		if (token) {
			token = token.replace(/\s/, "");
			token = token.replace(/\[\"/, "");
			token = token.replace(/\"\]/, "");
			//If a token is logged in, get that token's preferences
			getPreferences(token, function (reply) {
				var preferences = JSON.parse(reply);
				if (preferences && preferences['preferences']) {
					//Get and add the snapshotted settings to the preference set
					getSnapshot(function (reply) {
						var snapshotted = JSON.parse(reply);
						for (solution in snapshotted) {
							if ((parsedPost) && isAllowedSnapshotSolution(solution, parsedPost)) {
								preferences['preferences'][solution] = snapshotted[solution];
							};
						};
						saveModifiedPreferences(token, preferences['preferences']	, "Snapshot saved to preferences server", response);
					});
				} else {
					response.writeHead(200, {"Content-Type": "text/html"});
                    response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Error on fetching preferences!</p>");
                    response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
					response.end();
				}
			});
		} else {
			response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>Error on fetching user token!</p>");
            response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();
		}
	});
};


function getFeedback(response, postData){
	var file = querystring.parse(postData)['feedback'];
	fs.readFile('./feedback/'+file, function(err, feedback){
		if(err){
			throw err;
		}
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(feedback);
		response.end();
	});
}

function saveModifiedPreferences(token, preferencesObject, usrMsg, response) {
	var data = JSON.stringify(preferencesObject);

	// object of options to indicate where to POST to
	var post_options = {
		host: 'preferences.gpii.net',
		port: '80',
		path: '/user/' + token,
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		'Content-Length': data.length
		}
	};

	// set up the http.request POST
	var post_req = http.request(post_options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			console.log('Response: ' + chunk);
		});
		res.on('end', function(){
			response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<html><title>Pilots Configuration Tool Feedback</title><body><p>" + usrMsg + "</p>");
            response.write("<p><a href='javascript:history.go(-1)'>Go back to the pilotsConfig tool</a>.</p></body></html>");
			response.end();
		});
	});
	// writes http request body data; Server replies and response callback 'res' gets activated
	post_req.write(data);
	post_req.end();

}

exports.start = start;
exports.selectMM = selectMM;
exports.setDetailedDeviceinfo = setDetailedDeviceinfo;
exports.setDeviceinfo = setDeviceinfo;
exports.snapshotToPrefs = snapshotToPrefs;
exports.getFeedback = getFeedback;
exports.logging = logging;
// outdated logging
//exports.snapshotToLog = snapshotToLog;


function isAllowedSnapshotSolution(solution, parsedPost) {
	for (key in parsedPost) {
		if ((solution.indexOf(key) > -1) && (parsedPost[key] == 1)) {
			return true;
		}
	}
	return false;
}

function createSnapshotterSelection() {
	var result = "";
	for (i in snapshotterSolutionsList) {
		var solution = snapshotterSolutionsList[i];
		var id = solution["id"];
		var name = solution["name"];
		if (!name) { name = id; }
		result += '<input type="checkbox" id="SnapShotter_' + id + '" name="' + id + '" value="1"><label for="SnapShotter_' + id + '">' + name + '</label><br>\n';
	}
	return result;
}

snapshotterSolutionsList = 
[
    {
        "id": "org.nvda-project",
		"name": "NVDA"
    },
    {
        "id": "com.microsoft.windows.magnifier",
        "name": "Windows Built-in Screen Magnifier"
    },
    {
        "id": "com.microsoft.windows.highContrast",
        "name": "Windows High Contrast"
    },
    {
        "id": "com.microsoft.windows.cursors",
        "name": "Windows Cursors"
    },
    {
        "id": "com.microsoft.windows.mouseTrailing",
        "name": "Windows Mouse Trailing"
    },
    {
        "id": "com.microsoft.windows.onscreenKeyboard",
        "name": "Windows Built-in Onscreen Keyboard"
    },
    {
        "id": "org.gnome.orca",
        "name": "ORCA Screen Reader"
    },
    {
        "id": "org.gnome.desktop.a11y.magnifier",
        "name": "GNOME Shell Magnifier"
    },
    {
        "id": "org.gnome.desktop.interface",
        "name": "GNOME Interface Settings (font size, cursor size)"
    },
    {
        "id": "org.gnome.shell.overrides",
        "name": "GNOME Shell overrides"
    },
    {
        "id": "org.gnome.desktop.wm.preferences",
        "name": "GNOME desktop Window Manager preferences"
    },
    {
        "id": "org.gnome.nautilus",
        "name": "GNOME Nautilus Settings"
    },
    {
        "id": "org.gnome.desktop.a11y.keyboard",
        "name": "GNOME Shell Keyboard Settings"
    },
    {
        "id": "org.gnome.desktop.a11y.applications.onscreen-keyboard",
        "name": "GNOME Assistive Technology - Screen Keyboard"
    },
    {
        "id": "org.alsa-project",
        "name": "Linux System Volume (ALSA)"
    },
    {
        "id": "org.freedesktop.xrandr",
        "name": "XRandR (for brightness, screen height and screen width)"
    },
    {
        "id": "org.chrome.cloud4chrome",
        "name": "Cloud4Chrome"
    }
];
