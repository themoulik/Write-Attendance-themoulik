// Date & Time Update
function updateDateTime() {
    const now = new Date();
    document.getElementById('datetime').innerText = now.toLocaleString();
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Login Logic (Demo Credentials: ID: admin, Pass: 1234)
function login() {
    const id = document.getElementById('inst-id').value;
    const pass = document.getElementById('inst-pass').value;
    
    if (id === 'admin' && pass === '1234') {
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('dashboard-section').classList.remove('hidden');
        renderStudents();
    } else {
        document.getElementById('login-error').innerText = "Invalid ID or Password!";
    }
}

function logout() {
    document.getElementById('dashboard-section').classList.add('hidden');
    document.getElementById('login-section').classList.remove('hidden');
}

// Data Management
let students = JSON.parse(localStorage.getItem('attendanceApp_students')) || [];

function saveToLocal() {
    localStorage.setItem('attendanceApp_students', JSON.stringify(students));
}

function addStudent() {
    const id = document.getElementById('std-id').value;
    const name = document.getElementById('std-name').value;
    const phone = document.getElementById('std-phone').value;

    if(id && name && phone) {
        students.push({
            id: id,
            name: name,
            phone: phone,
            totalClasses: 0,
            attended: 0
        });
        saveToLocal();
        document.getElementById('std-id').value = '';
        document.getElementById('std-name').value = '';
        document.getElementById('std-phone').value = '';
        renderStudents();
        alert("Student Added Successfully!");
    } else {
        alert("Please fill all fields");
    }
}

function renderStudents() {
    const list = document.getElementById('students-list');
    list.innerHTML = '';
    students.forEach((student, index) => {
        const div = document.createElement('div');
        div.className = 'student-item';
        div.innerHTML = `
            <div>
                <strong>${student.name}</strong> (${student.id})<br>
                <small>Attended: ${student.attended}/${student.totalClasses}</small>
            </div>
            <div>
                <input type="checkbox" id="check-${index}" checked style="width:auto;"> Present
            </div>
        `;
        list.appendChild(div);
    });
}

function markAllAttendance() {
    if(students.length === 0) return alert("No students added yet!");
    
    students.forEach((student, index) => {
        const isPresent = document.getElementById(`check-${index}`).checked;
        student.totalClasses += 1;
        if (isPresent) {
            student.attended += 1;
        }
    });
    saveToLocal();
    renderStudents();
    alert("Today's Attendance Saved!");
}

// Shortlist Below 75%
function showShortlist() {
    const resultDiv = document.getElementById('shortlist-result');
    resultDiv.innerHTML = '';
    
    const defaulters = students.filter(student => {
        if (student.totalClasses === 0) return false;
        const percentage = (student.attended / student.totalClasses) * 100;
        return percentage < 75;
    });

    if (defaulters.length === 0) {
        resultDiv.innerHTML = '<p>No students have below 75% attendance. Excellent!</p>';
        return;
    }

    let html = '<ul>';
    defaulters.forEach(student => {
        const percentage = ((student.attended / student.totalClasses) * 100).toFixed(1);
        html += `<li style="color:red; margin-top:5px;">
            <strong>${student.name}</strong> (ID: ${student.id})<br>
            Phone: ${student.phone} | Attendance: ${percentage}%
        </li>`;
    });
    html += '</ul>';
    resultDiv.innerHTML = html;
}