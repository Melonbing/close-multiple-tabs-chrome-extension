function toggleOptions() {
	var curVisibility = $('#more_options').css('visibility');
	if (curVisibility == 'hidden') {
  		$('#more_options').css('visibility', 'visible')
  		$('#toggle_options').html('Hide')
	} else if (curVisibility == 'visible') {
  		$('#more_options').css('visibility', 'hidden')
  		$('#toggle_options').html('Show more options')
	}
}

function addToggleOptionsClickListener() {
	$('#toggle_options').click(toggleOptions);
	// document.querySelector('button').addEventListener('click', toggleOptions);
}

document.addEventListener("DOMContentLoaded", addToggleOptionsClickListener);