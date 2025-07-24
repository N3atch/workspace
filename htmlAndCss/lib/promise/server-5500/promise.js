function promisifyAjax() {
  return new Promise(function (resolve, reject) {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/websites',
      success: function (data) {
        resolve(data)
      },
      error: function (error) {
        reject(error)
      },
    })
  })
}

promisifyAjax()
  .then(function (data) {
    console.log('data')
    console.log(data)
  })
  .catch(function (error) {
    console.log('error')
    console.log(error)
  })
