$(() => {
  const socket = io('/testroom');

  const ctx = document.getElementById("myChart");
  let myChart;

  $.ajax({
    dataType: 'json',
    url: `http://localhost:8181/api/polls/1`,

  }).then((json) => {
    myChart = new Chart(ctx, {
      type: json[0].style.type,
      data: {
        labels: json[0].style.labels,
        datasets: [{
          label: json[0].style.label,
          data: [1, 2, 3, 4],
          backgroundColor: json[0].style.bgc,
          borderColor: json[0].style.bdc,
          borderWidth: json[0].style.bdw
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  })

  $("#addone").click(() => {
    console.log('clicked upvote');
    socket.emit("upvote", 1);
  });

  socket.on("upvote", (val) => {
    console.log('received upvote');
    myChart.data.datasets[0].data[1] += val;
    myChart.update();
  });

  socket.on('vote', val => {
    myChart.data.datasets[0].data[val] += 1;
    myChart.update();
  })


});