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

  // on pressing enter submit the input
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      getMessages()
    }
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

  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value)
    } 
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats,
          {
            title: currentTitle,
            role: "User",
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

  // pin the chat to the bottom
  useEffect(() => {
    const feed = document.querySelector(".feed")
    feed.scrollTop = feed.scrollHeight
  }, [currentChat])

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
        <h1>Chat-JellyPT</h1>
        {!currentTitle && 
          <div className="intro">
            <a href="https://github.com/internetmara/chat-JellyPT" target="_blank" rel="noreferrer">
              <img src="jelly.png" className="jelly" alt="jelly" />
              </a>
              <p>How can Jelly help you today?</p>
          </div>
        }
        <ul className="feed">
          {currentChat?.map((chatMessage, index) => {
            const role = chatMessage.role === "User" ? "You" : "Chat-JellyPT"
            const content = chatMessage.content
            return (
              <li key={index}>
                <div className="role-container">
                  <img className="avatar" src={chatMessage.role === "User" ? "user.png" : "jelly.png"} alt={chatMessage.role} />
                  <p className="role">{role + ":"}</p>
                </div>
                <p className={role !== "User" ? "response" : ""}>{content}</p>
              </li> 
            )
          })}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input id="question" value={value} onKeyDown={handleKeyDown} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}><i class="fa-solid fa-arrow-up"></i></div>
          </div>
          <div id="loading">{loading ? "Loading..." : ""}</div>
        </div>
        <p className="info">Chat-JellyPT may produce inaccurate information about people, places, or facts. This is because the
          AI was modeled on the brain of a shih tzu.</p>
        </section>
    </div>
  );
}

export default App;
