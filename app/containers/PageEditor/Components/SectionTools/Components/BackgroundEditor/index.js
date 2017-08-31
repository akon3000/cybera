import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PaintIcon from 'react-icons/lib/go/paintcan';
import TrashIcon from 'react-icons/lib/md/clear';

import { ChromePicker } from 'react-color';

import Button from '../../../Button';
import Popover from '../../../Popover';

import styles from './styles.css';

import {
  changeSectionBackground,
  updateSectionBackground,
  showFileManager,
} from '../../../../actions';

import { getActiveSection } from '../../../../reducers/utils';

class BackgroundEditor extends React.Component {
  constructor(props) {
    super(props);

    const sizes = props.backgroundSize.split(' ');
    this.state = {
      open: false,
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top',
      },
      targetOrigin: {
        horizontal: 'right',
        vertical: 'bottom',
      },
      style: {
        backgroundColor: props.backgroundColor,
        backgroundImage: props.backgroundImage,
        backgroundPosition: props.backgroundPosition,
        backgroundSize: props.backgroundSize,
        backgroundRepeat: props.backgroundRepeat,
      },
      widthCheck: sizes[0] === 'auto',
      heightCheck: sizes[1] === 'auto',
      widthValue: sizes[0] !== 'auto' ? sizes[0] : '100',
      heightValue: sizes[1] !== 'auto' ? sizes[1] : '100',
      widthType: sizes[0] !== 'auto' ? sizes[0][sizes[0].length - 1] : '%',
      heightType: sizes[1] !== 'auto' ? sizes[1][sizes[1].length - 1] : '%',
    };
  }

  componentWillReceiveProps(props) {
    const sizes = props.backgroundSize.split(' ');
    this.setState({
      style: {
        backgroundColor: props.backgroundColor,
        backgroundImage: props.backgroundImage,
        backgroundPosition: props.backgroundPosition,
        backgroundSize: props.backgroundSize,
        backgroundRepeat: props.backgroundRepeat,
      },
      widthCheck: sizes[0] === 'auto',
      heightCheck: sizes[1] === 'auto',
      widthValue: sizes[0] !== 'auto' ? sizes[0].replace('%', '').replace('px', '') : '100',
      heightValue: sizes[1] !== 'auto' ? sizes[1].replace('%', '').replace('px', '') : '100',
      widthType: sizes[0] !== 'auto' ? sizes[0][sizes[0].length - 1] : '%',
      heightType: sizes[1] !== 'auto' ? sizes[1][sizes[1].length - 1] : '%',
    });
  }

  handleTouchTap(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  }

  handleRequestClose() {
    if (this.state.style) {
      this.props.onUpdateSectionBackgroud(this.state.style);
    }
    this.setState({
      open: false,
      // style: {},
    });
  }

  handleChangeComplete = (color) => {
    const style = {
      ...this.state.style,
      backgroundColor: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
    };
    this.setState({ style });
    this.props.onChangeSectionBackgroud(style);
  };

  render() {
    const { onShowFileManager, onChangeSectionBackgroud } = this.props;
    const { backgroundImage, backgroundPosition, backgroundSize, backgroundRepeat } = this.state.style;
    const image = backgroundImage.replace("url('", '').replace("')", '');
    const positions = backgroundPosition.split(' ');
    const sizes = backgroundSize.split(' ');
    return (
      <div className={styles.contianer}>
        <Button
          icon={<PaintIcon />}
          text="Manage background"
          onClick={(event) => { this.handleTouchTap(event); }}
        />
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={this.state.anchorOrigin}
          targetOrigin={this.state.targetOrigin}
          onRequestClose={() => this.handleRequestClose()}
        >
          <div className={styles.image}>
            <span
              className={styles.preview}
            >
              {image && <img src={image} alt="preview" />}
              <Button
                onClick={() => {
                  this.handleRequestClose();
                  onShowFileManager();
                  this.setState({ open: false });
                }}
                text={image ? 'Change image' : 'Add image'}
                className={styles.addImage}
              />
              {image &&
                <button
                  className={styles.close}
                  onClick={() => {
                    this.setState({
                      style: {
                        ...this.state.style,
                        backgroundPosition: '',
                        backgroundImage: '',
                        backgroundSize: '',
                        backgroundRepeat: '',
                      },
                    }, () => onChangeSectionBackgroud(this.state.style));
                  }}
                ><TrashIcon /></button>}
            </span>
            <div className={styles.imageOptions}>
              {image === '' && <div className={styles.mask}></div>}
              <div className={styles.position}>
                <h4>Position</h4>
                <div>
                  <span>Vertical</span>
                  <select
                    defaultValue={positions[0]}
                    onChange={(e) => {
                      this.setState({
                        style: {
                          ...this.state.style,
                          backgroundPosition: `${e.target.value} ${positions[1]}`,
                        },
                      }, () => onChangeSectionBackgroud(this.state.style));
                    }}
                    style={{ width: '80px' }}
                  >
                    <option value="unset"></option>
                    <option value="center">Middle</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div>
                  <span>Horizontal</span>
                  <select
                    defaultValue={positions[1]}
                    onChange={(e) => {
                      this.setState({
                        style: {
                          ...this.state.style,
                          backgroundPosition: `${positions[0]} ${e.target.value}`,
                        },
                      }, () => onChangeSectionBackgroud(this.state.style));
                    }}
                    style={{ width: '80px' }}
                  >
                    <option value="unset"></option>
                    <option value="center">Center</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>
              <div className={styles.position}>
                <h4>Size</h4>
                <div>
                  <span>Width</span>
                  <select
                    defaultValue={this.state.widthType}
                    onChange={(e) => {
                      const widthType = e.target.value;
                      this.setState({
                        widthType,
                        style: {
                          ...this.state.style,
                          backgroundSize: `${this.state.widthValue}${widthType} ${sizes[1]}`,
                        },
                      }, () => onChangeSectionBackgroud(this.state.style));
                    }}
                    disabled={this.state.widthCheck}
                  >
                    <option>%</option>
                    <option>px</option>
                  </select>
                  <input
                    type="number"
                    disabled={this.state.widthCheck}
                    value={this.state.widthValue}
                    onChange={(e) => {
                      const widthCheck = e.target.value;
                      if (widthCheck !== '') {
                        this.setState({
                          widthCheck,
                          style: {
                            ...this.state.style,
                            backgroundSize: `${widthCheck}${this.state.widthType} ${sizes[1]}`,
                          },
                        }, () => onChangeSectionBackgroud(this.state.style));
                      }
                    }}
                  />
                  <span style={{ float: 'right', marginRight: '15px' }}>
                    <label htmlFor="widthCheckbox">
                      <input
                        id="widthCheckbox"
                        type="checkbox"
                        checked={this.state.widthCheck}
                        onChange={(e) => {
                          const widthCheck = e.target.checked;
                          this.setState({ widthCheck }, () => {
                            if (widthCheck) {
                              this.setState({
                                style: {
                                  ...this.state.style,
                                  backgroundSize: `auto ${sizes[1]}`,
                                },
                              }, () => onChangeSectionBackgroud(this.state.style));
                            } else {
                              this.setState({
                                style: {
                                  ...this.state.style,
                                  backgroundSize: `${this.state.widthValue}${this.state.widthType} ${sizes[1]}`,
                                },
                              }, () => onChangeSectionBackgroud(this.state.style));
                            }
                          });
                        }}
                      />
                      <span> Auto</span>
                    </label>
                  </span>
                </div>
                <div>
                  <span>Height</span>
                  <select
                    defaultValue={this.state.heightType}
                    onChange={(e) => {
                      const heightType = e.target.value;
                      this.setState({
                        heightType,
                        style: {
                          ...this.state.style,
                          backgroundSize: `${sizes[0]} ${this.state.heightValue}${heightType}`,
                        },
                      }, () => onChangeSectionBackgroud(this.state.style));
                    }}
                    disabled={this.state.widthCheck}
                  >
                    <option>%</option>
                    <option>px</option>
                  </select>
                  <input
                    type="number"
                    disabled={this.state.heightCheck}
                    value={this.state.heightValue}
                    onChange={(e) => {
                      const heightCheck = e.target.value;
                      if (heightCheck !== '') {
                        this.setState({
                          heightCheck,
                          style: {
                            ...this.state.style,
                            backgroundSize: `${sizes[0]} ${heightCheck}${this.state.heightType}`,
                          },
                        }, () => onChangeSectionBackgroud(this.state.style));
                      }
                    }}
                  />
                  <span style={{ float: 'right', marginRight: '15px' }}>
                    <label htmlFor="heightCheckbox">
                      <input
                        id="heightCheckbox"
                        type="checkbox"
                        checked={this.state.heightCheck}
                        onChange={(e) => {
                          const heightCheck = e.target.checked;
                          this.setState({ heightCheck }, () => {
                            if (heightCheck) {
                              this.setState({
                                style: {
                                  ...this.state.style,
                                  backgroundSize: `${sizes[0]} auto`,
                                },
                              }, () => onChangeSectionBackgroud(this.state.style));
                            } else {
                              this.setState({
                                style: {
                                  ...this.state.style,
                                  backgroundSize: `${sizes[0]} ${this.state.heightValue}${this.state.heightType}`,
                                },
                              }, () => onChangeSectionBackgroud(this.state.style));
                            }
                          });
                        }}
                      />
                      <span> Auto</span>
                    </label>
                  </span>
                </div>
              </div>
              <div className={styles.position}>
                <h4 style={{ float: 'left' }}>Repeat</h4>
                <span style={{ padding: '4px', float: 'right' }}>
                  <select
                    defaultValue={backgroundRepeat}
                    onChange={(e) => {
                      this.setState({
                        style: {
                          ...this.state.style,
                          backgroundRepeat: e.target.value,
                        },
                      }, () => onChangeSectionBackgroud(this.state.style));
                    }}
                  >
                    <option>no-repeat</option>
                    <option>repeat</option>
                    <option>repeat-x</option>
                    <option>repeat-y</option>
                  </select>
                </span>
              </div>
            </div>
          </div>
          <div className={styles.colorpicker}>
            <ChromePicker
              color={this.state.style.backgroundColor}
              onChangeComplete={this.handleChangeComplete}
            />
          </div>
        </Popover>
      </div>
    );
  }
}

BackgroundEditor.propTypes = {
  onChangeSectionBackgroud: PropTypes.func.isRequired,
  onUpdateSectionBackgroud: PropTypes.func.isRequired,
  onShowFileManager: PropTypes.func.isRequired,
  backgroundColor: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string.isRequired,
  backgroundPosition: PropTypes.string.isRequired,
  backgroundSize: PropTypes.string.isRequired,
  backgroundRepeat: PropTypes.string.isRequired,
};

BackgroundEditor.defaultProps = {
  backgroundColor: '',
  backgroundImage: '',
  backgroundPosition: 'center center',
  backgroundSize: '100% auto',
  backgroundRepeat: 'no-repeat',
};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  const section = getActiveSection(state);
  let backgroundColor = '#FFF';
  let backgroundImage = '';
  if (section.containerStyle) {
    backgroundColor = section.containerStyle.backgroundColor;
    backgroundImage = section.containerStyle.backgroundImage;
  }

  return {
    popup: state.get('popup'),
    backgroundColor,
    backgroundImage,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChangeSectionBackgroud: (style) => dispatch(changeSectionBackground(style)),
    onUpdateSectionBackgroud: (style) => dispatch(updateSectionBackground(style)),
    onShowFileManager: () => dispatch(showFileManager(0, 'BackgroundImage')),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundEditor);
