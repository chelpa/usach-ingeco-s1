(function () {
  "use strict";

  function groupAt(source, start, open, close) {
    if (source[start] !== open) return null;
    var depth = 0;
    for (var i = start; i < source.length; i++) {
      if (source[i] === open) depth++;
      if (source[i] === close && --depth === 0) {
        return { value: source.slice(start + 1, i), end: i + 1 };
      }
    }
    return null;
  }

  function scriptAt(source, marker) {
    var next = marker + 1;
    var grouped = groupAt(source, next, "{", "}");
    if (grouped) return grouped;
    if (source[marker] === "^") {
      grouped = groupAt(source, next, "(", ")");
      if (grouped) return grouped;
    }
    if (/^[\p{L}\p{N}∞]$/u.test(source[next] || "")) {
      return { value: source[next], end: next + 1 };
    }
    return null;
  }

  function renderText(node) {
    var source = node.data;
    if (!/[_^]/.test(source)) return;
    var result = document.createDocumentFragment();
    var pending = "";
    var changed = false;

    function flush() {
      if (pending) result.appendChild(document.createTextNode(pending));
      pending = "";
    }

    for (var i = 0; i < source.length;) {
      var marker = source[i];
      var previous = pending.slice(-1);
      if ((marker === "_" || marker === "^") &&
          /^[\p{L}\p{N})\]|∞]$/u.test(previous)) {
        var script = scriptAt(source, i);
        if (script) {
          var raw = source.slice(i, script.end);
          if (marker === "_" && pending.endsWith("lím")) {
            pending = pending.slice(0, -3);
            flush();
            var limit = document.createElement("span");
            limit.className = "math-notation-limit";
            limit.dataset.mathSource = "lím" + raw;
            limit.appendChild(document.createTextNode("lím"));
            var limitSub = document.createElement("sub");
            limitSub.textContent = script.value;
            render(limitSub);
            limit.appendChild(limitSub);
            result.appendChild(limit);
          } else {
            flush();
            var element = document.createElement(marker === "_" ? "sub" : "sup");
            element.dataset.mathSource = raw;
            element.textContent = script.value;
            render(element);
            result.appendChild(element);
          }
          i = script.end;
          changed = true;
          continue;
        }
      }
      pending += marker;
      i++;
    }
    if (!changed) return;
    flush();
    var run = document.createElement("span");
    run.className = "math-notation-run";
    run.appendChild(result);
    node.replaceWith(run);
  }

  function render(root) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(renderText);
  }

  window.MI_MATH_NOTATION = { render: render };
  var root = document.querySelector("main.main");
  if (root) render(root);
})();
