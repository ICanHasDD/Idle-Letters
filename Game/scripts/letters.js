String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

var letter = {};

letter.value = String.fromCharCode(32);

letter.printInfo = function(){
  tempArr = this.value.split("");
  for (let i = 0; i < tempArr.length; i++) {
    console.log(tempArr[i] + " is " + this.toNumber(tempArr[i]) + " in ASCII");
  }
}

letter.toNumber = function(char){
  return char.charCodeAt(0) - 32;
}

letter.acsiiAt = function (index){
  return this.value.charCodeAt(index);
};

letter.add = function(x, pos){
  console.log(pos);
  let value = this.toNumber(this.value.substr(pos, 1)) + this.toNumber(x);
  console.log(value);
  if (value > 223){
    this.value = this.value.replaceAt(pos, String.fromCharCode(value - 191));
    if(pos == 0){
      this.value = " " + this.value;
    }else{
      pos--;
    }
    this.add(String.fromCharCode(33), pos);
  } else{
    this.value = this.value.replaceAt(pos, String.fromCharCode(value + 32));
  }
}

letter.render = function(element){
  this.add(String.fromCharCode(33), this.value.length - 1);
  element.innerText = this.value;
}
