(function () {
  "use strict";
  // 표시할 통화 (코드: 한글명)
  var CURRENCIES = [
    ["KRW", "원 (KRW)"], ["USD", "달러 (USD)"], ["JPY", "엔 (JPY)"],
    ["EUR", "유로 (EUR)"], ["CNY", "위안 (CNY)"], ["GBP", "파운드 (GBP)"],
    ["AUD", "호주달러 (AUD)"], ["CAD", "캐나다달러 (CAD)"], ["HKD", "홍콩달러 (HKD)"],
    ["CHF", "스위스프랑 (CHF)"], ["SGD", "싱가포르달러 (SGD)"], ["VND", "베트남동 (VND)"], ["THB", "바트 (THB)"]
  ];
  // API 실패 시 폴백(2026 근사, USD 기준). 정확치 않을 수 있음을 안내에 명시.
  var FALLBACK = { USD:1, KRW:1370, JPY:157, EUR:0.92, CNY:7.2, GBP:0.79, AUD:1.52, CAD:1.36, HKD:7.8, CHF:0.88, SGD:1.34, VND:25400, THB:36 };

  var fromVal = document.getElementById("fromVal");
  var toVal = document.getElementById("toVal");
  var fromCur = document.getElementById("fromCur");
  var toCur = document.getElementById("toCur");
  var rateNote = document.getElementById("rateNote");
  var swapBtn = document.getElementById("swapBtn");

  var rates = null;       // base USD 기준 배수
  var isLive = false;
  var dateStr = "";
  var lock = false;

  function parseF(v) { return parseFloat(String(v).replace(/[^0-9.]/g, "")); }
  function fmt(n) {
    if (!isFinite(n)) return "";
    return (Math.round(n * 100) / 100).toLocaleString("ko-KR", { maximumFractionDigits: 2 });
  }

  function fillSelects() {
    var opts = CURRENCIES.map(function (c) { return '<option value="' + c[0] + '">' + c[1] + '</option>'; }).join("");
    fromCur.innerHTML = opts; toCur.innerHTML = opts;
    fromCur.value = "KRW"; toCur.value = "USD";
  }

  // USD 기준 배수로 변환: amount(from) → USD → to
  function convert(amount, from, to) {
    if (!rates) return NaN;
    var usd = amount / rates[from];
    return usd * rates[to];
  }

  function recalc(src) {
    if (lock || !rates) return;
    lock = true;
    if (src === "to") {
      var v2 = parseF(toVal.value);
      fromVal.value = isFinite(v2) ? fmt(convert(v2, toCur.value, fromCur.value)) : "";
    } else {
      var v1 = parseF(fromVal.value);
      toVal.value = isFinite(v1) ? fmt(convert(v1, fromCur.value, toCur.value)) : "";
    }
    lock = false;
    updateNote();
  }

  function updateNote() {
    if (!rates) return;
    var one = convert(1, fromCur.value, toCur.value);
    var line = "1 " + fromCur.value + " = <strong>" + fmt(one) + " " + toCur.value + "</strong>";
    rateNote.innerHTML = line + "<br><span style='font-size:12px'>" +
      (isLive ? ("ECB 기준 · " + dateStr + " 갱신") : "오프라인 근사 환율(참고용)") + "</span>";
  }

  function setRates(map, live, date) {
    rates = map; isLive = live; dateStr = date || "";
    fromVal.value = "1000"; recalc("from");
  }

  // Frankfurter: base EUR 응답을 USD 기준으로 정규화
  function loadRates() {
    var symbols = CURRENCIES.map(function (c) { return c[0]; }).join(",");
    fetch("https://api.frankfurter.app/latest?base=USD&symbols=" + symbols)
      .then(function (r) { if (!r.ok) throw new Error("http"); return r.json(); })
      .then(function (j) {
        var map = Object.assign({ USD: 1 }, j.rates);
        // 누락 통화는 폴백 보충
        CURRENCIES.forEach(function (c) { if (!map[c[0]]) map[c[0]] = FALLBACK[c[0]]; });
        setRates(map, true, j.date);
        if (window.gtag) gtag("event", "exchange_loaded", { live: 1 });
      })
      .catch(function () {
        setRates(FALLBACK, false, "");
      });
  }

  fromVal.addEventListener("input", function () { recalc("from"); });
  toVal.addEventListener("input", function () { recalc("to"); });
  fromCur.addEventListener("change", function () { recalc("from"); });
  toCur.addEventListener("change", function () { recalc("from"); });
  swapBtn.addEventListener("click", function () {
    var a = fromCur.value; fromCur.value = toCur.value; toCur.value = a; recalc("from");
  });

  fillSelects();
  rateNote.textContent = "환율을 불러오는 중...";
  loadRates();
})();
