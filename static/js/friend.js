

$(document).ready(function(){

	function remove_friend(compid, elementname){
		xhr = $.ajax({
		        url: 'remove-friend',
		        type: 'POST', 
		        data: {
		        	"friend" : compid
		        }       
		    });

		litem = document.getElementById(elementname);
		litem.remove();
	}

	xhr = $.ajax({
	        url: 'friend-list',
	        type: 'GET',        
	    });
	xhr.done( () => {
		friends = JSON.parse(xhr['responseText']);
		var friendlist = document.getElementById("friendlist");
		friendlist.innerHTML = ""
		for (const [key, value] of Object.entries(friends)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerText += value['name'];

		  const removefriendbutton = document.createElement("button");
		  removefriendbutton.setAttribute('type', 'button');
		  removefriendbutton.setAttribute('class', 'btn btn-danger float-right');
		  removefriendbutton.setAttribute('onclick', 'remove_friend("' + key + '", "' +key+ '-element")');
		  removefriendbutton.innerText = 'Remove Friend';
		  litem.appendChild(removefriendbutton);


	      litem.innerHTML += "<br> <p style=\"color:gray\">" + key + " (" + value['major'] + ", " + value['graduation_year'] + ") </p>";
	      litem.setAttribute('id', key + '-element');
	      friendlist.appendChild(litem);
		}
	});

	function add_friend(compid, elementname){
		xhr = $.ajax({
		        url: 'add-friend',
		        type: 'POST', 
		        data: {
		        	"friend" : compid
		        }       
		    });

		litem = document.getElementById(elementname)
		litem.remove();
	}

	xhr2 = $.ajax({
	        url: 'friend-requests',
	        type: 'GET',        
	    });
	xhr2.done( () => {
		requests = JSON.parse(xhr2['responseText']);
		var requestlist = document.getElementById("requestlist");
		requestlist.innerHTML = ""
		for (const [key, value] of Object.entries(requests)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerText += value['name'];

		  const denyfriendbutton = document.createElement("button");
		  denyfriendbutton.setAttribute('type', 'button');
		  denyfriendbutton.setAttribute('class', 'btn btn-danger float-right');
		  denyfriendbutton.setAttribute('onclick', 'remove_friend("' + key + '", "' +key+ '-request")');
		  denyfriendbutton.innerText = 'Deny';
		  litem.appendChild(denyfriendbutton);

		  const addfriendbutton = document.createElement("button");
		  addfriendbutton.setAttribute('type', 'button');
		  addfriendbutton.setAttribute('class', 'btn btn-success float-right');
		  addfriendbutton.setAttribute('onclick', 'add_friend("' + key + '", "' +key+ '-request")');
		  addfriendbutton.innerText = 'Accept';
		  litem.appendChild(addfriendbutton);


	      litem.innerHTML += "<br> <p style=\"color:gray\">" + key + ") </p>";
	      litem.setAttribute('id', key + '-request');
	      requestlist.appendChild(litem);
		}
	});


});