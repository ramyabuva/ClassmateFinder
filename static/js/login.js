// Need to integrate this into login.html

$(document).ready(function(){
	$('#submit-registration').on("click", function(){
		xhr = $.ajax({
	        url: 'register',
	        type: 'POST',
	        data: {
	        	cid: document.getElementById("cid-signup").value,
	        	firstname: document.getElementById("firstname-signup").value,
	            lastname: document.getElementById("lastname-signup").value,
	            'grad-year': document.getElementById("grad-year").options[document.getElementById("grad-year").selectedIndex].text,
	            major: document.getElementById("major").options[document.getElementById("major").selectedIndex].text,
	            password: document.getElementById("password-signup").value
	         }         
	    });
	});
});