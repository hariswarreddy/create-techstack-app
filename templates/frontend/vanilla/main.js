import './style.css';

function setupCounter(element) {
  let counter = 0;
  const setCounter = (count) => {
    counter = count;
    element.innerHTML = `Count is ${counter}`;
  };
  element.addEventListener('click', () => setCounter(counter + 1));
  setCounter(0);
}

document.addEventListener('DOMContentLoaded', () => {
  setupCounter(document.querySelector('#counter'));
});
