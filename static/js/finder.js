           
$(document).ready(function(){
	$('#edit').on("click", function(){
		$('#edit').hide();
		const  fname = document.getElementById("firstname");
		fname.disabled = false;
		const  lname = document.getElementById("lastname");
		lname.disabled = false;
		const  gradyear = document.getElementById("gradyear");
		gradyear.disabled = false;
		const  major = document.getElementById("major");
		major.disabled = false;
		document.getElementById("savechanges").hidden=false;
	});

	function switchMode(){
		document.getElementById("savechanges").hidden=true;
		$('#edit').show();
		const  fname = document.getElementById("firstname");
		fname.disabled = true;
		const  lname = document.getElementById("lastname");
		lname.disabled = true;
		const  gradyear = document.getElementById("gradyear");
		gradyear.disabled = true;
		const  major = document.getElementById("major");
		major.disabled = true;
	}

	$('#savechanges').on("click", function(){
		switchMode();
		 $.ajax({
	        url: 'update',
	        type: 'POST',
	        data: {
	            firstname: document.getElementById("firstname").getAttribute('value'),
	            lastname: document.getElementById("lastname").getAttribute('value'),
	            gradyear: document.getElementById("gradyear").options[document.getElementById("gradyear").selectedIndex].text,
	            major: document.getElementById("major").options[document.getElementById("major").selectedIndex].text,
	        },
	        success: function(msg) {
	            alert('Updated info');
	        }               
	    });

	});

});