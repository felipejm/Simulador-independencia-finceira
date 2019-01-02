$('#input-stocks').selectize({
    delimiter: ',',
    persist: false,
    valueField: 'code',
    labelField: 'code',
    searchField: ['code'],
    create: function(input) {
        return {
            value: input,
            text: input
        }
    }
});

function submitForm(){
    var form = $('#form-backtester');
    var url = form.attr('action');

    $.ajax({
        type: form.attr('method'),
        url: url,
        data: form.serialize(),
        success: function(data){ $('#result-ajax').html(data) }
        });
}
