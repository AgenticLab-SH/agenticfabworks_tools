(function () {
  "use strict";
  var birthEl = document.getElementById("birth");
  var baseEl = document.getElementById("base");
  var resultEl = document.getElementById("result");

  function todayStr() {
    var n = new Date();
    return n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
  }
  baseEl.value = todayStr();

  function parseD(s) { var p = (s || "").split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }

  // 만 나이: 생일 안 지났으면 -1
  function manAge(birth, base) {
    var age = base.getFullYear() - birth.getFullYear();
    var m = base.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && base.getDate() < birth.getDate())) age--;
    return age;
  }

  function calc() {
    if (!birthEl.value || !baseEl.value) { resultEl.hidden = true; return; }
    var birth = parseD(birthEl.value);
    var base = parseD(baseEl.value);
    if (isNaN(birth) || isNaN(base) || base < birth) { resultEl.hidden = true; return; }

    var man = manAge(birth, base);
    var yearAge = base.getFullYear() - birth.getFullYear();
    var totalDays = Math.floor((base - birth) / 86400000);

    // 다음 생일
    var next = new Date(base.getFullYear(), birth.getMonth(), birth.getDate());
    if (next < base) next = new Date(base.getFullYear() + 1, birth.getMonth(), birth.getDate());
    var daysToNext = Math.round((next - base) / 86400000);

    document.getElementById("manAge").textContent = man + "세";
    document.getElementById("yearAge").textContent = yearAge + "세";
    document.getElementById("nextBirthday").textContent = (daysToNext === 0 ? "오늘 생일!" : "D-" + daysToNext);
    document.getElementById("totalDays").textContent = totalDays.toLocaleString("ko-KR") + "일";
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "age_calc");
  }

  birthEl.addEventListener("input", calc);
  baseEl.addEventListener("input", calc);
})();
