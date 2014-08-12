angular.module('AudioTrackr').directive('track', function() {
	
	var trackController = function($scope, $element, $timeout, audioTrackFactory) {
		
		$scope.trackVolume = 100;
		$scope.loading = true;
		
		var track = $scope.track;
		var canvas = $element[0].querySelector('canvas');
		var cWidth = $scope.trackWidth;
		var cHeight = 200;
		var freqShowPercent = 0.75;
		var fftSize = 256;
		var freqCount = fftSize / 2;
		var freqDrawWidth = cWidth / (freqCount * freqShowPercent);
		var timeDrawWidth = cWidth / freqCount;
		
		var audioTrack;
		var analyser;
		
		
		(function init() {
			audioTrack = audioTrackFactory.getNewAudioTrack(
				$scope.$parent.aCtx,
				$scope.$parent.useAudioTag,
				track.url,
				$scope.$parent.master.gainNode,
				fftSize
			);
			
			audioTrack.loadAndDecode(updateStatus);
			initCanvas(canvas);
		})();
		
		
		
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
		
		$scope.$watch('trackVolume', function(value) {
			value = value / 100;
			audioTrack.setVolume(value);
		});
		
		
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
		
		track.draw = function() {
			var ctx = track.cCtx;
			
			if (!analyser) {
				return;
			}
			
			var byteFreqArr = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteFrequencyData(byteFreqArr);
			
			var timeDomainArr = new Uint8Array(analyser.frequencyBinCount);
			analyser.getByteTimeDomainData(timeDomainArr);
			
			ctx.clearRect(0, 0, cWidth, cHeight);
			
			ctx.beginPath();
			for (var j=0, jLen=byteFreqArr.length; j<jLen; j++) {
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
			trackName: '@',
			trackWidth: '@'
		},
		link: function(scope, elem, attrs) {
			
		},
		templateUrl: 'src/track.htm',
		controller: trackController
	}
});
