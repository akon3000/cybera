import React from 'react';
import PropTypes from 'prop-types';
import IconClose from 'react-icons/lib/md/close';
import { Field, reduxForm } from 'redux-form/immutable';
import MenuItem from 'material-ui/MenuItem';
import { Row, Col } from 'react-flexbox-grid';
import { Map } from 'immutable';

import styles from './styles.css';
import InputDateMonthYear from '../../../../components/InputDateMonthYear';
import Input from '../../../../components/Input';
import AutoComplete from '../../../../components/AutoComplete';
import Select from '../../../../components/Select';
import TextArea from '../../../../components/TextArea';
import RadioGroup from '../../../../components/RadioGroup';
import Loading from '../../../../components/Loading';
import ErrorBox from '../../../../components/ErrorBox';
import request from '../../../../utils/request';
import Validate from '../../../../utils/validate';
import { stringToDate } from '../../../../utils';
import message from '../../../../Message';
import { apiUrl, defaultCountryID } from '../../../../config';

export const natureOfBusinessAPI = `${apiUrl}/NatureOfBusiness`;
export const timeZoneAPI = (countryID) => `${apiUrl}/Timezone/${countryID}`;
export const hearAboutAPI = `${apiUrl}/HowDidYouHearAboutCybera`;
export const titleAPI = `${apiUrl}/title`;
export const postcodeAPI = (countryID, postcode) => `${apiUrl}/Postcode/${countryID}/${postcode}?$top=10`;
export const districtAPI = (countryID, keyword) => `${apiUrl}/Suburb/${countryID}/${keyword}?$top=10`;

export const validate = (valuesBefore) => {
  if (!Map.isMap(valuesBefore)) return {};
  const values = valuesBefore;
  const errors = {};

  const requiredFields = {
    natureOfBusiness(value) {
      if (!value) return message.format('require_choose', 'nature of business');
      return true;
    },
    timeZone(value) {
      if (!value) return message.format('require_choose', 'time zone');
      return true;
    },
    businessDescription(value) {
      if (!value) return message.format('require_enter', 'business description');
      const maxLength = Validate.isValidLength(value, 250, 'Business description');
      if (maxLength !== true) return maxLength;
      return true;
    },
    hearCybera(value) {
      if (!value) return message.format('require_choose', 'how you hear about Cybera');
      return true;
    },
    title(value) {
      if (!value) return message.format('require_select', 'title');
      return true;
    },
    firstName(value) {
      if (!value) return message.format('require_enter', 'first name');
      const maxLength = Validate.isValidLength(value, 50, 'First name');
      if (maxLength !== true) return maxLength;
      const matchName = Validate.matchName(value);
      if (matchName !== true) return matchName;
      return true;
    },
    lastName(value) {
      if (!value) return message.format('require_enter', 'last name');
      const maxLength = Validate.isValidLength(value, 50, 'Last name');
      if (maxLength !== true) return maxLength;
      const matchName = Validate.matchName(value);
      if (matchName !== true) return matchName;
      return true;
    },
    address(value) {
      if (!value) return message.format('require_enter', 'address');
      const maxLength = Validate.isValidLength(value, 50, 'Address');
      if (maxLength !== true) return maxLength;
      const matchAddress = Validate.matchAddress(value);
      if (matchAddress !== true) return matchAddress;
      return true;
    },
    postcode(value) {
      if (!value) return message.format('require_enter', 'postcode');
      const maxLength = Validate.isValidLength(value, 25, 'Postcode');
      if (maxLength !== true) return maxLength;
      const notSpecialChar = Validate.notSpecialChar(value);
      if (notSpecialChar !== true) return notSpecialChar;
      return true;
    },
    district(value) {
      if (!value) return message.format('require_enter', 'suburb');
      const maxLength = Validate.isValidLength(value, 50, 'Suburb');
      if (maxLength !== true) return maxLength;
      const notNumeric = Validate.notNumeric(value);
      if (notNumeric !== true) return notNumeric;
      const notSpecialChar = Validate.notSpecialChar(value);
      if (notSpecialChar !== true) return notSpecialChar;
      return true;
    },
    state(value) {
      if (!value) return message.format('require_choose', 'state');
      const maxLength = Validate.isValidLength(value, 50, 'State');
      if (maxLength !== true) return maxLength;
      const notNumeric = Validate.notNumeric(value);
      if (notNumeric !== true) return notNumeric;
      const matchPlace = Validate.matchPlace(value);
      if (matchPlace !== true) return matchPlace;
      return true;
    },
    country(value) {
      if (!value) return message.format('require_choose', 'country');
      const maxLength = Validate.isValidLength(value, 50, 'Country');
      if (maxLength !== true) return maxLength;
      const notNumeric = Validate.notNumeric(value);
      if (notNumeric !== true) return notNumeric;
      const matchPlace = Validate.matchPlace(value);
      if (matchPlace !== true) return matchPlace;
      return true;
    },
    dateOfBirth(value) {
      if (!value) return message.format('require_enter', 'date of birth');
      const maxLength = Validate.isValidLength(value, 10, 'Date of birth');
      if (maxLength !== true) return maxLength;
      const matchDateOfBrith = Validate.matchDateOfBirth(value);
      if (matchDateOfBrith !== true) return matchDateOfBrith;
      return true;
    },
    contactNumber(value) {
      if (!value) return message.format('require_enter', 'contact number');
      const maxLength = Validate.isValidLength(value, 14, 'Contact number');
      if (maxLength !== true) return maxLength;
      const matchContactNumber = Validate.matchContactNumber(value);
      if (matchContactNumber !== true) return matchContactNumber;
      return true;
    },
  };

  values.country = defaultCountryID;
  if (!values.get('country')) values.set('country', defaultCountryID);

  for (const [field, fc] of Object.entries(requiredFields)) { // eslint-disable-line
    const msg = fc(values.get(field));
    if (msg !== true) errors[field] = msg;
  }

  return errors;
};

export class BusinessInfoPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      dateOfBirth: null,
      natureOfBusiness: [],
      timeZone: [],
      hearCybera: [],
      title: [],
      postcodeAutofill: [],
      districtAutofill: [],
      isLoadingPostcode: false,
      isLoadingDistrict: false,
      postcodeSearchText: '',
      districtSearchText: '',
      isSubscribe: true,
      country: defaultCountryID,
      states: [],
      isLoading: false,
      error: false,
    };
  }

  componentWillMount() {
    request.get(natureOfBusinessAPI, {}, (response) => {
      if (response.data) {
        this.setState({ natureOfBusiness: response.data.Items });
      }
    });

    request.get(hearAboutAPI, {}, (response) => {
      if (response.data) {
        this.setState({ hearCybera: response.data.Items });
      }
    });

    request.get(titleAPI, {}, (response) => {
      if (response.data) {
        this.setState({ title: response.data.Items });
      }
    });
    this.getTimeZone();
  }

  componentDidMount() {
    this.props.change('signUpID', this.props.signUpID);
    this.props.change('isSubscribe', true);
    this.props.change('country', 'Australia');
    request.get(`${apiUrl}/State/${this.state.country}`, {}, (response) => {
      if (response.data) {
        this.setState({ states: response.data.Items });
      }
    });
  }

  getTimeZone() {
    const API = timeZoneAPI(this.state.country);
    request.get(API, {}, (response) => {
      if (response.data) {
        this.setState({ timeZone: response.data.Items }, () => {
          this.props.change('timeZone', '(UTC+10:00) Canberra, Melbourne, Sydney');
        });
      }
    });
  }

  getPostcodeAutofill(keyword) {
    const API = postcodeAPI(this.state.country, keyword.trim());
    request.get(API, {}, (response) => {
      if (response.data) {
        const datas = [];
        for (let i = 0; i < response.data.Items.length; i += 1) {
          datas.push({
            text: response.data.Items[i].PostCode,
            value: (
              <MenuItem
                primaryText={`${response.data.Items[i].PostCode}, ${response.data.Items[i].district}, ${response.data.Items[i].state}`}
              />
            ),
            object: response.data.Items[i],
          });
        }
        this.setState({ isLoadingPostcode: false, postcodeAutofill: datas });
      } else {
        this.setState({ isLoadingPostcode: false });
      }
    });
  }

  getDistrictAutofill(keyword) {
    const API = districtAPI(this.state.country, keyword.trim());
    request.get(API, {}, (response) => {
      if (response.data) {
        const datas = [];
        for (let i = 0; i < response.data.Items.length; i += 1) {
          datas.push({
            text: response.data.Items[i].district,
            value: (
              <MenuItem
                primaryText={`${response.data.Items[i].PostCode}, ${response.data.Items[i].district}, ${response.data.Items[i].state}`}
              />
            ),
            object: response.data.Items[i],
          });
        }
        this.setState({ isLoadingDistrict: false, districtAutofill: datas });
      } else {
        this.setState({ isLoadingDistrict: false });
      }
    });
  }

  submit(values) {
    const datas = {
      WebsiteNatureOfBusinessId: values.get('natureOfBusiness'),
      WebsiteHowDidYouHearAboutCyberaId: values.get('hearCybera'),
      TitleId: values.get('title'),
      TimeZone: values.get('timeZone'),
      District: values.get('district'),
      State: values.get('state'),
      Country: values.get('country'),
      FirstName: values.get('firstName'),
      LastName: values.get('lastName'),
      PhoneNumber: values.get('contactNumber'),
      BirthDate: stringToDate(values.get('dateOfBirth')).toUTCString(),
      Description: values.get('businessDescription'),
      Address1: values.get('address'),
      PostCode: values.get('postcode'),
      IsReceiveCyberaNewsLetter: values.get('isSubscribe'), // not have yet
    };

    const API = `${apiUrl}/Users/SignUpBusinessDetail/${values.get('signUpID')}`;
    this.setState({ isLoading: true });
    request.put(
      API,
      datas,
      (response) => {
        if (!response.error) {
          const isFreeTrial = response.data;
          this.props.onSuccess(isFreeTrial);
        } else {
          this.setState({ error: response.error, isLoading: false });
        }
      });
  }

  render() {
    const natureOfBusinessJSXs = [];
    for (let i = 0; i < this.state.natureOfBusiness.length; i += 1) {
      natureOfBusinessJSXs.push(<MenuItem key={`natureOfBusiness_${i}`} value={this.state.natureOfBusiness[i].Id} primaryText={this.state.natureOfBusiness[i].Name} />);
    }

    const timeZoneJSXs = [];
    for (let i = 0; i < this.state.timeZone.length; i += 1) {
      timeZoneJSXs.push(<MenuItem key={`timeZone_${i}`} value={this.state.timeZone[i].DisplayName} primaryText={this.state.timeZone[i].DisplayName} />);
    }

    const hearCyberaJSXs = [];
    for (let i = 0; i < this.state.hearCybera.length; i += 1) {
      hearCyberaJSXs.push(<MenuItem key={`hearCybera_${i}`} value={this.state.hearCybera[i].Id} primaryText={this.state.hearCybera[i].Name} />);
    }

    const titleJSXs = [];
    for (let i = 0; i < this.state.title.length; i += 1) {
      titleJSXs.push(<radio key={`title_${i}`} value={this.state.title[i].Id} label={this.state.title[i].Name} />);
    }

    const stateJSXs = [];
    for (let i = 0; i < this.state.states.length; i += 1) {
      stateJSXs.push(<MenuItem key={`state_${i}`} value={this.state.states[i].ShortName} primaryText={this.state.states[i].ShortName} />);
    }

    const countryJSXs = [];
    countryJSXs.push(<MenuItem key={'country_573'} value="Australia" primaryText="Australia" />);

    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit((values) => this.submit(values))} data-automation-id="form-business-infomation">
        <div className={styles.background}>
          <div className={styles.box}>
            <div key="Popup_Title" className={styles.titleBox}>
              Business Information
              <button data-automation-id="btn-close" className={styles.closeButton} onClick={() => this.props.onClose()} type="button"><IconClose /></button>
            </div>
            <div className={styles.body}>
              <Row>
                { this.state.error &&
                  <Col xs={12} style={{ padding: '20px' }}>
                    <ErrorBox data-automation-id="error-box" error={this.state.error} onClose={() => { this.setState({ error: false }); }} />
                  </Col>
                }
                <Col md={6} sm={12}>
                  <Row>
                    <Col xs={12}>
                      <Field data-automation-id="select-nature-business" name="natureOfBusiness" component={Select} label="Nature of business">
                        {natureOfBusinessJSXs}
                      </Field>
                    </Col>
                    <Col xs={12} style={{ marginTop: '10px' }}>
                      <Field data-automation-id="select-time-zone" name="timeZone" component={Select} label="Time zone">
                        {timeZoneJSXs}
                      </Field>
                    </Col>
                    <Col xs={12} style={{ marginTop: '15px' }}>
                      <Field
                        label="Business Description"
                        name="businessDescription"
                        data-automation-id="textarea-business-description"
                        component={TextArea}
                        rows="5"
                      />
                    </Col>
                    <Col xs={12} style={{ marginTop: '15px' }}>
                      <Field
                        label="How did you hear about Cybera?"
                        data-automation-id="select-about-cybera"
                        name="hearCybera"
                        component={Select}
                      >
                        {hearCyberaJSXs}
                      </Field>
                    </Col>
                  </Row>
                </Col>
                <Col md={6} sm={12} className={styles.rightColumn}>
                  <Row>
                    <Col xs={12}>
                      <Field name="title" component={RadioGroup} label="Title" data-automation-id="radiogroup-title-name">
                        {titleJSXs}
                      </Field>
                    </Col>
                    <Col xs={6}>
                      <Field label="First Name" name="firstName" type="text" component={Input} data-automation-id="input-first-name" />
                    </Col>
                    <Col xs={6}>
                      <Field label="Last Name" name="lastName" type="text" component={Input} data-automation-id="input-last-name" />
                    </Col>
                    <Col xs={12}>
                      <Field label="Address" name="address" type="text" component={Input} data-automation-id="input-address" />
                    </Col>
                    <Col xs={6}>
                      <Field
                        key="PostcodeAutoFill"
                        data-automation-id="autocomplete-post-code"
                        label="Postcode" name="postcode" type="text" component={AutoComplete}
                        dataSource={this.state.postcodeAutofill}
                        value={this.state.postcodeSearchText}
                        onChange={(value) => this.props.change('postcode', value)}
                        searchText={this.state.postcodeSearchText}
                        isLoading={this.state.isLoadingPostcode}
                        onFocus={() => {
                          this.setState({ postcodeAutofill: [] });
                        }}
                        onUpdateInput={(value) => {
                          if (value !== '') {
                            this.setState({ isLoadingPostcode: true });
                            clearTimeout(this.typingPostCodeTimer);
                            this.typingPostCodeTimer = setTimeout(() => {
                              this.setState({ postcodeSearchText: value });
                              this.props.change('postcode', value);
                              this.getPostcodeAutofill(value);
                            }, 500);
                          }
                        }}
                        onNewRequest={(obj) => {
                          this.setState({ postcodeSearchText: obj.object.PostCode });
                          this.setState({ districtSearchText: obj.object.district });
                          this.props.change('postcode', obj.object.PostCode);
                          this.props.change('state', obj.object.state);
                          this.props.change('district', obj.object.district);
                          this.props.change('country', 'Australia');
                        }}
                      />
                    </Col>
                    <Col xs={6}>
                      <Field
                        key="SuburbAutoFill"
                        data-automation-id="autocomplete-suburb"
                        label="Suburb" name="district" type="text" component={AutoComplete}
                        dataSource={this.state.districtAutofill}
                        value={this.state.districtSearchText}
                        searchText={this.state.districtSearchText}
                        isLoading={this.state.isLoadingDistrict}
                        onFocus={() => {
                          this.setState({ districtAutofill: [] });
                        }}
                        onUpdateInput={(value) => {
                          if (value !== '') {
                            this.setState({ isLoadingDistrict: true });
                            clearTimeout(this.typingDistrictTimer);
                            this.typingDistrictTimer = setTimeout(() => {
                              this.getDistrictAutofill(value);
                            }, 500);
                          }
                        }}
                        onNewRequest={(obj) => {
                          this.setState({ postcodeSearchText: obj.object.PostCode });
                          this.setState({ districtSearchText: obj.object.district });
                          this.props.change('state', obj.object.state);
                          this.props.change('postcode', obj.object.PostCode);
                          this.props.change('district', obj.object.district);
                          this.props.change('country', 'Australia');
                        }}
                      />
                    </Col>
                    <Col xs={6}>
                      <Field
                        name="state"
                        data-automation-id="select-state"
                        component={Select}
                        label="State"
                      >
                        {stateJSXs}
                      </Field>
                    </Col>
                    <Col xs={6}>
                      <Field
                        name="country"
                        data-automation-id="select-country"
                        component={Select}
                        label="Country"
                        defaultValue={this.state.country}
                      >
                        {countryJSXs}
                      </Field>
                    </Col>
                    <Col xs={6} style={{ marginTop: '12px' }}>
                      <Field
                        label="Date of birth"
                        name="dateOfBirth"
                        component={InputDateMonthYear}
                      />
                    </Col>
                    <Col xs={6} style={{ marginTop: '9px' }}>
                      <Field label="Contact Number" name="contactNumber" type="text" component={Input} data-automation-id="input-contact-number" />
                    </Col>
                  </Row>
                </Col>
                <Col xs={12}>
                  <div className={styles.buttonFooter}>
                    <button data-automation-id="btn-next-step" type="submit" className={styles.nextButton}>Next</button>
                  </div>
                </Col>
              </Row>
            </div>
            { this.state.isLoading && <Loading /> }
          </div>
        </div>
      </form>
    );
  }
}

BusinessInfoPopup.propTypes = {
  signUpID: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default reduxForm({
  form: 'BusinessInfoPopup',
  validate,
  initinitialValues: {
    country: defaultCountryID,
    isSubscribe: true,
  },
})(BusinessInfoPopup);
