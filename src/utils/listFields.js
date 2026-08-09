function linesToArray(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(items) {
  return (items ?? []).join('\n');
}

function tagsToArray(text) {
  return text
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function arrayToTags(items) {
  return (items ?? []).join(', ');
}

export { arrayToLines, arrayToTags, linesToArray, tagsToArray };
