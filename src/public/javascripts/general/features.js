var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [20, 30, 40, 50],
        datasets: [
            {
                data: [21, 23, 37, 21],
                label: 'Africa',
                borderColor: '#333333',
                fill: false,
            },
            {
                data: [23, 34, 24, 25],
                label: 'Asia',
                borderColor: '#555555',
                fill: false,
            },
            {
                data: [31, 43, 35, 31],
                label: 'Europe',
                borderColor: '#777777',
                fill: false,
            },
        ],
    },
    options: {
        title: {
            display: true,
            text: 'Users Worldwide',
        },
    },
});
