import fs from 'fs'
import path from 'path'

const envFilename = process.env.NODE_ENV === 'test' ? '.env.test' : '.env'

const candidatePaths = [
  path.resolve(process.cwd(), envFilename),
  path.resolve(__dirname, `../../../${envFilename}`),
]

for (const candidatePath of candidatePaths) {
  if (fs.existsSync(candidatePath)) {
    process.loadEnvFile(candidatePath)
    break
  }
}
