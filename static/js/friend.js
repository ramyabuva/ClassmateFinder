

$(document).ready(function(){

	function remove_friend(compid){
		litem = document.getElementById( compid+ '-element')
		litem.remove();
		  	console.log("here");
		  	xhr = $.ajax({
		        url: 'remove-friend',
		        type: 'POST', 
		        data: {
		        	"friend" : compid
		        }       
		    });
	}

	xhr = $.ajax({
	        url: 'friend-list',
	        type: 'GET',        
	    });
	xhr.done( () => {
		friends = JSON.parse(xhr['responseText']);
		var friendlist = document.getElementById("friendlist");
		console.log(friends);
		friendlist.innerHTML = ""
		for (const [key, value] of Object.entries(friends)) {
			console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerText += value['name'];

		  const removefriendbutton = document.createElement("button");
		  removefriendbutton.setAttribute('type', 'button');
		  removefriendbutton.setAttribute('class', 'btn btn-danger float-right');
		  removefriendbutton.setAttribute('onclick', 'remove_friend("' + key + '")');
		  removefriendbutton.innerText = 'Remove Friend';
		  litem.appendChild(removefriendbutton);


	      litem.innerHTML += "<br> <p style=\"color:gray\">" + key + " (" + value['major'] + ", " + value['gradyear'] + ")" + "<br>Mutual Courses: " +  value['classes'] + "<br>Mutual Clubs:</p>";
	      litem.setAttribute('id', key + '-element');
	      friendlist.appendChild(litem);
		}
	});
});