import { useState, useEffect } from 'react'
import axios from 'axios'


const api_key = import.meta.env.VITE_SOME_KEY
console.log('api_key in frontend:', api_key)

const Filter = ({ value, onChange }) => (
  <div>
    find countries
    <input value={value} onChange={onChange} />
  </div>
)

const Countries = ({ countries, onShowCountry }) => {
  if (countries.length > 10) { return <p>Too many matches, specify another filter</p> }
  if (countries.length > 1) {
    return (
      <div>
        {countries.map(country => (
          <div key={country.cca3}>
            {country.name.common}{' '}
            <button onClick={() => onShowCountry(country.name.common)}>
              show
            </button>
          </div>
        ))}
      </div>
    )
  }
  if (countries.length === 1) { return <Country country={countries[0]} /> }
  return <p>No matches</p>
}

const Country = ({ country }) => {
  const languages = country.languages
    ? Object.values(country.languages)
    : []
  const capital =
    Array.isArray(country.capital) && country.capital.length > 0
      ? country.capital[0]
      : 'N/A'

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>

      <img
        src={country.flags.png}
        alt={country.flags.alt || `Flag of ${country.name.common}`}
        width="160"
      />

      {capital !== 'N/A' && (
        <Weather capital={capital} />
      )}
    </div>
  )
}

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!api_key) {
      setError('No API key (VITE_SOME_KEY) configured')
      return
    }

    setLoading(true)
    setError(null)

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      capital
    )}&appid=${api_key}&units=metric`

    axios
      .get(url)
      .then(response => {
        setWeather(response.data)
      })
      .catch(err => {
        console.error('weather error', err)
        const msg =
          err.response?.data?.message || 'Failed to load weather data'
        setError(msg)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [capital])

  if (!api_key) { return <p>No API key (VITE_SOME_KEY)</p> }

  if (loading) { return <p>loading weather...</p> }

  if (error) { return <p>weather error: {error}</p> }

  if (!weather) { return null }

  const iconCode = weather.weather[0].icon // esim. "10d"
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`

  return (
    <div>
      <h3>Weather in {capital}</h3>
      <p>temperature {weather.main.temp} °C</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => { setFilter(event.target.value) }

  const countriesToShow =
    filter === ''
      ? []
      : countries.filter(c =>
          c.name.common.toLowerCase().includes(filter.toLowerCase())
        )

  const handleShowCountry = (name) => { setFilter(name) }

  return (
    <div>
      <h1>Countries</h1>
      <Filter value={filter} onChange={handleFilterChange} />
      <Countries countries={countriesToShow} onShowCountry={handleShowCountry} />
    </div>
  )
}

export default App
