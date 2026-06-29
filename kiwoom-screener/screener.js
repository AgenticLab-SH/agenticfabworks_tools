(function () {
  "use strict";
  var DATA = window.KIWOOM_DATA || [];
  var searchEl = document.getElementById("ksSearch");
  var listEl = document.getElementById("ksList");
  var countEl = document.getElementById("ksCount");

  function esc(s) { var d = document.createElement("div"); d.textContent = s == null ? "" : s; return d.innerHTML; }
  function hl(text, q) {
    var safe = esc(text);
    if (!q) return safe;
    try {
      var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
      return safe.replace(re, "<mark>$1</mark>");
    } catch (e) { return safe; }
  }

  function render(q) {
    q = (q || "").trim();
    var rows = DATA;
    if (q) {
      var lq = q.toLowerCase();
      rows = DATA.filter(function (it) {
        return (it.top + " " + (it.sub || "") + " " + it.desc + " " + it.hint).toLowerCase().indexOf(lq) >= 0;
      });
    }
    countEl.textContent = q ? (rows.length + "개 항목 검색됨") : ("전체 " + DATA.length + "개 항목");
    if (!rows.length) { listEl.innerHTML = '<div class="ks-empty">검색 결과가 없습니다. 다른 키워드를 입력해 보세요.</div>'; return; }

    // 대분류로 그룹핑 (대분류 자체 항목 = sub 없음)
    var groups = {};
    var order = [];
    rows.forEach(function (it) {
      if (!groups[it.top]) { groups[it.top] = { head: null, items: [] }; order.push(it.top); }
      if (it.sub == null) groups[it.top].head = it;
      else groups[it.top].items.push(it);
    });

    listEl.innerHTML = order.map(function (top) {
      var g = groups[top];
      var headDesc = g.head ? g.head.desc : "";
      var itemsHtml = g.items.map(function (it) {
        return '<div class="ks-item"><h4>' + hl(it.sub, q) + '</h4><p>' + hl(it.desc, q) + '</p>' +
          (it.hint ? '<div class="hint">💡 ' + hl(it.hint, q) + '</div>' : '') + '</div>';
      }).join("");
      // 검색 중 대분류만 매칭되고 하위가 없으면 head를 항목으로 표시
      if (!itemsHtml && g.head) {
        itemsHtml = '<div class="ks-item"><p>' + hl(g.head.desc, q) + '</p>' +
          (g.head.hint ? '<div class="hint">💡 ' + hl(g.head.hint, q) + '</div>' : '') + '</div>';
      }
      return '<div class="ks-group"><div class="ks-group-title">' + hl(top, q) + '</div>' +
        (headDesc ? '<div class="ks-group-desc">' + hl(headDesc, q) + '</div>' : '') +
        '<div class="ks-items">' + itemsHtml + '</div></div>';
    }).join("");
  }

  searchEl.addEventListener("input", function () {
    render(searchEl.value);
    if (window.gtag && searchEl.value.trim().length >= 2) gtag("event", "kiwoom_search", { q: searchEl.value.trim() });
  });
  render("");
})();
