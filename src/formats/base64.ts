export type JSONBase64Format = {
  name: "base64";
};

const base64Regex = /^(?:[A-Za-z\d+/]{4})*(?:[A-Za-z\d+/]{3}=|[A-Za-z\d+/]{2}==)?$/;

export function inferBase64(value: string): JSONBase64Format | undefined {
  if (base64Regex.exec(value)) {
    return { name: "base64" };
  }

  return undefined;
}
