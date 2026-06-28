(function () {
  "use strict";

  // ===== 2025년 기준 요율 (예상치 계산용) =====
  var RATE = {
    pension: 0.045,          // 국민연금 4.5% (근로자 부담)
    pensionCapMonthly: 6170000,   // 기준소득월액 상한
    pensionFloorMonthly: 390000,  // 기준소득월액 하한
    health: 0.03545,         // 건강보험 3.545% (근로자 부담)
    care: 0.1295,            // 장기요양 = 건강보험료 × 12.95%
    employment: 0.009        // 고용보험 0.9%
  };

  // 근로소득공제 (연 총급여 기준)
  function earnedIncomeDeduction(gross) {
    if (gross <= 5000000) return gross * 0.7;
    if (gross <= 15000000) return 3500000 + (gross - 5000000) * 0.4;
    if (gross <= 45000000) return 7500000 + (gross - 15000000) * 0.15;
    if (gross <= 100000000) return 12000000 + (gross - 45000000) * 0.05;
    return 14750000 + (gross - 100000000) * 0.02;
  }

  // 종합소득 누진세율 (2025)
  function progressiveTax(base) {
    if (base <= 0) return 0;
    var b = [
      [14000000, 0.06, 0],
      [50000000, 0.15, 1260000],
      [88000000, 0.24, 5760000],
      [150000000, 0.35, 15440000],
      [300000000, 0.38, 19940000],
      [500000000, 0.40, 25940000],
      [1000000000, 0.42, 35940000],
      [Infinity, 0.45, 65940000]
    ];
    for (var i = 0; i < b.length; i++) {
      if (base <= b[i][0]) return base * b[i][1] - b[i][2];
    }
    return 0;
  }

  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }

  var salaryEl = document.getElementById("salary");
  var nontaxEl = document.getElementById("nontax");
  var familyEl = document.getElementById("family");
  var resultEl = document.getElementById("result");

  function fmtInput(el) {
    var n = parseNum(el.value);
    el.value = n ? n.toLocaleString("ko-KR") : "";
  }

  function calc() {
    var grossYear = parseNum(salaryEl.value);
    if (grossYear <= 0) { resultEl.hidden = true; return; }

    var nontaxMonthly = parseNum(nontaxEl.value);
    var family = Math.max(1, Math.min(11, parseInt(familyEl.value, 10) || 1));

    var grossMonthly = grossYear / 12;
    var nontaxYear = nontaxMonthly * 12;
    var taxableMonthlyForInsurance = Math.max(0, grossMonthly - nontaxMonthly);

    // 4대보험 (월, 과세소득 기준)
    var pensionBase = Math.min(Math.max(taxableMonthlyForInsurance, RATE.pensionFloorMonthly), RATE.pensionCapMonthly);
    var pension = pensionBase * RATE.pension;
    var health = taxableMonthlyForInsurance * RATE.health;
    var care = health * RATE.care;
    var employment = taxableMonthlyForInsurance * RATE.employment;

    // 소득세 (연 과세표준 → 누진 → 월 환산, 근사)
    var grossTaxable = Math.max(0, grossYear - nontaxYear);
    var afterEarned = grossTaxable - earnedIncomeDeduction(grossTaxable);
    var personalDeduction = 1500000 * family;          // 인적공제
    var pensionYear = pension * 12;                    // 연금보험료 소득공제
    var taxBase = Math.max(0, afterEarned - personalDeduction - pensionYear);
    var computedTax = progressiveTax(taxBase);
    // 근로소득세액공제 (간이 근사: 산출세액의 일부 공제, 상한 적용)
    var taxCredit = Math.min(computedTax * 0.55, 740000);
    var incomeTaxYear = Math.max(0, computedTax - taxCredit);
    var incomeTax = incomeTaxYear / 12;
    var localTax = incomeTax * 0.10;                   // 지방소득세 10%

    var dedTotal = pension + health + care + employment + incomeTax + localTax;
    var netMonthly = grossMonthly - dedTotal;

    document.getElementById("netMonthly").textContent = won(netMonthly);
    document.getElementById("netYearly").textContent = won(netMonthly * 12);
    document.getElementById("grossMonthly").textContent = won(grossMonthly);
    document.getElementById("dedTotal").textContent = won(dedTotal);

    var rows = [
      ["국민연금", pension, "4.5%"],
      ["건강보험", health, "3.545%"],
      ["장기요양", care, "건보 12.95%"],
      ["고용보험", employment, "0.9%"],
      ["소득세", incomeTax, "간이세액 근사"],
      ["지방소득세", localTax, "소득세 10%"]
    ];
    document.getElementById("dedBody").innerHTML = rows.map(function (r) {
      return "<tr><td>" + r[0] + "</td><td>" + won(r[1]) + "</td><td>" + r[2] + "</td></tr>";
    }).join("");

    resultEl.hidden = false;
    if (window.gtag) gtag("event", "salary_calc", { gross_year: grossYear });
  }

  salaryEl.addEventListener("input", function () { fmtInput(salaryEl); calc(); });
  nontaxEl.addEventListener("input", function () { fmtInput(nontaxEl); calc(); });
  familyEl.addEventListener("input", calc);

  document.querySelectorAll(".quick [data-add]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      salaryEl.value = (parseNum(salaryEl.value) + parseInt(btn.dataset.add, 10)).toLocaleString("ko-KR");
      calc();
    });
  });
  document.getElementById("clearBtn").addEventListener("click", function () {
    salaryEl.value = ""; resultEl.hidden = true; salaryEl.focus();
  });
})();
