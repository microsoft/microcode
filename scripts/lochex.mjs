import { writeFileSync, readFileSync, copyFileSync } from "fs"
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

languages.splice(languages.indexOf("en"), 1)
languages.unshift("en")
console.log({ languages, timestamp })
const supported = []

const fonts = {
    ar: 12,
    ja: 12,
}

for (const lang of languages.filter(l => l !== "pxt")) {
    console.log(`build hex for '${lang}'`)
    const translations = await (
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
    // merge translations
    Object.keys(tooltips)
        .filter(k => !translations[k])
        .forEach(k => (translations[k] = tooltips[k]))

    const ts = `// auto-generated, run 'node scripts/locs.js' to refresh
namespace microcode {
    export const lang = "${lang}"
    export const font = image.font${fonts[lang] || 5}
    export const tooltips: any = ${JSON.stringify(translations, null, 2)}
}`
    writeFileSync("./tooltips.ts", ts, { encoding: "utf8" })

    // build hex
    execSync("makecode --hw n3")
    copyFileSync(
        "./built/n3/binary.hex",
        `./assets/hex/microcode-${lang.toLowerCase()}.hex`
    )
    supported.push(lang)
}

writeFileSync("./assets/languages.json", JSON.stringify(supported, null, 2))
