$('#submit').on('click', function() {
    GenQRCode();
});

$('.code-gen').on('keydown', function(e) {
    if(e.keyCode == 13) {
        e.preventDefault();
        GenQRCode();
    }
});

$('#submit-user').on('click', function() {
    GenAPI();
});

$('.api-gen').on('keydown', function(e) {
    if(e.keyCode == 13) {
        e.preventDefault();
        GenAPI();
    }
});

$('#copy').on('click', (e) => {
    e.preventDefault();

    var data = GetInfo();

    if($('#check_qr').prop('checked')) {
        navigator.clipboard.writeText(`http://localhost:8080/api/qr/generate/?api_key=${data.api_key}&api_secret=${data.api_secret}&data=${data.text_data}`);
    } else {
        navigator.clipboard.writeText(`http://localhost:8080/api/barcode/generate/?api_key=${data.api_key}&api_secret=${data.api_secret}&data=${data.text_data}&scale=${data.scale}&height=${data.height}&label=${data.showLabel}&align=${data.align}`);
    }

    alert('Copied to clipboard!');
});

function GetInfo() {
    var data = {};

    data.api_key     = $('#api_key').val()    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpnaGFkZW4iLCJpYXQiOjE2MDYwMTMwNjF9.P0PLEdLr87boMF8Bz2WrfcNMtuhYKK16sM4rHB98jEM';
    data.api_secret  = $('#api_secret').val() || 'Lrjihcih44G0pvkp';
    data.text_data   = $('#text_data').val();

    data.scale     = $('#scale').val()  || 2;
    data.height    = $('#height').val() || 10;
    data.showLabel = $('#showLabel').prop('checked') ? 1 : 0;
    data.align     = 'right';

    if($('#align_l').prop('checked')) {
        data.align = 'left';
    } else if($('#align_c').prop('checked')) {
        data.align = 'center';
    } else {
        data.align = 'right';
    }

    return data;
}

function GenQRCode() {
    var data = GetInfo();
    
    var api_key     = data.api_key;
    var api_secret  = data.api_secret;
    var text_data   = data.text_data;

    if($('#check_qr').prop('checked')) {
        if(text_data.length >= 1 && text_data.length <= 1500) {
            var api_url = '/api/qr/generate/?api_key=' + api_key + '&api_secret=' + api_secret + '&data=' + text_data;
            $.get(api_url, function(data, status) {
                if(data.success == false) {
                    alert(data.message);
                } else {
                    var url = $(data).attr('src');

                    $('#qr_img').attr('src', url);
                }
            });
        }
    } else {
        var scale     = $('#scale').val()  || 2;
        var height    = $('#height').val() || 10;
        var showLabel = $('#showLabel').prop('checked') ? 1 : 0;
        var align     = 'right';

        if($('#align_l').prop('checked')) {
            align = 'left';
        } else if($('#align_c').prop('checked')) {
            align = 'center';
        } else {
            align = 'right';
        }

        if(text_data.length >= 1 && text_data.length <= 20) {
            var api_url = '/api/barcode/generate/?api_key=' + api_key + '&api_secret=' + api_secret + '&data=' + text_data + '&scale=' + scale + '&height=' + height + '&label=' + showLabel + '&align=' + align;
            $.get(api_url, function(data, status) {
                if(data.success == false) {
                    alert(data.message);
                } else {
                    var url = $(data).attr('src');

                    $('#qr_img').attr('src', url);
                }
            });
        }
    }
}

function ShowBarOptions() {
    if($('#check_bar').prop('checked')) {
        $('#options_bar').removeClass('hide');
        $('#text_data').attr('maxlength', 20);
    } else {
        $('#options_bar').addClass('hide');
        $('#text_data').attr('maxlength', 1500);
    }
}

function ShowLabelOptions() {
    if($('#showLabel').prop('checked')) {
        $('#options_label').removeClass('hide');
    } else {
        $('#options_label').addClass('hide');
    }
}

UpdateScaleValue();
UpdateHeightValue();

function UpdateScaleValue() {
    $('#scale_val').text($('#scale').val());
}

function UpdateHeightValue() {
    $('#height_val').text($('#height').val());
}

function GenAPI() {
    var username = $('#username').val() || 'johndoe2020';

    var api_url = '/api/users/generate/?username=' + username;
            $.get(api_url, function(data, status) {
                if(data.success == false) {
                    alert(data.message);
                } else {
                    $('#api_key').val(data.api_key);
                    $('#api_secret').val(data.api_secret);
                }
            });
}