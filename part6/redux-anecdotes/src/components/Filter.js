import { setFilter } from '../reducers/filterReducer'
import { useSelector, useDispatch } from 'react-redux'

const Filter = () => {
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const handleChange = (event) => {
    event.preventDefault()
    const input = event.target.value
    dispatch(setFilter(input))
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input value={filter} onChange={handleChange} />
    </div>
  )
}

export default Filter