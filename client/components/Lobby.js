//client/components/Lobby.js
import React from 'react';
import axios from 'axios';
import VideoCard from './VideoCard';
const Row = require('react-bootstrap/lib/Row');
import '../styles/Lobby.css';

//Responsible for grabbing initial video set information and rendering lobby page.
class Lobby extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      videos:[]
    }
  }
  //Make api call to server to grab video set data.
  componentDidMount() {
    if(authed){
      axios.get(`/fetchvideos`)
      .then(res => {
        this.setState({videos:res.data})
      });
    }
  }
  componentDidUpdate(){
    const ele = document.getElementById('ipl-progress-indicator')
    if(ele){
      setTimeout(() => {
        ele.classList.add('available')
        setTimeout(() => {
          ele.outerHTML = ''
        }, 2000)
      }, 1000)
    }
  }
  render() {
    return (
      <div className="container-fluid cards-wrapper">
        <Row>
          {this.state.videos.map(function(video){
            return <VideoCard key={video.id.videoId} video={video} />
          })}
        </Row>
        <div className="text-center">
          <span className="credits">
            written by 
          <a style={{textDecoration:"none!important"}} href="https://quanchifootball.github.io">Jason Keum</a>
            - 2018   Icons made by 
          <a href="https://www.flaticon.com/authors/google" title="Google">Google</a>
            and 
          <a href="https://www.fontawesome.com/" title="Font Awesome">Font Awesome</a>
          </span>
        </div>
      </div>
    );
  }
}

export default Lobby;