import React, { Component } from 'react'
import './App.css'
import request from 'superagent'
import YouTube from 'react-youtube'

export default class App extends React.Component {
  state = {
    value: '',
    data: null,
    maxResult: 1
  }
  loadedJSON = (err, res) => this.setState({data:res.body})
  getData = (newValue,newMaxResult) => {
    const URI = 'https://www.googleapis.com/youtube/v3/search'
    const KEY = 'YOUR_YoutubeDataAPIkey'
    let params = {
      'key':KEY,
      'part': 'snippet',
      'q': newValue,
      'type': 'video',
      'order': 'relevance',
      'maxResults': newMaxResult
    }
    request.get(URI)
      .query(params)
      .end(this.loadedJSON)
  }
  componentDidUpdate (prevProps) {
    if (this.state.value !== prevProps.value) {
      this.getData(this.state.value, prevProps.maxResult)
    }
  }
  valueChange (e) {
    const newValue = e.value
    this.setState({
      value: newValue
    })
  }
  plusResult = () => this.setState({ maxResult: this.state.maxResult + 1})
  render () {
    return (
      <div className="App">
        <VideoView className="video-view"
          data = {this.state.data}
          maxResult = {this.state.maxResult}
        />
        <button
          type="button"
          onClick={this.plusResult}
        >+{this.state.maxResult}
        </button>
        <SearchBox className="search-box"
          onChange = {e => {this.valueChange(e)}}
        />
      </div>
    )
  }
}

class VideoView extends React.Component {
  state = {
    data: this.props.data,
    maxResult: this.props.maxResult
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.state.data) {
      this.setState({
        data: nextProps.data
      })
    }
    if (nextProps.maxResult !== this.state.maxResult) {
      this.setState({
        maxResult: nextProps.maxResult
      })
    }
  }
  _onReady (event) {
    // access to player in all event handlers via event.target
    event.target.pauseVideo()
  }
  render () {
    const opts = {
      height: window.innerHeight,
      width: window.innerWidth,
      playerVars: { // https://developers.google.com/youtube/player_parameters
        autoplay: 1
      }
    }
    let Videos = []
    if (this.state.data != null) {
      for (let i = 0; i < this.state.maxResult; i++) {
        Videos.push(
          <YouTube
            videoId={this.state.data.items[i].id.videoId}
            opts={opts}
            onReady={this.onReady}
          />
        )
      }
    }
    return (
      <div className="videos">
        {Videos}
      </div>
    )
  }
}

class SearchBox extends React.Component {
  state = {
    value: this.props.value
  }
  handleChange (e) {
    const newValue = e.target.value
    this.setState({
      value: newValue
    })
    if (this.props.onChange) {
      this.props.onChange({
        target: this,
        value: newValue
      })
    }
  }
  componentWillReceiveProps (nextProps) {
    this.setState({value: nextProps.value})
  }
  render () {
    return (
      <div className="search-box">
        <input
          type="text"
          placeholder='Search'
          value={this.state.value}
          onChange={e => this.handleChange(e)}
        />
      </div>
    )
  }
}
