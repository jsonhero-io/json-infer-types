export type JSONMACFormat = {
  name: "mac";
  variant: "EUI-48" | "EUI-64";
  splitter: ":" | "." | "-";
};

const macRegexDDot = /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){5}$/;
const macRegexDot = /^[a-fA-F0-9]{2}(\.[a-fA-F0-9]{2}){5}$/;
const macRegexDash = /^[a-fA-F0-9]{2}(-[a-fA-F0-9]{2}){5}$/;

const mac64RegexDDot = /^[a-fA-F0-9]{2}(:[a-fA-F0-9]{2}){7}$/;
const mac64RegexDot = /^[a-fA-F0-9]{2}(.[a-fA-F0-9]{2}){7}$/;
const mac64RegexDash = /^[a-fA-F0-9]{2}(-[a-fA-F0-9]{2}){7}$/;

export function inferMAC(value: string): JSONMACFormat | undefined {
  if (value.length === 17) {
    if (macRegexDDot.exec(value)) return { name: "mac", variant: "EUI-48", splitter: ":" };
    else if (macRegexDot.exec(value)) return { name: "mac", variant: "EUI-48", splitter: "." };
    else if (macRegexDash.exec(value)) return { name: "mac", variant: "EUI-48", splitter: "-" };
  } else if (value.length === 23) {
    if (mac64RegexDDot.exec(value)) return { name: "mac", variant: "EUI-64", splitter: ":" };
    else if (mac64RegexDot.exec(value)) return { name: "mac", variant: "EUI-64", splitter: "." };
    else if (mac64RegexDash.exec(value)) return { name: "mac", variant: "EUI-64", splitter: "-" };
  }

  return undefined;
}
