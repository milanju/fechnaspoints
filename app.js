var React = require('react');
var ReactDOM = require('react-dom');
var ReactTransitionGroup = require('react-addons-transition-group');
var ReactTimerMixin = require('react-timer-mixin');
var $ = require('jquery');

require('normalize.css');
require('./css/style.css');

var App = React.createClass({
  loadPlayers() {
    this.serverRequest = $.getJSON('https://dl.dropboxusercontent.com/s/i4d8i0jwd50hf1i/devnaspoints.json?dl=0', (result) => {
      var fechnasPoints = result;
      var origin = {};
      origin.players = [...fechnasPoints.players];

      fechnasPoints.players.sort((a, b) => {
        return b.score - a.score;
      });

      fechnasPoints.players.map((player, i) => {
        player.pos = i;
      });

      origin.players.map((player) => {
        for (var i = 0; i < fechnasPoints.players.length; i++) {
          if (player.name === fechnasPoints.players[i].name) {
            player.pos = fechnasPoints.players[i].pos;
            break;
          }
        }
      });

      this.setState({
        players: origin.players
      });
    });
  },
  componentDidMount() {
    this.loadPlayers();
    setInterval(this.loadPlayers, 3000);
  },
  render() {
    return (
      <div>
        <h1 className="headline">Fechnas Points</h1>
        {(this.state && this.state.players) ? <Players players={this.state.players} /> : 'Loading...'}
      </div>
    );
  }
});

var Players = React.createClass({
  propTypes: {
    players: React.PropTypes.array
  },

  render() {
    return (
      <div className="players">
        {this.props.players.map((player) => {
          return <Player key={player.name} player={player}/>;
        })}
      </div>
    );
  }
});

var Player = React.createClass({
  mixins: [ReactTimerMixin],

  propTypes: {
    player: React.PropTypes.object
  },

  getInitialState() {
    return {updating: false};
  },

  componentWillUnmount() {
    console.log('HEY!');
  },

  render() {
    var name = this.props.player.name;
    var score = this.props.player.score;
    var pos = this.props.player.pos;
    var playerClass = this.props.player.class.toLowerCase();
    var thumbnail = this.props.player.thumbnail ? this.props.player.thumbnail : "http://render-api-eu.worldofwarcraft.com/static-render/eu/cerchio-del-sangue/234/132217322-avatar.jpg"

    return (
        <div className={'player ' + 'player--' + playerClass} style={{top: pos * 56}}>
          <img
            className="player__thumbnail"
            src={thumbnail}
          />
          <div className="player__info">
          <span className="player__info__name">
            {name}
          </span>
          <span className="player__info__score">
            {score}
          </span>
          </div>
        </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
