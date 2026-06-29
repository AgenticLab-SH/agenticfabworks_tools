(function () {
  "use strict";
  function pf(id) { return parseFloat(String(document.getElementById(id).value).replace(/[^0-9.\-]/g, "")); }
  function fmt(n) { return (Math.round(n * 100) / 100).toLocaleString("ko-KR"); }
  function on(ids, fn) { ids.forEach(function (i) { document.getElementById(i).addEventListener("input", fn); }); }

  // ① 전체의 몇 %
  on(["a1", "a2"], function () {
    var t = pf("a1"), p = pf("a2");
    document.getElementById("aOut").textContent = (isFinite(t) && isFinite(p)) ? (fmt(t) + " 의 " + fmt(p) + "% = " + fmt(t * p / 100)) : "";
  });

  // ② 부분은 전체의 몇 %
  on(["b1", "b2"], function () {
    var part = pf("b1"), tot = pf("b2");
    document.getElementById("bOut").textContent = (isFinite(part) && isFinite(tot) && tot !== 0) ? (fmt(part) + " 은 " + fmt(tot) + " 의 " + fmt(part / tot * 100) + "%") : "";
  });

  // ③ 할인가
  on(["c1", "c2"], function () {
    var price = pf("c1"), disc = pf("c2");
    if (isFinite(price) && isFinite(disc)) {
      var final = price * (1 - disc / 100);
      document.getElementById("cOut").textContent = "할인가 " + fmt(final) + "원 (할인액 " + fmt(price - final) + "원)";
    } else { document.getElementById("cOut").textContent = ""; }
  });

  // ④ 증감률
  on(["d1", "d2"], function () {
    var a = pf("d1"), b = pf("d2");
    if (isFinite(a) && isFinite(b) && a !== 0) {
      var rate = (b - a) / a * 100;
      var sign = rate > 0 ? "+" : "";
      document.getElementById("dOut").textContent = "증감률 " + sign + fmt(rate) + "% (" + (rate >= 0 ? "증가" : "감소") + ")";
    } else { document.getElementById("dOut").textContent = ""; }
  });
})();
