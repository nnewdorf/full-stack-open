import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from '../../components/NewBlogForm'

test('the handler is called with appropriate information uppon submission of the form', async () => {
  const addBlog = jest.fn()
  const setMessage = jest.fn()
  const setMessageClass = jest.fn()
  render(<NewBlogForm addBlog={addBlog} setMessage={setMessage} setMessageClass={setMessageClass}/>)

  const user = userEvent.setup()
  const inputs = screen.getAllByRole('textbox')

  await user.type(inputs[0], 'atitle')
  await user.type(inputs[1], 'anauthor')
  await user.type(inputs[2], 'aurl')

  const button = screen.getByText('create')
  await user.click(button)

  expect(addBlog).toBeCalledWith({
    title: 'atitle',
    author: 'anauthor',
    url: 'aurl'
  })
})