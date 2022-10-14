import { writeFileSync, readFileSync, readdirSync } from "fs"
import { join } from "path"

const enTooltips = JSON.parse(
    readFileSync("./locales/tooltips.json", { encoding: "utf-8" })
)

const writeLoc = lang => {
    console.log(lang)
    const fp = join(...[".", "locales", lang, "tooltips.json"].filter(s => !!s))
    const op = `./tooltips${lang ? `.${lang}` : ""}.ts`
    console.log(`convert ${fp} -> ${op}`)
    const tooltips = JSON.parse(readFileSync(fp, { encoding: "utf-8" }))
    // merge
    Object.keys(enTooltips)
        .filter(k => !tooltips[k])
        .forEach(k => (tooltips[k] = enTooltips[k]))

    const ts = `// auto-generated, run 'node scripts/locs.js' to refresh
namespace microcode {
    export const tooltips: any = ${JSON.stringify(tooltips, null, 2)}
}`
    writeFileSync(op, ts, { encoding: "utf8" })
}

const files = readdirSync("./locales", { withFileTypes: true }).filter(f =>
    f.isDirectory()
)

writeLoc("")
//for (const file of files) {
  //  const stat = writeLoc(file.name)
//}
