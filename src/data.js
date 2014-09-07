angular.module('AudioTrackr').factory('songFactory', function () {
	return [
		{
			name: 'Analog Or Digital',
			band: 'Wildlife Control',
			link: 'https://itunes.apple.com/us/album/analog-or-digital/id544588972?i=544588975',
			tracks: {
				vocals: 'files/analogordigital/Analog or Digital.Vocals.mp3',
				guitarpiano: 'files/analogordigital/Analog or Digital.GuitarPiano.mp3',
				drums: 'files/analogordigital/Analog or Digital.Drums.mp3',
				bass: 'files/analogordigital/Analog or Digital.Bass.mp3'
			}
		},
		{
			name: 'Lasso',
			band: 'Phoenix',
			link: 'https://itunes.apple.com/us/album/lasso/id315002203?i=315002473',
			tracks: {
				guitar: 'files/lasso/Guitar.mp3',
				bass: 'files/lasso/Bass.mp3',
				beat: 'files/lasso/Beat.mp3',
				key: 'files/lasso/Key.mp3',
				//roll: 'files/lasso/Roll.mp3',
				vocals: 'files/lasso/Accapela.mp3'
			}
		},
		{
			name: 'Armistice',
			band: 'Phoenix',
			link: 'https://itunes.apple.com/us/album/armistice/id315002203?i=315002670',
			tracks: {
				beat: 'files/armistice/Beat.mp3',
				goblins: 'files/armistice/Goblins.mp3',
				guitar: 'files/armistice/Guitar.mp3',
				keys: 'files/armistice/Keys + CS.mp3',
				bass: 'files/armistice/Bass.mp3',
				vocals: 'files/armistice/Accapela.mp3'
			}
		},
		{
			name: "Lisztomania",
			band: "Phoenix",
			link: 'https://itunes.apple.com/us/album/lisztomania/id315002203?i=315002364',
			tracks: {
				Bass: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Bass-combined.mp3',
				Beat: '//s1.cbateman.com/demos/AudioTrackr/files/lisztomania/Beat.mp3',
				Brass: '//s2.cbateman.com/demos/AudioTrackr/files/lisztomania/Brass.mp3',
				Cocotte: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Cocotte.mp3',
				Guitar1: '//s1.cbateman.com/demos/AudioTrackr/files/lisztomania/Guitar1.mp3',
				Guitar2: '//s2.cbateman.com/demos/AudioTrackr/files/lisztomania/Guitar2.mp3',
				Guitar3: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Guitar3.mp3',
				Key: '//s1.cbateman.com/demos/AudioTrackr/files/lisztomania/Key.mp3',
				Motif: '//s2.cbateman.com/demos/AudioTrackr/files/lisztomania/Motif.mp3',
				Vocals: '//cbateman.com/demos/AudioTrackr/files/lisztomania/Vox.mp3'
			}
		},
		{
			name: "Trying to be Cool",
			band: "Phoenix",
			link: 'https://itunes.apple.com/us/album/trying-to-be-cool/id602308131?i=602308222',
			tracks: {
				'Electric Guitars': '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/ALL ELEC GTRS.mp3',
				Solinas: '//s1.cbateman.com/demos/AudioTrackr/files/tryingtobecool/ALL SOLINAS.mp3',
				Bass: '//s2.cbateman.com/demos/AudioTrackr/files/tryingtobecool/BASS.mp3',
				Beat: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/BEAT.mp3',
				'China Sonus Tone': '//s1.cbateman.com/demos/AudioTrackr/files/tryingtobecool/CHINA SONUS TONE.mp3',
				'Glock Claps': '//s2.cbateman.com/demos/AudioTrackr/files/tryingtobecool/GLOCK CLAPS.mp3',
				Guitar12: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/GTR12.mp3',
				Moog: '//s1.cbateman.com/demos/AudioTrackr/files/tryingtobecool/MOOG MEGAWAVE.mp3',
				Riff: '//s2.cbateman.com/demos/AudioTrackr/files/tryingtobecool/RIFF.mp3',
				Vocals: '//cbateman.com/demos/AudioTrackr/files/tryingtobecool/LEAD DRY.mp3'
			}
		}
	];
});