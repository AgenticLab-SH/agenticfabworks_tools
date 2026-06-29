(function () {
  "use strict";
  var SQM_PER_PYEONG = 3.305785;
  var sqmEl = document.getElementById("sqm");
  var pyEl = document.getElementById("pyeong");
  var lock = false;

  function parseF(v) { return parseFloat(String(v).replace(/[^0-9.]/g, "")); }
  function round2(n) { return Math.round(n * 100) / 100; }

  sqmEl.addEventListener("input", function () {
    if (lock) return;
    var v = parseF(sqmEl.value);
    lock = true;
    pyEl.value = (v > 0) ? String(round2(v / SQM_PER_PYEONG)) : "";
    lock = false;
  });
  pyEl.addEventListener("input", function () {
    if (lock) return;
    var v = parseF(pyEl.value);
    lock = true;
    sqmEl.value = (v > 0) ? String(round2(v * SQM_PER_PYEONG)) : "";
    lock = false;
  });
})();
