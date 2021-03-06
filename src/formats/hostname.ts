const tlds = [
  "com",
  "org",
  "net",
  "edu",
  "gov",
  "mil",
  "co",
  "io",
  "ac",
  "dev",
  "info",
  "biz",
  "name",
  "uk",
  "me",
  "ca",
  "tv",
  "ir",
  "au",
];

function containsTld(value: string): boolean {
  const extname = value.split(".").pop();

  if (!extname) {
    return false;
  }

  return tlds.includes(extname);
}

export type JSONHostnameFormat = {
  name: "hostname";
  variant: "rfc1123" | "rfc5890";
};

function isValidHostname(value: string, allowUnderscore = false): boolean {
  if (value.length === 0) {
    return false;
  }

  if (value === "localhost") {
    return true;
  }

  if (!value.includes(".")) {
    return false;
  }

  const validHostnameChars = new RegExp(
    `^[a-zA-Z0-9-.${allowUnderscore ? "_" : ""}]{1,253}.?$`,
    "g",
  );
  if (!validHostnameChars.test(value)) {
    return false;
  }

  if (value.endsWith(".")) {
    value = value.slice(0, value.length - 1);
  }

  const labels = value.split(".");

  const isValid = labels.every(function (label) {
    const validLabelChars = new RegExp(`^([a-zA-Z0-9-${allowUnderscore ? "_" : ""}]+)$`, "g");

    const validLabel =
      validLabelChars.test(label) &&
      label.length < 64 &&
      !label.startsWith("-") &&
      !label.endsWith("-");

    return validLabel;
  });

  return isValid && containsTld(value);
}

export function inferHostname(value: string): JSONHostnameFormat | undefined {
  if (isValidHostname(value)) {
    return {
      name: "hostname",
      variant: "rfc1123",
    };
  }

  if (isValidHostname(value, true)) {
    return {
      name: "hostname",
      variant: "rfc5890",
    };
  }

  return undefined;
}
