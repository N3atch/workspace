$('#getUsersWebsiteCredsByPromise').on('click', getData)

function getData() {
  console.log('Request is sending now!')
  const ul = $('#usersWebsiteCredsListByPromise')
  ul.html('')

  promisifyAjax('GET', 'http://localhost:3000/websites')
    .then(function (response) {
        for(const website of response){
           return promisifyAjax('POST', 'http://localhost:3000/bulk-users', website.users)
        }
    })
    .then(function(response){
        console.log(response)
    })
    .catch(function (error) {
      console.log(error)
    })
}

function addUserToHtml(user, element) {
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

function promisifyAjax(type, url, data = null) {
  return new Promise(function (resolve, reject) {
    const ajaxObj = {
      type,
      url,
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      },
    }

    if (type === 'POST') {
      ajaxObj.contentType = 'application/json; charset=utf-8'
      if (data) {
        ajaxObj.data = JSON.stringify(data)
      }
    }

    $.ajax(ajaxObj)
  })
}
