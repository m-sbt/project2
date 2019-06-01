function resultsLocation(){
	if (window.innerWidth > 991) {
		document.getElementById('results-large-screen').appendChild(document.getElementById('results-container'));
	}
	else{
		document.getElementById('results-small-screen').appendChild(document.getElementById('results-container'));
	}
}
resultsLocation();
window.addEventListener('resize',resultsLocation);

country.addEventListener('change', function (e) {
    var selectedValue = country.options[country.selectedIndex];

    if (selectedValue != 0) {
        document.getElementById("country").style.color = "black"; 
    }
});