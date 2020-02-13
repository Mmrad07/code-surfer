import { parse } from "shell-quote";

type ParsedMetastring = { focus?: string } | { [key: string]: string };

/**
 * The metastring is the thing that comes after the language in markdown codeblocks
 *
 * ```js this is the metastring
 * code goes here
 * ```
 */
export function parseMetastring(metastring: string): ParsedMetastring {
  if (!metastring) {
    return {};
  }

  const argv = parse(metastring);
  const result: ParsedMetastring = {};
  argv.forEach(arg => {
    if (!arg.includes("=")) {
      if (arg === "showNumbers") {
        result["showNumbers"] = true;
      } else {
        result.focus = arg;
      }
    } else {
      const [key, value] = arg.split(/=(.*)/);
      if (value === "true") {
        result[key] = true;
      } else {
        result[key] = value;
      }
    }
  });
  return result;
}
