import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const CountryList = ({ countries, onShow }) => (
  <div>
    {countries.map((country) => (
      <div key={country.cca3}>
        {country.name.common}{' '}
        <button type="button" onClick={() => onShow(country.name.common)}>
          show
        </button>
      </div>
    ))}
  </div>
)

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)
  const apiKey = import.meta.env.VITE_OPENWEATHER_KEY

  useEffect(() => {
    if (!capital || !apiKey) {
      return
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      capital
    )}&appid=${apiKey}&units=metric`

    axios
      .get(url)
      .then((response) => {
        setWeather(response.data)
        setError(null)
      })
      .catch(() => {
        setWeather(null)
        setError('Weather data not available')
      })
  }, [capital, apiKey])

  if (!apiKey) {
    return <p>Weather API key missing. Set VITE_OPENWEATHER_KEY to enable.</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <p>temperature {weather.main.temp} °C</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetails = ({ country }) => {
  const languages = country.languages ? Object.values(country.languages) : []
  const capital = country.capital?.[0] || ''

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <h3>languages</h3>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
      <h3>Weather in {capital}</h3>
      <Weather capital={capital} />
    </div>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => {
        setCountries(response.data)
      })
  }, [])

  const matches = useMemo(() => {
    const query = filter.trim().toLowerCase()
    if (!query) {
      return []
    }
    return countries.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    )
  }, [countries, filter])

  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleShow = (name) => setFilter(name)

  const renderResults = () => {
    if (matches.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (matches.length === 1) {
      return <CountryDetails country={matches[0]} />
    }

    if (matches.length > 1) {
      return <CountryList countries={matches} onShow={handleShow} />
    }

    if (filter.trim() === '') {
      return <p>Type a country name to search.</p>
    }

    return <p>No matches.</p>
  }

  return (
    <div>
      <label>
        find countries{' '}
        <input value={filter} onChange={handleFilterChange} />
      </label>
      {renderResults()}
    </div>
  )
}

export default App
