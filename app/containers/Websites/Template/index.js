import React from 'react';
import PropTypes from 'prop-types';

class Template extends React.Component {
  state = {
    template: null,
  }

  componentDidMount() {
    switch (this.props.id) {
      case 1:
        System.import('./Template01').then((component) => {
          this.loaded(component);
        });
        break;
      case 2:
        System.import('./Template02').then((template) => {
          this.loaded(template);
        });
        break;
      default:
        break;
    }
  }

  loaded(component) {
    this.setState({ template: component.default ? component.default : component });
  }

  render() {
    return this.state.template && <div className={this.props.className}><this.state.template>{this.props.children}</this.state.template></div>;
  }
}

Template.propTypes = {
  id: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

Template.defaultProps = {
  className: '',
};

export default Template;
