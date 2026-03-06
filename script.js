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

function ledOn(){
  const method = 'POST';
  fetch('http://esp32.local/ledOn', { method })
  .then(response => response.text())
}
function ledOff(){
  const method = 'POST';
  fetch('http://esp32.local/ledOff', { method })
  .then(response => response.text())
}

function setColor(){
  let R = document.getElementById('R');
  let G = document.getElementById('G');
  let B = document.getElementById('B');
  if(R.options.length === 0&&G.options.length === 0&&B.options.length === 0){
    for(let i = 0; i <= 255; i++){
      R.appendChild(new Option(i, i));
      G.appendChild(new Option(i, i));
      B.appendChild(new Option(i, i));
    }
  }
}
setColor();

function sendColor(){
  let R = parseInt(document.getElementById('R').value);
  let G = parseInt(document.getElementById('G').value);
  let B = parseInt(document.getElementById('B').value);
  // let color = document.getElementById('color');
  // color.textContent = `R: ${R}, G: ${G}, B: ${B}`;
  document.getElementById("colorPicker").value = "#" + R.toString(16).padStart(2, '0') + G.toString(16).padStart(2, '0') + B.toString(16).padStart(2, '0');
  let colorText = document.getElementById('sendColorPicker');
  colorText.textContent = `R: ${R}, G: ${G}, B: ${B}`;
  const method = 'POST';
  fetch('http://esp32.local/setColor', { method, headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ R: R, G: G, B: B }) })
    .catch(error => {
      // color.textContent = 'Error: ' + error;
    });
}

function sendColorPicker() {
  let colorPicker = document.getElementById("colorPicker").value;
  let colorText = document.getElementById('sendColorPicker');
  colorText.textContent = `Color: ${colorPicker}`;
  let r = parseInt(colorPicker.slice(1, 3), 16);
  let g = parseInt(colorPicker.slice(3, 5), 16);
  let b = parseInt(colorPicker.slice(5, 7), 16);
  document.getElementById('R').value = r;
  document.getElementById('G').value = g;
  document.getElementById('B').value = b;
  colorText.textContent = `R: ${r}, G: ${g}, B: ${b}`;
  fetch(`http://esp32.local/setColor`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ R: r, G: g, B: b }) })
    .catch(error => {
      colorText.textContent = 'Error: ' + error;
    });
}

function saveColor(slot){
  let buttonCount = document.querySelectorAll('.loadColor').length;
  if(buttonCount >= 10){
    alert("保存できるボタンが10個を超えています");
    return;
  }
  let r = parseInt(document.getElementById('R').value);
  let g = parseInt(document.getElementById('G').value);
  let b = parseInt(document.getElementById('B').value);
  let color = {
    r:r,
    g:g,
    b:b,
  };

  let newData = 1;
  for(let i = 1; i <= buttonCount; i++){
    const data = localStorage.getItem("fav" + i);
    if(data !== null){
      newData = i + 1;
    }else{
      newData = i;
      break;
    }
  }
  localStorage.setItem("fav" + newData, JSON.stringify(color));
  const button = document.createElement('button');
  button.textContent = `R: ${r}, G: ${g}, B: ${b}`;
  button.onclick = function(){loadColor(newData)};
  button.classList.add('loadColor');
  document.body.appendChild(button);
}

function loadColor(slot) {
  const data = localStorage.getItem("fav" + slot);
  if (!data) {
    alert("未保存です");
    return;
  }

  const color = JSON.parse(data);

  document.getElementById('R').value = color.r;
  document.getElementById('G').value = color.g;
  document.getElementById('B').value = color.b;

  sendColor();
}

function clearColor(){
  const button = document.createElement('button');
  button.textContent = `allClearColor`;
  button.classList.add('clearColor');
  document.body.appendChild(button);
  button.addEventListener('click', function(){
    localStorage.clear();
    const buttons = document.querySelectorAll('.loadColor');
    buttons.forEach(button => {
      button.remove();
    });
  });
}
clearColor();