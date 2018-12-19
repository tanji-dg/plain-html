var calculate = function(){
    const lastMfu = new Date(2018, 11, 4);
    const daysSinceRaw = (new Date() - lastMfu) / (1000 * 60 * 60 * 24);
    const daysSince = Math.floor(daysSinceRaw);
    document.getElementById('place').textContent = daysSince + " Days";
    let greenGrade =  (daysSinceRaw + 6);
    document.getElementById('main').style.background = `linear-gradient(to top, #4caf50 0%,#4caf50 ${daysSinceRaw}%, #2196f3 ${greenGrade}%, #2196f3 100%)`
};



window.setInterval(function(){
calculate();
}, 1000);
calculate();