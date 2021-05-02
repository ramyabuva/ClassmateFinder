
	function remove_club(club, elementname){
		xhr = $.ajax({
		        url: 'remove-club',
		        type: 'POST', 
		        data: {
		        	"club" : club
		        }       
		    });

		litem = document.getElementById(elementname);
		litem.remove();
	}

	function add_club(club, elementname){
		xhr = $.ajax({
		        url: 'add-club',
		        type: 'POST', 
		        data: {
		        	"club" : club
		        }         
		    });
		xhr.done( () =>{
			xhr2 = $.ajax({
			        url: 'my-clubs',
			        type: 'GET',        
			    });
			xhr2.done( () => {
				populate_clublist(JSON.parse(xhr2['responseText']));
				
			});
		});

		litem = document.getElementById(elementname)
		litem.remove();
	}

	function populate_clublist(clubs){
		var clublist = document.getElementById("clublist");
		clublist.innerHTML = ""
		for (const [key, value] of Object.entries(clubs)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerText += key;

		  const removeclubbutton = document.createElement("button");
		  removeclubbutton.setAttribute('type', 'button');
		  removeclubbutton.setAttribute('class', 'btn btn-danger float-right');
		  key_nospaces = key.replace(/\s/g, '.')
		  removeclubbutton.setAttribute('onclick', 'remove_club("' + key + '", "' +key_nospaces+ '-element")');
		  removeclubbutton.innerText = 'Remove Club';
		  litem.appendChild(removeclubbutton);

		  var linkstr = ""

		  value.forEach(element => linkstr += "<a href=\"/user?cid="+element + "\">" + element + " </a>");

	      litem.innerHTML += "<br> <p style=\"color:gray\">Mutual Friends: " + linkstr + " </p>";
	      litem.setAttribute('id', key_nospaces + '-element');
	      clublist.appendChild(litem);
		}
	}

	function populate_searchresults(results){
		var resultlist = document.getElementById("club-searchresults");
		resultlist.innerHTML = ""
		for (const [key, value] of Object.entries(results)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerText += key;

		  const addfriendbutton = document.createElement("button");
		  addfriendbutton.setAttribute('type', 'button');
		  addfriendbutton.setAttribute('class', 'btn btn-success float-right');
		  key_nospaces = key.replace(/\s/g, '.')
		  addfriendbutton.setAttribute('onclick', 'add_club("' + key + '", "' +key_nospaces+ '-element")');
		  addfriendbutton.innerText = 'Add Club';
		  litem.appendChild(addfriendbutton);

		  var linkstr = ""

		  value.forEach(element => linkstr += "<a href=\"/user?cid="+element + "\">" + element + " </a>");


	      litem.innerHTML += "<br> <p style=\"color:gray\">Mutual Friends: " + linkstr + " </p>";
	      litem.setAttribute('id', key_nospaces + '-element');
	      resultlist.appendChild(litem);
		}
	}

$(document).ready(function(){

	xhr = $.ajax({
	        url: 'my-clubs',
	        type: 'GET',        
	    });
	xhr.done( () => {
		populate_clublist(JSON.parse(xhr['responseText']));
		
	});

	document.getElementById("searchclubs").addEventListener('click', () =>{
		xhr4 = $.ajax({
	        url: 'search-clubs',
	        type: 'POST',  
	        data: {
	        	club_name: document.getElementById("friend-search").value,
	            category: document.getElementById("category").options[document.getElementById("category").selectedIndex].text
	         }       
	    });
		xhr4.done( () => {
			populate_searchresults(JSON.parse(xhr4['responseText']));
		});
	});


});