
	function remove_course(course_id, semester, year, elementname){
		xhr = $.ajax({
		        url: 'remove-course',
		        type: 'POST', 
		        data: {
		        	"course_id" : course_id,
		        	"semester" : semester,
		        	"year" : year
		        }       
		    });

		litem = document.getElementById(elementname);
		litem.remove();
	}

	function add_course(course_id, semester, year, elementname){
		xhr = $.ajax({
		        url: 'add-course',
		        type: 'POST', 
		        data: {
		        	"course_id" : course_id,
		        	"semester" : semester,
		        	"year" : year
		        }          
		    });
		xhr.done( () =>{
			xhr2 = $.ajax({
			        url: 'my-courses',
			        type: 'GET',        
			    });
			xhr2.done( () => {
				populate_courselist(JSON.parse(xhr2['responseText']));
				
			});
		});

		litem = document.getElementById(elementname)
		litem.remove();
	}

	function populate_courselist(courses){
		var courselist = document.getElementById("courselist");
		courselist.innerHTML = ""
		for (const [key, value] of Object.entries(courses)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerHTML += "<a href=\"/course?course_id=" + key + "&semester=" +value['semester'] + "&year=" +value['year']+ "\">" + value["dept"] + value["course_number"] + " ("+ key + ") </a>";

		  const removecoursebutton = document.createElement("button");
		  removecoursebutton.setAttribute('type', 'button');
		  removecoursebutton.setAttribute('class', 'btn btn-danger float-right');

		  primary_key = key + "_" + value['semester'] +  "_" + value['year']
		  removecoursebutton.setAttribute('onclick', 'remove_course("' + key +'", "'+ value['semester']+'", '+ value['year'] + ', "' +primary_key+ '-element")');
		  removecoursebutton.innerText = 'Remove Course';
		  litem.appendChild(removecoursebutton);

	      litem.innerHTML += "<br> <p style=\"color:gray\">" + value["course_name"] + " </p>";
	      litem.innerHTML += "<p style=\"color:gray\">" + value["semester"] +" "+ value["year"] + " </p>";
	      litem.setAttribute('id', primary_key + '-element');
	      courselist.appendChild(litem);
		}
	}

	function populate_searchresults(results){
		var resultlist = document.getElementById("course-results");
		resultlist.innerHTML = ""
		for (const [key, value] of Object.entries(results)) {
		  console.log(key);
		  const litem = document.createElement("li");
		  litem.setAttribute('class', 'list-group-item');
		  litem.innerHTML += "<a href=\"/course?course_id=" + key + "&semester=" +value['semester'] + "&year=" +value['year']+ "\">" + value["dept"] + value["course_number"] + " ("+ key + ") </a>";

		  const addcoursebutton = document.createElement("button");
		  addcoursebutton.setAttribute('type', 'button');
		  addcoursebutton.setAttribute('class', 'btn btn-success float-right');
		  primary_key = key + "_" + value['semester'] +  "_" + value['year']
		  addcoursebutton.setAttribute('onclick', 'add_course("' + key +'", "'+ value['semester']+'", '+ value['year'] + ', "' +primary_key+ '-element")');
		  addcoursebutton.innerText = 'Add Course';
		  litem.appendChild(addcoursebutton);

		  litem.innerHTML += "<br> <p style=\"color:gray\">" + value["course_name"] + " </p>";
	      litem.innerHTML += "<p style=\"color:gray\">" + value["semester"] +" "+ value["year"] + " </p>";
	      litem.setAttribute('id', primary_key + '-element');
	      resultlist.appendChild(litem);
		}
	}

$(document).ready(function(){

	xhr = $.ajax({
	        url: 'my-courses',
	        type: 'GET',        
	    });
	xhr.done( () => {
		populate_courselist(JSON.parse(xhr['responseText']));
		
	});

	document.getElementById("searchcourses").addEventListener('click', () =>{
		xhr4 = $.ajax({
	        url: 'search-courses',
	        type: 'POST',  
	        data: {
	        	course_id: document.getElementById("course-id-search").value,
	        	course_name: document.getElementById("course-name-search").value,
	            department: document.getElementById("department").options[document.getElementById("department").selectedIndex].text,
	            course_number: document.getElementById("number-search").value,
	         }       
	    });
		xhr4.done( () => {
			populate_searchresults(JSON.parse(xhr4['responseText']));
		});
	});


});