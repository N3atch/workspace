$('#getUsersWebsiteCredsByFetchAsyncAwait').on('click', getData)

async function getData() {
  console.log('Request is sending now!')
  const ul = $('#usersWebsiteCredsListByFetchAsyncAwait')
  ul.html('')

  const websites = []
  const users = []
  try {
    const websitesRes = await generateFetch(
      'GET',
      'http://localhost:3000/websites'
    )
    const websiteJsonRes = await websitesRes.json()
    const promises = []
    for (const website of websiteJsonRes) {
      websites.push(website)
      promises.push(
        generateFetch('POST', 'http://localhost:3000/bulk-users', website.users)
      )
    }
    const bulkUserRes = await Promise.allSettled(promises)
    const bulkUserJsonRes = await jsonAll(bulkUserRes)

    promises.splice(0, promises.length)
    for (const key in bulkUserJsonRes) {
      if (bulkUserJsonRes[key].status === 'fulfilled') {
        const websiteUsers = bulkUserJsonRes[key].value
        for (const user of websiteUsers) {
          user.website = websites[key].name
          users.push(user)
          promises.push(
            generateFetch('GET', `http://localhost:3000/role/${user.role}`)
          )
        }
      } else {
        console.log(bulkUserJsonRes[key].status)
        console.log(bulkUserJsonRes[key].reason)
      }
    }
    const roleRes = await Promise.allSettled(promises)
    const roleJsonRes = await jsonAll(roleRes)

    for (const key in roleJsonRes) {
      if (roleJsonRes[key].status === 'fulfilled') {
        users[key].roleName = roleJsonRes[key].value.name
        users[key].credentials = roleJsonRes[key].value.credentials
        addUserToHtml(users[key], ul)
      } else {
        console.log(roleJsonRes[key].status)
        console.log(roleJsonRes[key].reason)
      }
    }
    console.log(users)
  } catch (error) {
    console.log(error)
  }
}

async function jsonAll(responses) {
  const promises = []
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      promises.push(response.value.json())
    } else {
      console.error(response.status)
      console.error(response.reason)
    }
  }

  return await Promise.allSettled(promises)
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

function generateFetch(method, url, data = null) {
  const fetchObj = {
    method,
  }

  if (method === 'POST') {
    fetchObj.headers = { 'Content-Type': 'application/json; charset=utf-8' }
    if (data) {
      fetchObj.body = JSON.stringify(data)
    }
  }

  return fetch(url, fetchObj)
}
