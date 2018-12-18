class Cube {
  constructor(value, multiplier, toAdd, toSubtract) {
    this.index = Cube.prototype.lastIndex++;
    this.value = new Letter("1");
    this.multiplier = 1;
    this.element = document.createElement("div");
    this.element.label = document.createElement("label");
    this.element.button = document.createElement("div");
    this.element.button.upgrade = document.createElement("Button");
    this.element.button.upgrade.innerText = "↑";
    this.element.button.upgrade.id = this.index;
    this.element.button.upgrade.onclick = function() {
      cubeUpgrade(this.id);
    };
    this.element.button.migrate = document.createElement("Button");
    this.element.button.migrate.innerText = "↓";
    this.element.button.migrate.id = this.index;
    this.element.button.migrate.onclick = function() {
      cubeClick(this.id);
    };
    this.element.button.appendChild(this.element.button.upgrade);
    this.element.button.appendChild(this.element.button.migrate);
    this.element.button.upgrade.classList.add("arrow-up");
    this.element.button.migrate.classList.add("arrow-down");
    this.element.name = document.createElement("label");
    this.element.name.innerText = "C" + Cube.prototype.lastIndex;

    this.element.appendChild(this.element.label);
    this.element.appendChild(this.element.button);
    this.element.appendChild(this.element.name);
    world.appendChild(this.element);
    this.toAdd = new Letter("0");
    this.toSubtract = new Letter("0");
    this.element.button.migrate.disabled = true;
    this.element.button.upgrade.disabled = true;
    this.update();
  }

  toHTML() {
    var sacString = this.value.toString().padStart(31).split('');
    var importantNumber = this.index + amountToBuy + 1;
    var red;
    var theString;
    if (this.index + 1 + this.multiplier < importantNumber) {
      red = sacString.splice(-importantNumber);
      var p1 = red.splice(-(this.index + 1 + this.multiplier));
      theString = sacString.join('') + "<span class=\"red\">" + red.join('') + "<span class=\"green\">" + p1.join('') + "</span></span>";
    } else {
      var p1 = sacString.splice(-(this.index + 1 + this.multiplier));
      red = p1.splice(-importantNumber);
      theString = sacString.join('') + "<span class=\"green\">" + p1.join('') + "<span class=\"red\">" + red.join('') + "</span></span>";
    }
    return theString;
  }

  update() {
    if (this.toAdd.value != [0]) {
      this.value.add(this.toAdd);
      this.toAdd.value = [0];
    }
    if (this.toSubtract.value != [0]) {
      this.value.subtract(this.toSubtract);
      this.toSubtract.value = [0];
    }
    this.updateButton();
    this.updateLable();
  }

  updateButton() {
    //console.log(multi + " " + this.index);

    if (this.value.value.length > this.index + amountToBuy + 1) {
      var tempVal = [1];
      for (let i = 0; i < amountToBuy; i++) {
        tempVal.push(0);
      }

      if (((Cublettes.value.value[0] >= tempVal[0]) && (Cublettes.value.value.length == tempVal.length)) || (Cublettes.value.value.length > tempVal.length)) {
        this.element.button.migrate.disabled = false;
      }
      if (this.value.value.length > this.index + 1 + this.multiplier) {
        this.element.button.upgrade.disabled = false;
      }
    }
  }

  updateLable() {
    this.element.label.innerHTML = this.toHTML();
  }

  export() {
    var temp = {};
    temp.value = this.value.value;
    temp.toAdd = this.toAdd.value;
    temp.multiplier = this.multiplier;
    return temp;
  }
}
Cube.prototype.lastIndex = 0;
