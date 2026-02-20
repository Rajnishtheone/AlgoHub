const MARKER_START = "VISIBLE_CODE_START";
const MARKER_END = "VISIBLE_CODE_END";
const MARKER_ERROR = "comment marker issue";

const isMarkerLine = (line, marker) => {
  const markerIndex = line.indexOf(marker);
  if (markerIndex === -1) return false;
  const slashIndex = line.indexOf("//");
  const hashIndex = line.indexOf("#");
  if (slashIndex !== -1 && slashIndex < markerIndex) return true;
  if (hashIndex !== -1 && hashIndex < markerIndex) return true;
  return false;
};

const extractVisibleCode = (template) => {
  if (!template) return { error: MARKER_ERROR };
  const normalized = template.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  let startLine = -1;
  let endLine = -1;

  for (let i = 0; i < lines.length; i++) {
    if (startLine === -1 && isMarkerLine(lines[i], MARKER_START)) {
      startLine = i;
      continue;
    }
    if (startLine !== -1 && isMarkerLine(lines[i], MARKER_END)) {
      endLine = i;
      break;
    }
  }

  if (startLine === -1 || endLine === -1 || endLine <= startLine) {
    return { error: MARKER_ERROR };
  }

  const lineStarts = [];
  let cursor = 0;
  for (let i = 0; i < lines.length; i++) {
    lineStarts.push(cursor);
    cursor += lines[i].length + 1;
  }

  const startOffset = lineStarts[startLine] + lines[startLine].length + 1;
  const endOffset = lineStarts[endLine];
  const visible = normalized.slice(startOffset, endOffset);

  return { visible, start: startOffset, end: endOffset, normalized };
};

const mergeUserCode = (template, userCode) => {
  const result = extractVisibleCode(template);
  if (result.error) {
    return { error: result.error };
  }
  const normalizedUser = (userCode || "").replace(/\r\n/g, "\n");
  const merged =
    result.normalized.slice(0, result.start) +
    normalizedUser +
    result.normalized.slice(result.end);
  return { merged };
};

export { extractVisibleCode, mergeUserCode, MARKER_ERROR };
