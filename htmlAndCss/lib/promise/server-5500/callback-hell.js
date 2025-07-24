

$('#getUsersWebsiteCreds').on('click', getData)


function getData(){
    console.log('Request is sending now!')
    const ul = $('#usersWebsiteCredsList')
    ul.html('')

    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/websites',
        success: function(websites){
            console.log('websites')
            console.log(websites)
            for(const website of websites){
                $.ajax({
                    type: 'POST',
                    url:'http://localhost:3000/bulk-users',
                    data: JSON.stringify(website.users),
                    contentType: 'application/json; charset=utf-8',
                    success: function(users){
                        console.log('users')
                        console.log(users)
                        for(const user of users){
                            $.ajax({
                                type: 'GET',
                                url: `http://localhost:3000/role/${user.role}`,
                                success: function(role){
                                    console.log('role')
                                    console.log(role)
                                    user.website = website.name
                                    user.roleName = role.name
                                    user.credentials = role.credentials
                                    addUserToHtml(user, ul)
                                },
                                error: function(error){
                                    console.log('role')
                                    console.error(error.status)
                                }
                            })
                        }
                    },
                    error: function(error){
                        console.log('users')
                        console.error(error.status)
                    }
                })
            }
        },
        error: function(error){
            console.log('websites')
            console.error(error.status)
        }
    })
}


function addUserToHtml(user, element){
    element.append(
        `
            <li>
                ID: <b>${user.id}</b>,
                Full Name: <b>${user.first_name} ${user.last_name}</b>,
                Website Name: <b>${user.website}</b>,
                Role Name: <b>${user.roleName}</b>,
                Creds: <b>${user.credentials}</b>
            </li>
        `
    )
}