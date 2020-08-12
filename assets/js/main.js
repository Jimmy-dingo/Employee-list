var employeesAPI = 'http://rest.vedinas.ro/employees';

function deserializeResponse(response) {
  return response.json();
}

function createEmployeeElement(employee) {
  var employeeElement = document.createElement('li');
  employeeElement.dataset.id = employee.id;
  employeeElement.classList.add('employee');

  var employeeNameElement = document.createElement('div');
  employeeNameElement.classList.add('name');
  employeeNameElement.innerText = employee.name;

  var pElement = document.createElement('p');
  var pInnerHtml = '<span>Age: ' + employee.age + '</span> <span>Salary: ' + employee.salary + '</span>';

  var pInnerHtml2 = '';
  pInnerHtml2 += '<span>Age: ';
  pInnerHtml2 += employee.age;
  pInnerHtml2 += '</span> <span>Salary: ';
  pInnerHtml2 += employee.salary;
  pInnerHtml2 += '</span>';

  var pInnerHtml3 = `<span>Age: ${employee.age}</span> <span>Salary: ${employee.salary}</span>`;

  pElement.innerHTML = pInnerHtml3;

  var removeElement = document.createElement('button');
  removeElement.classList.add('remove');
  removeElement.innerText = 'X';

  removeElement.addEventListener('click', removeEmployee);

  employeeElement.appendChild(employeeNameElement);
  employeeElement.appendChild(pElement);
  employeeElement.appendChild(removeElement);

  return employeeElement;
}

function listEmployees(employees) {
  var agendaElement = document.querySelector('.agenda');
  for (var i = 0; i < employees.length; i++) {
    var employeeElement = createEmployeeElement(employees[i]);
    agendaElement.appendChild(employeeElement);
  }
}

function getEmployees() {
  // We GET employees from API
  fetch(employeesAPI + '?_start=15&_limit=10')
    .then(deserializeResponse)
    .then(listEmployees);
}

function addEmployee(event) {
  event.preventDefault();
  var loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.display = 'block';

  var $impName = document.querySelector('input[name="name"]');
  var $impAge = document.querySelector('input[name="age"]');
  var $impSalary = document.querySelector('input[name="salary"]');
  var employee = {
    name: $impName.value,
    age: $impAge.value,
    salary: $impSalary.value,
  };
  // console.log($impName.value === "")
  if(!$impName.value || !$impAge.value || !$impSalary.value){
    alert("Can't POST if the fields are empty!");
    loadingScreen.style.display = 'none';
    return false;
  };

  // POST employeesAPI employee
  fetch(employeesAPI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(employee)
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (jsonResp) {
      // list in the DOM
      var employeeElement = createEmployeeElement(employee);
      var agendaElement = document.querySelector('.agenda');
      agendaElement.appendChild(employeeElement);

      employeeElement.dataset.id = jsonResp.id;
      loadingScreen.style.display = 'none';
    })
}

/*** Remove button ***/
function removeEmployee(event) {
  var employeeElement = event.target.parentElement;
  var id = employeeElement.dataset.id;
  employeeElement.remove();

  // HTTP DELETE request by ID
  fetch(employeesAPI + `/${id}`, {
    method: 'DELETE'
  })
    .then(function (response) {
      return response.json();
    });
}

function onDOMLoad() {
  getEmployees();
  var addEmployeeElement = document.querySelector('.add-employee');
  addEmployeeElement.addEventListener('click', addEmployee);
}

document.addEventListener('DOMContentLoaded', onDOMLoad);
