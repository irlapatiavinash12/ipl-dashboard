import {Component} from 'react'
import Loader from 'react-loader-spinner'

import {Link} from 'react-router-dom'

import {PieChart, Pie, Legend, Cell, ResponsiveContainer} from 'recharts'

import LatestMatch from '../LatestMatch'
import MatchCard from '../MatchCard'

import './index.css'

const teamMatchesApiUrl = 'https://apis.ccbp.in/ipl/'

class TeamMatches extends Component {
  state = {
    isLoading: true,
    teamMatchesData: {},
  }

  componentDidMount() {
    this.getTeamMatches()
  }

  getFormattedData = data => ({
    umpires: data.umpires,
    result: data.result,
    manOfTheMatch: data.man_of_the_match,
    id: data.id,
    date: data.date,
    venue: data.venue,
    competingTeam: data.competing_team,
    competingTeamLogo: data.competing_team_logo,
    firstInnings: data.first_innings,
    secondInnings: data.second_innings,
    matchStatus: data.match_status,
  })

  getTeamMatches = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`${teamMatchesApiUrl}${id}`)
    const fetchedData = await response.json()
    const formattedData = {
      teamBannerURL: fetchedData.team_banner_url,
      latestMatch: this.getFormattedData(fetchedData.latest_match_details),
      recentMatches: fetchedData.recent_matches.map(eachMatch =>
        this.getFormattedData(eachMatch),
      ),
    }

    this.setState({teamMatchesData: formattedData, isLoading: false})
  }

  renderRecentMatchesList = () => {
    const {teamMatchesData} = this.state
    const {recentMatches} = teamMatchesData

    const matchesWin = recentMatches.filter(
      eachItem => eachItem.matchStatus === 'Won',
    ).length
    const matchesLost = recentMatches.filter(
      eachItem => eachItem.matchStatus === 'Lost',
    ).length

    const data = [
      {
        count: matchesWin,
        status: 'Won',
      },
      {
        count: matchesLost,
        status: 'Lost',
      },
      {
        count: 0,
        status: 'Draw',
      },
    ]

    return (
      <>
        <ul className="recent-matches-list">
          {recentMatches.map(recentMatch => (
            <MatchCard matchDetails={recentMatch} key={recentMatch.id} />
          ))}
        </ul>
        <ResponsiveContainer
          width="100%"
          height={300}
          className="pie-chart-container"
        >
          <PieChart align="center">
            <Pie
              cx="70%"
              cy="50%"
              data={data}
              startAngle={0}
              endAngle={360}
              innerRadius="0%"
              outerRadius="100%"
              dataKey="count"
              horizontalAlign="start"
            >
              <Cell name="Lost" fill="#f54242" />
              <Cell name="Win" fill="#60f542" />
              <Cell name="Draw" fill="#000000" />
            </Pie>
            <Legend
              iconType="circle"
              layout="vertical"
              verticalAlign="middle"
              align="right"
            />
          </PieChart>
        </ResponsiveContainer>
      </>
    )
  }

  renderTeamMatches = () => {
    const {teamMatchesData} = this.state
    const {teamBannerURL, latestMatch} = teamMatchesData

    return (
      <div className="responsive-container">
        <Link className="link-button-styling" to="/">
          <button className="back-button-styling">Back</button>
        </Link>
        <img src={teamBannerURL} alt="team banner" className="team-banner" />
        <LatestMatch latestMatchData={latestMatch} />
        {this.renderRecentMatchesList()}
      </div>
    )
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="Oval" color="#ffffff" height={50} />
    </div>
  )

  getRouteClassName = () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    switch (id) {
      case 'RCB':
        return 'rcb'
      case 'KKR':
        return 'kkr'
      case 'KXP':
        return 'kxp'
      case 'CSK':
        return 'csk'
      case 'RR':
        return 'rr'
      case 'MI':
        return 'mi'
      case 'SH':
        return 'srh'
      case 'DC':
        return 'dc'
      default:
        return ''
    }
  }

  render() {
    const {isLoading} = this.state
    const className = `team-matches-container ${this.getRouteClassName()}`

    return (
      <div className={className}>
        {isLoading ? this.renderLoader() : this.renderTeamMatches()}
      </div>
    )
  }
}

export default TeamMatches
