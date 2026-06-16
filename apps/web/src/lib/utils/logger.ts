export const loggerLevels = {
  LOG: 0,
  WARN: 1,
  ERROR: 2,
  DEBUG: 3,
} as const

// `%c %cBK%c${group}%c  %c${path}%c  %c${etc}`,
const getTemplate = (group: string, path: string, msg: string) => [
  `%c %c${group}%c %c${path}%c ${msg}`,
  'padding-left: 28px; line-height: 30px; background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDIwMDEwOTA0Ly9FTiIKICJodHRwOi8vd3d3LnczLm9yZy9UUi8yMDAxL1JFQy1TVkctMjAwMTA5MDQvRFREL3N2ZzEwLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiB3aWR0aD0iMTAwMC4wMDAwMDBwdCIgaGVpZ2h0PSIxMDAwLjAwMDAwMHB0IiB2aWV3Qm94PSIwIDAgMTAwMC4wMDAwMDAgMTAwMC4wMDAwMDAiCiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCBtZWV0Ij4KPG1ldGFkYXRhPgpDcmVhdGVkIGJ5IHBvdHJhY2UgMS4xNCwgd3JpdHRlbiBieSBQZXRlciBTZWxpbmdlciAyMDAxLTIwMTcKPC9tZXRhZGF0YT4KPGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsMTAwMC4wMDAwMDApIHNjYWxlKDAuMTAwMDAwLC0wLjEwMDAwMCkiCmZpbGw9IiMwMDAwMDAiIHN0cm9rZT0ibm9uZSI+CjxwYXRoIGQ9Ik00Njg5IDk5ODkgYy0xODY4IC0xMTIgLTM1MzEgLTEyODEgLTQyNzcgLTMwMDQgLTQyMCAtOTcwIC01MjEKLTIwNTYgLTI4NyAtMzA5MSAyOTAgLTEyODEgMTA3NiAtMjM5NyAyMTkwIC0zMTEwIDE0ODkgLTk1MyAzMzk0IC0xMDQxIDQ5NzAKLTIzMCA0NzcgMjQ2IDg1NCA1MjMgMTI0NiA5MTUgMjA1IDIwNSAzMjggMzQ2IDQ3MSA1MzYgODg5IDExODUgMTIwNiAyNzIyCjg1NyA0MTY1IC0xODMgNzU5IC01MjIgMTQzMiAtMTAzMCAyMDQ1IC0xMTQgMTM4IC00ODAgNTAyIC02MTkgNjE3IC0xMDA3IDgzMgotMjIzMyAxMjM1IC0zNTIxIDExNTd6IG00MTUgLTIxMTggYzEwMyAtNDkgMTk3IC05MSAyMDEgLTkxIDUgMCAxMjQgLTU1IDI5MAotMTM1IDU3MiAtMjc0IDE0NDIgLTcwOSAxODA1IC05MDMgNDEgLTIyIDEwMCAtNTMgMTMwIC02OSAzMCAtMTUgOTIgLTQ5IDEzOAotNzUgNDYgLTI3IDg1IC00OCA4NyAtNDggMiAwIDM0IC0xOSA3MCAtNDEgOTIgLTU4IDEyMCAtMTA3IDExOSAtMjA5IDAgLTEzMAotMjkgLTE2NCAtMjQyIC0yNzYgLTUxIC0yNyAtMTI1IC02NiAtMTY1IC04OCAtMTIzIC02NiAtODMzIC00MjkgLTEwNTcgLTU0MQotNDY4IC0yMzQgLTEwNTggLTUyMyAtMTIxNSAtNTk1IC0zOCAtMTggLTk1IC00NCAtMTI1IC01OCAtNjkgLTMzIC0xMzggLTM0Ci0yMDAgLTUgLTI1IDEyIC05NyA0NiAtMTYwIDc2IC02MyAzMCAtMTU1IDc0IC0yMDUgOTcgLTI1MCAxMTcgLTEzNTggNjY5Ci0xODYzIDkyOSAtMTIgNiAtMzAgMTUgLTQxIDIwIC0xMCA1IC01OCAzMSAtMTA3IDU3IC00OSAyNiAtMTMyIDY5IC0xODQgOTcKLTE0MiA3NCAtMjA2IDExNCAtMjM0IDE0OCAtMjMgMjcgLTI2IDQwIC0yNiAxMDIgMCAxMTUgNDYgMTg1IDE3OCAyNzQgMzEgMjEKNjYgNDMgNzcgNDkgMTEgNiAzNiAyMCA1NSAzMSAxNzggMTAwIDIzMiAxMjkgNzk1IDQyMCAxOTEgOTggNjA0IDMwNCAxMDc1CjUzNSAyNzUgMTM1IDM1NCAxNzMgNTA1IDI0MyAzOSAxNyA5MCA0MSAxMTUgNTMgNTggMjcgMTMxIDI4IDE4NCAzeiBtLTI2MTkKLTI2NTYgYzg4IC00MCAzMjEgLTE0OCA1MDkgLTIzOCA2MCAtMjkgNTQwIC0yNjcgMTA2OCAtNTI5IDUyNyAtMjYzIDk2NiAtNDc4Cjk3NiAtNDc4IDEyIDAgNjEzIDI5NiA3NjkgMzc5IDE2NCA4NyAxMzY1IDY4MSAxMzc3IDY4MSAyIDAgNDYgMjAgOTggNDQgNTEKMjQgMTI1IDU2IDE2MyA3MSAzOSAxNCA4NiAzMyAxMDUgNDEgMTAyIDQyIDIxOSA1NSAyNjggMzAgNzcgLTQwIDE0MCAtMTc0CjEyNSAtMjY5IC05IC02MCAtMTA0IC0xNTQgLTIzOCAtMjM0IC0xMSAtNyAtNDkgLTMwIC04NSAtNTEgLTY0IC0zOSAtMTQwIC04MAotMzU1IC0xOTMgLTQyNiAtMjI1IC0yMTMyIC0xMDU4IC0yMTY4IC0xMDU5IC03IDAgLTIxIC03IC0zMSAtMTUgLTMzIC0yNSAtNDMKLTIyIC0xODEgNDEgLTE1NiA3MSAtMjQyIDExMiAtNTU1IDI2NyAtNjUyIDMyMiAtNzYyIDM3NyAtMTI2NSA2MzcgLTg4IDQ1Ci0yMzkgMTIzIC0zMzUgMTcyIC05NiA1MCAtMjA0IDEwNiAtMjQwIDEyNiAtODYgNDggLTE3OCA5OCAtMjE1IDExNyAtNDggMjQKLTEwNyA2OCAtMTI3IDk2IC01NCA3MyAtNDkgMTg1IDEyIDI2NiAzOCA1MSAxMjIgMTE5IDE1NSAxMjcgNDAgOSAxMTEgLTMgMTcwCi0yOXogbS01OCAtMTMwMSBjNTMgLTIzIDg2IC0zNyAxNzggLTc5IDE2NSAtNzYgMTk2IC05MCA0MzAgLTIwNSAxMzIgLTY0IDMxNwotMTU0IDQxMCAtMjAwIDk0IC00NSA0ODUgLTIzOSA4NzEgLTQzMSAzODUgLTE5MiA3MDcgLTM0OSA3MTYgLTM0OSA4IDAgMTI1CjU0IDI1OSAxMjEgMTM0IDY3IDU3MyAyODQgOTc0IDQ4NCA3MjcgMzYxIDkzOSA0NjUgOTQ5IDQ2NSA2IDAgMTczIDc3IDIwOCA5NQoxNCA4IDMyIDE1IDM4IDE1IDcgMCA1MyAxNiAxMDEgMzUgNzcgMzAgMTAwIDM1IDE3NCAzNSBsODUgMCA0MCAtNDEgYzIyIC0yMwo0MCAtNDcgNDAgLTUzIDAgLTYgOSAtMjggMjAgLTQ5IDEzIC0yNSAyMCAtNTYgMjAgLTk1IDAgLTEwMyAtNTEgLTE1NSAtMjk1Ci0zMDAgLTEyNCAtNzMgLTE2OSAtOTggLTMyMCAtMTc4IC02NiAtMzQgLTE3MiAtOTAgLTIzNSAtMTIzIC0yMjUgLTExOCAtMTU4MAotNzkwIC0xNzYwIC04NzQgLTMwIC0xNCAtMTAwIC00NiAtMTU1IC03MiAtMTQ3IC02OSAtMTQ4IC02OSAtMzkwIDQ1IC0zMyAxNQotMTAwIDQ3IC0xNTAgNzAgLTkxIDQzIC0xMjE4IDYwMyAtMTMzMCA2NjEgLTg3IDQ1IC03NiAzOSAtMzE4IDE2MyAtMzM2IDE3MQotNTA5IDI2MyAtNzI1IDM4MyAtODIgNDYgLTEzOCAxMTQgLTE0NyAxODAgLTEyIDkxIDI2IDE4MSAxMDMgMjQzIDg2IDY5IDE0MQo4MyAyMDkgNTR6Ii8+CjxwYXRoIGQ9Ik00OTEwIDcyNTggYy0yMTYgLTEwMyAtOTE1IC00NDggLTEwOTUgLTU0MiAtNzEgLTM4IC0xOTEgLTEwMCAtMjY1Ci0xMzggLTc0IC0zOSAtMTM5IC03NCAtMTQ1IC03OCAtNSAtNCAtNDYgLTI3IC05MCAtNTAgLTkyIC00OSAtMjA1IC0xMjEgLTIzMAotMTQ2IC0xNCAtMTQgLTE0IC0xOSAtMyAtMzAgMTkgLTE5IDE5MyAtMTA4IDY4MyAtMzUzIDEwMTUgLTUwNiAxMjUxIC02MjEKMTI3MCAtNjIxIDExIDAgMTg0IDgyIDM4NSAxODEgMjAxIDEwMCA0MDQgMjAxIDQ1MiAyMjUgNDcgMjMgOTQgNDcgMTA1IDUyIDEwCjYgNTAgMjYgODggNDUgMTk0IDk3IDcyNSAzNjcgNzU2IDM4NSAyMSAxMSA2NCAzNSA5OCA1MiAzNCAxOCA2NCAzNiA2NyA0MiA5CjE0IC0yMyA0NSAtODQgODEgLTMwIDE4IC03MSA0MiAtOTEgNTQgLTIwIDExIC02MyAzNSAtOTYgNTMgLTMzIDE3IC04MCA0MwotMTA1IDU3IC05OSA1NiAtMTA5OCA1NTIgLTEzMDUgNjQ4IC01NCAyNSAtMTc5IDgxIC0yMTggOTggLTU0IDI0IC0xMDMgMjAKLTE3NyAtMTV6Ii8+CjwvZz4KPC9zdmc+Cg=="); background-size: 24px; background-repeat: no-repeat; background-position: 2px 2px',
  // "background: #666; border-radius:0.5em 0 0 0.5em; padding:0.2em 0em 0.1em 0.5em; color: white; font-weight: bold",
  "background: #666; border-radius:0.5em  0.5em; padding:0.2em 0.5em 0.1em 0.5em; color: white;",
  "",
  "background: #12061e; border-radius:0.5em; padding:0.2em 0.5em 0.1em 0.5em; color: white;",
  "",
]
// "background: #15889f; border-radius:0.5em; padding:0.2em 0.5em 0.1em 0.5em; color: white;",

type LoggerLevel = (typeof loggerLevels)[keyof typeof loggerLevels]

export class Logger {
  #logLevel: LoggerLevel

  constructor(data: { level?: LoggerLevel; prefix?: string } = {}) {
    const { level = loggerLevels.LOG } = data
    this.#logLevel = level
  }

  printf(level: keyof typeof loggerLevels, ...msgs: string[]) {
    const method = level.toLowerCase() as Lowercase<keyof typeof loggerLevels>
    const path = typeof window !== "undefined" ? window.location.pathname : "SERVER"

    // Allow passing objects to log
    const outputMsg = []
    for (const msg of msgs) {
      if (typeof msg === "object") {
        outputMsg.push(JSON.stringify(msg, null, 2))
      } else if (typeof msg === "string") {
        outputMsg.push(msg)
      }
    }

    const logTemplate = getTemplate(level, path, outputMsg.join(" "))
    // console[method](`> ${ level } [${ this.#prefix }]: ${ outputMsg.join(" ") } `)
    console[method === "debug" ? "log" : method](...logTemplate)
  }

  log(...msg: string[]) {
    if (this.#logLevel >= loggerLevels.LOG) {
      this.printf("LOG", ...msg)
    }
  }

  warn(...msg: string[]) {
    if (this.#logLevel >= loggerLevels.WARN) {
      this.printf("WARN", ...msg)
    }
  }

  error(...msg: string[]) {
    if (this.#logLevel >= loggerLevels.ERROR) {
      this.printf("ERROR", ...msg)
    }
  }

  debug(...msg: string[]) {
    if (this.#logLevel >= loggerLevels.DEBUG) {
      this.printf("DEBUG", ...msg)
    }
  }

  setLevel(level: (typeof loggerLevels)[keyof typeof loggerLevels]) {
    this.#logLevel = level
  }
}
