      var newsList = [];
      var studentsList = [];

      function addNews() {
        var title = document.getElementById("newsTitle").value;
        var content = document.getElementById("newsContent").value;

        if (title && content) {
          var news = {
            title: title,
            content: content
          };

          newsList.push(news);

          document.getElementById("newsTitle").value = "";
          document.getElementById("newsContent").value = "";

          alert("News added successfully!");
        } else {
          alert("Please enter both title and content for the news.");
        }
      }

      //function showStudents() {
        //var studentsListElement = document.getElementById("studentsList");
        //studentsListElement.innerHTML = "";

         //Simulating fetching students from the server
        //studentsList = [
          //{ id: 1, name: "John Doe", age: 20, grade: "A" },
          //{ id: 2, name: "Jane Smith", age: 21, grade: "B+" },
          //{ id: 2, name: "Jane Smith", age: 21, grade: "B+" },
          //{ id: 3, name: "Mark Johnson", age: 19, grade: "A-" },
          //{ id: 4, name: "Emily Williams", age: 22, grade: "A+" },
          //{ id: 5, name: "Michael Brown", age: 20, grade: "B" }
        //];

        //studentsList.forEach(function(student) {
        //  var listItem = document.createElement("li");
         // listItem.innerHTML = "Name: " + student.name + ", Age: " + student.age + ", Grade: " + student.grade +
         //   " <button onclick='editStudent(" + student.id + ")'>Edit</button>";
          //studentsListElement.appendChild(listItem);
        //});
      //}

      function showStudents() {
        var studentsTable = document.getElementById("studentsTable");
        studentsTable.style.display = "block";
  
        studentsList = [
            { id: 1, name: "John Doe", age: 20, grade: "A" },
            { id: 2, name: "Jane Smith", age: 21, grade: "B+" },
            { id: 3, name: "Mark Johnson", age: 19, grade: "A-" },
            { id: 4, name: "Emily Williams", age: 22, grade: "A+" },
            { id: 5, name: "Michael Brown", age: 20, grade: "B" }
          ];
  
        if (studentsList.length === 0) {
          studentsTable.innerHTML = "<p>No students available.</p>";
        } else {
          var studentsListTable = document.getElementById("studentsList");
          studentsListTable.innerHTML = "";
  
          for (var i = 0; i < studentsList.length; i++) {
            var student = studentsList[i];
  
            var row = studentsListTable.insertRow();
            var nameCell = row.insertCell();
            var ageCell = row.insertCell();
            var gradeCell = row.insertCell();
            var actionsCell = row.insertCell();
  
            nameCell.innerHTML = student.name;
            ageCell.innerHTML = student.age;
            gradeCell.innerHTML = student.grade;
            actionsCell.innerHTML = "<button onclick='editStudent(" + student.id + ")'>Edit</button>";
          }
        }
      }
  


      function editStudent(studentId) {
        var student = studentsList.find(function(student) {
          return student.id === studentId;
        });

        if (student) {
          document.getElementById("editStudentId").value = student.id;
          document.getElementById("editStudentName").value = student.name;
          document.getElementById("editStudentAge").value = student.age;
          document.getElementById("editStudentGrade").value = student.grade;

          var modal = document.getElementById("editStudentModal");
          modal.style.display = "block";
        }
      }

      function saveEditedStudent() {
        var studentId = document.getElementById("editStudentId").value;
        var student = studentsList.find(function(student) {
          return student.id === parseInt(studentId);
        });

        if (student) {
          var name = document.getElementById("editStudentName").value;
          var age = document.getElementById("editStudentAge").value;
          var grade = document.getElementById("editStudentGrade").value;

          student.name = name;
          student.age = age;
          student.grade = grade;

          var modal = document.getElementById("editStudentModal");
          modal.style.display = "none";

          // Refresh the student list
          showStudents();
        }
      }

      // Close the edit student modal if user clicks outside of it
      window.onclick = function(event) {
        var modal = document.getElementById("editStudentModal");
        if (event.target == modal) {
          modal.style.display = "none";
        }
      }
