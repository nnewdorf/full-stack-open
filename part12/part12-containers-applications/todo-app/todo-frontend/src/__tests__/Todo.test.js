import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from '../Todos/Todo'

describe('<Todo />', () => {
  let deleteToDo
  let completeToDo

  beforeEach(() => {
    const todo = {
      text: 'test text',
      done: false
    }

    deleteToDo = jest.fn()
    completeToDo = jest.fn()

    const container = render(
      <Todo 
        todo={todo}
        deleteTodo={deleteToDo}
        completeTodo={completeToDo}
      />
    ).container
  })

  test('text is rendered to screen', async () => {
    await screen.findAllByText('test text')
  })

  test('complete todo is properly shown', async () => {
    const user = userEvent.setup()
    const button = await screen.getByText('Set as done')
    await user.click(button)
    expect(completeToDo.mock.calls).toHaveLength(1)
  })
})