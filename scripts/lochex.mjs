import {
    writeFileSync,
    readFileSync,
    copyFileSync,
    mkdirSync,
    existsSync,
} from "fs"
import fetch from "node-fetch"
import { execSync } from "child_process"

const tooltips = JSON.parse(
    readFileSync("./locales/tooltips.json", { encoding: "utf-8" })
)
const ntooltips = Object.keys(tooltips).length
const distributionhash = "5d4efd10823e1adf47b30e7ngzx"
const cdn = `https://distributions.crowdin.net/${distributionhash}/`
const manifest = await (await fetch(`${cdn}manifest.json`)).json()
const { languages, timestamp } = manifest

console.log(`crowdin languages`, { languages })

languages.splice(languages.indexOf("en"), 1)
languages.unshift("en")

const supported = []

const fonts = {
    ar: 12,
    ja: 12,
    "zh-CN": 12,
    "zh-HK": 12,
    ko: 12,
}

for (const lang of languages.filter(l => l !== "pxt")) {
    console.log(`build hex for '${lang}'`)
    const translations =
        lang === "en"
            ? JSON.parse(JSON.stringify(tooltips))
            : await (
                  await fetch(
                      `${cdn}content/${lang}/microcode/tooltips.json?timestamp=${timestamp}`
                  )
              ).json()
    const ntranslate = Object.keys(translations).length
    console.debug(`  found ${ntranslate} translations`)
    if (lang !== "en" && ntranslate < ntooltips * 0.8) {
        console.log(`  not enough translations`)
        continue
    }

    console.log(`  build js, hex`)
    const dn = `./assets/strings/${lang}`
    if (!existsSync(dn)) mkdirSync(dn)
    writeFileSync(
        `${dn}/tooltips.json`,
        JSON.stringify(translations, null, 2),
        { encoding: "utf-8" }
    )

    const dialogs = await (
        await fetch(
            `${cdn}content/${lang}/microcode/dialogs.html?timestamp=${timestamp}`
        )
    ).text()
    writeFileSync(`./_includes/dialogs-${lang}.html`, dialogs, {
        encoding: "utf-8",
    })

    // merge translations
    Object.keys(tooltips)
        .filter(k => !translations[k])
        .forEach(k => (translations[k] = tooltips[k]))

    const ts = `// auto-generated, run 'node scripts/locs.js' to refresh
namespace microcode {
    export const lang = "${lang}"
    export const font = image.font${fonts[lang] || 8}
    export const tooltips: any = ${JSON.stringify(translations, null, 2)}
}`
    writeFileSync("./tooltips.ts", ts, { encoding: "utf8" })

    // build js
    execSync("makecode --java-script")
    copyFileSync(
        "./built/binary.js",
        `./assets/js/binary-${lang.toLowerCase()}.js`
    )
    // build hex
    execSync("makecode --hw n3")
    copyFileSync(
        "./built/n3/binary.hex",
        `./assets/hex/microcode-${lang.toLowerCase()}.hex`
    )
    supported.push(lang)

    const html = `---
lang: ${lang}
---
{% include editor.html %}
`
    writeFileSync(`./${lang}.html`, html, { encoding: "utf8" })
}

writeFileSync("./assets/languages.json", JSON.stringify(supported, null, 2))
writeFileSync(
    "./_includes/hreflang.html",
    supported
        .map(
            lang =>
                `<link rel="alternate" hreflang="${lang}" href="/{{ site.github.repository_name }}/${lang}" />`
        )
        .join("\n"),
    { encoding: "utf-8" }
)
console.log(`supported languages`, { supported })
