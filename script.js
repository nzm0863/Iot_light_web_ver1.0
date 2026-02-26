function getIP() {
  let IP = document.getElementById('IP');
  IP.textContent = 'Loading...';
  fetch('http://esp32.local/')
  .then(response => response.text())
  .then(data => {
    IP.textContent = data;
  })
  .catch(error => {
    IP.textContent = 'Error: ' + error;
  });
}
getIP();

let led = document.getElementById('led');
function ledOn(){
  const method = 'POST';
  fetch('http://esp32.local/ledOn', { method })
  .then(response => response.text())
  .then(data => {
    led.textContent = data;
  })
  .catch(error => {
    led.textContent = 'Error: ' + error;
  });
}
function ledOff(){
  const method = 'POST';
  fetch('http://esp32.local/ledOff', { method })
  .then(response => response.text())
  .then(data => {
    led.textContent = data;
  })
  .catch(error => {
    led.textContent = 'Error: ' + error;
  });
}

function setColor(){
  const R = document.getElementById('R');
  const G = document.getElementById('G');
  const B = document.getElementById('B');
  for(let i = 0; i <= 255; i++){
    R.appendChild(new Option(i, i));
    G.appendChild(new Option(i, i));
    B.appendChild(new Option(i, i));
  }
}
setColor();

function sendColor(){
  const R = parseInt(document.getElementById('R').value);
  const G = parseInt(document.getElementById('G').value);
  const B = parseInt(document.getElementById('B').value);
  const color = document.getElementById('color');
  color.textContent = `R: ${R}, G: ${G}, B: ${B}`;
  const method = 'POST';
  fetch('http://esp32.local/setColor', { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ R: R, G: G, B: B }) })
    .catch(error => {
      color.textContent = 'Error: ' + error;
    });
}

function sendColorPicker() {
  const colorPicker = document.getElementById("colorPicker").value;
  const colorText = document.getElementById('sendColorPicker');
  colorText.textContent = `Color: ${colorPicker}`;
  const r = parseInt(colorPicker.slice(1, 3), 16);
  const g = parseInt(colorPicker.slice(3, 5), 16);
  const b = parseInt(colorPicker.slice(5, 7), 16);
  colorText.textContent = `R: ${r}, G: ${g}, B: ${b}`;
  fetch(`http://esp32.local/setColor`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ R: r, G: g, B: b }) })
    .catch(error => {
      colorText.textContent = 'Error: ' + error;
    });
}