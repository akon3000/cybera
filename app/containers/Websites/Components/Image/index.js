import React from 'react';
import PropTypes from 'prop-types';

import './styles.css';

import Editor from '../../../PageEditor/Components/ComponentEditors/Image';

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      complete: true,
      style: { ...props.imageStyle },
    };
  }

  componentDidMount() {
    this.focusBannerFirstLoad();
    window.addEventListener('resize', () => this.focusBannerResize);
  }

  componentDidUpdate() {
    this.focusBannerFirstLoad();
  }

  focusBannerFirstLoad() {
    const image = this.contentImage.querySelector('img');
    if (image) {
      image.addEventListener('load', () => {
        this.setState({
          style: {
            ...this.state.style,
            marginTop: `-${(image.clientHeight - this.contentImage.clientHeight) / 2}px`,
          },
        });
      });
    }
  }

  focusBannerResize() {
    const image = this.contentImage.querySelector('img');
    if (image) {
      this.setState({
        style: {
          ...this.state.style,
          marginTop: `-${(image.clientHeight - this.contentImage.clientHeight) / 2}px`,
        },
      });
    }
  }

  render() {
    const { url, width, height, editMode, id, type, sectionID, sectionGroup, deletable, link } = this.props;
    const { complete } = this.state;
    let image = (
      <div
        className={`component-image ${this.props.className} ${complete ? 'loading' : 'hidden'}`}
        style={{ width, height, ...this.props.style }}
        ref={(el) => { this.contentImage = el; }}
      >
        { link !== null && link.url && link.url !== '' &&
          (link.url && link.url !== '') ?
            <a href={link.url} target={link.target}>
              <img src={this.props.url} alt={this.props.alt} style={this.state.style} />
            </a>
          : <img src={this.props.url} alt={this.props.alt} style={this.state.style} />
        }
        {editMode && <Editor id={id} type={type} sectionID={sectionID} sectionGroup={sectionGroup} deletable={deletable} link={link} />}
      </div>
    );
    if (!url) {
      image = (
        <div
          className={`component-image component-image-default ${this.props.className}`}
          style={{ width, height, ...this.props.style }}
          ref={(el) => { this.contentImage = el; }}
        >
          { link !== null && link.url && link.url !== '' &&
            <a href={link.url} target={link.target}>
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  right: '0',
                  bottom: '0',
                }}
              ></div>
            </a>
          }
          {editMode && <Editor id={id} type={type} sectionID={sectionID} sectionGroup={sectionGroup} deletable={deletable} link={link} />}
        </div>
      );
    }
    return image;
  }
}

Image.propTypes = {
  editMode: PropTypes.bool.isRequired,
  url: PropTypes.string,
  alt: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  id: PropTypes.number,
  type: PropTypes.string,
  sectionID: PropTypes.number.isRequired,
  sectionGroup: PropTypes.string,
  link: PropTypes.object,
  deletable: PropTypes.bool,
  imageStyle: PropTypes.object,
};

Image.defaultProps = {
  url: null,
  alt: '',
  style: {},
  width: '100%',
  height: 'auto',
  className: '',
  onChange: () => {},
  id: null,
  type: '',
  link: null,
  sectionGroup: 'Body',
  imageStyle: {},
  deletable: true,
};

export default Image;
