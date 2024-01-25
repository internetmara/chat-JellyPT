import { useState, useEffect } from 'react';

const App = () => {
  const [message, setMessage] = useState(null)
  const [question, setQuestion] = useState(null)
  const [histories, setHistories] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  const [loading, setLoading] = useState(false)

  const createNewChat = () => {
    setMessage(null)
    setQuestion("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: question
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/completions', options)
      setLoading(false)
      const data = await response.json()
      console.log(data)
      setMessage(data.choices[0].message)
    } catch (err) {
      console.error(err)
    }
  }

//submit on enter
  useEffect(() => {
    const input = document.getElementById("question")
    input.addEventListener("keyup", function(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("submit").click();
      }
    })
  }, [])

  useEffect(() => {
    console.log(currentTitle, question, message)
    if (!currentTitle && question && message) {
      setCurrentTitle(question)
    } 
    if (currentTitle && question && message) {
      setHistories(history => (
        [...history, 
          {
            title: currentTitle,
            role: "user",
            content: question
          }, {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }}
  , [message,  currentTitle])

  console.log(histories)

  const currentChat = histories.filter(history => history.title === currentTitle)
  const uniqueTitles = Array.from(new Set(histories.map((history) => history.title)))
  console.log(uniqueTitles)

  return (
    <div className="app">
      <section className="sidebar">
        <button className="new-chat" onClick={createNewChat}>New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
          ))}
        </ul>
        <nav>
          <p>A Very Finkel™ Production</p>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && 
          <div className="intro">
            <h1>Chat Jelly-PT</h1>
            <img src="jelly.png" alt="jelly" />
            <p>Ask me anything!</p>
          </div>
        }
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => (
            <li key={index}>
              <p className="role">{chatMessage.role}</p>
              <p>{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input id="question" value={question} onChange={(e) => setQuestion(e.target.value)}></input>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <div id="loading">{loading ? "Loading..." : ""}</div>
        </div>
        <p className="info">Chat Jelly-PT may produce inaccurate information about people, places, or facts. This is because the
          AI was modeled on the brain of a shih tzu.</p>
        </section>
    </div>
  );
}

export default App;
