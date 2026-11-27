const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;

function linkifyText(text) {
  if (!text.includes("@")) return text;
  return text.replace(
    emailPattern,
    (email) => `<a href="mailto:${email}" class="mailto-link">${email}</a>`,
  );
}

export function linkifyEmails(input) {
  if (!input || typeof input !== "string") return input;

  let result = "";
  let index = 0;
  let insideAnchor = false;

  while (index < input.length) {
    const tagStart = input.indexOf("<", index);
    if (tagStart === -1) {
      const text = input.slice(index);
      result += insideAnchor ? text : linkifyText(text);
      break;
    }

    if (tagStart > index) {
      const text = input.slice(index, tagStart);
      result += insideAnchor ? text : linkifyText(text);
    }

    const tagEnd = input.indexOf(">", tagStart);
    if (tagEnd === -1) {
      result += input.slice(tagStart);
      break;
    }

    const tag = input.slice(tagStart, tagEnd + 1);
    if (/^<a[\s/>]/i.test(tag)) insideAnchor = true;
    else if (/^<\/a[\s>]/i.test(tag)) insideAnchor = false;

    result += tag;
    index = tagEnd + 1;
  }

  return result;
}
