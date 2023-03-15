import { useEffect, useState } from 'react'
import getCountryList from './services'

const SearchBox = ({searchText, setSearchText}) => {
  const handleChange = (event) => {
    setSearchText(event.target.value)
  }

  return(
    <>
      find countries <input onChange={handleChange} value={searchText}/>
    </>
  )
}

const CountryList = ({searchText, masterList}) => {
  const countryList = masterList.filter(c =>
    c.name.common.toLowerCase().includes(searchText.toLowerCase()))

  if (countryList.length > 10) {
    return (
      <>
        <p>To many matches, specify another filter</p>
      </>
    )
  } else if (countryList.length > 1) {
    return (
      <>
        <ul>
          {countryList.map(c => <li key={c.ccn3}>{c.name.common}</li>)}
        </ul>
      </>
    )
  } else if (countryList.length === 1) {
    const country = countryList[0]
    return (
      <>
        <h1>{country.name.common}</h1>
        <div>
          <p>capital {country.capital[0]}</p>
          <p>area {country.area}</p>
        </div>
        <div>
          <b>languages:</b>
          <ul>
            {Object.values(country.languages).map((language, index) => 
              <li key={index}>{language}</li>
            )}
          </ul>
        </div>
        <div>
          <img src={`${country.flags.png}`} alt={`${country.flags.alt}`} />
        </div>
      </>
    )
  }
}

const App = () => {
  const [masterList, setMasterList] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    getCountryList().then(response => {setMasterList(response); console.log(response)})
  }, [])

  return (
    <>
      <SearchBox searchText={searchText} setSearchText={setSearchText}/>
      <CountryList searchText={searchText} masterList={masterList} />
    </>
  )
}

export default App
