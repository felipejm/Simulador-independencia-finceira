$('#input-stocks').selectize({
    delimiter: ',',
    persist: false,
    valueField: 'code',
    labelField: 'code',
    searchField: ['code'],
    create: false,
    load: function(query, callback) {
        if (!query.length) return callback();
        $.ajax({
            url: '/stocks?query=' + encodeURIComponent(query),
            type: 'GET',
            error: function() {
                callback();
            },
            success: function(res) {
                callback(res);
            }
        });
    }
});

function generateLink(){
    var form = $('#form-backtester');
    var url = form.attr('action');

    $.ajax({
        type: form.attr('method'),
        url: "/generate-link",
        data: form.serialize(),
        success: function(data){ $('#result-ajax').html(data) }
        });
}

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

function showHidePositionSizing(elem){
    if(elem.value === 'Porcentual de risco') {
        $('#blocks-field').removeClass('display-visible')
        $('#blocks-field').addClass('display-none')
        $('#risk-field').addClass('display-visible')
        $('#risk-field').removeClass('display-none')
    }

    if(elem.value === 'Blocos') {
        $('#blocks-field').addClass('display-visible')
        $('#blocks-field').removeClass('display-none')
        $('#risk-field').removeClass('display-visible')
        $('#risk-field').addClass('display-none')
    }
}

function loadChart(symbol, periodStart, periodEnd){
    $.ajax({
        type: 'GET',
        url: '/operation-detail',
        data: {
            symbol: symbol,
            periodStart: periodStart,
            periodEnd: periodEnd,
        },
        success: function(data){ $('#result-ajax').html(data) }
        });
}