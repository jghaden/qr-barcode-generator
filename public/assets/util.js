$('#submit').on('click', function() {
    GenQRCode();
});

$('#text_data').on('keydown', function(e) {
    if(e.keyCode == 13) {
        GenQRCode();
    }
});

function GenQRCode() {
    var api_key     = $('#api_key').val() || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpnaGFkZW4iLCJpYXQiOjE2MDYwMTMwNjF9.P0PLEdLr87boMF8Bz2WrfcNMtuhYKK16sM4rHB98jEM';
    var api_secret  = $('#api_secret').val() || 'Lrjihcih44G0pvkp';
    var text_data   = $('#text_data').val();

    if(text_data.length >= 1 && text_data.length <= 1500) {
        $.get('http://localhost:8080/api/qrcode/?api_key=' + api_key + '&secret=' + api_secret + '&data=' + text_data, function(data, status) {
            if(data.success == false) {
                alert(data.message);
            } else {
                var url = $(data).attr('src');

                $('#qr_img').attr('src', url);
            }
        });
    }
}