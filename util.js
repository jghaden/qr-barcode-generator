// $('#submit').on('click', function() {
//     var xhttp = new XMLHttpRequest();
    
//     xhttp.onreadystatechange = function() {
//         if(this.readyState == 4 && this.status == 200) {
//             var data = JSON.parse(this.responseText);

//             $('#qr_img').attr('src', data.url);
//         }
//     }

//     xhttp.open('POST', 'http://localhost:8080/api/qr/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpnaGFkZW4iLCJpYXQiOjE2MDYwMTMwNjF9.P0PLEdLr87boMF8Bz2WrfcNMtuhYKK16sM4rHB98jEM&secret=Lrjihcih44G0pvkp&data=' + $('#data').val(), true);
//     xhttp.send();
// })

var axios = require('axios');

var config = {
  method: 'post',
  url: 'http://localhost:8080/api/qr/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpnaGFkZW4iLCJpYXQiOjE2MDYwMTMwNjF9.P0PLEdLr87boMF8Bz2WrfcNMtuhYKK16sM4rHB98jEM&secret=Lrjihcih44G0pvkp&data=Hello World!',
  headers: { }
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});