import '../css/finance.css';

window.addEventListener('load', () => {
    const logo = document.getElementById('logo');

    logo.addEventListener('click', (event) => {
        window.location.href = "/";
    });

    const serviceBtns = document.getElementsByClassName('service-btn');

    for (let btn of serviceBtns) {
      btn.addEventListener('click', (event) => {
        let attrib = btn.getAttribute("for");
        if (attrib == 'blendedshop') {
            let win = window.open('https://smartstore.naver.com/blendedstore', '_blank');
            win.focus();
        }
      });
    }
});