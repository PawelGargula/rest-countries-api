const body = document.querySelector('body');
const switchModeBtn = document.querySelector('.swich-mode-button');

switchModeBtn.onclick = () => {
    if (body.dataset.actualMode === 'light') {
        switchModeBtn.textContent = 'Light Mode';
        body.dataset.actualMode = 'dark';
    } else {
        switchModeBtn.textContent = 'Dark Mode';
        body.dataset.actualMode = 'light';
    }
}