
angular.module('AudioTrackr').controller('MainController', function($scope, songFactory) {
	
	// So sorry. There's no way to detect whether a browser can play multiple audio elements at once.
	var isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
	var thisLoadCount = 0;
	
	$scope.currentSong;
	$scope.songs = songFactory;
	$scope.ready = false
	$scope.playing = false;
	
	$scope.aCtx;
	$scope.master = {};
	$scope.useAudioTag = true;
	
	
	
	(function init() {
		if (!AudioContext) { // bag it and go home
			$scope.error = true;
			return;
		}
		
		parseTracks(songFactory);
		initAudio();
	})();
	
	
	
	$scope.playTracks = function(tracks) {
		if (!tracks) {
			tracks = $scope.currentSong.tracks;
		}
		angular.forEach(tracks, function(track, key) {
			track.play();
		});
		$scope.playing = true;
	};
	
	$scope.stopTracks = function(tracks) {
		if (!tracks) {
			tracks = $scope.currentSong.tracks;
		}
		angular.forEach(tracks, function(track, key) {
			track.stop();
		});
		$scope.playing = false;
	};
	
	$scope.$watch('currentSong', function(currentSong, oldSong) {
		if ($scope.playing) {
			$scope.stopTracks(oldSong.tracks);
		}
		if (oldSong) {
			clearAudios(oldSong.tracks);
			$scope.ready = false
			thisLoadCount = 0;
		}
	});
	
	$scope.trackLoad = function(key, track) {
		if (++thisLoadCount >= $scope.currentSong.trackCount) {
			$scope.ready = true;
			$scope.$$phase || $scope.$apply();
			tick();
		}
	};
	
	
	function tick() {
		angular.forEach($scope.currentSong.tracks, function(track, key) {
			track.draw();
		});
		
		window.requestAnimationFrame(tick);
	}
	
	
	function clearAudios(tracks) {
		angular.forEach(tracks, function(track, key) {
			if (track.audio) {
				track.audio.src = '';
			}
		});
	}
	
	
	function initAudio() {
		$scope.aCtx = new AudioContext();
		$scope.aCtx.createGain = $scope.aCtx.createGain || $scope.aCtx.createGainNode;
		$scope.master.gainNode = $scope.aCtx.createGain();
		$scope.master.gainNode.connect($scope.aCtx.destination);
		
		if (!$scope.aCtx.createMediaElementSource || isiOS) {
			$scope.useAudioTag = false;
		}
	}
	
	
	function parseTracks(songs) {
		for (var i in songs) {
			var song = songs[i];
			var trackCount = 0;
			for (var k in song.tracks) {
				var track = song.tracks[k];
				song.tracks[k] = {
					url: track,
				};
				trackCount++;
			}
			song.trackCount = trackCount;
		}
	}
	
});