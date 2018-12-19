var calculate = function(){
    let start = moment("2018-08-01");
    let end = moment();
    let diff = end.diff(start);
    let duration = moment.duration(diff);
    let answer = duration.asDays().toFixed(0) + " Days"
    document.getElementById('place').textContent = answer;
};

window.setInterval(function(){
calculate();
}, 1000);
calculate();