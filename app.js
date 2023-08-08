const userList = document.getElementById('userList');
const addUserButton = document.getElementById('addUserButton');
const userDetails = document.getElementById('userDetails');

let users = JSON.parse(localStorage.getItem('users')) || [];

function validateName(name) {
    return /^[A-Z][a-z]*$/.test(name);
}

function validatePassword(password) {
    return password.length >= 5;
}

function validateAge(age) {
    return /^\d+$/.test(age);
}

function validateEmail(email) {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
}

function validatePhone(phone) {
    return /^\+380\d{9}$/.test(phone);
}

function validateCard(card) {
    return /^\d{16}$/.test(card);
}

function showError(input, message) {
    const formControl = input.parentElement;
    formControl.classList.add('has-error');
    const small = formControl.querySelector('small');
    small.innerText = message;
}

function showSuccess(input) {
    const formControl = input.parentElement;
    formControl.classList.remove('has-error');
    const small = formControl.querySelector('small');
    small.innerText = '';
}

function validateInput(input, validationFunction, errorMessage) {
    const value = input.value.trim();
    if (value === '') {
        showError(input, 'Field is required');
        return false;
    } else if (!validationFunction(value)) {
        showError(input, errorMessage);
        return false;
    } else {
        showSuccess(input);
        return true;
    }
}

function renderUsers() {
    userList.innerHTML = '';
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>
                <button class="btn btn-sm btn-primary view" data-id="${index}">View</button>
                <button class="btn btn-sm btn-info edit" data-id="${index}">Edit</button>
                <button class="btn btn-sm btn-danger remove" data-id="${index}">Remove</button>
            </td>
        `;
        userList.appendChild(row);
    });
}

function renderUserDetails(user) {
    userDetails.innerHTML = `
        <h2>User Details</h2>
        <p>Name: ${user.name}</p>
        <p>Password: ${user.password}</p>
        <p>Age: ${user.age}</p>
        <p>Email: ${user.email}</p>
        <p>Phone: ${user.phone}</p>
        <p>Card: ${user.card}</p>
        <button class="btn btn-secondary mt-3" id="returnButton">Return to all users</button>
    `;

    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', () => {
        clearUserDetails();
    });
}

function clearUserDetails() {
    userDetails.innerHTML = '';
}

userList.addEventListener('click', event => {
    const target = event.target;
    const index = parseInt(target.getAttribute('data-id'));

    if (target.classList.contains('view')) {
        renderUserDetails(users[index]);
    } else if (target.classList.contains('edit')) {
        clearUserDetails();
        renderEditForm(users[index], index);
    } else if (target.classList.contains('remove')) {
        const confirmDelete = confirm('Are you sure you want to delete this user?');
        if (confirmDelete) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            clearUserDetails();
        }
    }
});

function renderEditForm(user, index) {
    const editForm = document.createElement('form');
    editForm.innerHTML = `
        <h2>Edit User</h2>
        <div class="form-group">
            <label for="editName">Name</label>
            <input type="text" class="form-control" id="editName" value="${user.name}" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="editPassword">Password</label>
            <input type="password" class="form-control" id="editPassword" value="${user.password}" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="editAge">Age</label>
            <input type="text" class="form-control" id="editAge" value="${user.age}" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="editEmail">Email</label>
            <input type="email" class="form-control" id="editEmail" value="${user.email}" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="editPhone">Phone</label>
            <input type="text" class="form-control" id="editPhone" value="${user.phone}" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="editCard">Card Number</label>
            <input type="text" class="form-control" id="editCard" value="${user.card}" required>
            <small></small>
        </div>
        <button type="button" class="btn btn-primary" id="saveEditButton">Save</button>
        <button type="button" class="btn btn-secondary" id="cancelEditButton">Cancel</button>
    `;
    userDetails.appendChild(editForm);

    const editNameInput = document.getElementById('editName');
    const editPasswordInput = document.getElementById('editPassword');
    const editAgeInput = document.getElementById('editAge');
    const editEmailInput = document.getElementById('editEmail');
    const editPhoneInput = document.getElementById('editPhone');
    const editCardInput = document.getElementById('editCard');
    const saveEditButton = document.getElementById('saveEditButton');
    const cancelEditButton = document.getElementById('cancelEditButton');

    saveEditButton.addEventListener('click', () => {
        const updatedUser = {
            name: editNameInput.value,
            password: editPasswordInput.value,
            age: editAgeInput.value,
            email: editEmailInput.value,
            phone: editPhoneInput.value,
            card: editCardInput.value,
        };

        if (validateInput(editNameInput, validateName, 'Enter name from capital letter') &&
            validateInput(editPasswordInput, validatePassword, 'Password must be at least 5 characters') &&
            validateInput(editAgeInput, validateAge, 'Enter a valid age') &&
            validateInput(editEmailInput, validateEmail, 'Enter a valid email with @') &&
            validateInput(editPhoneInput, validatePhone, 'Enter phone number in format +380...') &&
            validateInput(editCardInput, validateCard, 'Card number must has 16 numbers')) {
            users[index] = updatedUser;
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            clearUserDetails();
        }
    });

    cancelEditButton.addEventListener('click', () => {
        renderUserDetails(users[index]);
        editForm.remove();
    });
}

addUserButton.addEventListener('click', () => {
    clearUserDetails();
    renderAddForm();
});

function renderAddForm() {
    const addForm = document.createElement('form');
    addForm.innerHTML = `
        <h2>Add User</h2>
        <div class="form-group">
            <label for="addName">Name</label>
            <input type="text" class="form-control" id="addName" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="addPassword">Password</label>
            <input type="password" class="form-control" id="addPassword" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="addAge">Age</label>
            <input type="text" class="form-control" id="addAge" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="addEmail">Email</label>
            <input type="email" class="form-control" id="addEmail" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="addPhone">Phone</label>
            <input type="text" class="form-control" id="addPhone" required>
            <small></small>
        </div>
        <div class="form-group">
            <label for="addCard">Card Number</label>
            <input type="text" class="form-control" id="addCard" required>
            <small></small>
        </div>
        <button type="button" class="btn btn-primary" id="saveAddButton">Add</button>
        <button type="button" class="btn btn-secondary" id="cancelAddButton">Cancel</button>
    `;
    userDetails.appendChild(addForm);

    const addNameInput = document.getElementById('addName');
    const addPasswordInput = document.getElementById('addPassword');
    const addAgeInput = document.getElementById('addAge');
    const addEmailInput = document.getElementById('addEmail');
    const addPhoneInput = document.getElementById('addPhone');
    const addCardInput = document.getElementById('addCard');
    const saveAddButton = document.getElementById('saveAddButton');
    const cancelAddButton = document.getElementById('cancelAddButton');

    saveAddButton.addEventListener('click', () => {
        const newUser = {
            name: addNameInput.value,
            password: addPasswordInput.value,
            age: addAgeInput.value,
            email: addEmailInput.value,
            phone: addPhoneInput.value,
            card: addCardInput.value,
        };

        if (validateInput(addNameInput, validateName, 'Enter name from capital letter') &&
            validateInput(addPasswordInput, validatePassword, 'Password must be at least 5 characters') &&
            validateInput(addAgeInput, validateAge, 'Enter a valid age') &&
            validateInput(addEmailInput, validateEmail, 'Enter a valid email with @') &&
            validateInput(addPhoneInput, validatePhone, 'Enter phone number in format +380...') &&
            validateInput(addCardInput, validateCard, 'Card number must has 16 numbers')) {
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            renderUsers();
            clearUserDetails();
        }
    });

    cancelAddButton.addEventListener('click', () => {
        clearUserDetails();
        addForm.remove();
    });
}

renderUsers();