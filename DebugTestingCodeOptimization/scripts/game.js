var hardReset = false;

var Cublettes = {};
var Cubes = new Array(95);
var updateInterval;

var one = new Letter("1");

var world;
var shop;
var header;

var amountToBuyOptions = document.getElementsByName("buyMultiplier");
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
    for (let i = 0, y = Cubes.length; i < y; i++) {
      if(Cubes[i] != null) {
        tempCubes.push(Cubes[i].export());
      }
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
  if (tempCubes === null) {
    Cubes[0] = new Cube("1", 0, "0", "0", 0, 0, 0);
    Cubes[1] = new Cube("1", 0, "0", "0", 1, 0, 1);
  } else {
    for (let i = 0, y = tempCubes.length; i < y; i++) {
      Cubes[tempCubes[i].index] = new Cube(tempCubes[i].value, tempCubes[i].multiplier, tempCubes[i].toAdd, tempCubes[i].toSubtract, tempCubes[i].x, tempCubes[i].y, tempCubes[i].index, tempCubes[i].mirgationDirection);
    }
  }
  if (window.localStorage.getItem('checked') != null) {
    amountToBuyOptions[window.localStorage.getItem('checked')].click();
  }
  var tempCublettes = JSON.parse(window.localStorage.getItem('cublettes'));
  if (tempCublettes != null) {
    Cublettes.value = tempCublettes.value;
  }
}

init = function() {
  shop = document.getElementById("cubeUpgradeMenu");
  Cublettes.value = 1;
  /*
  Cublettes.toAdd = new Letter("1");
  Cublettes.toSubtract = new Letter("0");
  Cublettes.multiplier = 0;
  Cublettes.totalToAdd = new Letter("0");
  Cublettes.element = document.getElementById("c");
  Cublettes.element.label = document.getElementById("cAmount");
  Cublettes.element.ngu = document.getElementById("cProduction");
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
  */
  for (let i = 0, end = amountToBuyOptions.length; i < end; i++) {
    amountToBuyOptions[i].addEventListener("click", function() {
      disableAllButtons(this.value, i);
    })
  }

  world = document.createElement("div");
  world.classList.add('flexContainer');
  document.body.appendChild(world);
  load();
  update();
}

disableAllButtons = function(value, id) {
  for (let i = 0; i < Cubes.length; i++) {
    if(Cubes[i] != null) {
      Cubes[i].cell.element.button.migrate.disabled = true;
    }
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
  //Cublettes.update();
  updateInterval = setTimeout(update, 1000);
  tick++;
}

calculate = function() {
  for (let i = 0, y = Cubes.length; i < y; i++) {
    if (Cubes[i] != null) {
      Cubes[i].update();
      Cubes[i].migratedThisTick = false;
    }
  }
  Cubes[0].calculate(true, [1]);
}

cubeClick = function(index) {
  Cubes[index].buyCube();
}

cubeUpgrade = function(index) {
  var thisCube = Cubes[index++];
  thisCube.cell.element.button.upgrade.disabled = true;
  thisCube.cell.element.button.migrate.disabled = true;
  var tempVal = {};
  tempVal.value = [1];
  for (let i = 0; i < (index + thisCube.multiplier); i++) {
    tempVal.value.push(0);
  }
  //console.log(tempVal);
  thisCube.multiplier++;
  thisCube.toSubtract.add(tempVal);
  Cublettes.value++;
  thisCube.update();
}

showDevWhatIsWrong = function() {
  prompt("Enter something!", (window.localStorage.getItem('cubes') + "radio:" + window.localStorage.getItem('checked') + "Cublettes:" + window.localStorage.getItem('cublettes')));
}
