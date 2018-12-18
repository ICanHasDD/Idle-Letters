class Letter {
    constructor(x) {
      this.value = [];  //Make empty array
      if (typeof x === 'string') {
        var valueTemp = x.split("");
        for (let i = 0; i < valueTemp.length; i++) {
          this.value.push(Letter.prototype.masterString.indexOf(valueTemp[i]));
        }
      } else {
        this.value = x;
      }
    }

    toString() {
      var word = '';
      for (let i = 0; i < this.value.length; i++) {
        word += Letter.prototype.lettersToBeUsed[this.value[i]];
      }
      return word;
    }

    add(that) {
        var rThis = this.value.reverse(); //Reverse the value of this
        var rThat = that.value.reverse(); //Reverse the value of that
        var temp = []; //Make empty array
        var carry = 0; // Set Carry bit to 0
        var maxSize = 0; // Set Max Size to 0
        var x = 0; // Set X to 0
        var y = 0; // Set y to 0

        if (rThis.length > rThat.length) { // If this is longer then that
          maxSize = rThis.length + 1; // Set maxSize to this.length + 1
        } else{
          maxSize = rThat.length + 1; // Set maxSize to that.length + 1
        }

        for (let i = 0; i < maxSize; i++) { //For every element in longest array + 1
          if(rThis.length <= i){ //if this.length is smaller then or equal to i
            x = 0; // Set x to 0
          } else {
            x = rThis[i]; // Set x to this[i]
          }
          if(rThat.length <= i){ //if thas.length is smaller then or equal to i
            y = 0; // Set y to 0
          } else {
            y = rThat[i] // Set y to thas[i]
          }
          temp.push(x + y + carry); //Add sum of x + y + carry to end of temp array
          if (temp[i] > Letter.prototype.lettersToBeUsed.length - 1) { //if the sum is too large
            carry = 1; // set Carry to 1
            temp[i] -= Letter.prototype.lettersToBeUsed.length; // Subrtact 65 from sum
          } else {
            carry = 0; //set carry to 0
          }
          //console.log(carry + " + " + rThat + " + " + rThis);
        }
        temp.reverse(); // flip temp to correct orientation
        while (temp[0] == 0) { //cut leading zero
          temp.shift();
        }

        that.value.reverse();
        this.value = temp; // Set this.value to temp
    }

    subtract(that) {
      var getCarried = function(i) {
        if (temp[i] < 0) {
          temp[i-1] -= 1;
          temp[i] += Letter.prototype.lettersToBeUsed.length;
        }
        if (temp[i - 1] < 0) {
          getCarried(i - 1);
        }
      }
      var temp = [];
      var difference = this.value.length - that.value.length;
      for (let i = 0; i < this.value.length; i++) {
        if (i < difference) { //If this is longer then that
          temp.push(this.value[i])
        } else {
          temp.push(this.value[i] - that.value[i - difference]);
          getCarried(i);
        }
      }
      while (temp[0] == 0) {
        temp.shift();
      }

      this.value = temp;
    }

    getPercent(value) {
      return this.value.slice(0, this.value.length - value);
    }
}

Letter.prototype.masterString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?.";
Letter.prototype.lettersToBeUsed = Letter.prototype.masterString.split("");
