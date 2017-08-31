import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { ChromePicker } from 'react-color';
import PaintIcon from 'react-icons/lib/go/paintcan';

import styles from './styles.css';

import Button from '../../../Button';
import Popover from '../../../Popover';

class ButtonStyling extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openButtonStyling: false,
      anchorEl: null,
      showPicker: '',
      activePanel: 'Normal',
    };
    Object.keys(props.settingStyle).forEach((key) => {
      this.state[key] = props.settingStyle[key];
    });
  }

  render() {
    const { label, anchorOrigin, targetOrigin, onClose } = this.props;
    return (
      <div className={styles.containerTools}>
        <Button
          text={label}
          icon={<PaintIcon />}
          onClick={(event) => this.setState({ openButtonStyling: true, anchorEl: event.currentTarget })}
        />
        <Popover
          open={this.state.openButtonStyling}
          anchorEl={this.state.anchorEl}
          anchorOrigin={anchorOrigin}
          targetOrigin={targetOrigin}
          onRequestClose={() => {
            this.setState({ openButtonStyling: false, anchorEl: null }, () => {
              onClose({
                Active: { ...this.state.Active },
                Hover: { ...this.state.Hover },
                Normal: { ...this.state.Normal },
              });
            });
          }}
          style={{ overflow: 'none' }}
        >
          <div className={styles.container}>

            <button onClick={() => this.setState({ activePanel: 'Normal' })} className={`${styles.panel} ${this.state.activePanel === 'Normal' && styles.active}`}>Normal</button>
            { this.state.activePanel === 'Normal' && this.state.Normal && // Normal
              <div className={styles.body}>

                { this.state.Normal.fontFamily && // front-family
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Font Family :</Col>
                    <Col xs={7}>
                      <select
                        value={this.state.Normal.fontFamily}
                        onChange={(ev) => this.setState({ Normal: { ...this.state.Normal, fontFamily: ev.target.value } })}
                      >
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Arial">Arial</option>
                      </select>
                    </Col>
                  </Row>
                }

                { this.state.Normal.color && // front-color
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Font Color :</Col>
                    <Col xs={5}>
                      <input
                        value={this.state.Normal.color}
                        onChange={(ev) => this.setState({ Normal: { ...this.state.Normal, color: ev.target.value } })}
                      />
                    </Col>
                    <Col xs={2} className={styles.boxContent}>
                      <button
                        style={{ backgroundColor: this.state.Normal.color }}
                        className={styles.box}
                        onClick={() => this.setState({ showPicker: this.state.showPicker === 'n-font-color' ? '' : 'n-font-color' })}
                      ></button>
                      { this.state.showPicker === 'n-font-color' &&
                        <div className={styles.colorPicker}>
                          <ChromePicker
                            color={this.state.Normal.color}
                            onChangeComplete={(color) => this.setState({ Normal: { ...this.state.Normal, color: color.hex } })}
                          />
                        </div>
                      }
                    </Col>
                  </Row>
                }

                { this.state.Normal.backgroundColor && // background-color
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Background Color :</Col>
                    <Col xs={5}>
                      <input
                        value={this.state.Normal.backgroundColor}
                        onChange={(ev) => this.setState({ Normal: { ...this.state.Normal, backgroundColor: ev.target.value } })}
                      />
                    </Col>
                    <Col xs={2} className={styles.boxContent}>
                      <button
                        style={{ backgroundColor: this.state.Normal.backgroundColor }}
                        className={styles.box}
                        onClick={() => this.setState({ showPicker: this.state.showPicker === 'n-background-color' ? '' : 'n-background-color' })}
                      ></button>
                      { this.state.showPicker === 'n-background-color' &&
                        <div className={styles.colorPicker}>
                          <ChromePicker
                            color={this.state.Normal.backgroundColor}
                            onChangeComplete={(color) => this.setState({ Normal: { ...this.state.Normal, backgroundColor: color.hex } })}
                          />
                        </div>
                      }
                    </Col>
                  </Row>
                }

              </div>
            }

            <button onClick={() => this.setState({ activePanel: 'Active' })} className={`${styles.panel} ${this.state.activePanel === 'Active' && styles.active}`}>Active</button>
            { this.state.activePanel === 'Active' && this.state.Active && // Active
              <div className={styles.body}>

                { this.state.Active.fontFamily && // front-family
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Font Family :</Col>
                    <Col xs={7}>
                      <select
                        value={this.state.Active.fontFamily}
                        onChange={(ev) => this.setState({ Active: { ...this.state.Active, fontFamily: ev.target.value } })}
                      >
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Arial">Arial</option>
                      </select>
                    </Col>
                  </Row>
                }

                { this.state.Active.color && // front-color
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Font Color :</Col>
                    <Col xs={5}>
                      <input
                        value={this.state.Active.color}
                        onChange={(ev) => this.setState({ Active: { ...this.state.Active, color: ev.target.value } })}
                      />
                    </Col>
                    <Col xs={2} className={styles.boxContent}>
                      <button
                        style={{ backgroundColor: this.state.Active.color }}
                        className={styles.box}
                        onClick={() => this.setState({ showPicker: this.state.showPicker === 'a-font-color' ? '' : 'a-font-color' })}
                      ></button>
                      { this.state.showPicker === 'a-font-color' &&
                        <div className={styles.colorPicker}>
                          <ChromePicker
                            color={this.state.Active.color}
                            onChangeComplete={(color) => this.setState({ Active: { ...this.state.Active, color: color.hex } })}
                          />
                        </div>
                      }
                    </Col>
                  </Row>
                }

                { this.state.Active.backgroundColor && // background-color
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Background Color :</Col>
                    <Col xs={5}>
                      <input
                        value={this.state.Active.backgroundColor}
                        onChange={(ev) => this.setState({ Active: { ...this.state.Active, backgroundColor: ev.target.value } })}
                      />
                    </Col>
                    <Col xs={2} className={styles.boxContent}>
                      <button
                        style={{ backgroundColor: this.state.Active.backgroundColor }}
                        className={styles.box}
                        onClick={() => this.setState({ showPicker: this.state.showPicker === 'a-background-color' ? '' : 'a-background-color' })}
                      ></button>
                      { this.state.showPicker === 'a-background-color' &&
                        <div className={styles.colorPicker}>
                          <ChromePicker
                            color={this.state.Active.backgroundColor}
                            onChangeComplete={(color) => this.setState({ Active: { ...this.state.Active, backgroundColor: color.hex } })}
                          />
                        </div>
                      }
                    </Col>
                  </Row>
                }

              </div>
            }

            <button onClick={() => this.setState({ activePanel: 'Hover' })} className={`${styles.panel} ${this.state.activePanel === 'Hover' && styles.active}`}>Hover</button>
            { this.state.activePanel === 'Hover' && this.state.Hover && // Hover
              <div className={styles.body}>

                { this.state.Hover.fontFamily && // front-family
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Font Family :</Col>
                    <Col xs={7}>
                      <select
                        value={this.state.Hover.fontFamily}
                        onChange={(ev) => this.setState({ Hover: { ...this.state.Hover, fontFamily: ev.target.value } })}
                      >
                        <option value="Montserrat, sans-serif">Montserrat</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Arial">Arial</option>
                      </select>
                    </Col>
                  </Row>
                }

                { this.state.Hover.color && // front-color
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Font Color :</Col>
                    <Col xs={5}>
                      <input
                        value={this.state.Hover.color}
                        onChange={(ev) => this.setState({ Hover: { ...this.state.Hover, color: ev.target.value } })}
                      />
                    </Col>
                    <Col xs={2} className={styles.boxContent}>
                      <button
                        style={{ backgroundColor: this.state.Hover.color }}
                        className={styles.box}
                        onClick={() => this.setState({ showPicker: this.state.showPicker === 'h-font-color' ? '' : 'h-font-color' })}
                      ></button>
                      { this.state.showPicker === 'h-font-color' &&
                        <div className={styles.colorPicker}>
                          <ChromePicker
                            color={this.state.Hover.color}
                            onChangeComplete={(color) => this.setState({ Hover: { ...this.state.Hover, color: color.hex } })}
                          />
                        </div>
                      }
                    </Col>
                  </Row>
                }

                { this.state.Hover.backgroundColor && // background-color
                  <Row className={styles.row} middle="xs">
                    <Col xs={4} className="text-right">Background Color :</Col>
                    <Col xs={5}>
                      <input
                        value={this.state.Hover.backgroundColor}
                        onChange={(ev) => this.setState({ Hover: { ...this.state.Hover, backgroundColor: ev.target.value } })}
                      />
                    </Col>
                    <Col xs={2} className={styles.boxContent}>
                      <button
                        style={{ backgroundColor: this.state.Hover.backgroundColor }}
                        className={styles.box}
                        onClick={() => this.setState({ showPicker: this.state.showPicker === 'h-background-color' ? '' : 'h-background-color' })}
                      ></button>
                      { this.state.showPicker === 'h-background-color' &&
                        <div className={styles.colorPicker}>
                          <ChromePicker
                            color={this.state.Hover.backgroundColor}
                            onChangeComplete={(color) => this.setState({ Hover: { ...this.state.Hover, backgroundColor: color.hex } })}
                          />
                        </div>
                      }
                    </Col>
                  </Row>
                }

              </div>
            }

          </div>
        </Popover>
      </div>
    );
  }
}

ButtonStyling.propTypes = {
  label: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  anchorOrigin: PropTypes.object,
  targetOrigin: PropTypes.object,
  settingStyle: PropTypes.object,
};

ButtonStyling.defaultProps = {
  label: '',
  anchorOrigin: {},
  targetOrigin: {},
  settingStyle: null,
};

export default connect(null, null)(ButtonStyling);
