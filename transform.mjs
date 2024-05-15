import { promisify } from 'util'
import * as path from 'path'
import * as fs from 'fs'


(async function main() {
  const readFile = promisify(fs.readFile)
  const data = await readFile(path.join(import.meta.dirname, 'BIAU1.TXT'))
  const decoder = new TextDecoder('big5')
  const content = decoder.decode(data)
  const stream = fs.createWriteStream(path.join(import.meta.dirname, 'result.csv'))
  const re = /^.*?║\s*?(\d+)\s*?│\s*?(.?)\s*?│\s*?(.+?)\s*?│\s*?(\d+)\s*?║\s*?(\d+)\s*?│\s*?(\d+)\s*?│\s*?(\d+(?:\.\d+))\s*?║/
  stream.write([
    '字頻序號',
    '字',
    '部首',
    '筆畫',
    '出現頻次',
    '累積頻次',
    '累積百分比',
  ].join(',') + '\n')
  content.split('\n').forEach(line => {
    const match = re.exec(line)
    if (match) {
      stream.write(match.slice(1).join(',') + '\n')
    }
  })
  stream.end()
}()).catch(err => {
  console.error(err)
  process.exit(1)
})