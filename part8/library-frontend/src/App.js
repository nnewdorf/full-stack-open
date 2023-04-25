import { useEffect, useState } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import { ALL_BOOKS } from './queries'
import { BOOK_ADDED } from './subscriptions'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'
import Recommended from './components/Recommended'

export const updateCache = (cache, query, addedBook) => {
  const uniqByTitle = books => {
    let seen = new Set()
    return books.filter(item => {
      const title = item.title
      return seen.has(title) ? false : seen.add(title)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByTitle(allBooks.concat(addedBook))
    }
  })
}

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    setPage('authors')
  },[token])

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      console.log(data)
      const addedBook = data.data.bookAdded
      window.alert('New Book Added')
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook )
    }
  })

  const handleLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  let logButtons
  let logPages
  if(token) {
    logButtons = <>
      <button onClick={() => setPage('add')}>add book</button>
      <button onClick={() => setPage('recommended')}>recommended</button>
      <button onClick={handleLogout}>logout</button>
    </>

    logPages = <>
      <NewBook show={page === 'add'} />
      <Recommended show={page === 'recommended'} />
    </>
  } else {
    logButtons = <>
      <button onClick={() => setPage('login')}>login</button>
    </>

    logPages = <>
      <Login show={page === 'login'} setToken={setToken}/>
    </>
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {logButtons}
      </div>

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      {logPages}
    </div>
  )
}

export default App
