import { defineConfig } from "tsup"
import AutoImport from "unplugin-auto-import/esbuild"
import { copy } from "esbuild-plugin-copy"
import mnaddon from "./mnaddon.json"
import os from "os"
import path from "path"

const isProd = process.env.NODE_ENV === "production"

const bannerText = `/*
THIS IS A GENERATED/BUNDLED FILE BY ESBuild
if you want to view the source code, please visit the github repository
https://github.com/mnaddon/ohmymn
version: ${mnaddon.version} by ${mnaddon.author}
*/
`
const outDir = isProd
  ? "./dist"
  : os.homedir() +
    `/Library/Containers/QReader.MarginStudyMac/Data/Library/MarginNote Extensions/${mnaddon.addonid}`

export default defineConfig({
  entry: ["src/main.ts"],
  splitting: false,
  sourcemap: false,
  clean: isProd,
  outDir,
  minify: isProd,
  banner: {
    js: bannerText
  },
  platform: "browser",
  format: ["iife"],
  target: "esnext",
  pure: "JSB.log",
  // rename outfile
  onSuccess: `mv "${path.join(outDir, "main.global.js")}" "${path.join(
    outDir,
    "main.js"
  )}"`,
  esbuildPlugins: [
    AutoImport({
      imports: [
        {
          "utils/common": ["console"]
        }
      ],
      dts: false
    }),
    copy({
      resolveFrom: "cwd",
      verbose: false,
      once: true,
      assets: [
        ...["assets/logo.png", "mnaddon.json"].map(k => ({
          from: k,
          to: path.join(outDir, path.basename(k))
        })),
        {
          from: "assets/icon/**/*",
          to: path.join(outDir, "icon"),
          keepStructure: true
        }
      ]
    })
  ]
})
