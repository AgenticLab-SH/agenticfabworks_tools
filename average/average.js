(function () {
  "use strict";
  function parseNum(v) { return parseInt(String(v).replace(/[^0-9]/g, ""), 10) || 0; }
  function won(n) { return Math.round(n).toLocaleString("ko-KR") + "원"; }

  var ids = ["qty1", "price1", "qty2", "price2", "cur"];
  var el = {};
  ids.forEach(function (i) { el[i] = document.getElementById(i); });
  var resultEl = document.getElementById("result");

  function fmt(node) {
    var n = parseNum(node.value);
    node.value = n ? n.toLocaleString("ko-KR") : "";
  }

  function calc() {
    var q1 = parseNum(el.qty1.value), p1 = parseNum(el.price1.value);
    var q2 = parseNum(el.qty2.value), p2 = parseNum(el.price2.value);
    var cur = parseNum(el.cur.value);
    var totQty = q1 + q2;
    if (totQty <= 0) { resultEl.hidden = true; return; }
    var totCost = q1 * p1 + q2 * p2;
    var avg = totCost / totQty;

    document.getElementById("avg").textContent = won(avg);
    document.getElementById("totQty").textContent = totQty.toLocaleString("ko-KR") + "주";
    document.getElementById("totCost").textContent = won(totCost);

    var roiEl = document.getElementById("roi");
    if (cur > 0 && avg > 0) {
      var roi = (cur - avg) / avg * 100;
      var sign = roi > 0 ? "+" : "";
      roiEl.textContent = sign + (Math.round(roi * 100) / 100) + "%";
      roiEl.style.color = roi > 0 ? "#22c55e" : (roi < 0 ? "#ef4444" : "");
    } else {
      roiEl.textContent = "-";
      roiEl.style.color = "";
    }
    resultEl.hidden = false;
    if (window.gtag) gtag("event", "average_calc");
  }

  ids.forEach(function (i) {
    el[i].addEventListener("input", function () {
      if (i !== "cur" || true) fmt(el[i]);
      calc();
    });
  });
})();
