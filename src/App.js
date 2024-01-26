import { useState, useEffect } from 'react';

const App = () => {
  const [message, setMessage] = useState(null)
  const [value, setValue] = useState(null)
  const [previousChats, setPreviousChats] = useState([])
  const [currentTitle, setCurrentTitle] = useState(null)
  const [loading, setLoading] = useState(false)

  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setCurrentTitle(null)
  }

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value
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
      setMessage(data.choices[0].message)
    } catch (err) {
      console.error(err)
    }
  }

// //submit on enter
//   useEffect(() => {
//     const input = document.getElementById("question")
//     input.addEventListener("keyup", function(event) {
//       if (event.keyCode === 13) {
//         event.preventDefault();
//         document.getElementById("submit").click();
//       }
//     })
//   }, [])

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    } 
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "user",
            content: value
          }, {
            title: currentTitle,
            role: message.role,
            content: message.content
          }
        ]
      ))
    }}
  , [message,  currentTitle])

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map((previousChat) => previousChat.title)))

  return (
    <div className="app">
      <section className="sidebar">
        <button className="new-chat" onClick={createNewChat}>+  New Chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => (
            <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
          ))}
        </ul>
        <nav>
          <a href="https://internetmara.github.io/" target="_blank" rel="noreferrer">
            <p>A Very Finkel™ Production</p>
          </a>
        </nav>
      </section>

      <section className="main">
        {!currentTitle && 
          <div className="intro">
            <h1>Chat Jelly-PT</h1>
            <a href="https://github.com/internetmara/chat-JellyPT" target="_blank" rel="noreferrer">
              <img src="jelly.png" className="jelly" alt="jelly" />
            </a>
          </div>
        }
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => {
            const role = chatMessage.role
            const content = chatMessage.content
            return (
              <li key={index}>
                <p className="role">{role + ":"}</p>
                <p className="response">{content}</p>
              </li>
            )
          })}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input id="question" value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}><i class="fa-solid fa-arrow-up"></i></div>
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
