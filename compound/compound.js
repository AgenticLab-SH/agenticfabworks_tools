(function () {
  "use strict";
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }
  function parseRate(v) { return parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0; }
  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }

  var principalEl = document.getElementById("principal");
  var monthlyEl = document.getElementById("monthly");
  var rateEl = document.getElementById("rate");
  var yearsEl = document.getElementById("years");
  var resultEl = document.getElementById("result");

  function fmt(node) { var n = parseNum(node.value); node.value = n ? n.toLocaleString("ko-KR") : ""; }

  function calc() {
    var principal = parseNum(principalEl.value);
    var monthly = parseNum(monthlyEl.value);
    var rate = parseRate(rateEl.value);
    var years = parseNum(yearsEl.value);
    if ((principal <= 0 && monthly <= 0) || years <= 0 || rate < 0) { resultEl.hidden = true; return; }

    var months = years * 12;
    var mRate = rate / 100 / 12; // 월 이율

    // 복리: 초기 원금은 months 만큼, 매월 적립금은 들어온 시점부터 복리
    var balance = principal;
    for (var i = 0; i < months; i++) {
      balance = balance * (1 + mRate) + monthly;
    }
    var principalSum = principal + monthly * months;
    var interest = balance - principalSum;

    // 단리 비교: 원금은 전체기간, 적립금은 평균 보유기간 근사
    var simple = principal * (1 + (rate / 100) * years);
    // 적립금 단리: 각 납입액이 평균 (months+1)/2 개월 보유
    var avgMonths = (months + 1) / 2;
    simple += monthly * months + monthly * months * mRate * avgMonths;
    var diff = balance - simple;

    document.getElementById("total").textContent = won(balance);
    document.getElementById("principalSum").textContent = won(principalSum);
    document.getElementById("interest").textContent = won(interest);
    document.getElementById("diff").textContent = won(diff > 0 ? diff : 0);

    resultEl.hidden = false;
    if (window.gtag) gtag("event", "compound_calc");
  }

  [principalEl, monthlyEl].forEach(function (n) { n.addEventListener("input", function () { fmt(n); calc(); }); });
  rateEl.addEventListener("input", calc);
  yearsEl.addEventListener("input", function () { fmt(yearsEl); calc(); });
})();
