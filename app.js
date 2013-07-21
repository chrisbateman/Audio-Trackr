
(function() {
	window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	
	// So sorry. There's no way to detect whether a browser can play multiple audio elements at once.
	var _isiOS = navigator.userAgent.match(/(iPad|iPhone|iPod)/g) ? true : false;
	var _cWidth;
	var _cHeight = 200;
	var _useAudioTag = true;
	var _showPercent = 0.75;
	var _fftSize = 256;
	var _freqCount = _fftSize / 2;
	var _freqDrawWidth;
	var _timeDrawWidth;
	var _aCtx;
	var _master = {};
	
	
	
	
	var _page = angular.module('Page', [] );
	
	_page.controller('PageController', function($scope) {
		
		(function init() {
			if (!AudioContext) { // bag it and go home
				$scope.error = true;
				return;
			}
			
			_parseTracks();
			_setWidths();
			_initAudio();
		})();
		
		
		$scope.currentSong;
		$scope.songs = songs;
		$scope.ready = false
		$scope.playing = false;
		var thisLoadCount = 0;
		
		
		
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
				if (track.analyser) {
					_drawStuff(track.cCtx, track.analyser);
				}
			});
			//_drawStuff(_master.cCtx, _master.analyser);
			
			window.requestAnimationFrame(tick);
		}
		
		
		function clearAudios(tracks) {
			angular.forEach(tracks, function(track, key) {
				if (track.audio) {
					track.audio.src = '';
				}
			});
		}
	});
	
	
	_page.controller('TrackController', function($scope, $element) {
		$scope.trackVolume = 100;
		$scope.loading = true;
		$scope.canvas = $element[0].getElementsByTagName('canvas')[0];
		
		$scope.track.play = function() {
			if (_useAudioTag) {
				$scope.track.audio.play();
			} else {
				_playBuffer($scope.track);
			}
		};
		
		$scope.track.stop = function() {
			if (_useAudioTag) {
				$scope.track.audio.pause();
			} else {
				if ($scope.track.node.stop) {
					$scope.track.node.stop(0);
				} else {
					$scope.track.node.noteOff(0);
				}
				$scope.track.pauseTime = _aCtx.currentTime - $scope.track.startTime;
			}
		};
		
		$scope.$watch('trackVolume', function(value) {
			value = value / 100;
			if (_useAudioTag) {
				$scope.track.audio.volume = value;
			} else {
				if ($scope.track.node) {
					$scope.track.node.gain.value = value;
				}
			}
		});
		
		var doneLoading = function() {
			$scope.loading = false;
			$scope.status = '';
			$scope.$$phase || $scope.$apply();
			
			$scope.trackLoad($scope.key, $scope.track);
		};
		
		var updateStatus = function(status) {
			$scope.status = status;
			$scope.$$phase || $scope.$apply();
		};
		
		
		_loadAndDecode($scope.track, doneLoading, updateStatus);
		_initCanvas($element[0].getElementsByTagName('canvas')[0], $scope.track);
		
	});
	
	/*
	_page.controller('MasterTrackController', function($scope, $element) {
		$scope.trackVolume = 100;
		_master.canvas = $element[0].getElementsByTagName('canvas')[0];
		
		$scope.$watch('trackVolume', function(value) {
			value = value / 100;
			_master.node.gain.value = value;
		});
		
		_createAnalyser(_master);
		_initCanvas(_master.canvas, _master);
	});
	*/
	
	
	
	
	function _parseTracks() {
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
	
	function _setWidths() {
		_cWidth = document.getElementsByClassName('track-container')[0].offsetWidth;
		
		if (_cWidth > 1200) {
			_cWidth /= 3;
		} else if (_cWidth > 800) {
			_cWidth /= 2;
		}
		_cWidth -= 22;
		
		_freqDrawWidth = _cWidth / (_freqCount * _showPercent);
		_timeDrawWidth = _cWidth / _freqCount;
	}
	
	function _initAudio() {
		_aCtx = new AudioContext();
		_aCtx.createGain = _aCtx.createGain || _aCtx.createGainNode;
		_master.node = _aCtx.createGain();
		_master.node.connect(_aCtx.destination);
		
		if (!_aCtx.createMediaElementSource || _isiOS) {
			_useAudioTag = false;
		}
	}
	
	
	function _loadAndDecode(track, doneCallback, statusCallback) {
		if (_useAudioTag) {
			var audio = new Audio(track.url);
			audio.addEventListener('canplaythrough', function(e) {
				track.node = _aCtx.createMediaElementSource(audio);
				_createAnalyser(track);
				track.node.connect(_master.node);
				doneCallback();
			});
			
			track.audio = audio;
		} else {
			if (track.buffer) { // already loaded
				track.pauseTime = null;
				doneCallback();
				return;
			}
			statusCallback('loading');
			
			var request = new XMLHttpRequest();
			request.open('GET', track.url, true);
			request.responseType = 'arraybuffer';
			request.onload = function() {
				statusCallback('decoding');
				_aCtx.decodeAudioData(request.response, function(buffer) {
					track.buffer = buffer;
					doneCallback();
				});
			}
			request.send();
		}
	}
	
	function _createAnalyser(track) {
		var analyser = _aCtx.createAnalyser();
		analyser.smoothingTimeConstant = 0.6;
		analyser.fftSize = _fftSize;
		
		track.node.connect(analyser);
		track.analyser = analyser;
	}
	
	function _initCanvas(canvas, track) {
		track.canvas = canvas;
		track.canvas.width = _cWidth;
		track.canvas.height = _cHeight;
		
		track.cCtx = track.canvas.getContext('2d');
		
		var gradient = track.cCtx.createLinearGradient(0, 0, 0, _cHeight);
		gradient.addColorStop(0.15, '#e81717');
		gradient.addColorStop(0.75, '#7943cb');
		gradient.addColorStop(1, '#005392');
		track.cCtx.fillStyle = gradient;
		
		track.cCtx.strokeStyle = '#AAA';
	}
	
	function _drawStuff(ctx, analyser) {
		var byteFreqArr = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(byteFreqArr);
		
		var timeDomainArr = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteTimeDomainData(timeDomainArr);
		
		ctx.clearRect(0, 0, _cWidth, _cHeight);
		
		ctx.beginPath();
		for (var j=0,jLen=byteFreqArr.length; j<jLen; j++ ) {
			ctx.fillRect(j*_freqDrawWidth, _cHeight-(byteFreqArr[j] / 256 * _cHeight), (_freqDrawWidth - 2), _cHeight);
			
			var percent = timeDomainArr[j] / 256;
			var offset = _cHeight - (percent * _cHeight) - 1;
			ctx.lineTo(j*_timeDrawWidth, offset);
		}
		ctx.stroke();
	}
	
	function _playBuffer(track) {
		var sourceNode = _aCtx.createBufferSource();
		sourceNode.connect(_master.node);
		sourceNode.buffer = track.buffer;
		
		var bufferOffset = track.pauseTime || 0;
		track.startTime = _aCtx.currentTime;
		if (track.pauseTime) {
			track.startTime -= track.pauseTime;
		}
		
		if (sourceNode.start) {
			sourceNode.start(0, bufferOffset);
		} else {
			sourceNode.noteGrainOn(0, bufferOffset, 180);
		}
		track.node = sourceNode;
		
		_createAnalyser(track);
	}
	
})();