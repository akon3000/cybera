import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from 'react-icons/lib/md/search';
import { Field, reduxForm } from 'redux-form/immutable';
import { Row, Col } from 'react-flexbox-grid';
import Layout from '../../Layout';
import BreadCrumb from '../../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../../components/AdminLayout/components/Box';
import Table from '../../../../../app/components/Table';
// import styles from './styles.css';
import ErrorPopup from '../../../../../app/components/ErrorPopup';
import Button from '../../../../components/Button';
import InputWithIcon from '../../../../components/InputWithIcon';
import validate from '../../../../utils/validate';

export const FileManagerUsageValidate = (values) => {
  const errors = {};

  if (!values.get('website') && !values.get('merchant')) {
    errors.website = 'Please enter website';
    errors.merchant = 'Please enter merchant';
  }

  if (values.get('website')) {
    const isValidLength = validate.isValidLength(values.get('website'), 50, 'Website');
    const isWebsiteName = validate.isWebsiteName(values.get('website'));
    if (isValidLength !== true && isWebsiteName !== true) {
      errors.website = `${isValidLength}.  ${isWebsiteName}.`;
    } else if (isValidLength !== true) {
      errors.website = isValidLength;
    } else if (isWebsiteName !== true) {
      errors.website = isWebsiteName;
    }
  }

  if (values.get('merchant')) {
    const isValidLength = validate.isValidLength(values.get('merchant'), 100, 'Merchant');
    const isName = validate.isName(values.get('merchant'), "-'.");
    if (isValidLength !== true && isName !== true) {
      errors.merchant = `${isValidLength}.  ${isName}.`;
    } else if (isValidLength !== true) {
      errors.merchant = isValidLength;
    } else if (isName !== true) {
      errors.merchant = isName;
    }
  }

  return errors;
};

class FileManagerUsage extends React.Component {

  constructor() {
    super();
    this.state = {
      error: false,
      filter: [],
      searchParams: '',
    };
  }

  search(merchant, website) {
    const filter = [
      { Columns: ['Merchant'], keywords: merchant },
      { Columns: ['Website'], keywords: website },
    ];
    this.setState({ filter, search: true });
  }

  render() {
    const header = [
      { Label: 'Merchant', Name: 'Merchant', align: 'center' },
      { Label: 'Website', Name: 'Website', align: 'center' },
      { Label: 'Plan', Name: 'Plan', align: 'center' },
      { Label: 'Allocate Storage', Name: 'AllocateStorage', align: 'center' },
      { Label: 'AllocateStorage', Name: 'Hide', align: 'center' },
      { Label: 'Total Usage', Name: 'TotalUsage', align: 'center' },
      { Label: 'TotalUsage', Name: 'Hide', align: 'center' },
      { Label: 'Percentage Usage', Name: 'PercentageUsage', align: 'center' },
      { Label: 'PercentageUsage', Name: 'Hide', align: 'center' },
      { Label: 'Available', Name: 'AvailableAmount', align: 'center' },
      { Label: 'AvailableAmount', Name: 'Hide', align: 'center' },
    ];

    const body = [
      (value) => value.Name,
      (value) => value.WebsiteName,
      (value) => value.Plan,
      (value) => {
        let Allocatestorage = '';
        if (value.Plan === 'Unlimited') {
          Allocatestorage = 'Unlimited';
        } else {
          Allocatestorage = `${value.Allocatestorage}MB`;
        }
        return Allocatestorage;
      },
      (value) => {
        let Allocatestorage = 0;
        if (value.Plan === 'Unlimited') {
          Allocatestorage = 10000000000000;
        } else {
          Allocatestorage = parseInt(value.Allocatestorage, 10);
        }
        return Allocatestorage;
      },
      (value) => `${value.TotalUsage}MB`,
      (value) => value.TotalUsage,
      (value) => {
        let PercentageUsage = '';
        if (value.Plan === 'Unlimited') {
          PercentageUsage = 'N/A';
        } else if (value.PercentageUsage === '0') {
          PercentageUsage = '0.00%';
        } else {
          PercentageUsage = `${parseFloat(value.PercentageUsage).toFixed(2)}%`;
        }
        return PercentageUsage;
      },
      (value) => {
        let PercentageUsage = 0;
        if (value.Plan === 'Unlimited') {
          PercentageUsage = 'N/A';
        } else {
          PercentageUsage = parseFloat(value.PercentageUsage).toFixed(2);
        }
        return PercentageUsage;
      },
      (value) => {
        let Available = '';
        if (value.Plan === 'Unlimited') {
          Available = 'N/A';
        } else {
          Available = `${value.Available}MB`;
        }
        return Available;
      },
      (value) => {
        let Available = 0;
        if (value.Plan === 'Unlimited') {
          Available = 10000000000000;
        } else {
          Available = parseFloat(value.Available);
        }
        return Available;
      },
    ];

    const downloadBody = [
      (value) => value.Merchant,
      (value) => value.Website,
      (value) => value.Plan,
      (value) => value['Allocate Storage'],
      (value) => value['Total Usage'],
      (value) => value['Percentage Usage'],
      (value) => value.Available,
    ];

    return (
      <Layout data-automation-id="page-report-filemanagerusage">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-report-registration-link" key="Reports" onClick={() => this.props.history.push('/CBAdmin/MerchantReport/Registration')}>Report</button>,
            <button data-automation-id="btn-report-filemanagerusage-link" key="filemanagerusage" onClick={() => window.location.reload()}>File Manager Storage Usage</button>,
          ]}
        />
        <h2>File Manager Storage Usage</h2>
        <Box>
          <form data-automation-id="form-report-filemanagerusage-search" onSubmit={this.props.handleSubmit((values) => this.search(values.get('merchant'), values.get('website')))}>
            <Row end="xs">
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-report-filemanagerusage-merchant" hintText="Merchant" name="merchant" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={5}>
                <Field data-automation-id="input-report-filemanagerusage-website" hintText="Website" name="website" type="text" component={InputWithIcon} icon={<SearchIcon />} />
              </Col>
              <Col xs={12} sm={4} lg={2}>
                <Button data-automation-id="btn-report-planrenewal-search"><SearchIcon /> Search</Button>
              </Col>
            </Row>
          </form>
          <Table
            data-automation-id="table-report-filemanagerusage"
            dataSource="Report/MerchantFileManagerStorageReport"
            header={header}
            body={body}
            downloadBody={downloadBody}
            filter={this.state.filter}
            fileName="File Manager Storage Usage"
            onClearSearch={() => {
              this.setState({ filter: [] }, () => {
                this.props.reset();
              });
            }}
          />
        </Box>
        { this.state.error &&
          <ErrorPopup
            data-automation-id="error-report-filemanagerusage"
            error={this.state.error}
            onClose={() => { this.setState({ error: false }); }}
          />
        }
      </Layout>);
  }
}

FileManagerUsage.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default reduxForm({
  form: 'FileManagerUsage',
  validate: FileManagerUsageValidate,
})(FileManagerUsage);
