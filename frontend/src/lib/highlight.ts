/* ============================================
   Lightweight Python syntax highlighter
   ============================================ */

const KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del",
  "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in",
  "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while",
  "with", "yield", "True", "False", "None",
]);

const BUILTINS = new Set([
  "int", "str", "list", "dict", "set", "tuple", "bool", "float", "bytes", "type",
  "len", "range", "print", "isinstance", "enumerate", "zip", "map", "filter",
  "open", "sorted", "reversed", "sum", "min", "max", "any", "all", "iter", "next",
]);

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)
  );
}

interface Token {
  cls?: string;
  value: string;
}

export function highlightPython(code: string): string {
  const tokens: Token[] = [];
  let i = 0;
  const n = code.length;

  while (i < n) {
    const c = code[i];

    // Comment
    if (c === "#") {
      let j = i;
      while (j < n && code[j] !== "\n") j++;
      tokens.push({ cls: "com", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Triple-quoted string
    if ((c === '"' || c === "'") && code.substr(i, 3) === c.repeat(3)) {
      const q = c.repeat(3);
      let j = i + 3;
      while (j < n && code.substr(j, 3) !== q) j++;
      j = Math.min(j + 3, n);
      tokens.push({ cls: "str", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Single-quoted string
    if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && code[j] !== c) {
        if (code[j] === "\\") j++;
        j++;
      }
      j = Math.min(j + 1, n);
      tokens.push({ cls: "str", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Decorator
    if (c === "@" && /[a-zA-Z_]/.test(code[i + 1] ?? "")) {
      let j = i + 1;
      while (j < n && /[a-zA-Z0-9_.]/.test(code[j])) j++;
      tokens.push({ cls: "dec", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Number
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < n && /[0-9_.eE+\-x]/.test(code[j])) j++;
      tokens.push({ cls: "num", value: code.slice(i, j) });
      i = j;
      continue;
    }

    // Identifier / keyword
    if (/[a-zA-Z_]/.test(c)) {
      let j = i;
      while (j < n && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);

      let cls: string | undefined;
      if (KEYWORDS.has(word)) cls = "kw";
      else if (BUILTINS.has(word)) cls = "builtin";
      else if (word === "self" || word === "cls") cls = "self";
      else {
        let k = j;
        while (k < n && /\s/.test(code[k]) && code[k] !== "\n") k++;
        if (code[k] === "(") cls = "fn";
      }

      tokens.push({ cls, value: word });
      i = j;
      continue;
    }

    tokens.push({ value: c });
    i++;
  }

  return tokens
    .map((t) => (t.cls ? `<span class="${t.cls}">${escapeHtml(t.value)}</span>` : escapeHtml(t.value)))
    .join("");
}
