angular.module('AudioTrackr').directive('track', function(){
    
    var trackController = function($scope, $element) {
        
        $scope.trackVolume = 100;
        $scope.loading = true;
        
    	var track = $scope.track;
    	var canvas = $element[0].querySelector('canvas');
    	var cWidth;
    	var cHeight = 200;
    	var freqShowPercent = 0.75;
    	var fftSize = 256;
    	var freqCount = fftSize / 2;
    	var freqDrawWidth;
    	var timeDrawWidth;
    	
        
        
    	(function init() {
    		setWidths();
    		
    		loadAndDecode(doneLoading, updateStatus);
    		initCanvas(canvas);
    	})();
        
        
    	
    	track.play = function() {
    		if ($scope.$parent.useAudioTag) {
    			track.audio.play();
    		} else {
    			playBuffer();
    		}
    	};
    	
    	track.stop = function() {
    		if ($scope.$parent.useAudioTag) {
    			track.audio.pause();
    		} else {
    			if (track.node.stop) {
    				track.node.stop(0);
    			} else {
    				track.node.noteOff(0);
    			}
    			track.pauseTime = $scope.$parent.aCtx.currentTime - track.startTime;
    		}
    	};
    	
    	$scope.$watch('trackVolume', function(value) {
    		value = value / 100;
    		if (track.gainNode) {
    			track.gainNode.gain.value = value;
    		}
    	});
    	
    	function setWidths() {
    		cWidth = document.querySelector('.track-container').offsetWidth;
    		
    		if (cWidth > 1200) {
    			cWidth /= 3;
    		} else if (cWidth > 800) {
    			cWidth /= 2;
    		}
    		cWidth -= 22;
    		
    		freqDrawWidth = cWidth / (freqCount * freqShowPercent);
    		timeDrawWidth = cWidth / freqCount;
    	}
    	
    	
    	function doneLoading() {
    	    $scope.$apply(function() {
    		    $scope.loading = false;
    		    $scope.status = '';
    	    });
    	    
    		$scope.$parent.trackLoad($scope.key, track);
    	}
    	
    	
    	function updateStatus(status) {
    	    $scope.$apply(function() {
    		    $scope.status = status;
    	    });
    	}
    	
    	function loadAndDecode(doneCallback, statusCallback) {
    		if ($scope.$parent.useAudioTag) {
    			var audio = new Audio(track.url);
    			audio.addEventListener('canplaythrough', function(e) {
    				track.node = $scope.$parent.aCtx.createMediaElementSource(audio);
    				
    				addGainNode();
    				createAnalyser();
    				
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
    				$scope.$parent.aCtx.decodeAudioData(request.response, function(buffer) {
    					track.buffer = buffer;
    					doneCallback();
    				});
    			};
    			request.send();
    		}
    	}
    	
    	
    	function initCanvas(canvas) {
    		track.canvas = canvas;
    		track.canvas.width = cWidth;
    		track.canvas.height = cHeight;
    		
    		track.cCtx = track.canvas.getContext('2d');
    		
    		var gradient = track.cCtx.createLinearGradient(0, 0, 0, cHeight);
    		gradient.addColorStop(0.15, '#e81717');
    		gradient.addColorStop(0.75, '#7943cb');
    		gradient.addColorStop(1, '#005392');
    		track.cCtx.fillStyle = gradient;
    		
    		track.cCtx.strokeStyle = '#AAA';
    	}
    	
    	
    	function addGainNode() {
    		track.gainNode = $scope.$parent.aCtx.createGain();
    		track.node.connect(track.gainNode);
    		track.gainNode.connect($scope.$parent.master.gainNode);
    	}
    	
    	
    	function createAnalyser() {
    		var analyser = $scope.$parent.aCtx.createAnalyser();
    		analyser.smoothingTimeConstant = 0.6;
    		analyser.fftSize = fftSize;
    		
    		track.gainNode.connect(analyser);
    		track.analyser = analyser;
    	}
    	
    	
    	function playBuffer() {
    		track.node = $scope.$parent.aCtx.createBufferSource();
    		track.node.buffer = track.buffer;
    		
    		var bufferOffset = track.pauseTime || 0;
    		track.startTime = $scope.$parent.aCtx.currentTime;
    		if (track.pauseTime) {
    			track.startTime -= track.pauseTime;
    		}
    		
    		if (track.node.start) {
    			track.node.start(0, bufferOffset);
    		} else {
    			track.node.noteGrainOn(0, bufferOffset, 180);
    		}
    		
    		addGainNode();
    		createAnalyser();
    	}
    	
    	
    	track.draw = function() {
    		var ctx = track.cCtx;
    		var analyser = track.analyser;
    		
    		if (!analyser) {
    			return;
    		}
    		
    		var byteFreqArr = new Uint8Array(analyser.frequencyBinCount);
    		analyser.getByteFrequencyData(byteFreqArr);
    		
    		var timeDomainArr = new Uint8Array(analyser.frequencyBinCount);
    		analyser.getByteTimeDomainData(timeDomainArr);
    		
    		ctx.clearRect(0, 0, cWidth, cHeight);
    		
    		ctx.beginPath();
    		for (var j=0,jLen=byteFreqArr.length; j<jLen; j++ ) {
    			ctx.fillRect(j*freqDrawWidth, cHeight-(byteFreqArr[j] / 256 * cHeight), (freqDrawWidth - 2), cHeight);
    			
    			var percent = timeDomainArr[j] / 256;
    			var offset = cHeight - (percent * cHeight) - 1;
    			ctx.lineTo(j*timeDrawWidth, offset);
    		}
    		ctx.stroke();
    	};
    	
    };
    
    
    
    return {
        restrict: 'EA',
        //replace: false,
        scope: {
            track: '=',
            trackName: '@'
        },
        link: function(scope, elem, attrs) {
            // scope.test = 'hey';
        },
        templateUrl: 'src/track.htm',
        controller: trackController
    }
});