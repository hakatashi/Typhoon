var hostname = 'ws://' + location.hostname + '/websocket';
var ws;
		
function init() {
	ws = new WebSocket(hostname);
	
	ws.onmessage = function(message) {
		var data = JSON.parse(message.data);
		var dislike = document.getElementById('dislike');
		dislike.innerText = 'Dislike: ' + data.dislike + '/' + data.limit;
		
		var songs = data.queue;
		var ol = document.getElementById('list');
		
		for(var i = ol.childNodes.length - 1; i > -1; i--)
			ol.removeChild(ol.childNodes[i]);
		
		for(var i = 0; i < songs.length; i++) {
			var element = document.createElement('li');
			element.innerText = songs[i].title + ' (' + songs[i].duration + ')';
			ol.appendChild(element);
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

function dislike() {
	ws.send('dislike');
}
