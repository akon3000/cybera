import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import MenuItem from 'material-ui/MenuItem';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Input from '../../../../components/Input';
import Select from '../../../../components/Select';
import AutoComplete from '../../../../components/AutoComplete';
import request from '../../../../utils/request';
import { apiUrl } from '../../../../config';
import Loading from '../../../../components/Loading';
import styles from './styles.css';
import validate from '../../../../utils/validate';
import Button from '../../../../components/Button';
import SuccessPopup from '../../../../components/SuccessPopup';
import ErrorPopup from '../../../../components/ErrorPopup';

export const timeZoneAPI = (countryID) => `${apiUrl}/Timezone/${countryID}`;
export const postcodeAPI = (countryID, postcode) => `${apiUrl}/Postcode/${countryID}/${postcode}?$top=10`;
export const districtAPI = (countryID, keyword) => `${apiUrl}/Suburb/${countryID}/${keyword}?$top=10`;

export const editWebsiteDetailsValidate = (values) => {
  const errors = {};

  const requiredFields = {
    address: 'Please enter address line',
    postcode: 'Please enter postcode',
    district: 'Please enter suburb',
    state: 'Please choose state',
    country: 'Please choose country',
    website: 'Please enter website name',
    natureOfBusiness: 'Please choose nature of business',
    copyright: 'Please enter copyright',
    timeZone: 'Please choose time zone',
  };

  for (const [field, hint] of Object.entries(requiredFields)) { // eslint-disable-line
    if (!values.get(field)) {
      errors[field] = hint;
    }
  }

  if (values.get('website')) {
    const isValidLength = validate.isValidLength(values.get('website'), 50, 'Website name');
    const isWebsiteName = validate.isWebsiteName(values.get('website'));
    if (values.get('website').length < 3) {
      errors.website = 'Website name cannot be less than 3 characters';
    } else if (isValidLength !== true && isWebsiteName !== true) {
      errors.website = `${isValidLength}.  ${isWebsiteName}.`;
    } else if (isValidLength !== true) {
      errors.website = isValidLength;
    } else if (isWebsiteName !== true) {
      errors.website = isWebsiteName;
    }
  }

  if (values.get('copyright')) {
    const isValidLength = validate.isValidLength(values.get('copyright'), 50, 'Copyright');
    const isCopyright = validate.isCopyright(values.get('copyright'));
    if (isValidLength !== true && isCopyright !== true) {
      errors.copyright = `${isValidLength}.  ${isCopyright}.`;
    } else if (isValidLength !== true) {
      errors.copyright = isValidLength;
    } else if (isCopyright !== true) {
      errors.copyright = isCopyright;
    }
  }

  if (values.get('address')) {
    const isValidLength = validate.isValidLength(values.get('address'), 50, 'Address');
    const matchAddress = validate.matchAddress(values.get('address'));
    if (isValidLength !== true && matchAddress !== true) {
      errors.address = `${isValidLength}.  ${matchAddress}.`;
    } else if (isValidLength !== true) {
      errors.address = isValidLength;
    } else if (matchAddress !== true) {
      errors.address = matchAddress;
    }
  }

  if (values.get('postcode')) {
    const isValidLength = validate.isValidLength(values.get('postcode'), 25, 'Postcode');
    if (isValidLength !== true) {
      errors.postcode = isValidLength;
    }
  }

  if (values.get('district')) {
    errors.district = '';
    const isValidLength = validate.isValidLength(values.get('district'), 50, 'Suburb');
    const notNumeric = validate.notNumeric(values.get('district'));
    const notSpecialChar = validate.notSpecialChar(values.get('district'));
    if (isValidLength !== true) {
      errors.district += `${isValidLength}. `;
    }
    if (notNumeric !== true) {
      errors.district += `${notNumeric}. `;
    }
    if (notSpecialChar !== true) {
      errors.district += `${notSpecialChar}.`;
    }
  }

  return errors;
};

export class EditWebsiteDetails extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      loading: true,
      submitMessage: '',
      editWebsitePopupShow: false,
      addressId: '',
      addressDetailId: '',
      natureOfBusiness: [],
      timeZone: [],
      postcodeAutofill: [],
      districtAutofill: [],
      isLoadingPostcode: false,
      isLoadingDistrict: false,
      postcodeSearchText: '',
      districtSearchText: '',
      isSubscribe: true,
      country: [],
      countryId: 573,
      states: [],
      addressInitializeData: {},
      otherInitializeData: {},
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/NatureOfBusiness`, {}, (response) => {
      if (response.data) {
        this.setState({ natureOfBusiness: response.data.Items });
      }
    });

    request.get(`${apiUrl}/Country`, {}, (response) => {
      if (response.data) {
        this.setState({ country: response.data.Items });
      }
    });

    const API = timeZoneAPI(this.state.countryId);
    request.get(API, {}, (response) => {
      if (response.data) {
        this.setState({ timeZone: response.data.Items });
      }
    });
  }

  componentDidMount() {
    this.props.change('country', 'Australia');
    request.get(`${apiUrl}/State/${this.state.countryId}`, {}, (response) => {
      if (response.data) {
        this.setState({ states: response.data.Items });
      }
    });
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Address`, {}, (response) => {
      if (response.data) {
        this.setState({
          addressInitializeData: response.data.Items[0].AddressDetail,
          addressId: response.data.Items[0].Id,
          addressDetailId: response.data.Items[0].AddressDetail.Id,
        });
      }
    });
    request.get(`${apiUrl}/Websites/${localStorage.getItem('websiteID')}`, {}, (response) => {
      if (response.data) {
        this.setState({ otherInitializeData: response.data }, () => {
          this.handleInitialize();
        });
      }
    });
  }

  getPostcodeAutofill(keyword) {
    const API = postcodeAPI(this.state.countryId, keyword.trim());
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
    const API = districtAPI(this.state.countryId, keyword.trim());
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

  handleInitialize() {
    this.setState({ postcodeSearchText: this.state.addressInitializeData.PostCode });
    this.setState({ districtSearchText: this.state.addressInitializeData.District });
    const initData = {
      address: (this.state.addressInitializeData.Address) ? this.state.addressInitializeData.Address : '',
      postcode: (this.state.addressInitializeData.PostCode) ? this.state.addressInitializeData.PostCode : '',
      district: (this.state.addressInitializeData.District) ? this.state.addressInitializeData.District : '',
      state: (this.state.addressInitializeData.State) ? this.state.addressInitializeData.State : '',
      country: (this.state.addressInitializeData.CountryName) ? '573' : '',
      email: (this.state.otherInitializeData.Email) ? this.state.otherInitializeData.Email : '',
      website: (this.state.otherInitializeData.WebsiteName) ? this.state.otherInitializeData.WebsiteName : '',
      natureOfBusiness: (this.state.otherInitializeData.NatureOfBusiness) ? this.state.otherInitializeData.NatureOfBusiness.Id : '',
      copyright: (this.state.otherInitializeData.CopyRight) ? this.state.otherInitializeData.CopyRight : '',
      timeZone: (this.state.otherInitializeData.TimeZone) ? this.state.otherInitializeData.TimeZone : '',
    };
    this.props.initialize(initData);
    this.setState({ loading: false });
  }

  submit(values) {
    const addressParams = {
      Id: parseInt(this.state.addressId, 10),
      District: values.get('district'),
      State: values.get('state'),
      Address: values.get('address'),
      PostCode: values.get('postcode'),
      CountryName: 'Australia',
      AddressDetailId: parseInt(this.state.addressDetailId, 10),
    };

    const otherParams = {
      WebsiteName: values.get('website'),
      WebsiteNatureOfBusinessId: values.get('natureOfBusiness'),
      TimeZone: values.get('timeZone'),
      CopyRight: values.get('copyright'),
    };

    this.setState({ loading: true });
    request.put(
      `${apiUrl}/Websites/${localStorage.getItem('websiteID')}/Address`, addressParams,
      (response) => {
        if (!response.error) {
          request.put(
            `${apiUrl}/Websites/${localStorage.getItem('websiteID')}`, otherParams,
            (response1) => {
              if (!response1.error) {
                this.setState({
                  submitMessage: 'Website details updated',
                  editWebsitePopupShow: true,
                  loading: false,
                });
              } else {
                this.setState({
                  error: response1.error,
                  loading: false,
                });
              }
            }
          );
        } else {
          this.setState({
            error: response.error,
            loading: false,
          });
        }
      }
    );
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

    const stateJSXs = [];
    for (let i = 0; i < this.state.states.length; i += 1) {
      stateJSXs.push(<MenuItem key={`state_${i}`} value={this.state.states[i].ShortName} primaryText={this.state.states[i].ShortName} />);
    }

    const countryJSXs = [];
    countryJSXs.push(<MenuItem key={'country_573'} value="573" primaryText="Australia" />);

    const { handleSubmit } = this.props;
    const popup = [];

    if (this.state.editWebsitePopupShow) {
      popup.push(
        <SuccessPopup
          key="EditWebsiteDetailsPopupWindow"
          data-automation-id="popup-edit-websitedetails-success"
          onClose={() => {
            this.setState({ editWebsitePopupShow: false }, () => { this.props.history.push('/MCAdmin/WebsiteManagement'); });
          }}
        >
          <h3>You have been successful</h3>
          <div>{this.state.submitMessage}</div>
        </SuccessPopup>
      );
    }

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-popup-edit-websitedetails-fail"
          error={this.state.error}
          key="EditWebsiteDetailsPopupError"
          onClose={() => { this.setState({ error: false }); }}
        />
      );
    }

    return (
      <Layout data-automation-id="page-edit-websitedetails">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-website-management-link" key="Website Management Details" onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement')}>Website Management</button>,
            <button data-automation-id="btn-edit-websitedetails-link" key="edit website details" onClick={() => window.location.reload()}>Edit Website Details</button>,
          ]}
        />
        <h2>Edit Website Details</h2>
        <Box>
          <form data-automation-id="form-edit-websitedetails" onSubmit={handleSubmit((values) => this.submit(values))}>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-edit-websitedetails-email" label="Email address" name="email" type="text" component={Input} disabled />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-edit-websitedetails-website" label="Website name" name="website" type="text" component={Input} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="select-edit-websitedetails-nature-business" name="natureOfBusiness" component={Select} label="Nature of business">
                  {natureOfBusinessJSXs}
                </Field>
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="select-edit-websitedetails-time-zone" name="timeZone" component={Select} label="Time zone">
                  {timeZoneJSXs}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-edit-websitedetails-copyright" label="Copyright" name="copyright" type="text" component={Input} />
              </Col>
              <Col xs={12} md={6}>
                <Field data-automation-id="input-edit-websitedetails-address" label="Address" name="address" type="text" component={Input} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field
                  key="PostcodeAutoFill"
                  data-automation-id="autocomplete-edit-websitedetails-post-code"
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
                    this.props.change('country', '573');
                  }}
                />
              </Col>
              <Col xs={12} md={6}>
                <Field
                  key="SuburbAutoFill"
                  data-automation-id="autocomplete-edit-websitedetails-suburb"
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
                    this.props.change('country', '573');
                  }}
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={6}>
                <Field
                  name="state"
                  data-automation-id="select-edit-websitedetails-state"
                  component={Select}
                  label="State"
                >
                  {stateJSXs}
                </Field>
              </Col>
              <Col xs={12} md={6}>
                <Field
                  name="country"
                  data-automation-id="select-edit-websitedetails-country"
                  component={Select}
                  label="Country"
                  defaultValue={this.state.countryId}
                >
                  {countryJSXs}
                </Field>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12}>
                <div className={styles.buttonFooter}>
                  <Button
                    data-automation-id="btn-edit-websitedetails-submit"
                    type="submit"
                    onClick={() => {
                      if (!this.state.codeInput) {
                        this.setState({ errorCodeInput: 'Please enter code' });
                      }
                    }}
                  >Save</Button>
                  <Button data-automation-id="btn-edit-websitedetails-cancel" type="button" btnStyle="negative" onClick={() => this.props.history.push('/MCAdmin/WebsiteManagement')}>Cancel</Button>
                </div>
              </Col>
            </Row>
          </form>
          {popup}
        </Box>
        { this.state.loading && <Loading /> }
      </Layout>);
  }
}

EditWebsiteDetails.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  initialize: PropTypes.func.isRequired,
//  dispatch: PropTypes.func.isRequired,
  change: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'EditWebsiteDetails',
  validate: editWebsiteDetailsValidate,
})(EditWebsiteDetails);
