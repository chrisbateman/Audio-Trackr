angular.module('AudioTrackr').directive('track', function() {
	
	function trackController($scope, $element, $timeout, audioTrackFactory) {
		
		$scope.trackVolume = 100;
		$scope.loading = true;
		
		var track = $scope.track;
		var canvas = $element[0].querySelector('canvas');
		var canvasWidth = $scope.$parent.trackWidth;
		var canvasHeight = 200;
		var freqShowPercent = 0.75;
		var fftSize = 256;
		var freqCount = fftSize / 2;
		var freqDrawWidth = canvasWidth / (freqCount * freqShowPercent);
		var timeDrawWidth = canvasWidth / freqCount;
		
		var audioTrack;
		var analyser;
		
		
		(function init() {
			audioTrack = audioTrackFactory.getNewAudioTrack({
				ctx: $scope.$parent.aCtx,
				useAudioTag: $scope.$parent.useAudioTag,
				url: track.url,
				outNode: $scope.$parent.master.gainNode,
				fftSize: fftSize
			});
			
			audioTrack.loadAndDecode(updateStatus);
			initCanvas(canvas);
			
			$scope.$watch('trackVolume', function(value) {
				value = value / 100;
				audioTrack.setVolume(value);
			});
		})();
		
		
		
		function updateStatus(status) {
			if (status === 'ready') {
				$scope.loading = false;
				status = '';
				$scope.$parent.trackLoad($scope.key, track);
			}
			
			$timeout(function() {
				$scope.status = status;
			});
		}
		
		
		function initCanvas(canvas) {
			track.canvas = canvas;
			track.canvas.width = canvasWidth;
			track.canvas.height = canvasHeight;
			
			track.cCtx = track.canvas.getContext('2d');
			
			var gradient = track.cCtx.createLinearGradient(0, 0, 0, canvasHeight);
			gradient.addColorStop(0.15, '#e81717');
			gradient.addColorStop(0.75, '#7943cb');
			gradient.addColorStop(1, '#005392');
			track.cCtx.fillStyle = gradient;
			
			track.cCtx.strokeStyle = '#AAA';
		}
		
		
		// augment track object
		
		track.play = function() {
			audioTrack.play();
			analyser = audioTrack.analyser;
		};
		
		track.stop = function() {
			audioTrack.stop();
		};
		
		track.clear = function() {
			audioTrack.clear();
		};
		
		track.draw = function() {
			var ctx = track.cCtx;
			
			if (!analyser) {
				return;
			}
			
			var byteFreqArr = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(byteFreqArr);
			
			var timeDomainArr = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteTimeDomainData(timeDomainArr);
			
			ctx.clearRect(0, 0, canvasWidth, canvasHeight);
			
			ctx.beginPath();
			for (var i=0, iLen=byteFreqArr.length; i<iLen; i++) {
				ctx.fillRect(i * freqDrawWidth, canvasHeight - (byteFreqArr[i] / 256 * canvasHeight), (freqDrawWidth - 2), canvasHeight);
				
				var percent = timeDomainArr[i] / 256;
				var offset = canvasHeight - (percent * canvasHeight) - 1;
				ctx.lineTo(i * timeDrawWidth, offset);
			}
			ctx.stroke();
		};
		
	};
	
	
	
	return {
		restrict: 'EA',
		replace: true,
		scope: {
			track: '=',
			trackName: '@'
		},
		link: function(scope, elem, attrs) {
			
		},
		templateUrl: 'track/track.htm',
		controller: trackController
	}
});
