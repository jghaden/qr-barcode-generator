$('#submit').on('click', function() {
    GenQRCode();
});

$('.form-group').on('keydown', function(e) {
    if(e.keyCode == 13) {
        GenQRCode();
    }
});

function GenQRCode() {
    var api_key     = $('#api_key').val()    || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImpnaGFkZW4iLCJpYXQiOjE2MDYwMTMwNjF9.P0PLEdLr87boMF8Bz2WrfcNMtuhYKK16sM4rHB98jEM';
    var api_secret  = $('#api_secret').val() || 'Lrjihcih44G0pvkp';
    var text_data   = $('#text_data').val();

    if($('#check_qr').prop('checked')) {
        if(text_data.length >= 1 && text_data.length <= 1500) {
            var api_url = '/api/qrcode/?api_key=' + api_key + '&secret=' + api_secret + '&data=' + text_data;
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
            var api_url = '/api/barcode/?api_key=' + api_key + '&secret=' + api_secret + '&data=' + text_data + '&scale=' + scale + '&height=' + height + '&label=' + showLabel + '&align=' + align;
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