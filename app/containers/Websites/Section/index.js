import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mod: null };
  }

  componentWillMount() {
    this.load();
  }

  // componentWillReceiveProps(nextProps) {
  //   this.load(nextProps);
  // }

  load() {
    this.setState({
      mod: null,
    });
    this.props.load((mod) => {
      this.setState({
        mod: mod.default ? mod.default : mod,
      });
    });
  }

  render() {
    const { id, name, containerStyle, style, fluid, data, editMode, gridMode, ...otherProps } = this.props;
    return (
      <div
        className={`section-container ${name}`}
        style={this.state.mod && containerStyle}
      >
        <div
          className={`section ${this.state.mod ? '' : 'loading'} ${fluid ? '' : 'container padding-none'}`}
          style={this.state.mod && style}
        >
          { editMode && gridMode && this.props.sectionGrid.left }
          { editMode && gridMode && this.props.sectionGrid.right }
          { this.state.mod ? <this.state.mod id={id} editMode={editMode} {...data} {...otherProps} /> : null }
        </div>
        {/* editMode && this.props.sectionGrid.top */ }
        { editMode && gridMode && this.props.sectionGrid.bottom }
        {this.props.children}
      </div>);
  }
}

Section.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  children: PropTypes.array,
  sectionGrid: PropTypes.object,
  load: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  fluid: PropTypes.bool,
  containerStyle: PropTypes.object,
  style: PropTypes.object,
  gridMode: PropTypes.bool,
  data: PropTypes.object,
};

Section.defaultProps = {
  editMode: false,
  gridMode: false,
  children: [],
  sectionGrid: {},
  fluid: false,
  containerStyle: {},
  style: {},
  data: {},
};

export default Section;
