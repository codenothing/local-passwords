// Random characters to include in generator
var chars = "!@#$%^&*()-=_+[]{}|;:,./<>?";

// Random character generator
function rand(){
	return Math.random() > 0.3 ?
		( Math.random() * 16 | 0 ).toString( 16 ) :
		chars.substr( parseInt( Math.random() * chars.length, 10 ), 1 );
}

// Random string generator
function generate( length ) {
	var str = '';
	length = length && length > 0 ? length : 15;
	while ( length-- ) {
		str += Math.random() > 0.5 ? rand().toUpperCase() : rand();
	}

	return str;
}

// Host name puller
function host( url ) {
	return ( url || '' ).indexOf( 'http' ) === 0 ?
		url.replace( /^(https?:\/\/[^\/]*\/).*$/, "$1" ) :
		url;
}

// Put in day notation, and add suggestion if too old
function fancytime( stamp ) {
	var elem = document.getElementById('time'),
		now = Date.now(),
		days = parseInt( ( now - stamp ) / ( 1000 * 60 * 60 * 24 ), 10 );

	// Only positives
	if ( days < 1 ) {
		days = 1;
	}

	// Display
	if ( days > 90 ) {
		elem.innerHTML = days + " days too old, Regenerate.";
		elem.className = 'change';
	}
	else {
		elem.innerHTML = days + " days old.";
		elem.className = '';
	}
}

// Display meta
function display( url, pass, time ) {
	fancytime( time );
	document.getElementById('title').innerHTML = url;
	document.getElementById('password').innerHTML = pass.replace( /\&/, '&amp;' ).replace( /</, '&lt;' ).replace( />/, '&gt;' );
}

// Window Ready
window.onload = function(){
	chrome.tabs.getSelected( null, function( tab ) {
		var url = host( tab.url ), select = "<option value='0'>Characters</option>", i = 1, data = {};

		// Set pass data
		if ( url in localStorage ) {
			data = JSON.parse( localStorage[ url ] );
		}
		else {
			data = {
				pass: generate(),
				time: Date.now()
			};
			localStorage[ url ] = JSON.stringify( data );
		}

		// Build character length
		for ( ; i < 31; i++ ) {
			select += "<option>" + i + "</option>";
		}
		document.getElementById('length').innerHTML = select;

		// Format display
		display( url, data.pass, data.time );

		// Regenerate password
		document.getElementById('generate').onclick = function(){
			data.pass = generate( document.getElementById('length').value );
			data.time = Date.now();
			display( url, data.pass, data.time );
			localStorage[ url ] = JSON.stringify( data );
		};
	});
};
