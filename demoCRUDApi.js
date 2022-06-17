

var courseApi = 'http://localhost:3000/posts'
var btnSave = document.querySelector('#save')
var inputTitle = document.getElementById("title")
var inputAuthor = document.getElementById("author")

function start() {
 
//    getCourses(function(courses) {
//        renderCourses(courses);
//    });
    getCourses(renderCourses)
    handleCreateForm();
}

start();

//Functions
function getCourses(callback) {
    fetch(courseApi)
        .then(function (response) {
            return response.json();
        })
        .then(callback);  
}

function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };
    fetch(courseApi, options)
        .then(function (response) {
            response.json();
        })
        .then(callback); 
}

function handleDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},

    };
    fetch(courseApi  + '/' + id, options)
        .then(function (response) {
            response.json();
        })
        .then(function () {
            //getCourses(renderCourses);
            var courseItem = document.querySelector('.course-item-' + id);
            if (courseItem) {
                courseItem.remove();
            }
        }); 
}

function handleUpdateCourse(id)
{
    inputTitle.value = '';
    inputAuthor.value = '';
    btnSave.onclick = function()
    {
        var title = inputTitle.value;
        var author = inputAuthor.value;
        var data = {
            title : title,
            author : author
        };
        var options = {
            method : 'PUT',
            headers: {
                'Content-Type': 'application/json',
              },
              body : JSON.stringify(data)
        }
        fetch(courseApi  + '/' + id, options)
            .then(function(response)
            {
                return response.json();
            })
            .then(function(course)
            {
                
                getCourse(function(course)
            {
            renderCode(course);
            });
            });
    }
}

function renderCourses(courses){
    var listCoursesBlock = 
        document.querySelector('#list-courses');

    var htmls = courses.map(function (course) { 
        return `
            <li class="course-item-${course.id}">
                <h4>${course.title}</h4>
                <p>${course.author}</p>
                <button onclick="handleDeleteCourse(${course.id})">Delete</button>
                <button onclick="handleUpdateCourse(${course.id})">update</button>
            </li>
        `;
    });
    listCoursesBlock.innerHTML = htmls.join('');
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create')
    createBtn.onclick = function() {
        var title = document.querySelector('input[name="title"]').value;
        var author = document.querySelector('input[name="author"]').value;
        
        var formData = {
            title: title,
            author: author
        };

        createCourse(formData, function() {
            getCourses(renderCourses);
        });

    }
}