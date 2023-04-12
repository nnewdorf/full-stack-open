import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from '../../components/Blog'

test('renders title and author', () => {
  const blog = {
    user: {
      username: 'auser',
      id: 'anid',
      name: 'name'
    },
    title: 'atitle',
    url: 'http://aurl.com',
    author: 'anauthor',
    likes: 0
  }

  // eslint-disable-next-line no-unused-vars
  render(<Blog blog={blog} isUserOwner={(blog) => true}/>)

  const element = screen.getByText('atitle anauthor')
  expect(element).toBeDefined()
})

test('likes and url are shown when view button is pressed', async () => {
  const blog = {
    user: {
      username: 'auser',
      id: 'anid',
      name: 'name'
    },
    title: 'atitle',
    url: 'http://aurl.com',
    author: 'anauthor',
    likes: 0
  }

  // eslint-disable-next-line no-unused-vars
  const container = render(<Blog blog={blog} isUserOwner={(blog) => true}/>).container

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const div = container.querySelector('.togglable')
  expect(div).not.toHaveStyle('display: none')
})

test('clicking the like button twice calls event handler twice', async () => {
  const blog = {
    user: {
      username: 'auser',
      id: 'anid',
      name: 'name'
    },
    title: 'atitle',
    url: 'http://aurl.com',
    author: 'anauthor',
    likes: 0
  }

  const mockHandler = jest.fn()

  // eslint-disable-next-line no-unused-vars
  render(<Blog blog={blog} isUserOwner={(blog) => true} likeBlog={mockHandler}/>)

  const user = userEvent.setup()
  const button = screen.getByText('like')
  await user.click(button)
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})