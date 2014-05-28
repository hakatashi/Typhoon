var hostname = 'ws://' + location.hostname + '/websocket';

var id;
var ws;
var player;

function onYouTubePlayerAPIReady() {
	player = new YT.Player('player', {
		height: '768',
		width: '1024',
		playerVars: {
			'controls': 0,
			'disablekb': 1
		},
		events: {
			'onReady': onPlayerReady,
			'onStateChange': onPlayerStateChange
		}
	});
}

function onPlayerReady(event) {
	event.target.playVideo();
}

function onPlayerStateChange(event) {
	if(event.data == 0)
		ws.send('finish');
}

function init() {
	ws = new WebSocket(hostname);
	
	ws.onmessage = function(message) {
		var data = JSON.parse(message.data);
		var songs = data.queue;
		$('#dislike').text(data.dislike + ' / ' + data.limit);

		var table = $('div.queue>table>tbody');
		table.children().remove();
		for(var i = 0; i < songs.length; i++) {
			var tr = $('<tr>');
			tr.append($('<td>').text(i + 1));
			tr.append($('<td>').text(songs[i].title));
			tr.append($('<td>').text(songs[i].duration));
			table.append(tr);
		}
		
		if(songs.length == 0) {
			id = null;
			player.stopVideo();
		} else if(songs[0].id != id) {
			id = songs[0].id;
			player.loadVideoById(id);
		}
	}
	
	ws.onclose = function() {
		ws.close();
		ws = new WebSocket(hostname);
	}
	ws.onerror = function() {
		ws.close();
		ws = new WebSocket(hostname);
	}
}
