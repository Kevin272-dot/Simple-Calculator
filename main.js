let val = document.querySelector("#val");
let output = document.querySelector("#output");
let first = false;

function evaluate(result) {
  let stack = [];
  for (let res of result) {
    if (isOperator(res)) {
      let a = stack.pop();
      let b = stack.pop();
      let c;
      if (res == "x") {
        c = a * b;
      } else if (res == "+") {
        c = a + b;
      } else if (res == "/") {
        if (a == 0) {
          alert("Not valid");
          return undefined;
        } else {
          c = b / a;
        }
      } else if (res == "-") {
        c = b - a;
      } else if (res == "**") {
        c = b ** a;
      }
      stack.push(c);
    } else {
      stack.push(Number(res));
    }
  }
  if (stack.length > 1) {
    alert("invalid input");
    return "";
  } else {
    // Rounding long floats to 8 decimal places max to avoid layout stretching
    let finalValue = stack[0];
    if (finalValue % 1 !== 0) {
      finalValue = parseFloat(finalValue.toFixed(8));
    }
    return String(finalValue);
  }
}

function prec(val) {
  if (val === "**") return 3;
  if (val === "/" || val === "x") return 2;
  if (val === "+" || val === "-") return 1;
  return 0;
}

function isRightAssociative(val) {
  return val === "**";
}

function isOperator(val) {
  return (
    val === "/" || val === "+" || val === "x" || val === "-" || val === "**"
  );
}

function operate(contents) {
  let stack = [];
  let result = [];
  let top = -1;
  let j = 0;

  for (let content of contents) {
    if (!isOperator(content) && content !== "(" && content !== ")") {
      result[j++] = content;
    } else if (content === "(") {
      stack[++top] = content;
    } else if (content === ")") {
      while (top !== -1 && stack[top] !== "(") {
        result[j++] = stack[top--];
      }
      top--;
    } else {
      while (
        top !== -1 &&
        stack[top] !== "(" &&
        (prec(stack[top]) > prec(content) ||
          (prec(stack[top]) === prec(content) &&
            isRightAssociative(stack[top])))
      ) {
        result[j++] = stack[top--];
      }
      stack[++top] = content;
    }
  }

  while (top !== -1) {
    result[j++] = stack[top--];
  }

  let final = evaluate(result);
  output.textContent = final;
}

function takin(value) {
  if (value != "()" && value != "=" && value != "C" && value != "⌫") {
    const currDisplay = val.textContent.trim();
    const prev =
      currDisplay.endsWith("x") ||
      currDisplay.endsWith("/") ||
      currDisplay.endsWith("+") ||
      currDisplay.endsWith("-") ||
      currDisplay.endsWith("**");
    const currIsOp = ["x", "-", "/", "*", "%", "**"].includes(value);

    if (currIsOp && (currDisplay === "" || prev)) {
      alert("Enter a operand before entering the operator");
    } else if (currIsOp) {
      val.textContent += " " + value + " ";
    } else {
      val.textContent += value;
    }
  } else if (value == "C") {
    val.textContent = "";
    output.textContent = "";
    first = false;
  } else if (value == "()") {
    if (!first) {
      val.textContent += " ( ";
      first = true;
    } else {
      val.textContent += " ) ";
      first = false;
    }
  } else if (value == "⌫") {
    let curr = val.textContent;
    if (curr.length === 0) return;

    // Correctly traces back operator/parenthesis padding spaces
    if (curr.endsWith(" ")) {
      let parts = curr.trim().split(" ");
      let removed = parts.pop();

      if (removed == "(") first = false;
      if (removed == ")") first = true;
      val.textContent = parts.length > 0 ? parts.join(" ") + " " : "";
    } else {
      val.textContent = curr.substring(0, curr.length - 1);
    }
  } else if (value == "=") {
    let toprocess = val.textContent.trim();
    if (toprocess === "") return;

    let content = toprocess.split(" ");
    let filtered = content.filter((item) => item !== "");
    operate(filtered);
  }
}

const buttons = document.querySelectorAll("button");
for (let button of buttons) {
  button.addEventListener("click", (event) => {
    const value = event.target.textContent;
    takin(value);
  });
}

document.addEventListener("keydown", (event) => {
  const key = event.key;
  if ((key >= "0" && key <= "9") || ["+", "-", ".", "/"].includes(key)) {
    takin(key);
  } else if (key == "(" || key == ")") {
    takin("()");
  } else if (key == "*") {
    takin("x");
  } else if (key == "Enter" || key == "=") {
    takin("x");
  } else if (key == "Backspace" || key == "Delete") {
    takin("⌫");
  } else if (key.toLowerCase() == "c" || key == "Escape") {
    takin("C");
  }
});
