class Cube {
  constructor(value, multiplier, toAdd, toSubtract, x, y, index, mirgationDirection) {
    this.index = (index != null) ? index : Cube.lastPos;
    this.value = (value != null) ? new Letter(value) : new Letter("1");
    this.multiplier = (multiplier != null) ? multiplier : 1;
    this.toAdd = (toAdd != null) ? new Letter(toAdd) : new Letter("0");
    this.toSubtract = (toSubtract != null) ? new Letter(toSubtract) : new Letter("0");
    this.totalToAdd = new Letter("0");

    this.x = (x != null) ? x : this.index % 19;
    this.y = (y != null) ? y : Math.floor(this.index / 19);

    this.cell = document.getElementsByClassName("cube")[this.index];
    this.cell.innerText = "C";
    this.cell.addEventListener("click", function(e) {
      var offset = this.getClientRects()[0];
      var clickX = e.clientX - offset.x;
      var clickY = e.clientY - offset.y;
      var borderWidth = document.documentElement.clientWidth / 100;

      if (clickX < borderWidth) {
        if (clickY < borderWidth) {
          if (clickX < clickY) {  //Click West
            this.click(3);
          } else {  //Click North
            this.click(0);
          }
        } else if (clickY > offset.height - borderWidth) {
          if (clickX < clickY + borderWidth - offset.height) {  //Click West
            this.click(3);
          } else {  //Click South
            this.click(2);
          }
        } else {  //Click West
          this.click(3);
        }
      } else if (clickX < offset.width - borderWidth) {
        if (clickY < borderWidth) { //Click North
          this.click(0);
        } else if (clickY > (offset.height - borderWidth)) {  //Click South
          this.click(2);
        }
      } else {
        if (clickY < borderWidth) {
          if (clickX + borderWidth - offset.width > clickY) {  //Click North
            this.click(0);
          } else {  //Click East
            this.click(1);
          }
        } else if (clickY > offset.height - borderWidth) {
          if (clickX > clickY) {  //Click East
            this.click(1);
          } else {  //Click South
            this.click(2);
          }
        } else {  //Click East
          this.click(1);
        }
      }  //Open Menu
      if (shop.lastShown != null) {
        shop.lastShown.hidden = true;
      }
      shop.lastShown = this.element;
      shop.lastShown.hidden = false;
    }, false);

    this.cell.element = document.createElement("div");
    this.cell.element.label = document.createElement("label");
    this.cell.element.button = document.createElement("div");
    this.cell.element.button.upgrade = document.createElement("Button");
    this.cell.element.button.upgrade.innerText = "Upgrade";
    this.cell.element.button.upgrade.id = this.index;
    this.cell.element.button.upgrade.onclick = function() {
      cubeUpgrade(this.id);
    };
    this.cell.element.button.migrate = document.createElement("Button");
    this.cell.element.button.migrate.innerText = "Migrate";
    this.cell.element.button.migrate.id = this.index;
    this.cell.element.button.migrate.onclick = function() {
      cubeClick(this.id);
    };
    this.cell.element.button.appendChild(this.cell.element.button.upgrade);
    this.cell.element.button.appendChild(this.cell.element.button.migrate);
    this.cell.element.button.upgrade.classList.add("arrow-up");
    this.cell.element.button.migrate.classList.add("arrow-down");
    this.cell.element.name = document.createElement("label");
    this.cell.element.name.innerText = "This is Cube " + this.index;

    this.cell.element.appendChild(this.cell.element.label);
    this.cell.element.appendChild(this.cell.element.button);
    this.cell.element.appendChild(this.cell.element.name);

    this.cell.element.hidden = true;

    shop.appendChild(this.cell.element);

    this.cell.element.button.migrate.disabled = true;
    this.cell.element.button.upgrade.disabled = true;

    this.migrateDirections = { up: [false, "topActive", "topMigrate"], left: [false, "leftActive", "leftMigrate"], down: [false, "bottomActive", "bottomMigrate"], right: [false, "rightActive", "rightMigrate"] };
    if (this.x > 0) {
      this.migrateDirections.left[0] = true;
    }
    if (this.x < 18) {
      this.migrateDirections.right[0] = true;
    }
    if (this.y > 0) {
      this.migrateDirections.up[0] = true;
    }
    if (this.y < 4) {
      this.migrateDirections.down[0] = true;
    }

    var that = this;
    this.cell.click = function(direction) {
      var dirs = ["up", "right", "down", "left"];
      that.click(dirs[direction]);
    }
    this.cell.getCube = function() {
      return that;
    }
    this.migratable(true);
    if(mirgationDirection != null) {
      this.click(mirgationDirection);
    }
    this.migratedThisTick = false;
    this.update();
    Cube.lastPos++;
  }

  click(direction) {
    this.updateButton();
    if (this.migrateDirections[direction][0]) {
      if (this.mirgationDirection != null) {
        this.cell.classList.remove(this.migrateDirections[this.mirgationDirection][2]);
        this.cell.classList.add(this.migrateDirections[this.mirgationDirection][1]);
      }
      this.mirgationDirection = direction;
      this.cell.classList.remove(this.migrateDirections[direction][1]);
      this.cell.classList.add(this.migrateDirections[direction][2]);
    }
  }

  buyCube() {
    for (let i = 0; i < Cubes.length; i++) {
      if(Cubes[i] != null) {
        Cubes[i].cell.element.button.migrate.disabled = true;
      }
    }
    var addAmount = [1];
    for (let i = 0, y = Cubes.lastPos + Cublettes.value; i < y; i++) {
      addAmount.push(0);
    }
    this.toSubtract.add({value:addAmount});
    Cubes[this.getMigrationLocation()] = new Cube(null, null, null, null, null, null, this.getMigrationLocation());
  }

  toHTML() {
    var sacString = this.value.toString().padStart(31).split('');
    var importantNumber = Cube.lastPos - 1;
    var red;
    var theString;
    if (this.index + 1 + this.multiplier < importantNumber) { //Red is longer then Grenn
      red = sacString.splice(-importantNumber);
      var p1 = red.splice(-(1 + this.multiplier));
      theString = sacString.join('') + "<span class=\"red\">" + red.join('') + "<span class=\"green\">" + p1.join('') + "</span></span>";
    } else { //Geen is Longer then Red
      var p1 = sacString.splice(-(this.index + 1 + this.multiplier));
      red = p1.splice(-importantNumber);
      theString = sacString.join('') + "<span class=\"green\">" + p1.join('') + "<span class=\"red\">" + red.join('') + "</span></span>";
    }
    return theString;
  }

  calculate(call, production) {
    if (!this.migratedThisTick) {
      if (!call) {
        this.migratedThisTick = true;
      } else {
        production = [0];
      }
      var migrate = Cubes[this.getMigrationLocation()];
      if (migrate != null) {
        var onePercent = this.value.getPercent(3);
        this.toAdd.add({ value: production});
        this.toSubtract.add({ value: onePercent});
        //console.log(this.index + " migrating " + onePercent + " to " + migrate.index);
        migrate.calculate(false, onePercent);
      }
    }
  }

  update() { //Start with small percent transfer 0.01

    for(let i = 0; i < Cublettes.value - Cube.lastPos; i++) {
      this.totalToAdd.add({value:[1]});
    }
    if (this.totalToAdd.value != [0]) {
      this.value.add(this.totalToAdd);
      this.value.add(this.toAdd);
      this.toAdd.value = [0];
      this.totalToAdd.value = [1];
    }

    if (this.toSubtract.value != [0]) {
      this.value.subtract(this.toSubtract);
      this.toSubtract.value = [0];
    }

    this.updateButton();
    this.updateLabel();
  }

  updateButton() {
    //console.log(multi + " " + this.index);
    this.cell.element.button.migrate.disabled = true;
    this.cell.element.button.upgrade.disabled = true;

    var tempVal = [1];
    for (let i = 0; i < amountToBuy; i++) {
      tempVal.push(0);
    }

    if ((this.value.value.length > Cube.lastPos - 1) && (Cubes[this.getMigrationLocation()] == null)) {
      this.cell.element.button.migrate.disabled = false;
    }
    if (this.value.value.length > this.index + this.multiplier) {
      this.cell.element.button.upgrade.disabled = false;
    }
  }

  getMigrationLocation() {
    //console.log(this.mirgationDirection);
    var tempNum;

    if (this.mirgationDirection === "up") {
      tempNum = this.x + (this.y * 19) - 19;
    }
    if (this.mirgationDirection === "down") {
      tempNum = this.x + (this.y * 19) + 19;
    }
    if (this.mirgationDirection === "left") {
      tempNum = this.x + (this.y * 19) - 1;
    }
    if (this.mirgationDirection === "right") {
      tempNum = this.x + (this.y * 19) + 1;
    }
    return tempNum;
    //console.log(Cubes[tempNum]);
  }

  migratable(allow) {
    if (allow) {
      this.cell.classList = "cube";
      if (this.migrateDirections.left[0]) {
        this.cell.classList.add(this.migrateDirections.left[1]);
      }
      if (this.migrateDirections.right[0]) {
        this.cell.classList.add(this.migrateDirections.right[1]);
      }
      if (this.migrateDirections.up[0]) {
        this.cell.classList.add(this.migrateDirections.up[1]);
      }
      if (this.migrateDirections.down[0]) {
        this.cell.classList.add(this.migrateDirections.down[1]);
      }
    }
  }

  updateLabel() {
    this.cell.element.label.innerHTML = this.toHTML();
  }

  export() {
    var temp = {};
    temp.value = this.value.toString();
    temp.toAdd = this.toAdd.toString();
    temp.toSubtract = this.toSubtract.toString();
    temp.multiplier = this.multiplier;
    temp.x = this.x;
    temp.y = this.y;
    temp.index = this.index;
    temp.mirgationDirection = this.mirgationDirection;
    return temp;
  }

}
Cube.lastPos = 0;
