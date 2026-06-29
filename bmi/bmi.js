(function () {
  "use strict";
  function parseF(v) { return parseFloat(String(v).replace(/[^0-9.]/g, "")) || 0; }

  var heightEl = document.getElementById("height");
  var weightEl = document.getElementById("weight");
  var resultEl = document.getElementById("result");

  function categorize(bmi) {
    if (bmi < 18.5) return { t: "저체중", c: "#3b82f6", bg: "rgba(59,130,246,0.18)" };
    if (bmi < 23) return { t: "정상", c: "#22c55e", bg: "rgba(34,197,94,0.18)" };
    if (bmi < 25) return { t: "과체중", c: "#f59e0b", bg: "rgba(245,158,11,0.18)" };
    if (bmi < 30) return { t: "비만 1단계", c: "#f97316", bg: "rgba(249,115,22,0.2)" };
    if (bmi < 35) return { t: "비만 2단계", c: "#ef4444", bg: "rgba(239,68,68,0.2)" };
    return { t: "고도비만", c: "#dc2626", bg: "rgba(220,38,38,0.25)" };
  }

  function calc() {
    var h = parseF(heightEl.value);
    var w = parseF(weightEl.value);
    if (h <= 0 || w <= 0) { resultEl.hidden = true; return; }
    var m = h / 100;
    var bmi = w / (m * m);
    var cat = categorize(bmi);

    document.getElementById("bmi").textContent = (Math.round(bmi * 10) / 10).toFixed(1);
    var badge = document.getElementById("category");
    badge.textContent = cat.t;
    badge.style.color = cat.c;
    badge.style.background = cat.bg;

    // 표준체중: BMI 22 기준
    var ideal = 22 * m * m;
    document.getElementById("ideal").textContent = (Math.round(ideal * 10) / 10) + "kg";
    var lo = 18.5 * m * m, hi = 22.9 * m * m;
    document.getElementById("range").textContent = (Math.round(lo * 10) / 10) + "~" + (Math.round(hi * 10) / 10) + "kg";
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "bmi_calc");
  }

  heightEl.addEventListener("input", calc);
  weightEl.addEventListener("input", calc);
})();
