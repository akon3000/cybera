import React, { Component } from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class Tab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      underline: '',
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setAnimation(this.props);
    }, 300);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.active !== this.props.active) {
      this.setAnimation(nextProps, { transition: '0.3s ease-in-out' });
    } else {
      this.setAnimation(nextProps);
    }
  }

  setAnimation(props, animation = {}) {
    const styleUnderline = Object.assign({}, { height: '3px' }, animation);
    const self = this;
    for (let i = 0; i < props.tabs.length; i += 1) {
      if (props.tabs[i].key === props.active) {
        styleUnderline.width = `${self.refs[props.tabs[i].key].clientWidth}px`;
        styleUnderline.left = `${self.refs[props.tabs[i].key].offsetLeft}px`;
        styleUnderline.top = `${(self.refs[props.tabs[i].key].offsetTop + self.refs[props.tabs[i].key].clientHeight) - 1}px`;
      }
    }
    this.setState({ underline: (<div className={styles.underline} style={styleUnderline}></div>) });
  }

  render() {
    const tab = [];
    const { active } = this.props;
    this.props.tabs.forEach((x) => {
      tab.push(<div key={x.key} ref={x.key} className={`${styles.tab} ${x.key === active && styles.activeTap}`}>{x}</div>);
    });
    return (
      <div className={styles.tapsContainer}>
        <div className={styles.tapButtonContainer}>{tab}</div>
        {this.state.underline}
      </div>
    );
  }
}

Tab.propTypes = {
  tabs: PropTypes.array.isRequired,
  active: PropTypes.string,
};
Tab.defaultProps = {
  active: null,
};

export default Tab;
