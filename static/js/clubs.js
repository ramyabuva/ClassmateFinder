
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

		  value.forEach(element => linkstr += "<a href=\"/user?cid="+element + "\">" + element + "</a>");

	      litem.innerHTML += "<br> <p style=\"color:gray\">Mutual Friends: " + linkstr + " </p>";
	      litem.setAttribute('id', key_nospaces + '-element');
	      clublist.appendChild(litem);
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

	// xhr2 = $.ajax({
	//         url: 'friend-requests',
	//         type: 'GET',        
	//     });
	// xhr2.done( () => {
	// 	populate_requestlist(JSON.parse(xhr2['responseText']));
	// });

	// xhr3 = $.ajax({
	//         url: 'requested-friends',
	//         type: 'GET',        
	//     });
	// xhr3.done( () => {
	// 	populate_requested(JSON.parse(xhr3['responseText']));
	// });

	// document.getElementById("searchusers").addEventListener('click', () =>{
	// 	xhr4 = $.ajax({
	//         url: 'search-clubs',
	//         type: 'POST',  
	//         data: {
	//         	cid: document.getElementById("friend-search-cid").value,
	//         	firstname: document.getElementById("friend-search-fname").value,
	//             lastname: document.getElementById("friend-search-lname").value,
	//          }       
	//     });
	// 	xhr4.done( () => {
	// 		populate_searchresults(JSON.parse(xhr4['responseText']));
	// 	});
	// });


});