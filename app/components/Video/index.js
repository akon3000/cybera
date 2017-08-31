import React from 'react';
import PropTypes from 'prop-types';
// import Helmet from 'react-helmet';
import videojs from './videojs/video.min';
import './videojs/video-js.min.css';
import './styles.css';

class componentName extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    // instantiate video.js
    this.player = videojs(this.videoNode, this.props, () => {
      // console.log('onPlayerReady', this);
    });
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div data-vjs-player className={this.props.className}>
        <video ref={(node) => { this.videoNode = node; }} className="video-js"></video>
      </div>
    );
  }
}


componentName.propTypes = {
  className: PropTypes.string,
};

componentName.defaultProps = {
  className: '',
};

export default componentName;
