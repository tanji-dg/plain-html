var calculate = function(){
    const lastMfu = new Date(2018, 11, 4);
    const daysSince = Math.round((new Date() - lastMfu) / (1000 * 60 * 60 * 24));
    document.getElementById('place').textContent = daysSince + " Days";
};



window.setInterval(function(){
calculate();
}, 1000);
calculate();