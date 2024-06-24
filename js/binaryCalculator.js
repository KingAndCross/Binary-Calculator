let operations = "";
const res = document.getElementById("res");
const visual = document.getElementById("visual");
const overflowIndicator = document.getElementById("overflow");

let bitLength = 8;

document.getElementById("bit-size").addEventListener("click", function (e) {
  if (e.target.tagName === "INPUT" && e.target.type === "radio") {
    const selectedRadio = document.querySelector(
      'input[name="bit-options"]:checked'
    );
    bitLength = selectedRadio ? selectedRadio.value : 8;
  }
});

function backspace() {
  let currValue = cleanZeros(removeSpacing(visual.value));
  if (currValue.length != 0) {
    operations = operations.slice(0, -1);
    currValue = currValue.slice(0, -1);
    visual.value = addSpacing(padLeftWithZeros(currValue, bitLength));
  }
  return;
}

function shift(input) {
  if (input === "<") {
    insert("<1");
    eql();
    return;
  }
  insert(">1");
  eql();
  return;
}

function clc() {
  visual.value = "";
  res.value = "";
  operations = "";
  overflowIndicator.classList.add("hidden");
}

function insert(char) {
  overflowIndicator.classList.add("hidden");
  let currValue = cleanZeros(removeSpacing(visual.value));
  if ([0, 1].includes(char)) {
    if (currValue.length < bitLength) {
      operations += char;
      currValue += char;
      visual.value = addSpacing(padLeftWithZeros(currValue, bitLength));
    } else {
      console.log("bits máximos");
    }
  } else {
    operations += char;
    visual.value = "";
  }
}

function eql() {
  let result = operations;
  operations = "";
  visual.value = "";

  const parts = result
    .split(/([\+\-\*\/&|^><])/)
    .filter((part) => part.trim() !== "");

  if (parts.length !== 3) {
    operations = "Invalid Input";
    return;
  }

  const num1 =
    parseInt(parts[0].replace(".", ""), 2) /
    Math.pow(2, (parts[0].split(".")[1] || "").length);
  //this ensures binary fractions are also acknowledged in num1
  const operator = parts[1];
  const num2 =
    parseInt(parts[2].replace(".", ""), 2) /
    Math.pow(2, (parts[2].split(".")[1] || "").length);
  //this ensures binary fractions are also acknowledged in num2

  if (isNaN(num1) || isNaN(num2)) {
    operations = "Invalid Input";
    return;
  }

  let resultValue;

  switch (operator) {
    case "+":
      resultValue = num1 + num2;
      break;
    case "-":
      resultValue = num1 - num2;
      break;
    case "*":
      resultValue = num1 * num2;
      break;
    case "/":
      if (num2 === 0) {
        operations = "Undefined";
        return;
      }
      resultValue = num1 / num2;
      break;
    case ">":
      resultValue = num1 >> 1;
      break;
    case "<":
      resultValue = num1 << 1;
      break;
    default:
      operations = "Error";
      return;
  }

  while (resultValue > 2 ** bitLength - 1) {
    overflowIndicator.classList.remove("hidden");
    resultValue = resultValue - 2 ** bitLength;
  }
  res.value = addSpacing(
    padLeftWithZeros(decimalToBinary(resultValue), bitLength)
  );
}

function decimalToBinary(num) {
  let binary = "";
  let Integral = parseInt(num, 10);
  let fractional = num - Integral;

  while (Integral > 0) {
    let rem = Integral % 2;
    binary += String.fromCharCode(rem + "0".charCodeAt());
    Integral = parseInt(Integral / 2, 10);
  }

  binary = reverse(binary);
  if (binary.length == 0) {
    binary += "0";
  }

  return binary;
}

function reverse(input) {
  let temparray = input.split("");
  let left,
    right = 0;
  right = temparray.length - 1;

  for (left = 0; left < right; left++, right--) {
    // Swap values of left and right
    let temp = temparray[left];
    temparray[left] = temparray[right];
    temparray[right] = temp;
  }
  return temparray.join("");
}

function twoComplement() {
  const binary = removeSpacing(visual.value);
  console.log(binary);
  const onesComplement = binary
    .split("")
    .map((bit) => (bit === "0" ? "1" : "0"))
    .join("");
  const decimalValue = parseInt(onesComplement, 2);
  const twosComplementDecimal = decimalValue + 1;
  const twosComplementBinary = twosComplementDecimal.toString(2);
  const paddedTwosComplement = addSpacing(
    twosComplementBinary.padStart(bitLength, "0")
  );
  operations = "";
  res.value = paddedTwosComplement;
}

function binaryToDecimal(binary) {
  let decimal = 0;
  for (let i = 0; i < binary.length; i++) {
    decimal += binary[i] * Math.pow(2, binary.length - i - 1);
  }
  return decimal;
}

const inputs = document.querySelectorAll("input");
for (let input of inputs) {
  input.addEventListener("keydown", (event) => {
    if (event.code == "Enter" || event.key == "Enter") {
      eql();
      event.preventDefault();
    }
  });
}

// register a keystroke listener
document.addEventListener("keydown", (event) => {
  if (event.code === "Numpad0" || event.code === "Digit0") {
    insert(0);
  } else if (event.code === "Numpad1" || event.code === "Digit1") {
    insert(1);
  } else if (event.code == "NumpadAdd" || event.key == "+") {
    insert("+");
  } else if (event.code == "NumpadSubtract" || event.key == "-") {
    insert("-");
  } else if (event.code == "NumpadDivide" || event.key == "/") {
    insert("/");
  } else if (event.code == "NumpadMultiply" || event.key == "*") {
    insert("*");
  } else if (
    event.code == "KeyC" ||
    event.key == "c" ||
    event.code == "Backspace" ||
    event.key == "Backspace"
  ) {
    clc();
  } else if (event.code === "KeyM" || event.key === "m") {
    addToMemory();
  } else if (event.code === "KeyN" || event.key === "n") {
    subtractFromMemory();
  } else if (event.code === "KeyR" || event.key === "r") {
    recallMemory();
  } else if (event.code === "KeyL" || event.key === "l") {
    clearMemory();
  } else if (event.code === "NumpadDecimal" || event.key === "Period") {
    decimal();
  }
});

function removeSpacing(input) {
  return input.replace(/\s+/g, "");
}

function cleanZeros(input) {
  return input.replace(/^0+/g, "");
}

function addSpacing(input) {
  return input.replace(/(.{4})(?=.)/g, "$1 ");
}

function padLeftWithZeros(input, targetLength) {
  let cleanedInput = removeSpacing(input);
  const paddingLength = targetLength - cleanedInput.length;
  if (paddingLength > 0) {
    cleanedInput = "0".repeat(paddingLength) + cleanedInput;
  }
  return cleanedInput;
}
