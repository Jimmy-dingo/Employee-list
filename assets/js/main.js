// https://github.com/typicode/json-server#routes Here you can find information on how to sort, order or search the API resource 
var employeesAPI = 'http://rest.vedinas.ro/employees';

function deserializeResponse(response) {
  // .json() does JSON.parse behind the scenes
  return response.json();
}

function createEmployeeElement(employee) {
  // console.log(employee);

  // <li class="employee">
  //   <div class="name">John Snow</div>
  //   <p><span>Age: 27</span> <span>Salary: 27</span></p>
  //   <button class="remove">X</button>
  // </li>

  // var employeeElementTemplate = `
  //   <div class="name">${employee.name}</div>
  //   <p><span>Age: ${employee.age}</span> <span>Salary: ${employee.salary}</span></p>
  //   <button class="remove">X</button>
  // `

  var employeeElement = document.createElement('li');
  employeeElement.dataset.id = employee.id;
  employeeElement.classList.add('employee');
  
  var employeeNameElement = document.createElement('div');
  employeeNameElement.classList.add('name');
  employeeNameElement.innerText = employee.name;

  var pElement = document.createElement('p');
  var pInnerHtml = '<span>Age: ' + employee.age + '</span> <span>Salary: ' + employee.salary + '</span>';
  //<span>Age: 27</span> <span>Salary: 27</span>

  var pInnerHtml2 = '';
  pInnerHtml2 += '<span>Age: ';
  pInnerHtml2 += employee.age;
  pInnerHtml2 += '</span> <span>Salary: ';
  pInnerHtml2 += employee.salary;
  pInnerHtml2 += '</span>';

  // template literals
  var pInnerHtml3 = `<span>Age: ${employee.age}</span> <span>Salary: ${employee.salary}</span>`;

  pElement.innerHTML = pInnerHtml3;

  var removeElement = document.createElement('button');
  removeElement.classList.add('remove');
  removeElement.innerText = 'X';
  // event listener on remove button
  removeElement.addEventListener('click', removeEmployee);

  employeeElement.appendChild(employeeNameElement);
  employeeElement.appendChild(pElement);
  employeeElement.appendChild(removeElement);

  return employeeElement;
}

function listEmployees(employees) {
  console.log(employees);
  var agendaElement = document.querySelector('.agenda');
  for (var i = 0; i < employees.length; i++) {
    var employeeElement = createEmployeeElement(employees[i]);
    agendaElement.appendChild(employeeElement);
  }
}

function getEmployees() {
  // We GET employees from API
  fetch(employeesAPI + '?_start=15&_limit=10')  // Limit the display to only 10 records, starting from the 15th.
    .then(deserializeResponse)
    .then(listEmployees);
}

function addEmployee(event) {
  event.preventDefault();
  var loadingScreen = document.querySelector('.loading-screen');
  loadingScreen.style.display = 'block';
  console.log('adding employee');
  // get name from input
  // get age from input
  // get salary from input
  // create employee object
  var $impName = document.querySelector('input[name="name"]');
  var $impAge = document.querySelector('input[name="age"]');
  var $impSalary = document.querySelector('input[name="salary"]');
  var employee = {
    name: $impName.value,
    age: $impAge.value,
    salary: $impSalary.value,
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
    console.log(jsonResp);
    
    // list in the DOM
    var employeeElement = createEmployeeElement(employee);
    var agendaElement = document.querySelector('.agenda');
    agendaElement.appendChild(employeeElement);
    
    //it adds the id got from the API to the li element
    employeeElement.dataset.id = jsonResp.id;
    console.log(employeeElement);
    
    //removes the animation after adding the new employee
    loadingScreen.style.display = 'none';
  })
  }

/*** Remove button ***/

function removeEmployee(event) {
  console.log('Remove button is clicked');
  // get remove button parent .parent()

  var employeeElement = event.target.parentElement // it is referring to the button I clicked (parent so li)
  console.log(employeeElement);

  // var id = dataset.id from parent https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes

  var id = employeeElement.dataset.id;
  console.log(id);

  // remove parent .remove()

  employeeElement.remove();

  // DELETE `employeeAPI/${id}`

  fetch(employeesAPI + `/${id}`, {  
    method: 'DELETE'
  })
  .then(function(response){ 
    return response.json(); 
  })
  .then(function(jsonResp){    
    console.log(jsonResp); 
  });
}

// When the page is finished loading this function is called
function onDOMLoad() {
  // we call getEmployees function
  // to easely get to the function hold ctrl and click on the function name
  getEmployees();
  
  var addEmployeeElement = document.querySelector('.add-employee');
  addEmployeeElement.addEventListener('click', addEmployee);
}

// DOMContentLoaded is triggered when DOM load is complete
// On page load fetch employess from API
document.addEventListener('DOMContentLoaded', onDOMLoad);

// "how then works behind the scenes"
/*
var cbs = [
  function one(data) {
    console.log('one', data);'
    return 'from one'
  },
  function two(data) {
    console.log('two', data);
    return 'from two'
  },
  function three(data) {
    console.log('three', data);
  },
];

var ourData = 'initial data';
for (var i = 0; i < cbs.length; i++) {
  var currentCB = cbs[i];
  ourData = currentCB(ourData);
}
*/
