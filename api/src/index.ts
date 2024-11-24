import cors from 'cors'
import express, { Request, Response } from 'express'
import morgan from 'morgan'
import { calculateTreeLayout } from './calculateTreeLayout'

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get("/", (_req: Request, res: Response) => {
  res.send('Welcome!')
})

app.post("/api/visualize", (req: Request, res: Response) => {
  const json = req.body

  try {
    const { newNodes, newEdges } = calculateTreeLayout(json)

    res.json({
      newNodes,
      newEdges
    })
  } catch (error) {
    console.error(`[ERROR]: ${error}`)

    res.status(500).json({
      message: 'Failed to process JSON'
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})