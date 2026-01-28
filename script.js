document.addEventListener("DOMContentLoaded", () => {

  let display = document.getElementById("display");
  let historyList = document.getElementById("historyList");

  let history = JSON.parse(localStorage.getItem("history")) || [];
  updateHistory();

  const MAX_LENGTH = 20;

  function add(value) {

    if (display.value === "Error" || display.value === "Math Error") {
      display.value = "";
    }

    if (display.value.length >= MAX_LENGTH) return;

    let lastChar = display.value.slice(-1);

    // Allow negative number at start
    if (value === "-" && display.value === "") {
      display.value = "-";
      return;
    }

    // Prevent invalid operator usage
    if (/[+\/*]/.test(value) && display.value === "") return;
    if (/[+\-*/]/.test(lastChar) && /[+\-*/]/.test(value)) return;

    // Dot handling 
    if (value === ".") {
      let parts = display.value.split(/[+\-*/()]/);
      let lastPart = parts[parts.length - 1];
      if (lastPart.includes(".")) return;
      if (lastPart === "") display.value += "0";
    }

    // Parentheses rules
    if (value === "(") {
      if (/\d|\)/.test(lastChar)) return;
    }

    if (value === ")") {
      let open = (display.value.match(/\(/g) || []).length;
      let close = (display.value.match(/\)/g) || []).length;
      if (open <= close) return;
      if (/[+\-*/(]/.test(lastChar)) return;
    }

    display.value += value;
  }

  function clearDisplay() {
    display.value = "";
  }

  function deleteOne() {
    display.value = display.value.slice(0, -1);
  }

  function calculate() {
    try {
      let exp = display.value.trim();
      if (exp === "") return;

      let open = (exp.match(/\(/g) || []).length;
      let close = (exp.match(/\)/g) || []).length;
      if (open !== close) {
        display.value = "Error";
        return;
      }

      if (/^[+*/]|[+\-*/]$/.test(exp)) {
        display.value = "Error";
        return;
      }

      if (/\/0(?!\d)/.test(exp)) {
        display.value = "Math Error";
        return;
      }

      let result = eval(exp);

      if (!isFinite(result)) {
        display.value = "Math Error";
        return;
      }

      history.push(exp + " = " + result);
      localStorage.setItem("history", JSON.stringify(history));
      updateHistory();
      display.value = result;

    } catch {
      display.value = "Error";
    }
  }

  function updateHistory() {
    historyList.innerHTML = "";
    history.forEach(item => {
      let li = document.createElement("li");
      li.textContent = item;
      historyList.appendChild(li);
    });
  }

  function clearHistory() {
    history = [];
    localStorage.removeItem("history");
    updateHistory();
  }

  document.addEventListener("keydown", (e) => {
  const historyPanel = document.getElementById("historyPanel");
  const isHistoryOpen =
    historyPanel.classList.contains("show") ||
    historyPanel.classList.contains("modal-open") ||
    historyPanel.classList.contains("modal") ||
    historyPanel.classList.contains("is-visible");

  if (isHistoryOpen && e.key === "Enter") {
    e.preventDefault();
    return;
  }

  
  if (historyPanel.contains(document.activeElement)) return;

  if ("0123456789+-*/().".includes(e.key)) {
    add(e.key);
  } else if (e.key === "Enter") {
    e.preventDefault();
    calculate();
  } else if (e.key === "Backspace") {
    deleteOne();
  } else if (e.key === "Escape") {
    clearDisplay();
  }
});


  window.add = add;
  window.clearDisplay = clearDisplay;
  window.deleteOne = deleteOne;
  window.calculate = calculate;
  window.clearHistory = clearHistory;
});



//  toggleHistory + ADD closeHistory 

function toggleHistory() {
  const history = document.getElementById("historyPanel");
  const overlay = document.getElementById("overlay");

  const isOpen = history.classList.contains("modal-open");

  if (isOpen) {
    closeHistory();
  } else {
    overlay.classList.add("active");
    history.classList.add("modal-open");
    document.body.classList.add("modal-lock");

    // trigger animation
    requestAnimationFrame(() => history.classList.add("is-visible"));
  }
}

function closeHistory() {
  const history = document.getElementById("historyPanel");
  const overlay = document.getElementById("overlay");

  // animate out
  history.classList.remove("is-visible");
  overlay.classList.remove("active");
  document.body.classList.remove("modal-lock");

  // remove modal after transition
  setTimeout(() => {
    history.classList.remove("modal-open");
  }, 260);
}


document.getElementById("historyPanel").addEventListener("click", (e) => {
  e.stopPropagation();
});

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeHistory();
});

window.toggleHistory = toggleHistory;
window.closeHistory = closeHistory;

// stop closing when clicking inside history panel
document.getElementById("historyPanel").addEventListener("click", (e) => {
  e.stopPropagation();
});

// ESC to close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeHistory();
});

window.toggleHistory = toggleHistory;
window.closeHistory = closeHistory;

