import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'react-flexbox-grid';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Layout from '../Layout';
import BreadCrumb from '../../../components/AdminLayout/components/BreadCrumb';
import Box from '../../../components/AdminLayout/components/Box';
import request from '../../../utils/request';
import { apiUrl } from '../../../config';
import styles from './styles.css';

const YxisTick = (props) => {
  const { x, y, dy, fill, width, heigth, payload, textAnchor } = props; // eslint-disable-line
  return (<text
    data-automation-id="text-cyberadashboard-customize-yaxis-tick"
    x={x} y={y}
    width={width}
    fill={fill} textAnchor={textAnchor}
    className="recharts-text recharts-cartesian-axis-tick-value"
  >
    <tspan x={x} dy="0.355em" >{`$${payload.value}`}</tspan>
  </text>);
};

const CustomToolTips = (props) => {
  const { label, name, payload } = props; // eslint-disable-line
  return (<div
    data-automation-id="div-cyberadashboard-customize-yaxis-tooltips"
    className="recharts-default-tooltip"
    style={{ margin: 0, padding: '10px', backgroundColor: 'rgb(255, 255, 255)', border: '1px solid rgb(204, 204, 204)', whiteSpace: 'nowrap' }}
  >
    <p
      className="recharts-tooltip-label"
      style={{ margin: 0 }}
    >{label}</p>
    {payload.length > 0 &&
      <ul
        className="recharts-tooltip-item-list"
        style={{ padding: 0, margin: 0 }}
      >
        <li className="recharts-tooltip-item" style={{ display: 'block', paddingTop: '4px', paddingBottom: '4px', color: 'rgb(55, 135, 193)' }}>
          <span className="recharts-tooltip-item-name">{payload[0].dataKey}</span>
          <span className="recharts-tooltip-item-separator"> : </span>
          <span className="recharts-tooltip-item-value">{`$${payload[0].value}`}</span>
          <span className="recharts-tooltip-item-unit"></span>
        </li>
      </ul>
    }
  </div>);
};

class DashBoard extends React.Component {
  constructor() {
    super();
    this.state = {
      TotalRegisteration: [],
      TotalCancellation: [],
      TotalPlanRenewal: [],
      TotalEarning: [],
      PlanTotalSubscriber: [],
    };
  }

  componentWillMount() {
    request.get(`${apiUrl}/Dashboard/TotalRegisteration`, {}, (response) => {
      if (response.data) {
        this.setState({ TotalRegisteration: response.data.Items });
      }
    });

    request.get(`${apiUrl}/Dashboard/TotalCancellation`, {}, (response) => {
      if (response.data) {
        this.setState({ TotalCancellation: response.data.Items });
      }
    });

    request.get(`${apiUrl}/Dashboard/TotalPlanRenewal`, {}, (response) => {
      if (response.data) {
        this.setState({ TotalPlanRenewal: response.data.Items });
      }
    });

    request.get(`${apiUrl}/Dashboard/TotalEarning`, {}, (response) => {
      if (response.data) {
        this.setState({ TotalEarning: response.data.Items });
      }
    });

    request.get(`${apiUrl}/Dashboard/PlanTotalSubscriber`, {}, (response) => {
      if (response.data) {
        this.setState({ PlanTotalSubscriber: response.data.Items });
      }
    });
  }

  render() {
    const TotalRegisteration = [];
    const TotalCancellation = [];
    const TotalPlanRenewal = [];
    const TotalEarning = [];
    const PlanTotalSubscriber = [];

  //  const theMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const theMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    for (let i = 1; i < 13; i += 1) {
      const indexMonth = (currentMonth + i) % 12;
      let YearShown = '';
      if (indexMonth > currentMonth) {
        YearShown = (currentYear - 1).toString().substr(2, 3);
      } else {
        YearShown = currentYear.toString().substr(2, 3);
      }

      TotalRegisteration.push({ Name: `${theMonths[indexMonth]} ${YearShown}`, 'Total Registrations': 0 });
    }

    if (this.state.TotalRegisteration.length > 0) {
      for (let i = 1; i < 13; i += 1) {
        const indexMonth = (currentMonth + i) % 12;
        let YearShown = '';
        if (indexMonth > currentMonth) {
          YearShown = (currentYear - 1).toString().substr(2, 3);
        } else {
          YearShown = currentYear.toString().substr(2, 3);
        }
        for (let j = 0; j < this.state.TotalRegisteration.length; j += 1) {
          const dateFromDatabase = this.state.TotalRegisteration[j].Name;
          const monthDatabase = parseInt(dateFromDatabase.substr(0, 2), 10) - 1;
          const yearDatabase = dateFromDatabase.substr(5, 6);
          if (monthDatabase === indexMonth && yearDatabase === YearShown) {
            TotalRegisteration[i - 1]['Total Registrations'] = this.state.TotalRegisteration[j].Amount;
          }
        }
      }
    }

    for (let i = 1; i < 13; i += 1) {
      const indexMonth = (currentMonth + i) % 12;
      let YearShown = '';
      if (indexMonth > currentMonth) {
        YearShown = (currentYear - 1).toString().substr(2, 3);
      } else {
        YearShown = currentYear.toString().substr(2, 3);
      }

      TotalCancellation.push({ Name: `${theMonths[indexMonth]} ${YearShown}`, 'Total Cancellations': 0 });
    }

    if (this.state.TotalCancellation.length > 0) {
      for (let i = 1; i < 13; i += 1) {
        const indexMonth = (currentMonth + i) % 12;
        let YearShown = '';
        if (indexMonth > currentMonth) {
          YearShown = (currentYear - 1).toString().substr(2, 3);
        } else {
          YearShown = currentYear.toString().substr(2, 3);
        }
        for (let j = 0; j < this.state.TotalCancellation.length; j += 1) {
          const dateFromDatabase = this.state.TotalCancellation[j].Name;
          const monthDatabase = parseInt(dateFromDatabase.substr(0, 2), 10) - 1;
          const yearDatabase = dateFromDatabase.substr(5, 6);
          if (monthDatabase === indexMonth && yearDatabase === YearShown) {
            TotalCancellation[i - 1]['Total Cancellations'] = this.state.TotalCancellation[j].Amount;
          }
        }
      }
    }

    for (let i = 1; i < 13; i += 1) {
      const indexMonth = (currentMonth + i) % 12;
      let YearShown = '';
      if (indexMonth > currentMonth) {
        YearShown = (currentYear - 1).toString().substr(2, 3);
      } else {
        YearShown = currentYear.toString().substr(2, 3);
      }

      TotalPlanRenewal.push({ Name: `${theMonths[indexMonth]} ${YearShown}`, 'Total Renewals': 0 });
    }

    if (this.state.TotalPlanRenewal.length > 0) {
      for (let i = 1; i < 13; i += 1) {
        const indexMonth = (currentMonth + i) % 12;
        let YearShown = '';
        if (indexMonth > currentMonth) {
          YearShown = (currentYear - 1).toString().substr(2, 3);
        } else {
          YearShown = currentYear.toString().substr(2, 3);
        }
        for (let j = 0; j < this.state.TotalPlanRenewal.length; j += 1) {
          const dateFromDatabase = this.state.TotalPlanRenewal[j].Name;
          const monthDatabase = parseInt(dateFromDatabase.substr(0, 2), 10) - 1;
          const yearDatabase = dateFromDatabase.substr(5, 6);
          if (monthDatabase === indexMonth && yearDatabase === YearShown) {
            TotalPlanRenewal[i - 1]['Total Renewals'] = this.state.TotalPlanRenewal[j].Amount;
          }
        }
      }
    }

    for (let i = 1; i < 13; i += 1) {
      const indexMonth = (currentMonth + i) % 12;
      let YearShown = '';
      if (indexMonth > currentMonth) {
        YearShown = (currentYear - 1).toString().substr(2, 3);
      } else {
        YearShown = currentYear.toString().substr(2, 3);
      }

      TotalEarning.push({ Name: `${theMonths[indexMonth]} ${YearShown}`, 'Total Earnings': 0 });
    }

    if (this.state.TotalEarning.length > 0) {
      for (let i = 1; i < 13; i += 1) {
        const indexMonth = (currentMonth + i) % 12;
        let YearShown = '';
        if (indexMonth > currentMonth) {
          YearShown = (currentYear - 1).toString().substr(2, 3);
        } else {
          YearShown = currentYear.toString().substr(2, 3);
        }
        for (let j = 0; j < this.state.TotalEarning.length; j += 1) {
          const dateFromDatabase = this.state.TotalEarning[j].Name;
          const monthDatabase = parseInt(dateFromDatabase.substr(0, 2), 10) - 1;
          const yearDatabase = dateFromDatabase.substr(5, 6);
          if (monthDatabase === indexMonth && yearDatabase === YearShown) {
            TotalEarning[i - 1]['Total Earnings'] = this.state.TotalEarning[j].Amount;
          }
        }
      }
    }

    PlanTotalSubscriber.push({ Name: 'Web Only (no e-commerce)',
      'Total Subscribers': 0,
    });
    PlanTotalSubscriber.push({ Name: 'Business',
      'Total Subscribers': 0,
    });
    PlanTotalSubscriber.push({ Name: 'Enterprise',
      'Total Subscribers': 0,
    });
    PlanTotalSubscriber.push({ Name: 'Unlimited',
      'Total Subscribers': 0,
    });

    if (this.state.PlanTotalSubscriber.length > 0) {
      for (let i = 0; i < 4; i += 1) {
        for (let j = 0; j < this.state.PlanTotalSubscriber.length; j += 1) {
          if (this.state.PlanTotalSubscriber[j].Name === PlanTotalSubscriber[i].Name) {
            PlanTotalSubscriber[i]['Total Subscribers'] = this.state.PlanTotalSubscriber[j].Amount;
          }
        }
      }
    }

    const yaixTicks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const yaixTicksEarnings = [];
    let count = 0;
    for (let i = 0; i <= 10000 / 1000; i += 1) {
      yaixTicksEarnings.push(count);
      count += 1000;
    }

    return (
      <Layout data-automation-id="page-cyberadashboard">
        <BreadCrumb
          breadCrumb={[
            <button data-automation-id="btn-cyberadashboard-link" key="Dashboard" onClick={() => window.location.reload()}>Dashboard</button>,
          ]}
        />
        <h2></h2>
        <Box>
          <Row>
            <Col xs={12} sm={12} md={12}>
              <p className={styles.graphHeader}>Total Registrations for last 12 months</p>
              <div className={styles.barContainer}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchart-cyberadashboard-totalregistration" data={TotalRegisteration}>
                    <XAxis dataKey="Name" />
                    <YAxis domain={[0, 100]} ticks={yaixTicks} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Registrations" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.barContainerMobile}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchartmobile-cyberadashboard-totalregistration" data={TotalRegisteration}>
                    <Bar dataKey="Total Registrations" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} style={{ marginTop: '40px' }}>
              <p className={styles.graphHeader}>Total Cancellations for last 12 months</p>
              <div className={styles.barContainer}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchart-cyberadashboard-totalcancellation" data={TotalCancellation}>
                    <XAxis dataKey="Name" />
                    <YAxis domain={[0, 100]} ticks={yaixTicks} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Cancellations" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.barContainerMobile}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchartmobile-cyberadashboard-totalcancellation" data={TotalCancellation}>
                    <Bar dataKey="Total Cancellations" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} style={{ marginTop: '40px' }}>
              <p className={styles.graphHeader}>Total Renewals for last 12 months</p>
              <div className={styles.barContainer}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchart-cyberadashboard-totalrenewal" data={TotalPlanRenewal}>
                    <XAxis dataKey="Name" />
                    <YAxis domain={[0, 100]} ticks={yaixTicks} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Renewals" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.barContainerMobile}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchartmobile-cyberadashboard-totalrenewal" data={TotalPlanRenewal}>
                    <Bar dataKey="Total Renewals" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} style={{ marginTop: '40px' }}>
              <p className={styles.graphHeader}>Total Earnings for last 12 months</p>
              <div className={styles.barContainer}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchart-cyberadashboard-totalearning" data={TotalEarning}>
                    <XAxis dataKey="Name" />
                    <YAxis tick={<YxisTick />} domain={[0, 10000]} ticks={yaixTicksEarnings} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip content={<CustomToolTips />} />
                    <Legend />
                    <Bar dataKey="Total Earnings" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.barContainerMobile}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchartmobile-cyberadashboard-totalearning" data={TotalEarning}>
                    <Bar dataKey="Total Earnings" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} style={{ marginTop: '40px' }}>
              <p className={styles.graphHeader}>Total Subscribers for last 12 months</p>
              <div className={styles.barContainer}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchart-cyberadashboard-totalsubscriber" data={PlanTotalSubscriber} barCategoryGap="30%">
                    <XAxis dataKey="Name" />
                    <YAxis domain={[0, 100]} ticks={yaixTicks} />
                    <CartesianGrid strokeDasharray="2 2" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Total Subscribers" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className={styles.barContainerMobile}>
                <ResponsiveContainer>
                  <BarChart data-automation-id="barchartmobile-cyberadashboard-totalsubscriber" data={PlanTotalSubscriber} barCategoryGap="30%">
                    <Bar dataKey="Total Subscribers" fill="#3787C1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Col>
          </Row>
        </Box>
      </Layout>);
  }
}

DashBoard.propTypes = {
  location: PropTypes.object.isRequired,
};

export default DashBoard;
