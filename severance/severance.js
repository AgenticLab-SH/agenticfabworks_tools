(function () {
  "use strict";
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }
  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }
  function parseD(s) { var p = (s || "").split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  var joinEl = document.getElementById("joinDate");
  var quitEl = document.getElementById("quitDate");
  var monthlyEl = document.getElementById("monthly");
  var bonusEl = document.getElementById("annualBonus");
  var resultEl = document.getElementById("result");

  function fmt(node) { var n = parseNum(node.value); node.value = n ? n.toLocaleString("ko-KR") : ""; }

  function calc() {
    if (!joinEl.value || !quitEl.value) { resultEl.hidden = true; return; }
    var join = parseD(joinEl.value), quit = parseD(quitEl.value);
    var monthly = parseNum(monthlyEl.value);
    if (isNaN(join) || isNaN(quit) || quit <= join || monthly <= 0) { resultEl.hidden = true; return; }

    var totalDays = Math.round((quit - join) / 86400000);
    // 퇴직 전 3개월 총일수
    var threeMonthsAgo = new Date(quit.getFullYear(), quit.getMonth() - 3, quit.getDate());
    var days3 = Math.round((quit - threeMonthsAgo) / 86400000);

    var bonus = parseNum(bonusEl.value);
    // 3개월 임금총액 = 월급*3 + 상여 3개월분(연상여*3/12)
    var wage3 = monthly * 3 + bonus * 3 / 12;
    var avgWage = wage3 / days3; // 1일 평균임금
    var severance = avgWage * 30 * (totalDays / 365);

    document.getElementById("severance").textContent = won(severance);
    document.getElementById("days").textContent = totalDays.toLocaleString("ko-KR") + "일";
    document.getElementById("avgWage").textContent = won(avgWage);
    var y = Math.floor(totalDays / 365), d = totalDays % 365;
    document.getElementById("period").textContent = y + "년 " + d + "일";
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "severance_calc");
  }

  joinEl.addEventListener("input", calc);
  quitEl.addEventListener("input", calc);
  monthlyEl.addEventListener("input", function () { fmt(monthlyEl); calc(); });
  bonusEl.addEventListener("input", function () { fmt(bonusEl); calc(); });
})();
