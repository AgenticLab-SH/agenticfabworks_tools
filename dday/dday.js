(function () {
  "use strict";
  var KEY = "afw_dday_items_v1";
  var titleEl = document.getElementById("title");
  var dateEl = document.getElementById("date");
  var listEl = document.getElementById("list");

  function load() {
    try { var a = JSON.parse(localStorage.getItem(KEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch (e) { return []; }
  }
  function save(items) {
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) { /* noop */ }
  }

  // 당일 0일(D-DAY) 한국식: 자정 기준 일수 차
  function diffDays(target) {
    var now = new Date();
    var t = new Date(target + "T00:00:00");
    var a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var b = new Date(t.getFullYear(), t.getMonth(), t.getDate());
    return Math.round((b - a) / 86400000);
  }
  function label(d) {
    if (d === 0) return { txt: "D-DAY", cls: "today" };
    if (d > 0) return { txt: "D-" + d, cls: "future" };
    return { txt: "D+" + Math.abs(d), cls: "past" };
  }
  function esc(s) { var d = document.createElement("div"); d.textContent = s; return d.innerHTML; }

  function render() {
    var items = load().sort(function (a, b) { return a.date.localeCompare(b.date); });
    if (!items.length) {
      listEl.innerHTML = '<div class="dday-card"><div><div class="t">아직 일정이 없습니다</div><div class="d">위에서 일정을 추가해 보세요.</div></div></div>';
      return;
    }
    listEl.innerHTML = items.map(function (it, i) {
      var d = diffDays(it.date);
      var l = label(d);
      return '<div class="dday-card"><div><div class="t">' + esc(it.title) +
        '</div><div class="d">' + it.date + '</div></div>' +
        '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span class="big ' + l.cls + '">' + l.txt + '</span>' +
        '<button class="del" data-i="' + i + '">삭제</button></div></div>';
    }).join("");
    listEl.querySelectorAll(".del").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var arr = load().sort(function (a, b) { return a.date.localeCompare(b.date); });
        arr.splice(parseInt(btn.dataset.i, 10), 1);
        save(arr); render();
      });
    });
  }

  function add() {
    var title = (titleEl.value || "").trim();
    var date = dateEl.value;
    if (!title) { titleEl.focus(); return; }
    if (!date) { dateEl.focus(); return; }
    var items = load();
    items.push({ title: title, date: date });
    save(items);
    titleEl.value = ""; dateEl.value = "";
    render();
    if (window.gtag) gtag("event", "dday_add");
  }

  document.getElementById("addBtn").addEventListener("click", add);
  document.getElementById("todayBtn").addEventListener("click", function () {
    var n = new Date();
    dateEl.value = n.getFullYear() + "-" + String(n.getMonth() + 1).padStart(2, "0") + "-" + String(n.getDate()).padStart(2, "0");
  });
  titleEl.addEventListener("keydown", function (e) { if (e.key === "Enter") dateEl.focus(); });
  dateEl.addEventListener("keydown", function (e) { if (e.key === "Enter") add(); });

  // 기본 예시(처음 방문 시 SKCT 안내) — 저장은 안 함, 빈 상태 안내만
  render();
})();
