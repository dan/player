// 5by5 Audio Player

$(function() { audioPlayerInit();	});

// Initialise any audio players that are present on the current page
function audioPlayerInit() {
	
	var supportsAudio = !!document.createElement('audio').canPlayType;
			
	if (supportsAudio) {
		
		$(".player").each(function(index, player) {		
			
			var audio,
			loadedBar,
			playedBar,
			playhead,
			time,
			loaded = false,
			manualSeek = false,
			playedBarXtn = 8,
			remainingTime,
			elapsedTime;

			audio = $(player).find('audio').get(0);
			
			playButton = $(player).find('.play');
			loadedBar = $(player).find('.loaded');
			playhead = $(player).find('.playhead');
			playedBar = $(player).find('.played');
			time = $(player).find('.time');

			if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
				$(audio).bind('progress', function() {
					var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
					loadedBar.css({width: loaded + '%'});
				});
			}
			else {
				loadedBar.remove();
			}

			$(audio).bind('timeupdate', function() {

				var rem = parseInt(audio.duration - audio.currentTime, 10),						
						remMins = Math.floor(rem/60,10),
						remSecs = rem - remMins*60,
						elMins = Math.floor(audio.currentTime/60,10),
						elSecs = Math.round(audio.currentTime - elMins*60);
						pos = (audio.currentTime / audio.duration) * 100;
				
				remainingTime = '-' + remMins + ':' + (remSecs < 10 ? '0' + remSecs : remSecs);
				elapsedTime = elMins + ':' + (elSecs < 10 ? '0' + elSecs : elSecs);
				
				if (time.hasClass('remaining')) {
					time.text(remainingTime);
				}				
				else {
					time.text(elapsedTime);
				}			
				
				if (!manualSeek) { playhead.css("left", pos + '%'); }
				
				var w = $(player).find('.transport').innerWidth();
				w *= (pos / 100);
				w += playedBarXtn;
				
				playedBar.css("width", w + 'px');
				
				if (!loaded) {
					loaded = true;

					$(player).find('.transport').slider({
							value: 0,
							step: 0.01,
							orientation: "horizontal",
							range: "min",
							max: audio.duration,
							animate: false,					
							slide: function(e, ui) {
								var width = ui.handle.offsetLeft + 8;
								playedBar.css("width", width + "px");								
								manualSeek = true;
							},
							stop:function(e, ui) {
								manualSeek = false;					
								audio.currentTime = ui.value;
							}
						});
				}			
			
			}).bind('play',function(){
				playButton.addClass('playing');		
			}).bind('pause ended', function() {
				playButton.removeClass('playing');		
			});		

			playButton.click(function(e) {			
				if (audio.paused) {	audio.play();	} 
				else { audio.pause(); }			
				e.preventDefault();
			});
			
			time.click(function(e) {				
				$(this).toggleClass('remaining');				
				e.preventDefault();
			});
			
		});
				
	}
	
}

