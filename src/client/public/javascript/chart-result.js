function configureChart(labels, data){
    $('#modal-result').modal('show')

    var ctx = document.getElementById('result-chart').getContext('2d');
    var chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Resultado",
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: data,
            }]
        },

        // Configuration options go here
        options: {}
    });
}