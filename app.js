
import { useState } from 'react'
import './App.css'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

export default function App() {
  const [location, setLocation] = useState('San Francisco, CA')
  const [propertyType, setPropertyType] = useState('residential')
  const [timeframe, setTimeframe] = useState('10')
  const [scenario, setScenario] = useState('moderate')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [insights, setInsights] = useState(null)

  const climateData = {
    flood: {
      historical: [2, 3, 4, 5, 6, 8, 10],
      projected: [12, 15, 18, 22, 28, 35, 42]
    },
    heat: {
      historical: [5, 6, 8, 10, 12, 15, 18],
      projected: [22, 28, 35, 42, 50, 58, 65]
    },
    wildfire: {
      historical: [1, 2, 2, 3, 4, 5, 6],
      projected: [7, 9, 11, 14, 18, 23, 29]
    }
  }

  const assessRisk = async () => {
    if (!location) {
      alert('Please enter a location')
      return
    }

    setLoading(true)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a climate risk assessment expert. Analyze the given location and provide risk levels (Low/Medium/High) for flood, heat, and wildfire risks. Respond with only a JSON object containing 'flood', 'heat', and 'wildfire' keys, each with 'level' and 'percentage' properties."
        }, {
          role: "user",
          content: `Assess climate risks for ${location}. Consider the property type: ${propertyType}. Provide risk analysis in JSON format.`
        }],
        temperature: 0.7,
        max_tokens: 300
      })

      const aiResponse = completion.choices[0].message.content
      let riskResults
      
      try {
        riskResults = JSON.parse(aiResponse)
      } catch (parseError) {
        console.error('AI response parsing error:', parseError)
        riskResults = {
          flood: { level: 'Medium', percentage: 45 },
          heat: { level: 'Medium', percentage: 55 },
          wildfire: { level: 'Low', percentage: 25 }
        }
      }
      
      setResults(riskResults)
      await generateAIInsights()
      setLoading(false)
    } catch (error) {
      console.error('Error with AI analysis:', error)
      alert('AI analysis failed. Please check your API key in Secrets.')
      setLoading(false)
    }
  }

  const predictFuture = async () => {
    setLoading(true)
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a climate scientist specializing in future climate projections. Provide detailed risk assessments considering time-dependent climate change impacts. Respond with JSON containing 'flood', 'heat', and 'wildfire' risks with 'level' and 'percentage' properties."
        }, {
          role: "user",
          content: `Predict climate risks for ${location} over the next ${timeframe} years under ${scenario} climate scenario for ${propertyType} property. Consider accelerating climate change impacts.`
        }],
        temperature: 0.7,
        max_tokens: 400
      })

      const aiResponse = completion.choices[0].message.content
      let riskResults
      
      try {
        riskResults = JSON.parse(aiResponse)
      } catch (parseError) {
        console.error('AI response parsing error:', parseError)
        riskResults = {
          flood: { level: 'High', percentage: 75 },
          heat: { level: 'High', percentage: 80 },
          wildfire: { level: 'Medium', percentage: 60 }
        }
      }
      
      setResults(riskResults)
      await generateAIInsights()
      setLoading(false)
    } catch (error) {
      console.error('Error with AI prediction:', error)
      alert('AI prediction failed. Please check your API key in Secrets.')
      setLoading(false)
    }
  }

  const generateAIInsights = async () => {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
          role: "system",
          content: "You are a climate adaptation expert. Generate 3 detailed climate insights for the given location and property type. Format as JSON array with objects containing 'title' and 'content' fields."
        }, {
          role: "user",
          content: `Generate climate insights for ${location}, ${propertyType} property, ${timeframe}-year timeframe, ${scenario} climate scenario. Include specific recommendations and local climate data.`
        }],
        temperature: 0.8,
        max_tokens: 800
      })

      const aiResponse = completion.choices[0].message.content
      let aiInsights
      
      try {
        aiInsights = JSON.parse(aiResponse)
      } catch (parseError) {
        aiInsights = [
          {
            title: "AI Climate Analysis",
            content: `Climate analysis for ${location} shows varying risk levels. The AI assessment indicates the need for comprehensive climate adaptation planning for ${propertyType} properties.`
          }
        ]
      }
      
      setInsights(aiInsights)
    } catch (error) {
      console.error('Error generating AI insights:', error)
    }
  }

  const getRiskClass = (level) => {
    switch(level) {
      case 'Low': return 'risk-low'
      case 'Medium': return 'risk-medium'  
      case 'High': return 'risk-high'
      default: return 'risk-medium'
    }
  }

  return (
    <div className="climate-app">
      <header className="header">
        <div className="container">
          <nav className="nav">
            <div className="logo">🌍 ClimateGuard AI</div>
            <div className="nav-links">
              <a href="#assessment">Risk Assessment</a>
              <a href="#insights">AI Insights</a>
              <a href="#community">Community</a>
              <a href="#resources">Resources</a>
            </div>
          </nav>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="hero">
            <h1>Protect Your Community</h1>
            <p>Advanced AI-powered climate risk assessment and community resilience planning</p>
          </section>

          <div className="dashboard">
            <div className="card">
              <h3><span className="icon">📍</span>Location Assessment</h3>
              <div className="input-group">
                <label htmlFor="location">Enter Your Location</label>
                <input 
                  type="text" 
                  id="location" 
                  placeholder="City, State or ZIP Code"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="property-type">Property Type</label>
                <select 
                  id="property-type"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                  <option value="agricultural">Agricultural</option>
                </select>
              </div>
              <button className="btn" onClick={assessRisk}>🔍 Analyze Climate Risk</button>
            </div>

            <div className="card">
              <h3><span className="icon">🤖</span>AI Risk Predictor</h3>
              <div className="input-group">
                <label htmlFor="timeframe">Prediction Timeframe</label>
                <select 
                  id="timeframe"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="5">Next 5 Years</option>
                  <option value="10">Next 10 Years</option>
                  <option value="25">Next 25 Years</option>
                  <option value="50">Next 50 Years</option>
                </select>
              </div>
              <div className="input-group">
                <label htmlFor="scenario">Climate Scenario</label>
                <select 
                  id="scenario"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                >
                  <option value="optimistic">Optimistic (1.5°C)</option>
                  <option value="moderate">Moderate (2.0°C)</option>
                  <option value="severe">Severe (3.0°C+)</option>
                </select>
              </div>
              <button className="btn" onClick={predictFuture}>🔮 Predict Future Risks</button>
            </div>
          </div>

          {loading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>AI is analyzing climate data and generating insights...</p>
            </div>
          )}

          {results && (
            <div className="results">
              <div className="result-card">
                <div className={`risk-level ${getRiskClass(results.flood?.level)}`}>
                  {results.flood?.level}
                </div>
                <h4>Flood Risk</h4>
                <p>Probability of significant flooding in the next decade</p>
              </div>
              <div className="result-card">
                <div className={`risk-level ${getRiskClass(results.heat?.level)}`}>
                  {results.heat?.level}
                </div>
                <h4>Heat Risk</h4>
                <p>Extreme temperature events and heat waves</p>
              </div>
              <div className="result-card">
                <div className={`risk-level ${getRiskClass(results.wildfire?.level)}`}>
                  {results.wildfire?.level}
                </div>
                <h4>Wildfire Risk</h4>
                <p>Likelihood of wildfire impact in your area</p>
              </div>
            </div>
          )}

          {insights && (
            <div className="ai-insights">
              <h3>🧠 AI Climate Insights</h3>
              {insights.map((insight, index) => (
                <div key={index} className="insight-item">
                  <h4>{insight.title}</h4>
                  <p>{insight.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
