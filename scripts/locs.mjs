import { writeFileSync, readFileSync } from "fs"
const tooltips = JSON.parse(
    readFileSync("./locales/tooltips.json", { encoding: "utf-8" })
)

const ts = `// auto-generated, run 'node scripts/locs.js' to refresh
namespace microcode {
    export const tooltips: any = ${JSON.stringify(tooltips, null, 2)}
}`
writeFileSync("./tooltips.ts", ts)
