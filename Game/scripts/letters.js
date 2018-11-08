var masterString = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?.";
var lettersToBeUsed = masterString.split("");

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

var letter = {};

letter.value = lettersToBeUsed[0];

letter.printInfo = function(){
  tempArr = this.value.split("");
  for (let i = 0; i < tempArr.length; i++) {
    console.log(tempArr[i] + " is " + this.toNumber(tempArr[i]) + " in ASCII");
  }
}

letter.toNumber = function(char){
  return masterString.indexOf(char);
}

letter.add = function(x, pos){
  //console.log(pos);
  //console.log(this.value.substr(pos, 1));
  let value = this.toNumber(this.value.substr(pos, 1)) + x;
  //console.log(this.toNumber(this.value.substr(pos, 1))+ " + " + x + " = " + value);
  if (value > lettersToBeUsed.length - 1){
    //console.log(value % lettersToBeUsed.length);
    this.value = this.value.replaceAt(pos, lettersToBeUsed[(value % lettersToBeUsed.length)]);
    if(pos == 0){
      this.value = lettersToBeUsed[0] + this.value;
    }else{
      pos--;
    }
    this.add(1, pos);
  } else{
    this.value = this.value.replaceAt(pos, lettersToBeUsed[value]);
  }
}

letter.render = function(element){
  this.add(1, this.value.length - 1);
  element.innerText = this.value;
}
