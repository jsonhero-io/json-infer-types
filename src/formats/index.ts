// This is the order the formats will be run in
import { inferDatetime, JSONDateTimeFormat } from "./datetime";
import { inferTimestamp, JSONTimestampFormat } from "./timestamp";
import { inferEmail, JSONEmailFormat } from "./email";
import { inferCurrency, JSONCurrencyFormat } from "./currency";
import { inferCountry, JSONCountryFormat } from "./country";
import { inferTld, JSONTLDFormat } from "./tld";
import { inferIpAddress, JSONIPAddressFormat } from "./ipAddress";
import { inferLanguage, JSONLanguageFormat } from "./language";
import { inferPhoneNumber, JSONPhoneNumberFormat } from "./phoneNumber";
import { inferUri, JSONURIFormat } from "./uri";
import { inferUuid, JSONUUIDFormat } from "./uuid";
import { inferFilesize, JSONFilesizeFormat } from "./filesize";
import { inferHostname, JSONHostnameFormat } from "./hostname";
import { inferJson, JSONJSONFormat } from "./json";
import { inferJsonPointer, JSONJSONPointerFormat } from "./jsonPointer";
import { inferEmoji, JSONEmojiFormat } from "./emoji";
import { inferSemver, JSONSemverFormat } from "./semver";
import { inferFirestoreTimestamp, JSONFirestoreTimestampFormat } from "./firestoreTimestamp";
import { inferJWT, JSONJWTStringFormat } from "./jwt";
import { inferColor, JSONColorFormat } from "./color";
import { inferCreditCard, JSONCreditCardFormat } from "./creditCard";
import { inferBase64, JSONBase64Format } from "./base64";

export {
  JSONHostnameFormat,
  JSONUUIDFormat,
  JSONURIFormat,
  JSONPhoneNumberFormat,
  JSONLanguageFormat,
  JSONIPAddressFormat,
  JSONTLDFormat,
  JSONCountryFormat,
  JSONCurrencyFormat,
  JSONEmailFormat,
  JSONTimestampFormat,
  JSONDateTimeFormat,
  JSONFilesizeFormat,
  JSONJSONFormat,
  JSONJSONPointerFormat,
  JSONEmojiFormat,
  JSONSemverFormat,
  JSONJWTStringFormat,
  JSONColorFormat,
};

export type JSONStringFormat =
  | JSONHostnameFormat
  | JSONUUIDFormat
  | JSONURIFormat
  | JSONPhoneNumberFormat
  | JSONLanguageFormat
  | JSONIPAddressFormat
  | JSONTLDFormat
  | JSONCountryFormat
  | JSONCurrencyFormat
  | JSONEmailFormat
  | JSONTimestampFormat
  | JSONDateTimeFormat
  | JSONFilesizeFormat
  | JSONJSONFormat
  | JSONJSONPointerFormat
  | JSONEmojiFormat
  | JSONSemverFormat
  | JSONJWTStringFormat
  | JSONColorFormat
  | JSONCreditCardFormat
  | JSONBase64Format;

const formats = [
  inferUri,
  inferTld,
  inferHostname,
  inferEmail,
  inferDatetime,
  inferIpAddress,
  inferPhoneNumber,
  inferCurrency,
  inferCountry,
  inferLanguage,
  inferUuid,
  inferFilesize,
  inferTimestamp,
  inferJson,
  inferJsonPointer,
  inferEmoji,
  inferSemver,
  inferJWT,
  inferColor,
  inferCreditCard,
  inferBase64,
];

export function inferFormat(value: string): JSONStringFormat | undefined {
  if (value.trim() === "") {
    return undefined;
  }

  for (const [, format] of Object.entries(formats)) {
    const result = format(value);

    if (result) {
      return result;
    }
  }

  return undefined;
}

export type JSONObjectFormat = JSONFirestoreTimestampFormat;

const objectFormats = [inferFirestoreTimestamp];

export function inferObjectFormat(value: object): JSONObjectFormat | undefined {
  for (const [, format] of Object.entries(objectFormats)) {
    const result = format(value);

    if (result) {
      return result;
    }
  }

  return undefined;
}
