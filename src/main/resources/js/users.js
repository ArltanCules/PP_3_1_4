const userAddFormId = $('#addForm');
const deleteFormId = $('#modalDelete');
const userTableId = $('#userTable');

function insertUser() {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    let user = {
        'name': userAddFormId.find('#name').val(),
        'surname': userAddFormId.find('#surname').val(),
        'username': userAddFormId.find('#username').val(),
        'age': userAddFormId.find('#age').val(),
        'password': userAddFormId.find('#password').val(),
        'roles': userAddFormId.find('#newRoles')
            .val()
    }

    console.log(user);

    let request = new Request('/api/v1/admin/create', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then( function (response)  {
            if(response.ok){
                console.info("User with id = " + user.id + " was inserted");
                sleep(200);
                $('#tableLink').trigger('click');
            } else {
                userAddFormId.find('#password').addClass('alert alert-danger');
            }
        });

}

function getAllUsers() {
    userTableId.children('#userTableBody').empty();
    fetch('/api/v1/admin').then(function (response) {
        if (response.ok) {
            response.json().then(users => {
                users.forEach(user => {
                    newRow(user);
                });
            });
        }
    });
}

function newRow(user) {
    userTableId
        .append($('<tr class="border-top bg-light">').attr('id', 'userRow[' + user.id + ']')
            .append($('<td>').attr('id', 'userData[' + user.id + '][id]').text(user.id))
            .append($('<td>').attr('id', 'userData[' + user.id + '][name]').text(user.name))
            .append($('<td>').attr('id', 'userData[' + user.id + '][surname]').text(user.surname))
            .append($('<td>').attr('id', 'userData[' + user.id + '][username]').text(user.username))
            .append($('<td>').attr('id', 'userData[' + user.id + '][age]').text(user.age))
            .append($('<td>').attr('id', 'userData[' + user.id + '][roles]').text(user.roles.map(role => role.name)))
            .append($('<td>').append($('<button class="btn btn-sm btn-info">')
                .click(() => {
                    loadModal(user.id);
                }).text('Edit')))
            .append($('<td>').append($('<button class="btn btn-sm btn-danger">')
                .click(() => {
                    loadModal(user.id, false);
                }).text('Delete')))
        );
}

function loadModal(id, editMode = true) {

    fetch('/api/v1/admin/form/' + id, {method: 'GET'})
        .then(function (response) {
                response.json().then(function (user) {

                    deleteFormId.find('#id').val(user.id);
                    deleteFormId.find('#name').val(user.name);
                    deleteFormId.find('#surname').val(user.surname);
                    deleteFormId.find('#username').val(user.username);
                    deleteFormId.find('#age').val(user.age);
                    deleteFormId.find('#password').val(user.password);

                    if (editMode) {
                        deleteFormId.find('.modal-title').text('Edit user');
                        deleteFormId.find('#deleterButton').removeClass('btn-danger').addClass('btn-primary')
                            .removeAttr('value')
                            .attr('value', 'Edit')
                            .removeAttr('onClick')
                            .attr('onClick', 'editUser(' + id + ');');
                        Readonly(false);
                    } else {
                        deleteFormId.find('.modal-title').text('Delete user');
                        deleteFormId.find('#deleterButton').removeClass('btn-primary').addClass('btn-danger')
                            .removeAttr('value')
                            .attr('value', 'Delete')
                            .removeAttr('onClick')
                            .attr('onClick', 'deleteUser(' + id + ');');
                        Readonly();
                    }

                    fetch('/api/v1/admin/roles').then(function (response) {
                        if (response.ok) {
                            deleteFormId.find('#Roles').empty();
                            response.json().then(roleList => {
                                roleList.
                                forEach(role => {
                                    deleteFormId.find('#Roles')
                                        .append($('<option>')
                                            .prop('selected', user.roles.filter(e => e.id === role.id).length)
                                            .val(role.name).text(role.name));
                                });
                            });
                        }
                    });

                    deleteFormId.modal();
                });
            }
        )
        .catch(function (err) {
            console.error('Fetch Error :-S', err);
        });

}


function deleteUser(id) {
    fetch('/api/v1/admin/delete/' + id, {method: 'DELETE'})
        .then(function (response) {
            deleteFormId.modal('hide');
            if (response.status === 404 || response.status === 400) {
                response.text().then((value) => console.warn("Error message: " + value));
                return;
            }
            console.info("User with id = " + id + " was deleted");
        });

    deleteFormId.modal('hide');
    userTableId.find('#userRow\\[' + id + '\\]').remove();


}

function editUser(id) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');

    let user = {
        'id' : deleteFormId.find('#id').val(),
        'name': deleteFormId.find('#name').val(),
        'surname': deleteFormId.find('#surname').val(),
        'username': deleteFormId.find('#username').val(),
        'age': deleteFormId.find('#age').val(),
        'password': deleteFormId.find('#password').val(),
        'roles': deleteFormId.find('#Roles')
            .val()
            .map(function(val, index){
                return {id:index+1, name:val};
            })
    }

    let request = new Request('/api/v1/admin/update', {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(user)
    });

    fetch(request)
        .then( function (response) {
            if (response.ok) {
                console.info("User with id = " + user.id + " was edited");
            }
        });


    deleteFormId.modal('hide');
    sleep(200);
    getAllUsers();

}


function Readonly(value = true) {
    deleteFormId.find('#name').prop('readonly', value);
    deleteFormId.find('#surname').prop('readonly', value);
    deleteFormId.find('#username').prop('readonly', value);
    deleteFormId.find('#age').prop('readonly', value);
    deleteFormId.find('#password').prop('readonly', value);
    deleteFormId.find('#Roles').prop('disabled', value);
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

$('#addButton').click(() => {
    insertUser();
    userAddFormId.find('#name').val('');
    userAddFormId.find('#surname').val('');
    userAddFormId.find('#username').val('');
    userAddFormId.find('#age').val('');
    userAddFormId.find('#password').val('');
});

$('#newUserLink').click(() => {
    userAddFormId.find('#password').removeClass('alert alert-danger');
    userAddFormId.find('#password').removeAttr('placeholder');

    fetch('/api/v1/admin/roles').then(function (response) {
        if (response.ok) {
            userAddFormId.find('#newRoles').empty();
            response.json().then(roleList => {
                roleList.forEach(role => {
                    userAddFormId.find('#newRoles')
                        .append($('<option>')
                            .val(role.name).text(role.name));
                });
            });
        }
    });
});

$('#tableLink').click(() => {
    getAllUsers();
});

$(document).ready(
    () => {
        getAllUsers();
    }
);