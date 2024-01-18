const popup = document.querySelector('.bullFighter')
const buttonWarper = document.getElementById('bullFighter')
const button = popup.querySelector('.bullFighter__button')
const span = popup.querySelector('.bullFighter__message')

const positionsButton = [
    ['-15%' , '10%'],
    // ['19%', '71%'],
    ['82%', '9%'],
    ['82%', '109%']
]

const message = [
    'Are you sure you wanted to close the ad? <b>Click 2 more times to close it</b>',
    "To make sure you don't make a mistake. <b>Click one more time</b>"
]

let counter = 0;
const showMessage = (e) => {
    e.preventDefault();
    if (counter < 2) {
        span.innerHTML = message[counter]
    } else {
        popup.style.display = 'none'
    }
    counter++;
    button.style.border = '4px solid #8a3ffc';
    window.setTimeout(() => {
        button.style.border = '4px solid transparent';
    }, 300);
}


const escapeMouse = () => {
    let oneMoreTime = 1;
    const action = (oneTimeTimer) => {
        let timerEscapeMouse = '';
        clearTimeout(timerEscapeMouse);

        const currentTop = buttonWarper.style.top;
        const currentLeft = buttonWarper.style.left;
        const currentPosition = [currentTop, currentLeft]

        let newPosition = positionsButton.filter( position =>  position.toString() != currentPosition.toString())
        const keys = Object.keys(newPosition);
        newPosition = newPosition[keys[ keys.length * Math.random() << 0]];

        buttonWarper.style.top = newPosition[0];
        buttonWarper.style.left = newPosition[1];
        
        if (oneTimeTimer === 0) {
            return;
        }
        timerEscapeMouse = window.setTimeout(() => {
            return action(oneMoreTime -1);
        }, 1750);
    }
    action(oneMoreTime);
}

button.addEventListener('click', showMessage);

buttonWarper.addEventListener('mouseenter', escapeMouse);