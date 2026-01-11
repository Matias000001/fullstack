import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notificationType, setNotificationType] = useState(null)


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


const handleLogin = async event => {
  event.preventDefault()
  try {
    const user = await loginService.login({ username, password })

    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )
    blogService.setToken(user.token)
    setUser(user)

    const blogs = await blogService.getAll()
    setBlogs(blogs)

    setUsername('')
    setPassword('')
  } catch {
    setErrorMessage('wrong username or password')
    setNotificationType('error')
    setTimeout(() => {
    setErrorMessage(null)
    setNotificationType(null)
  }, 5000)
  }
}


  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
  }

  const addBlog = async (event) => {
    event.preventDefault()

    const newBlog = { title, author, url }
    const createdBlog = await blogService.create(newBlog)

    setBlogs(blogs.concat(createdBlog))
    setErrorMessage(`a new blog ${createdBlog.title} by ${createdBlog.author} added`)
    setNotificationType('success')
    setTimeout(() => {
      setErrorMessage(null)
      setNotificationType(null)
    }, 5000)
    setTitle('')
    setAuthor('')
    setUrl('')
  }



  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={errorMessage} type={notificationType} />

        <form onSubmit={handleLogin}>
          <div>
            <label>
              username
              <input
                type="text"
                value={username}
                onChange={({ target }) => setUsername(target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              password
              <input
                type="password"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
              />
            </label>
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={notificationType}/>
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create</h2>
      <form onSubmit={addBlog}>
        <div>
          title
          <input value={title} onChange={({ target }) => setTitle(target.value)} />
        </div>
        <div>
          author
          <input value={author} onChange={({ target }) => setAuthor(target.value)} />
        </div>
        <div>
          url
          <input value={url} onChange={({ target }) => setUrl(target.value)} />
        </div>
        <button type="submit">create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )



}

export default App