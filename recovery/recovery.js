(function () {
  "use strict";
  function parseF(v) { return parseFloat(String(v).replace(/[^0-9.]/g, "")); }
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }
  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }

  var lossEl = document.getElementById("loss");
  var amountEl = document.getElementById("amount");
  var resultEl = document.getElementById("result");

  function fmtNum(node) { var n = parseNum(node.value); node.value = n ? n.toLocaleString("ko-KR") : ""; }

  function calc() {
    var loss = parseF(lossEl.value);
    if (!isFinite(loss) || loss <= 0 || loss >= 100) { resultEl.hidden = true; return; }
    var need = loss / (100 - loss) * 100;

    document.getElementById("need").textContent = "+" + (Math.round(need * 100) / 100) + "%";
    document.getElementById("lossOut").textContent = "-" + (Math.round(loss * 100) / 100) + "%";

    var amount = parseNum(amountEl.value);
    if (amount > 0) {
      // 현재가 손실 후 금액이라 가정 → 본전 = 현재 / (1 - loss/100)
      var breakeven = amount / (1 - loss / 100);
      document.getElementById("amountOut").textContent = won(amount) + " → " + won(breakeven);
      document.getElementById("ratioOut").textContent = (Math.round((amount / breakeven) * 1000) / 10) + "%";
    } else {
      document.getElementById("amountOut").textContent = "-";
      document.getElementById("ratioOut").textContent = (Math.round((100 - loss) * 10) / 10) + "%";
    }
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "recovery_calc");
  }

  lossEl.addEventListener("input", calc);
  amountEl.addEventListener("input", function () { fmtNum(amountEl); calc(); });
})();
