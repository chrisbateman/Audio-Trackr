angular.module('AudioTrackr').factory('songFactory', function () {
	return [
		{
			name: 'Analog Or Digital',
			band: 'Wildlife Control',
			link: 'https://itunes.apple.com/us/album/analog-or-digital/id544588972?i=544588975',
			tracks: [
				{
					name: 'vocals',
					url: 'files/analogordigital/Analog or Digital.Vocals.mp3'
				},
				{
					name: 'guitarpiano',
					url: 'files/analogordigital/Analog or Digital.GuitarPiano.mp3'
				},
				{
					name: 'drums',
					url: 'files/analogordigital/Analog or Digital.Drums.mp3'
				},
				{
					name: 'bass',
					url: 'files/analogordigital/Analog or Digital.Bass.mp3'
				}
			]
		},
		{
			name: 'Lasso',
			band: 'Phoenix',
			link: 'https://itunes.apple.com/us/album/lasso/id315002203?i=315002473',
			tracks: [
				{
					name: 'guitar',
					url: 'files/lasso/Guitar.mp3'
				},
				{
					name: 'bass',
					url: 'files/lasso/Bass.mp3'
				},
				{
					name: 'beat',
					url: 'files/lasso/Beat.mp3'
				},
				{
					name: 'key',
					url: 'files/lasso/Key.mp3'
				},
				/*
				{
					name: 'roll',
					url: 'files/lasso/Roll.mp3'
				},
				*/
				{
					name: 'vocals',
					url: 'files/lasso/Accapela.mp3'
				}
			]
		},
		{
			name: 'Armistice',
			band: 'Phoenix',
			link: 'https://itunes.apple.com/us/album/armistice/id315002203?i=315002670',
			tracks: [
				{
					name: 'beat',
					url: 'files/armistice/Beat.mp3'
				},
				{
					name: 'goblins',
					url: 'files/armistice/Goblins.mp3'
				},
				{
					name: 'guitar',
					url: 'files/armistice/Guitar.mp3'
				},
				{
					name: 'keys',
					url: 'files/armistice/Keys + CS.mp3'
				},
				{
					name: 'bass',
					url: 'files/armistice/Bass.mp3'
				},
				{
					name: 'vocals',
					url: 'files/armistice/Accapela.mp3'
				}
			]
		},
		{
			name: "Lisztomania",
			band: "Phoenix",
			link: 'https://itunes.apple.com/us/album/lisztomania/id315002203?i=315002364',
			tracks: [
				{
					name: 'Bass',
					url: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Bass-combined.mp3'
				},
				{
					name: 'Beat',
					url: '//s1.cbateman.com/demos/AudioTrackr/files/lisztomania/Beat.mp3'
				},
				{
					name: 'Brass',
					url: '//s2.cbateman.com/demos/AudioTrackr/files/lisztomania/Brass.mp3'
				},
				{
					name: 'Cocotte',
					url: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Cocotte.mp3'
				},
				{
					name: 'Guitar1',
					url: '//s1.cbateman.com/demos/AudioTrackr/files/lisztomania/Guitar1.mp3'
				},
				{
					name: 'Guitar2',
					url: '//s2.cbateman.com/demos/AudioTrackr/files/lisztomania/Guitar2.mp3'
				},
				{
					name: 'Guitar3',
					url: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Guitar3.mp3'
				},
				{
					name: 'Key',
					url: '//s1.cbateman.com/demos/AudioTrackr/files/lisztomania/Key.mp3'
				},
				{
					name: 'Motif',
					url: '//s2.cbateman.com/demos/AudioTrackr/files/lisztomania/Motif.mp3'
				},
				{
					name: 'Vocals',
					url: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Vox.mp3'
				}
			]
		},
		{
			name: "Trying to be Cool",
			band: "Phoenix",
			link: 'https://itunes.apple.com/us/album/trying-to-be-cool/id602308131?i=602308222',
			tracks: [
				{
					name: 'Electric Guitars',
					url: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/ALL ELEC GTRS.mp3'
				},
				{
					name: 'Solinas',
					url: '//s1.cbateman.com/demos/AudioTrackr/files/tryingtobecool/ALL SOLINAS.mp3'
				},
				{
					name: 'Bass',
					url: '//s2.cbateman.com/demos/AudioTrackr/files/tryingtobecool/BASS.mp3'
				},
				{
					name: 'Beat',
					url: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/BEAT.mp3'
				},
				{
					name: 'China Sonus Tone',
					url: '//s1.cbateman.com/demos/AudioTrackr/files/tryingtobecool/CHINA SONUS TONE.mp3'
				},
				{
					name: 'Glock Claps',
					url: '//s2.cbateman.com/demos/AudioTrackr/files/tryingtobecool/GLOCK CLAPS.mp3'
				},
				{
					name: 'Guitar12',
					url: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/GTR12.mp3'
				},
				{
					name: 'Moog',
					url: '//s1.cbateman.com/demos/AudioTrackr/files/tryingtobecool/MOOG MEGAWAVE.mp3'
				},
				{
					name: 'Riff',
					url: '//s2.cbateman.com/demos/AudioTrackr/files/tryingtobecool/RIFF.mp3'
				},
				{
					name: 'Vocals',
					url: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/LEAD DRY.mp3'
				}
			]
		}
	];
});