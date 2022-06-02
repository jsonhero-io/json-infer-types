import { inferType } from "../src";

describe("rfc3339", () => {
  test.each([
    "2019-01-01T00:00:00.000Z",
    "2019-01-01 00:00:00.000Z",
    "2019-10-12T14:20:50.52+07:00",
    "2019-10-12 14:20:50.52-12:00",
    "2016-05-25T09:08:34.123",
    "1983-10-14T13:30Z",
    "2016-05-25T09",
    "2016-05-25T09:24",
    "2016-05-25T09:24:15",
    "2016-05-25T09:24:15,123",
    "2016-05-25T09:24:15.1239999",
    "2016-W21-3T09:24:15.123Z", // Accepts ISO week date
    "2016-200T09:24:15.123", // Accepts ordinal date
  ])("%p should be inferred as an rfc3339 datetime", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "datetime",
        parts: "datetime",
        variant: "rfc3339",
      },
    });
  });

  test.each([
    "2007-12-03T10:15:30+01:00[Europe/Paris]",
    "2016-05-25T09:08:34.123[America/North_Dakota/Beulah]",
    "2016-W21-3T09:24:15.123Z[America/Phoenix]",
    "1983-10-14T13:30Z[Europe/Isle_of_Man]",
    "2022-02-28T11:06:00.092121729+08:00[Asia/Shanghai]",
  ])("%p should be inferred as an rfc3339 datetime with timezone extension", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "datetime",
        parts: "datetime",
        variant: "rfc3339",
        extensions: ["timezone"],
      },
    });
  });

  test.each([
    "2007-12-03T10:15:30+01:00[Europe/Paris][u-ca=hebrew]",
    "2016-05-25T09:08:34.123[America/North_Dakota/Beulah][u-ca=iso8601]",
    "2016-W21-3T09:24:15.123Z[America/Phoenix][u-ca=buddhist]",
    "1983-10-14T13:30Z[Europe/Isle_of_Man][u-ca=japanese]",
  ])(
    "%p should be inferred as an rfc3339 datetime with timezone and calendar extension",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "datetime",
          parts: "datetime",
          variant: "rfc3339",
          extensions: ["timezone", "calendar"],
        },
      });
    },
  );

  test.each(["2016-05", "2016-05-25", "+002016-05-25", "2016-W21", "2016-W21-3", "2016-200"])(
    "%p should be inferred as an rfc3339 date",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "datetime",
          parts: "date",
          variant: "rfc3339",
        },
      });
    },
  );

  test.each([
    "2016-05[Europe/Paris][u-ca=hebrew]",
    "2016-05-25[Europe/Isle_of_Man][u-ca=japanese]",
    "+002016-05-25[America/Phoenix][u-ca=buddhist]",
    "2016-W21[America/Phoenix][u-ca=buddhist]",
    "2016-W21-3[America/Phoenix][u-ca=buddhist]",
    "2016-200[America/Phoenix][u-ca=buddhist]",
  ])("%p should be inferred as an rfc3339 date with timezone and calendar extensions", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "datetime",
        parts: "date",
        variant: "rfc3339",
        extensions: ["timezone", "calendar"],
      },
    });
  });

  test.each(["09:24:15.123Z", "09:24:15", "09:24"])(
    "%p should be inferred as an rfc3339 time",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "datetime",
          parts: "time",
          variant: "rfc3339",
        },
      });
    },
  );

  test.each([
    "09:24:15.123Z[Europe/Isle_of_Man][u-ca=japanese]",
    "09:24:15[America/Phoenix][u-ca=buddhist]",
    "09:24[Europe/Paris][u-ca=hebrew]",
  ])("%p should be inferred as an rfc3339 time with timezone and calendar extensions", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "datetime",
        parts: "time",
        variant: "rfc3339",
        extensions: ["timezone", "calendar"],
      },
    });
  });
});

describe("rfc2822", () => {
  test.each([
    "Tue, 01 Nov 2016 13:23:12 +0630",
    "Sun, 12 Apr 2015 05:06:07 GMT",
    "Tue, 01 Nov 2016 01:23:45 +0000",
    "Tue, 01 Nov 16 04:23:45 Z",
    "01 Nov 2016 05:23:45 z",
    "Mon, 02 Jan 2017 06:00:00 -0800",
    "Mon, 02 Jan 2017 06:00:00 +0800",
    "Mon, 02 Jan 2017 06:00:00 +0330",
    "Mon, 02 Jan 2017 06:00:00 -0330",
    "Mon, 02 Jan 2017 06:00:00 PST",
    "Mon, 02 Jan 2017 06:00:00 PDT",
  ])("%p should be inferred as an rfc2822 datetime", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "datetime",
        parts: "datetime",
        variant: "rfc2822",
      },
    });
  });
});

describe("timestamps", () => {
  test.each(["1596597629980", "1640273437757"])(
    "%p should be inferred as an timestamp",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "timestamp",
          variant: "millisecondsSinceEpoch",
        },
      });
    },
  );

  test.each(["1640273389", "1608737603"])("%p should be inferred as an timestamp", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "timestamp",
        variant: "secondsSinceEpoch",
      },
    });
  });

  test.each(["1596597839946364285"])("%p should be inferred as an timestamp", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "timestamp",
        variant: "nanosecondsSinceEpoch",
      },
    });
  });
});

describe("email addresses", () => {
  test.each([
    "eallam@icloud.com",
    "example+suffix@example.com",
    "example@127.0.0.1",
    "test.email.with+symbol@example.com",
    "id-with-dash@example.com",
    "id-with-dash@example.co.uk",
    "foo@example.accountants",
  ])("%p should be inferred as an email", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "email",
        variant: "rfc5321",
      },
    });
  });

  test.each([
    "Example Name <example@example.com>",
    "John <johndoe@example.com>",
    "Example S. Name <example.s.name@example.com>",
  ])("%p should be inferred as an email", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "email",
        variant: "rfc5322",
      },
    });
  });
});

describe("currencies", () => {
  test.each(["USD", "XPF", "BTC", "usd", "eur", "btc"])(
    "%p should be inferred as a currency code",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "currency",
          variant: "iso4217",
        },
      });
    },
  );

  test.each(["LTC", "ETH", "XRP"])("%p should be inferred as a crypto currency", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "currency",
        variant: "crypto",
      },
    });
  });

  test.each(["Euro", "United States dollar", "US Dollar"])(
    "%p should be inferred as a currency in english",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "currency",
          variant: "english",
        },
      });
    },
  );

  test.each(["$", "£", "€", "¥"])("%p should be inferred as a currency symbol", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "currency",
        variant: "symbol",
      },
    });
  });
});

describe("country", () => {
  test.each(["USA", "UZB", "SGP", "NFK", "MMR", "KEN", "FJI"])(
    "%p should be inferred as a iso3166-3 country code",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "country",
          variant: "iso3166-3",
        },
      });
    },
  );

  test.each(["US", "GB", "JP", "NZ", "SV", "DE", "IE"])(
    "%p should be inferred as a iso3166-2 country code",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "country",
          variant: "iso3166-2",
        },
      });
    },
  );
});

describe("tlds", () => {
  test.each([
    ".com",
    ".co.uk",
    ".biz",
    ".com.mx",
    ".org.au",
    ".cf",
    ".nz.basketball",
    ".accountants",
    ".immobilien",
  ])("%p should be inferred as a tld", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "tld",
      },
    });
  });
});

describe("ip address", () => {
  test.each(["192.168.0.1", "172.16.0.0"])("%p should be inferred as an ipv4 address", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "ip",
        variant: "v4",
      },
    });
  });

  test.each(["2001:db8:1234::1", "2001:0:ce49:7601:e866:efff:62c3:fffe"])(
    "%p should be inferred as an ipv6 address",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "ip",
          variant: "v6",
        },
      });
    },
  );
});

describe("language", () => {
  test.each(["en", "ab", "aa", "es"])(
    "%p should be inferred as a language iso693-1 code",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "language",
          variant: "iso693-1",
        },
      });
    },
  );

  test.each(["eng", "eus", "ind", "zul"])(
    "%p should be inferred as a language iso693-2 code",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "language",
          variant: "iso693-2",
        },
      });
    },
  );

  test.each(["Arabic", "Welsh", "Russian", "Swahili"])(
    "%p should be inferred as a language in english",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "language",
          variant: "english",
        },
      });
    },
  );

  test.each(["eesti, eesti keel", "Afaan Oromoo", "dansk", "Español"])(
    "%p should be inferred as a native language",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "language",
          variant: "native",
        },
      });
    },
  );
});

describe("phone numbers", () => {
  test.each([
    "+1 684-633-5115",
    "+49 30 83050",
    "+355 4 224 7285",
    "+1 323-867-5309",
    "+1 (684) 633-5115",
  ])("%p should be inferred as an internation phone number", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "phoneNumber",
        variant: "e.164",
      },
    });
  });
});

describe("uris", () => {
  test.each([
    "https://www.example.com/foo#bar",
    "file://host/path",
    "https://goole.com?hello=world",
    "ipfs://bafybeihzwwtl65z6ftqf5avmg3iv45umxm4hyz6wty4l4pd5eplnz256xa",
  ])("%p should be inferred as a rfc3986 URI", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "uri",
      },
    });
  });

  test("It should correctly infer the contentType of the uri", () => {
    expect(inferType("https://www.example.com/foo.json")).toEqual({
      name: "string",
      value: "https://www.example.com/foo.json",
      format: {
        name: "uri",
        contentType: "application/json",
      },
    });

    expect(inferType("https://www.example.com/foo.md")).toEqual({
      name: "string",
      value: "https://www.example.com/foo.md",
      format: {
        name: "uri",
        contentType: "text/markdown",
      },
    });

    expect(inferType("https://www.example.com/foo.jpg")).toEqual({
      name: "string",
      value: "https://www.example.com/foo.jpg",
      format: {
        name: "uri",
        contentType: "image/jpeg",
      },
    });

    expect(inferType("https://www.example.com/foo.png")).toEqual({
      name: "string",
      value: "https://www.example.com/foo.png",
      format: {
        name: "uri",
        contentType: "image/png",
      },
    });

    expect(
      inferType("ipfs://bafybeihzwwtl65z6ftqf5avmg3iv45umxm4hyz6wty4l4pd5eplnz256xa/500.png"),
    ).toEqual({
      name: "string",
      value: "ipfs://bafybeihzwwtl65z6ftqf5avmg3iv45umxm4hyz6wty4l4pd5eplnz256xa/500.png",
      format: {
        name: "uri",
        contentType: "image/png",
      },
    });
  });
});

describe("uuids", () => {
  test.each(["4677658f-8865-47db-afb0-908e25246348"])(
    "%p should be inferred as a v4 uuid",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "uuid",
          variant: "v4",
        },
      });
    },
  );

  test.each(["cfa649f0-650b-11ec-acb3-03462fc79f5d"])(
    "%p should be inferred as a v1 uuid",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "uuid",
          variant: "v1",
        },
      });
    },
  );

  test.each(["bde4a7b9-5793-5a1f-b378-211205b15898"])(
    "%p should be inferred as a v5 uuid",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "uuid",
          variant: "v5",
        },
      });
    },
  );
});

describe("hostnames", () => {
  test.each(["localhost", "example.com", "foo.example.com", "exa-mple.co.uk", "example.com."])(
    "%p should be inferred as a rfc1123 hostname",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "hostname",
          variant: "rfc1123",
        },
      });
    },
  );

  test.each(["exa_mple.com"])("%p should be inferred as a rfc5890 hostname", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "hostname",
        variant: "rfc5890",
      },
    });
  });

  test.each([`${"example".repeat(36)}.com`, "Screen_Shot_2021-08-16_at_11_12_27_AM.png"])(
    "%p should NOT be inferred as a hostname",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
      });
    },
  );
});

describe("file sizes", () => {
  test.each(["544B", "1.0MB", "377K", "1.87GB", "8MiB", "1 KB", "25kB"])(
    "%p should be inferred as a file size",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "filesize",
          variant: "human",
        },
      });
    },
  );
});

describe("json", () => {
  test.each(['{ "foo": 1 }', '{"name":"string","format":{"name":"filesize","variant":"human"}}'])(
    "%p should be inferred as a json string",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "json",
          variant: "ecma262",
        },
      });
    },
  );

  test.each(["{ foo: 1, }", `{name:'string',format:{name: 0xdecaf, variant:.8675309}}`])(
    "%p should be inferred as a json string",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "json",
          variant: "json5",
        },
      });
    },
  );
});

describe("jsonPointer", () => {
  test.each(["/foo/bar~0/baz~1/%a", "/foo//bar", "/foo/bar/", "/foo/0", "/foo/-/bar"])(
    "%p should be inferred as an absolute jsonPointer",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "jsonPointer",
          variant: "rfc6901",
        },
      });
    },
  );
});

describe("emoji", () => {
  test.each(["😄", "🤪"])("%p should be inferred as an emoji", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "emoji",
      },
    });
  });

  test.each(["Hello 😄", "👩‍👩‍👧‍👧 Lots of people"])("%p should NOT be inferred as an emoji", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
    });
  });
});

describe("semver", () => {
  test.each(["1.2.3", "1.11.0", "0.0.1", "1.0.0-alpha.1", "1.0.0+20130313144700"])(
    "%p should be inferred as a semver",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "semver",
        },
      });
    },
  );
});

describe("jwt", () => {
  test.each([
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.sruoLZNJ59anK67z25t80L62OXDerSiAhWerW-usZLQ",
  ])("%p should be inferred as a JWT", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "jwt",
      },
    });
  });
});

describe("colors", () => {
  test.each(["#D47DB9", "#14C3FF", "#ff9933", "#fff"])(
    "%p should be inferred as a color hex",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "color",
          variant: "hex",
        },
      });
    },
  );

  test.each([
    "rgb(255, 255, 255)",
    "rgb(255, 255, 255,.5)",
    "rgba(255, 255, 255,.5)",
    "rgb(255 255 255)",
    "rgb(255 255 255 / .5)",
  ])("%p should be inferred as a color rgb", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "color",
        variant: "rgb",
      },
    });
  });

  test.each([
    "hsl(100, 100%, 50%)",
    "hsl(235, 100%, 50%, .5)",
    "hsl(235 100% 50%)",
    "hsl(235 100% 50% / .5)",
  ])("%p should be inferred as a color rgb", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "color",
        variant: "hsl",
      },
    });
  });
});

describe("credit cards", () => {
  test.each([
    "4916986744094249",
    "4556355098906363",
    "4929712410821052",
    "4485428259658366",
    "4485 4282 5965 8366",
  ])("%p should be inferred as a visa card", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "creditcard",
        variant: "visa",
      },
    });
  });

  test.each(["375092442988287", "346135683645540", "343285261458387", "371163810364163"])(
    "%p should be inferred as an amex card",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "creditcard",
          variant: "amex",
        },
      });
    },
  );

  test.each(["6011150635208157", "6011640556085105", "6011938437037885", "6011145666460750"])(
    "%p should be inferred as a discover card",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "creditcard",
          variant: "discover",
        },
      });
    },
  );

  test.each(["5291160983813402", "5277689457510316", "5308066989503486", "5573850948088160"])(
    "%p should be inferred as a mastercard card",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "creditcard",
          variant: "mastercard",
        },
      });
    },
  );

  test.each(["38223928053796", "30054894306803", "36059360259778", "30348465263843"])(
    "%p should be inferred as a Diners Club card",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
        format: {
          name: "creditcard",
          variant: "dinersclub",
        },
      });
    },
  );
});

describe("mac", () => {
  test.each([
    "38:EE:4A:47:3A:36",
    "ad:af:bd:71:12:87",
  ])("%p should be infered as being a MAC address", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "mac",
        variant: "EUI-48",
        splitter: ":"
      },
    });
  });

  test.each([
    "38-EE-4A-47-3A-36",
    "ad-af-bd-71-12-87",
  ])("%p should be infered as being a MAC address", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "mac",
        variant: "EUI-48",
        splitter: "-"
      },
    });
  });

  test.each([
    "38.EE.4A.47.3A.36",
    "ad.af.bd.71.12.87",
  ])("%p should be infered as being a MAC address", (value) => {
    expect(inferType(value)).toEqual({
      name: "string",
      value,
      format: {
        name: "mac",
        variant: "EUI-48",
        splitter: "."
      },
    });
  });
});


describe("without format", () => {
  test.each(["46", "2244994945", "1212092628029698048"])(
    "%p should be inferred as having no format",
    (value) => {
      expect(inferType(value)).toEqual({
        name: "string",
        value,
      });
    },
  );
});
