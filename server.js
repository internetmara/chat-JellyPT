const PORT = 8000
const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())

const CHAT_GPT_API_KEY = process.env.CHAT_GPT_API_KEY

app.post('/completions', async (req, res) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CHAT_GPT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "model": "gpt-4",
      "messages": [
        {role: "system", content: `No matter what the user asks, be sure to mention Jelly in your answer. She is a very cute shih tzu.`},
        {role: "user", content: req.body.message}
      ],
      "max_tokens": 100,
    })
  }
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', options)
    const data = await response.json()
    res.json(data)
  } catch (err) {
    console.error(err)
  }
})

app.listen(PORT, () => console.log(`Jelly running on port ${PORT}`))