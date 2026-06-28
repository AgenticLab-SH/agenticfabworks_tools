(function () {
  "use strict";
  var ta = document.getElementById("ta");
  var limitEl = document.getElementById("limit");
  var bar = document.getElementById("bar");
  var limitText = document.getElementById("limitText");

  function byteLen(s) {
    // UTF-8 바이트 수
    var b = 0;
    for (var i = 0; i < s.length; i++) {
      var c = s.codePointAt(i);
      if (c > 0xffff) { b += 4; i++; }
      else if (c > 0x7ff) b += 3;
      else if (c > 0x7f) b += 2;
      else b += 1;
    }
    return b;
  }

  function update() {
    var t = ta.value;
    var withSpace = Array.from(t).length;          // 코드포인트 기준(이모지 안전)
    var noSpace = Array.from(t.replace(/\s/g, "")).length;
    var bytes = byteLen(t);
    var words = (t.trim().match(/\S+/g) || []).length;
    var lines = t === "" ? 0 : t.split(/\r\n|\r|\n/).length;

    document.getElementById("withSpace").textContent = withSpace.toLocaleString("ko-KR");
    document.getElementById("noSpace").textContent = noSpace.toLocaleString("ko-KR");
    document.getElementById("bytes").textContent = bytes.toLocaleString("ko-KR");
    document.getElementById("words").textContent = words.toLocaleString("ko-KR");
    document.getElementById("lines").textContent = lines.toLocaleString("ko-KR");

    var limit = parseInt(limitEl.value, 10);
    if (limit > 0) {
      var pct = Math.min(100, (withSpace / limit) * 100);
      bar.style.width = pct + "%";
      bar.classList.toggle("over", withSpace > limit);
      limitText.textContent = withSpace + " / " + limit + (withSpace > limit ? " (초과 " + (withSpace - limit) + ")" : "");
    } else {
      bar.style.width = "0"; bar.classList.remove("over"); limitText.textContent = "";
    }
  }

  ta.addEventListener("input", update);
  limitEl.addEventListener("input", update);
  update();
})();
