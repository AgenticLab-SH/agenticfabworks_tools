(function () {
  "use strict";
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }
  function parseRate(v) { return parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0; }
  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }

  var amountEl = document.getElementById("amount");
  var rateEl = document.getElementById("rate");
  var yearsEl = document.getElementById("years");
  var resultEl = document.getElementById("result");
  var method = "pi"; // pi=원리금균등, p=원금균등

  function fmt(node) { var n = parseNum(node.value); node.value = n ? n.toLocaleString("ko-KR") : ""; }

  function calc() {
    var P = parseNum(amountEl.value);
    var rate = parseRate(rateEl.value);
    var years = parseNum(yearsEl.value);
    if (P <= 0 || years <= 0) { resultEl.hidden = true; return; }
    var n = years * 12;
    var i = rate / 100 / 12;

    var payLabel = document.getElementById("payLabel");
    var firstLabel = document.getElementById("firstLabel");
    var monthlyPay, totalPay, totalInterest, firstPay;

    if (method === "pi") {
      // 원리금균등: 매월 동일
      var m = i === 0 ? P / n : P * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1);
      monthlyPay = m;
      totalPay = m * n;
      totalInterest = totalPay - P;
      firstPay = m;
      payLabel.textContent = "월 상환액 (매월 동일)";
      firstLabel.textContent = "마지막 달 상환액";
      // 원리금균등은 마지막도 동일
      document.getElementById("firstPay").textContent = won(m);
    } else {
      // 원금균등: 매월 원금 동일 + 잔액 이자
      var principalPart = P / n;
      var first = principalPart + P * i;
      var last = principalPart + principalPart * i;
      // 총이자 = i * 원금 * (n+1)/2 (등차)
      totalInterest = i * principalPart * (n + 1) * n / 2;
      totalPay = P + totalInterest;
      monthlyPay = first; // 첫 달
      firstPay = last;
      payLabel.textContent = "첫 달 상환액";
      firstLabel.textContent = "마지막 달 상환액";
      document.getElementById("firstPay").textContent = won(last);
    }

    document.getElementById("monthlyPay").textContent = won(monthlyPay);
    document.getElementById("totalPay").textContent = won(totalPay);
    document.getElementById("totalInterest").textContent = won(totalInterest);
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "loan_calc", { method: method });
  }

  document.getElementById("mEqualPI").addEventListener("click", function () {
    method = "pi"; this.classList.add("on"); document.getElementById("mEqualP").classList.remove("on"); calc();
  });
  document.getElementById("mEqualP").addEventListener("click", function () {
    method = "p"; this.classList.add("on"); document.getElementById("mEqualPI").classList.remove("on"); calc();
  });
  amountEl.addEventListener("input", function () { fmt(amountEl); calc(); });
  rateEl.addEventListener("input", calc);
  yearsEl.addEventListener("input", function () { fmt(yearsEl); calc(); });
})();
