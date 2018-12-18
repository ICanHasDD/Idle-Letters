var hardReset = false;

var Cublettes = {};
var Cubes = [];
var updateInterval;

var one = new Letter("1");

var world;
var shop;
var header;

var amountToBuyOptions = new Array(5);
var amountToBuy = 0;

// Load the API
var kongregate;

// Callback function
onComplete = function() {
  // Set the global kongregate API object
  kongregate = kongregateAPI.getAPI();
}

resetEverything = function() {
  if (confirm("Are you sure you want to nuke these cubes back to the stoneage?")) {
    hardReset = true;
    window.localStorage.clear();
    location.reload();
  }
}

save = function() {
  if (!hardReset) {
    var tempCubes = [];
    for (let i = 0; i < Cubes.length; i++) {
      tempCubes[i] = Cubes[i].export();
    }

    /*
    if (window.location.href.includes('kongregate')) {
      if(kongregate == null) {
          kongregateAPI.loadAPI(onComplete);
      }
      kongregate.stats.submit("Cube1", Cubes[0].value.length);
    }
    */
    window.localStorage.setItem('cubes', JSON.stringify(tempCubes));
    window.localStorage.setItem('cublettes', JSON.stringify(Cublettes));
  }
}

window.onbeforeunload = save;

changeTheme = function(theme) {
  document.body.className = theme.value;
}

load = function() {
  var tempCubes = JSON.parse(window.localStorage.getItem('cubes'));
  for (let i = 0; i < tempCubes.length; i++) {
    if (i == Cubes.length) {
      Cubes.push(new Cube());
    }
    if (tempCubes[i].value != null) {
      Cubes[i].value.value = tempCubes[i].value;
    }
    if (tempCubes[i].toAdd != null) {
      Cubes[i].toAdd.value = tempCubes[i].toAdd;
    }
    if (tempCubes[i].multiplier != null) {
      Cubes[i].multiplier = tempCubes[i].multiplier;
    }
  }
  if (window.localStorage.getItem('checked') != null) {
    amountToBuyOptions[window.localStorage.getItem('checked')].click();
  }
  var tempCublettes = JSON.parse(window.localStorage.getItem('cublettes'));
  Cublettes.value.value = tempCublettes.value.value;
  Cublettes.toAdd.value = tempCublettes.toAdd.value;
  Cublettes.toSubtract.value = tempCublettes.toSubtract.value;
  Cublettes.multiplier = tempCublettes.multiplier;
}

init = function() {
  Cublettes.value = new Letter("1");
  Cublettes.toAdd = new Letter("1");
  Cublettes.toSubtract = new Letter("0");
  Cublettes.multiplier = 0;
  Cublettes.totalToAdd = new Letter("0");
  Cublettes.update = function() {
    Cublettes.totalToAdd.add(Cublettes.toAdd);
    for (let i = 0; i < Cublettes.multiplier; i++) {
      Cublettes.totalToAdd.add(Cublettes.totalToAdd);
    }
    Cublettes.toAdd.value = [1];
    Cublettes.value.add(Cublettes.totalToAdd);
    Cublettes.element.ngu.innerText = Cublettes.totalToAdd.toString();
    Cublettes.totalToAdd.value = [0];

    if (Cublettes.toSubtract.value != [0]) {
      Cublettes.value.subtract(Cublettes.toSubtract);
      Cublettes.toSubtract.value = [0];
    }
    Cublettes.element.label.innerText = this.value.toString();
  }
  constructHeader();
  world = document.createElement("div");
  world.classList.add('flexContainer');
  document.body.appendChild(world);
  Cubes.push(new Cube(1));
  Cubes.push(new Cube(1));
  if (window.localStorage.getItem('cubes') != null) {
    load();
  }
  update();
}

constructHeader = function() {
  header = document.createElement("header");
  var radioDiv = document.createElement("div");
  for (let i = 0; i < amountToBuyOptions.length; i++) {
    var value = Math.pow(10, i);
    var text;
    if (i == 0) {
      text = "x1";
    } else {
      text = "x" + Letter.prototype.lettersToBeUsed.length + "^" + i;
    }
    amountToBuyOptions[i] = makeRadioButtonOf("amountToBuy", value, text, i, radioDiv);
  }
  amountToBuyOptions.push(makeRadioButtonOf("amountToBuy", -1, "max", amountToBuyOptions.length, radioDiv));
  amountToBuyOptions[0].setAttribute('checked', "checked");
  Cublettes.element = document.createElement('div');
  Cublettes.element.label = document.createElement('label');
  Cublettes.element.spacer = document.createElement('label');
  Cublettes.element.goyUpy = document.createElement('label');
  Cublettes.element.ngu = document.createElement('label');
  Cublettes.element.label.innerText = Cublettes.value.toString();
  Cublettes.element.spacer.innerText = "(";
  Cublettes.element.goyUpy.innerText = "/tick)";
  Cublettes.element.ngu.innerText = Cublettes.totalToAdd.toString();
  header.appendChild(radioDiv);
  Cublettes.element.appendChild(Cublettes.element.label);
  Cublettes.element.appendChild(Cublettes.element.spacer);
  Cublettes.element.appendChild(Cublettes.element.ngu);
  Cublettes.element.appendChild(Cublettes.element.goyUpy);
  header.appendChild(Cublettes.element);
  document.body.appendChild(header);
}

makeRadioButtonOf = function(name, value, text, id, contentDiv) {
  var input = document.createElement("input");
  input.id = id;
  input.setAttribute('type', "radio");
  input.setAttribute('name', name);
  input.setAttribute('value', value);
  input.onclick = function() {
    disableAllButtons(value, id);
  }
  var label = document.createElement("label");
  label.innerText = text;
  var div = document.createElement("div");
  div.appendChild(input);
  div.appendChild(label);
  contentDiv.appendChild(div);
  return input;
}

disableAllButtons = function(value, id) {
  for (let i = 0; i < Cubes.length; i++) {
    Cubes[i].element.button.migrate.disabled = true;
  }
  amountToBuy = Math.log10(Math.abs(value));

  window.localStorage.setItem('checked', id);
  //console.log(amountToBuy);
}

var tick = 0;

update = function() {
  if (tick % 10 == 0) {
    save();
    //console.log("Saved");
  }
  calculate();
  Cublettes.update();
  updateInterval = setTimeout(update, 1000);
  tick++;
}

calculate = function() {
  var thisCube = Cubes[0];
  var lastCube;
  for (let i = 1; i < Cubes.length; i++) {
    lastCube = thisCube;
    thisCube = Cubes[i];

    /*
    console.log(lastCube.toAdd + " lastCube.toAdd");
    console.log(thisCube.value + " thisCube.value");
    */

    lastCube.toAdd.add(thisCube.value);
    lastCube.update();
  }
  thisCube.update();
}

cubeClick = function(index) {
  var thisCube = Cubes[index++];
  thisCube.element.button.migrate.disabled = true;
  thisCube.element.button.upgrade.disabled = true;
  var boughtAmount = { value: [] };

  //console.log(amountToBuyOptions[amountToBuyOptions.length - 1].checked);
  if (!(amountToBuyOptions[amountToBuyOptions.length - 1].checked)) {
    boughtAmount.value.push(1);
    for (let i = 0; i < amountToBuy; i++) {
      boughtAmount.value.push(0);
    }
    //console.log(boughtAmount.value);
  } else {
    var leadingLetters = thisCube.value.value.length - index;
    if (Cublettes.value.value.length > leadingLetters) {
      boughtAmount.value = thisCube.value.value.slice(0, leadingLetters);
      Cublettes.toSubtract.add(boughtAmount);
    } else if (Cublettes.value.value.length < leadingLetters) {
      boughtAmount.value = Cublettes.value.value
      Cublettes.value.value = [0];
    } else {
      var solutionFound = false;
      var solutionAt = 0;
      while(!solutionFound) {
        if (Cublettes.value.value[solutionAt] == thisCube.value.value[solutionAt]) {
          solutionAt++;
        } else {
          solutionFound = true;
        }
        if (solutionAt >= Cublettes.value.value.length) {
          solutionFound = true;
        }
      }
      if (Cublettes.value.value[solutionAt] > thisCube.value.value[solutionAt]) {
        boughtAmount.value = thisCube.value.value.slice(0, leadingLetters);
        Cublettes.toSubtract.add(boughtAmount);
      } else {
        boughtAmount.value = Cublettes.value.value;
        Cublettes.value.value = [0];
      }
    }
    //console.log(boughtAmount.value);
  }

  if (Cube.prototype.lastIndex <= index) {
    Cubes.push(new Cube());
    boughtAmount.value[boughtAmount.length - 1]--;
  }
  Cubes[index].toAdd.add(boughtAmount);

  for (let i = 0; i < index; i++) {
    boughtAmount.value.push(0);
  }
  thisCube.toSubtract.add(boughtAmount);
  //Cublettes.update();

  Cubes[index].update();
}

cubeUpgrade = function(index) {
  var thisCube = Cubes[index++];
  thisCube.element.button.upgrade.disabled = true;
  thisCube.element.button.migrate.disabled = true;
  var tempVal = {};
  tempVal.value = [1];
  for (let i = 0; i < (index + thisCube.multiplier); i++) {
    tempVal.value.push(0);
  }
  //console.log(tempVal);
  thisCube.multiplier++;
  thisCube.toSubtract.add(tempVal);
  Cublettes.multiplier++;
  thisCube.update();
}

showDevWhatIsWrong = function() {
  prompt("Enter something!", (window.localStorage.getItem('cubes') + "radio:" + window.localStorage.getItem('checked') + "Cublettes:" + window.localStorage.getItem('cublettes')));
}
