const inputsNumber = document.querySelector('#numberOfInputs');
const form = document.querySelector('form');
const span = document.querySelector('form > span');
const list = document.querySelector('#list');
const all = [];
let dragSource = null;

generate();
// generate fields
function generate () {
  while(form.firstChild && form.firstChild !== span) {
    form.removeChild(form.firstChild);
  }
  while(all.length) {
    all.pop();
  }
  list.innerHTML = '';
  const fields = inputsNumber.value;
  if(fields < 7) {
    span.innerHTML = 'Please, input number greater than 6.';
    form.insertBefore(span, form.firstChild);
  } else {
    for(let f = fields; f > 0; f--) {
      span.innerHTML = 'Please, fill all inputs.';
      const div = document.createElement('div');
      const label = document.createElement('label');
      const input = document.createElement('input');
      all.unshift(input);
      label.setAttribute('for', `input${f}`);
      label.innerHTML = `Name ${f}`;
      input.type = 'test';
      input.id = `input${f}`;
      div.appendChild(label);
      div.appendChild(input);
      form.insertBefore(div, form.firstChild);
    }
  }
}
// create list of names
function submitNames (e) {
  e.preventDefault();
  const html = all.map(x => {
    const [back, text] = randomColor();
    return `
        <div id="${x.id}item" data-order="${x.id.slice(-1)}" style="background: ${back}; color: ${text}" draggable="true">
          ${x.value}
        </div>
        `
  }).join('');
  list.innerHTML = html;
  Array.from(document.querySelectorAll('[id$="item"]')).forEach(addDnDHandlers);
}
function randomColor () {
  var letters = '0123456789ABCDEF';
  var color = '';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  const textColor = (parseInt(color, 16) > 0xffffff / 2) ? '#000' : '#fff';
  return [`#${color}`, textColor];
}

// dragging functionality
function handleDragStart(e) {
  dragSource = this; // capturing dragged elem
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.outerHTML); // itself plus children
  e.dataTransfer.setData('order', +this.dataset.order); // id of dragged elem
  this.classList.add('dragging');
}
function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); // Necessary. Allows us to drop.
  }
  this.classList.add('over');
  e.dataTransfer.dropEffect = 'move';
}
function handleDragLeave(e) {
  this.classList.remove('over');
}
function handleDrop(e) {
  // if (e.stopPropagation) {
  //   e.stopPropagation(); // Stops some browsers from redirecting.
  // }
  if (dragSource != this) {
    this.parentNode.removeChild(dragSource);
    var dropHTML = e.dataTransfer.getData('text/html');
    var dropOrder = e.dataTransfer.getData('order');
    var curOrder = +this.dataset.order;
    if(curOrder < dropOrder) {
      this.insertAdjacentHTML('beforebegin', dropHTML);
      var dropedElem = this.previousElementSibling;
      dropedElem.dataset.order = curOrder;
      var next = this;
      while(dropOrder - curOrder) {
        next.dataset.order++
        next = next.nextElementSibling;
        curOrder++
      }
      addDnDHandlers(dropedElem);
    } else {
      this.insertAdjacentHTML('afterend', dropHTML);
      var dropedElem = this.nextElementSibling;
      dropedElem.dataset.order = curOrder;
      var prev = this;
      while(curOrder - dropOrder) {
        prev.dataset.order--;
        prev = prev.previousElementSibling;
        curOrder--;
      }
      addDnDHandlers(dropedElem);
    }
  } else { // if element itself is droped target
    this.classList.remove('dragging')
  }
  this.classList.remove('over');
}
// attaching all handlers to input
function addDnDHandlers(elem) {
  elem.addEventListener('dragstart', handleDragStart); // capture elem to drag
  elem.addEventListener('dragover', handleDragOver); // highlight elem to drop
  elem.addEventListener('dragleave', handleDragLeave); // remove highlighting form elem which is out of drop
  elem.addEventListener('drop', handleDrop); // drop
}