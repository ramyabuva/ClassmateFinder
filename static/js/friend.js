
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

	function add_friend(compid, elementname){
		xhr = $.ajax({
		        url: 'add-friend',
		        type: 'POST', 
		        data: {
		        	"friend" : compid
		        }       
		    });
		xhr.done( () =>{
			xhr2 = $.ajax({
			        url: 'friend-list',
			        type: 'GET',        
			    });
			xhr2.done( () => {
				populate_friendlist(JSON.parse(xhr2['responseText']));
			});
		});

		litem = document.getElementById(elementname)
		litem.remove();
	}

	function populate_friendlist(friends){
		var friendlist = document.getElementById("friendlist");
		friendlist.innerHTML = ""
		for (const [key, value] of Object.entries(friends)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerHTML += "<a href=\"/user?cid="+key + "\">" + value['name'] + "</a>";

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
	}

	function populate_searchresults(results){
		var resultlist = document.getElementById("search-results");
		resultlist.innerHTML = ""
		for (const [key, value] of Object.entries(results)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerHTML += "<a href=\"/user?cid="+key + "\">" + value['name'] + "</a>";

		  const removefriendbutton = document.createElement("button");
		  removefriendbutton.setAttribute('type', 'button');
		  removefriendbutton.setAttribute('class', 'btn btn-success float-right');
		  removefriendbutton.setAttribute('onclick', 'add_friend("' + key + '", "' +key+ '-element")');
		  removefriendbutton.innerText = 'Add Friend';
		  litem.appendChild(removefriendbutton);


	      litem.innerHTML += "<br> <p style=\"color:gray\">" + key + " (" + value['major'] + ", " + value['graduation_year'] + ") </p>";
	      litem.setAttribute('id', key + '-element');
	      resultlist.appendChild(litem);
		}
	}
	
$(document).ready(function(){

	xhr = $.ajax({
	        url: 'friend-list',
	        type: 'GET',        
	    });
	xhr.done( () => {
		populate_friendlist(JSON.parse(xhr['responseText']));
		
	});

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
		  litem.innerHTML += "<a href=\"/user?cid="+key + "\">" + value['name'] + "</a>";

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


	      litem.innerHTML += "<br> <p style=\"color:gray\">(" + key + ") </p>";
	      litem.setAttribute('id', key + '-request');
	      requestlist.appendChild(litem);
		}
	});

	xhr3 = $.ajax({
	        url: 'requested-friends',
	        type: 'GET',        
	    });
	xhr3.done( () => {
		requests = JSON.parse(xhr3['responseText']);
		var requestlist = document.getElementById("requested");
		requestlist.innerHTML = ""
		for (const [key, value] of Object.entries(requests)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerHTML += "<a href=\"/user?cid="+key + "\">" + value['name'] + "</a>";

		  const withdrawrequestbutton = document.createElement("button");
		  withdrawrequestbutton.setAttribute('type', 'button');
		  withdrawrequestbutton.setAttribute('class', 'btn btn-danger float-right');
		  withdrawrequestbutton.setAttribute('onclick', 'remove_friend("' + key + '", "' +key+ '-requested")');
		  withdrawrequestbutton.innerText = 'Withdraw';
		  litem.appendChild(withdrawrequestbutton);


	      litem.innerHTML += "<br> <p style=\"color:gray\">(" + key + ") </p>";
	      litem.setAttribute('id', key + '-requested');
	      requestlist.appendChild(litem);
		}
	});

	document.getElementById("searchusers").addEventListener('click', () =>{
		xhr4 = $.ajax({
	        url: 'search-users',
	        type: 'POST',  
	        data: {
	        	cid: document.getElementById("friend-search-cid").value,
	        	firstname: document.getElementById("friend-search-fname").value,
	            lastname: document.getElementById("friend-search-lname").value,
	         }       
	    });
		xhr4.done( () => {
			populate_searchresults(JSON.parse(xhr4['responseText']))
		});
	});


});