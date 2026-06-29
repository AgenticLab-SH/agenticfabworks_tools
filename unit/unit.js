(function () {
  "use strict";
  // 각 카테고리: base 단위 기준 배수(factor). 온도만 별도 공식.
  var CATS = {
    "길이": { units: [["mm",0.001],["cm",0.01],["m",1],["km",1000],["인치",0.0254],["피트",0.3048],["야드",0.9144],["마일",1609.344]], def: ["cm","인치"] },
    "무게": { units: [["mg",0.000001],["g",0.001],["kg",1],["톤",1000],["온스",0.0283495],["파운드",0.453592],["근(600g)",0.6],["관",3.75]], def: ["kg","파운드"] },
    "온도": { temp: true, units: [["섭씨℃",0],["화씨℉",0],["켈빈K",0]], def: ["섭씨℃","화씨℉"] },
    "면적": { units: [["㎡",1],["㎢",1000000],["평",3.305785],["에이커",4046.86],["헥타르",10000],["㎠",0.0001]], def: ["㎡","평"] },
    "부피": { units: [["mL",0.001],["L",1],["㎤",0.001],["㎥",1000],["갤런(US)",3.78541],["컵(200mL)",0.2]], def: ["L","mL"] },
    "속도": { units: [["m/s",1],["km/h",0.277778],["mph",0.44704],["knot",0.514444]], def: ["km/h","mph"] },
    "데이터": { units: [["B",1],["KB",1024],["MB",1048576],["GB",1073741824],["TB",1099511627776]], def: ["MB","GB"] }
  };

  var catTabs = document.getElementById("catTabs");
  var fromVal = document.getElementById("fromVal");
  var toVal = document.getElementById("toVal");
  var fromUnit = document.getElementById("fromUnit");
  var toUnit = document.getElementById("toUnit");
  var current = "길이";
  var lock = false;

  function parseF(v) { return parseFloat(String(v).replace(/[^0-9.\-]/g, "")); }
  function round(n) { if (!isFinite(n)) return ""; return String(Math.round(n * 1e6) / 1e6); }

  // 온도 변환: x(현재단위) → 섭씨 → 목표단위
  function tempToC(v, u) { if (u === "화씨℉") return (v - 32) * 5 / 9; if (u === "켈빈K") return v - 273.15; return v; }
  function cToTemp(c, u) { if (u === "화씨℉") return c * 9 / 5 + 32; if (u === "켈빈K") return c + 273.15; return c; }

  function convert(v, fromU, toU) {
    var cat = CATS[current];
    if (cat.temp) return cToTemp(tempToC(v, fromU), toU);
    var fF = cat.units.find(function (u) { return u[0] === fromU; })[1];
    var tF = cat.units.find(function (u) { return u[0] === toU; })[1];
    return v * fF / tF;
  }

  function fillUnits() {
    var cat = CATS[current];
    var opts = cat.units.map(function (u) { return '<option value="' + u[0] + '">' + u[0] + '</option>'; }).join("");
    fromUnit.innerHTML = opts; toUnit.innerHTML = opts;
    fromUnit.value = cat.def[0]; toUnit.value = cat.def[1];
  }

  function recalc(src) {
    if (lock) return;
    lock = true;
    if (src === "to") {
      var v2 = parseF(toVal.value);
      fromVal.value = isFinite(v2) ? round(convert(v2, toUnit.value, fromUnit.value)) : "";
    } else {
      var v1 = parseF(fromVal.value);
      toVal.value = isFinite(v1) ? round(convert(v1, fromUnit.value, toUnit.value)) : "";
    }
    lock = false;
  }

  function buildTabs() {
    catTabs.innerHTML = Object.keys(CATS).map(function (c) {
      return '<button type="button" data-cat="' + c + '"' + (c === current ? ' class="on"' : '') + '>' + c + '</button>';
    }).join("");
    catTabs.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        current = b.dataset.cat;
        catTabs.querySelectorAll("button").forEach(function (x) { x.classList.toggle("on", x === b); });
        fillUnits(); fromVal.value = "1"; recalc("from");
        if (window.gtag) gtag("event", "unit_convert", { cat: current });
      });
    });
  }

  fromVal.addEventListener("input", function () { recalc("from"); });
  toVal.addEventListener("input", function () { recalc("to"); });
  fromUnit.addEventListener("change", function () { recalc("from"); });
  toUnit.addEventListener("change", function () { recalc("from"); });

  buildTabs(); fillUnits(); fromVal.value = "1"; recalc("from");
})();
