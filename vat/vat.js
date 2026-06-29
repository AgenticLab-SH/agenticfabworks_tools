(function () {
  "use strict";
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }
  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }

  var amountEl = document.getElementById("amount");
  var amountLabel = document.getElementById("amountLabel");
  var resultEl = document.getElementById("result");
  var mode = "supply"; // supply=공급가액 입력, total=합계금액 입력

  function fmt(node) { var n = parseNum(node.value); node.value = n ? n.toLocaleString("ko-KR") : ""; }

  function calc() {
    var v = parseNum(amountEl.value);
    if (v <= 0) { resultEl.hidden = true; return; }
    var supply, vat, total;
    if (mode === "supply") {
      supply = v;
      vat = Math.round(v * 0.1);
      total = supply + vat;
    } else {
      // 합계금액 입력 → 공급가액 = 합계/1.1
      supply = Math.round(v / 1.1);
      vat = v - supply;
      total = v;
    }
    document.getElementById("vat").textContent = won(vat);
    document.getElementById("supply").textContent = won(supply);
    document.getElementById("vat2").textContent = won(vat);
    document.getElementById("total").textContent = won(total);
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "vat_calc", { mode: mode });
  }

  document.getElementById("mSupply").addEventListener("click", function () {
    mode = "supply"; this.classList.add("on"); document.getElementById("mTotal").classList.remove("on");
    amountLabel.textContent = "공급가액 (부가세 별도)"; calc();
  });
  document.getElementById("mTotal").addEventListener("click", function () {
    mode = "total"; this.classList.add("on"); document.getElementById("mSupply").classList.remove("on");
    amountLabel.textContent = "합계금액 (부가세 포함)"; calc();
  });
  amountEl.addEventListener("input", function () { fmt(amountEl); calc(); });
})();
