// 5by5 Audio Player

$(function() { 
	
	audioPlayerInit();	
	
	// Popout buttons
	$('.popout').popupwindow({ 
		height: 150, 
		width: 400
	});
	
});

// Initialise any audio players that are present on the current page
function audioPlayerInit() {
	
	// Check for support of HTML5 Audio module
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

			audio = $(player).find('audio').get(0);			// The audio element
			
			playButton = $(player).find('.play');				// The play/pause toggle button
			loadedBar = $(player).find('.loaded');			// The amount of the audio file that has been buffered/loaded
			playhead = $(player).find('.playhead');			// The playhead draggable element
			playedBar = $(player).find('.played');			// The highlighted "past" region on the transport bar
			time = $(player).find('.time');							// The time display

			// If buffering information available
			if ((audio.buffered != undefined) && (audio.buffered.length != 0)) {
				$(audio).bind('progress', function() {
					var loaded = parseInt(((audio.buffered.end(0) / audio.duration) * 100), 10);
					loadedBar.css({width: loaded + '%'});
				});
			}
			else {
				loadedBar.remove();
			}

			// With each time update event ...
			$(audio).bind('timeupdate', function() {

				var rem = parseInt(audio.duration - audio.currentTime, 10),					// Remaining time	
						remMins = Math.floor(rem/60,10),																// Remaining minutes
						remSecs = rem - remMins*60,																			// Remaining seconds
						elMins = Math.floor(audio.currentTime/60,10),										// Elapsed minutes
						elSecs = Math.round(audio.currentTime - elMins*60);							// Elapsed seconds
						pos = (audio.currentTime / audio.duration) * 100;								// Play position (%age)
				
				// Time strings (remaining & elapsed)
				remainingTime = '-' + remMins + ':' + (remSecs < 10 ? '0' + remSecs : remSecs);
				elapsedTime = elMins + ':' + (elSecs < 10 ? '0' + elSecs : elSecs);
				
				if (time.hasClass('remaining')) {
					time.text(remainingTime);
				}				
				else {
					time.text(elapsedTime);
				}			
				
				// Move the playhead if we're not seeking
				if (!manualSeek) { playhead.css("left", pos + '%'); }
				
				// Calculate the width of the played/past bar
				var w = $(player).find('.transport').innerWidth();
				w *= (pos / 100);
				w += playedBarXtn;				
				playedBar.css("width", w + 'px');
				
				if (!loaded) {
					loaded = true;

					// Set up draggable slider playhead
					$(player).find('.transport').slider({
							value: 0,
							step: 0.01,
							orientation: "horizontal",
							range: "min",
							max: audio.duration,		
							slide: function(e, ui) {
								// Update the played/past bar
								var width = ui.handle.offsetLeft + 8;
								playedBar.css("width", width + "px");								
								manualSeek = true;
							},
							stop:function(e, ui) {
								manualSeek = false;					
								// Jump in time on release of dragging the playhead
								audio.currentTime = ui.value;
							}
						});
				}			
			
			// Swap the icon state for the play/pause button depending on current play state
			}).bind('play',function(){
				playButton.addClass('playing');		
			}).bind('pause ended', function() {
				playButton.removeClass('playing');		
			});		

			// Bind functionality to play/pause button
			playButton.click(function(e) {			
				if (audio.paused) {	audio.play();	} 
				else { audio.pause(); }			
				e.preventDefault();
			});
			
			/*
			// Toggle display of remaining/elapsed time
			time.click(function(e) {				
				$(this).toggleClass('remaining');				
				e.preventDefault();
			});
			*/						
			
		});
				
	}
	
}

