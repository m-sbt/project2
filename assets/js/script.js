function resultsLocation(){
	if (window.innerWidth > 991) {
		document.getElementById('results-large-screen').appendChild(document.getElementById('results-container') )
	}
	else{
		document.getElementById('results-small-screen').appendChild(document.getElementById('results-container') )
	}
}
resultsLocation();
window.addEventListener('resize',resultsLocation);