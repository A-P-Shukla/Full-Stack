import React from 'react'
import useStore from './store'

const Button = ({ onClick, text }) => (
  <button onClick={onClick} className="btn">{text}</button>
)

const Statistics = () => {
  const { good, neutral, bad } = useStore()
  const total = good + neutral + bad
  if (total === 0) return <p>No feedback given</p>
  const average = ((good - bad) / total).toFixed(2)
  const positive = ((good / total) * 100).toFixed(1) + '%'

  return (
    <table className="stats">
      <tbody>
        <tr><td>good</td><td>{good}</td></tr>
        <tr><td>neutral</td><td>{neutral}</td></tr>
        <tr><td>bad</td><td>{bad}</td></tr>
        <tr><td>all</td><td>{total}</td></tr>
        <tr><td>average</td><td>{average}</td></tr>
        <tr><td>positive</td><td>{positive}</td></tr>
      </tbody>
    </table>
  )
}

const App = () => {
  const { good, neutral, bad, increaseGood, increaseNeutral, increaseBad, reset } = useStore()

  return (
    <div className="container">
      <h1>give feedback</h1>
      <div className="buttons">
        <Button onClick={increaseGood} text="good" />
        <Button onClick={increaseNeutral} text="neutral" />
        <Button onClick={increaseBad} text="bad" />
      </div>

      <h2>statistics</h2>
      <Statistics />

      <div style={{ marginTop: 16 }}>
        <button onClick={reset} className="btn reset">reset</button>
      </div>
    </div>
  )
}

export default App
