angular.module('AudioTrackr').factory('audioTrackFactory', function ($http) {
	
	function AudioTrack(cfg) {
		this.ctx = cfg.ctx;
		this.useAudioTag = cfg.useAudioTag;
		this.url = cfg.url;
		this.outNode = cfg.outNode;
		this.fftSize = cfg.fftSize;
	}
	
	AudioTrack.prototype.addGainNode = function (node) {
		var gainNode = this.ctx.createGain();
		node.connect(gainNode);
		gainNode.connect(this.outNode);
		
		return gainNode;
	};
	
	AudioTrack.prototype.createAnalyser = function(node) {
		var analyser = this.ctx.createAnalyser();
		analyser.smoothingTimeConstant = 0.6;
		analyser.fftSize = this.fftSize;
		
		node.connect(analyser);
		
		return analyser;
	};
	
	AudioTrack.prototype.loadAndDecode = function(statusCallback) {
		var self = this;
		
		if (self.useAudioTag) {
			var audio = new Audio(self.url);
			audio.addEventListener('canplaythrough', function(e) {
				self.node = self.ctx.createMediaElementSource(audio);
				
				self.gainNode = self.addGainNode(self.node);
				self.analyser = self.createAnalyser(self.gainNode);
				
				statusCallback('ready');
			});
			
			self.audio = audio;
		} else {
			if (self.buffer) { // already loaded
				self. pauseTime = null;
				statusCallback('ready');
				return;
			}
			statusCallback('loading');
			
			$http
				.get(this.url, {
					responseType: 'arraybuffer'
				})
				.then(function(response) {
					statusCallback('decoding');
					self.ctx.decodeAudioData(response.data, function(buffer) {
						self.buffer = buffer;
						statusCallback('ready');
					});
				});
			
		}
	};
	
	AudioTrack.prototype.play = function() {
		if (this.useAudioTag) {
			this.audio.play();
		} else {
			this.playBuffer();
		}
	};
	
	AudioTrack.prototype.stop = function() {
		if (this.useAudioTag) {
			this.audio.pause();
		} else {
			this.bsNode.stop(0);
			this.pauseTime = this.ctx.currentTime - this.startTime;
		}
	};
	
	AudioTrack.prototype.setVolume = function(value) {
		if (this.gainNode) {
			this.gainNode.gain.value = value;
		}
	};
	
	
	AudioTrack.prototype.playBuffer = function() {
		this.bsNode = this.ctx.createBufferSource();
		this.bsNode.buffer = this.buffer;
		
		var bufferOffset = this.pauseTime || 0;
		this.startTime = this.ctx.currentTime;
		if (this.pauseTime) {
			this.startTime -= this.pauseTime;
		}
		
		this.bsNode.start(0, bufferOffset);
		
		this.gainNode = this.addGainNode(this.bsNode, this.outNode);
		this.analyser = this.createAnalyser(this.gainNode, this.fftSize);
	};
	
	AudioTrack.prototype.clear = function() {
		if (this.audio) {
			this.audio.src = '';
		}
	};
	
	
	return {
		getNewAudioTrack: function() {
			var instance = Object.create(AudioTrack.prototype);
			AudioTrack.apply(instance, arguments);
			
			return instance;
		}
	};
});
