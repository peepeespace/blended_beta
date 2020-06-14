import '../css/about.css';

window.addEventListener('load', () => {
    const logo = document.getElementById('logo');

    logo.addEventListener('click', (event) => {
        window.location.href = "/";
    });
});