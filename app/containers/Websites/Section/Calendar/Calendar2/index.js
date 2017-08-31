import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Calendar from 'material-ui/DatePicker/Calendar';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CalendarBackIcon from 'material-ui/svg-icons/image/navigate-before';
import CalendarNextIcon from 'material-ui/svg-icons/image/navigate-next';

import './styles.css';

import TextBox from '../../../Components/TextBox';

class Calendar2 extends Component {

  constructor(props) {
    super(props);
    const splitDefaultDate = props.setting.date.defaultDate.split('/');
    const todayDate = new Date();
    const defaultDate = new Date(splitDefaultDate[2], splitDefaultDate[1] - 1, splitDefaultDate[0]);
    this.state = {
      isSelectYear: false,
      selectYear: [...Array(25)],
      activeYear: props.setting.date.today ? todayDate.getFullYear() : defaultDate.getFullYear(),
      activeMonth: props.setting.date.today ? todayDate.getMonth() : defaultDate.getMonth(),
      currentDate: props.setting.date.today ? todayDate : defaultDate,
    };
  }

  componentDidMount() {
    this.moveMonthView();
    this.calendar.setSelectedDate(this.state.currentDate);
    window.addEventListener('resize', this.moveMonthView());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.setting.date.today !== this.props.setting.date.today) {
      const splitDefaultDate = nextProps.setting.date.defaultDate.split('/');
      const todayDate = new Date();
      const defaultDate = new Date(splitDefaultDate[2], splitDefaultDate[1] - 1, splitDefaultDate[0]);
      this.setState({
        activeYear: nextProps.setting.date.today ? todayDate.getFullYear() : defaultDate.getFullYear(),
        activeMonth: nextProps.setting.date.today ? todayDate.getMonth() : defaultDate.getMonth(),
        currentDate: nextProps.setting.date.today ? todayDate : defaultDate,
      }, () => {
        this.calendar.setSelectedDate(this.state.currentDate);
      });
    }
  }

  componentDidUpdate() {
    this.moveMonthView();
  }

  setYear(year, condition) {
    if (condition) return;
    const currentDate = this.state.currentDate;
    currentDate.setFullYear(year, currentDate.getMonth(), 1);
    this.setState({ isSelectYear: false, activeYear: year, currentDate }, () => {
      this.calendar.setSelectedDate(new Date(this.state.activeYear, this.state.activeMonth));
    });
  }

  setSelectYear() {
    const selectYear = this.state.selectYear;
    for (let i = 0; i < selectYear.length; i += 1) {
      if (i === 12) selectYear[i] = this.state.activeYear;
      if (i < 12) selectYear[12 - (i + 1)] = this.state.activeYear - (i + 1);
      if (i > 12) selectYear[i] = this.state.activeYear + (i - 12);
    }
    return selectYear;
  }

  moveMonthView() {
    this.monthView.scrollLeft = this.monthView.children[this.state.activeMonth].offsetLeft
                                - ((this.monthView.children[this.state.activeMonth].clientWidth + 20) * 2);
  }

  prepareDateMinMax(currentDate, minDate, maxDate, month, year) {
    const temp = {
      allow: false,
      date: new Date(year, month, 1),
    };
    if (
      (temp.date.getMonth() === maxDate.getMonth() && temp.date.getFullYear() === maxDate.getFullYear()) ||
      (temp.date.getMonth() === minDate.getMonth() && temp.date.getFullYear() === minDate.getFullYear())
    ) {
      temp.allow = true;
      return temp;
    }
    if (
      temp.date.getTime() > maxDate.getTime() ||
      temp.date.getTime() < minDate.getTime()
    ) return temp;

    temp.allow = true;
    return temp;
  }

  render() {
    const { id, editMode, title, descrip, setting } = this.props;
    const StyleTools = { width: 35, height: 35, color: setting.toolsColor };
    const month = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ];
    const splitMinDate = setting.date.minDate.split('/');
    const splitMaxDate = setting.date.maxDate.split('/');
    const minDate = new Date(splitMinDate[2], splitMinDate[1] - 1, splitMinDate[0]);
    const maxDate = new Date(splitMaxDate[2], splitMaxDate[1] - 1, splitMaxDate[0]);

    const sectionCalendar = (
      <div className="content-calendar">
        <TextBox
          id={`calendar-2-title-${id}`}
          editMode={editMode}
          sectionID={id}
          type="title"
        >{ title }</TextBox>
        <div
          className="calendar"
          style={{
            backgroundColor: `${setting.calendarBg}`,
            height: `${setting.calendarHeight}px`,
          }}
        >
          <div className="month justify-content-center" ref={(el) => { this.monthView = el; }}>
            {
              month.map((x, index) => {
                const prepareDate = this.prepareDateMinMax(this.state.currentDate, minDate, maxDate, index, this.state.activeYear);
                const style = {
                  // textDecoration: !prepareDate.allow ? 'line-through' : 'initial',
                };
                return (
                  <button
                    key={`month-${x}`}
                    style={{
                      color: index === this.state.activeMonth ?
                            setting.toolCalendar.activeColor :
                            setting.toolCalendar.color,
                      display: !prepareDate.allow ? 'none' : 'inline-block',
                    }}
                    onClick={() => {
                      if (index === this.state.activeMonth) return;
                      if (!prepareDate.allow) return;
                      this.setState({ activeMonth: index, currentDate: prepareDate.date });
                      if (index < this.state.activeMonth) this.calendar.handleMonthChange(-(this.state.activeMonth - index));
                      if (index > this.state.activeMonth) this.calendar.handleMonthChange(index - this.state.activeMonth);
                    }}
                  >
                    { index === this.state.activeMonth ?
                      <b>{x}</b> : <small style={style}>{x}</small>
                    }
                  </button>
                );
              })
            }
          </div>
          <div className="year">
            <button
              style={{ color: setting.toolCalendar.activeColor }}
              onClick={() => this.setState({ selectYear: this.setSelectYear() }, this.setState({ isSelectYear: true }))}
            >
              {this.state.activeYear}
            </button>
          </div>
          <div className="day" style={{ color: setting.toolCalendar.color }}>
            <small>S</small>
            <small>M</small>
            <small>T</small>
            <small>W</small>
            <small>T</small>
            <small>F</small>
            <small>S</small>
          </div>
          <Calendar
            ref={(el) => { this.calendar = el; }}
            firstDayOfWeek={0}
            minDate={minDate}
            maxDate={maxDate}
          />
        </div>
        <div className="tools-group">
          <IconButton
            iconStyle={StyleTools}
            onClick={() => {
              const activeMonth = this.state.activeMonth - 1;
              const prepareDate = this.prepareDateMinMax(
                this.state.currentDate,
                minDate,
                maxDate,
                activeMonth < 0 ? 11 : activeMonth,
                activeMonth < 0 ? this.state.activeYear - 1 : this.state.activeYear
              );
              if (!prepareDate.allow) return;
              this.setState({
                activeMonth: prepareDate.date.getMonth(),
                activeYear: prepareDate.date.getFullYear(),
                currentDate: prepareDate.date,
              });
              this.calendar.handleMonthChange(-1);
            }}
          ><CalendarBackIcon /></IconButton>
          <IconButton
            iconStyle={StyleTools}
            onClick={() => {
              const activeMonth = this.state.activeMonth + 1;
              const prepareDate = this.prepareDateMinMax(
                this.state.currentDate,
                minDate,
                maxDate,
                activeMonth > 11 ? 0 : activeMonth,
                activeMonth > 11 ? this.state.activeYear + 1 : this.state.activeYear
              );
              if (!prepareDate.allow) return;
              this.setState({
                activeMonth: prepareDate.date.getMonth(),
                activeYear: prepareDate.date.getFullYear(),
                currentDate: prepareDate.date,
              });
              this.calendar.handleMonthChange(1);
            }}
          ><CalendarNextIcon /></IconButton>
        </div>
      </div>
    );

    const sectionDescrip = (
      <div className="content-descrip">
        <TextBox
          id={`calendar-2-descrip-${id}`}
          editMode={editMode}
          sectionID={id}
          type="descrip"
        >{ descrip }</TextBox>
      </div>
    );

    const sectionSelectYear = this.state.isSelectYear ? (
      <Dialog
        open={Boolean(true)}
        onRequestClose={() => this.setState({ isSelectYear: false })}
        contentStyle={{
          width: 270,
          height: 450,
          overflow: 'auto',
        }}
      >
        {
          this.state.selectYear.map((x) => {
            const condition = x < minDate.getFullYear() || x > maxDate.getFullYear();
            const style = {
              color: '#000',
              textDecoration: condition ? 'line-through' : 'initial',
            };
            if (x === this.state.activeYear) {
              return (
                <FlatButton
                  label={x}
                  key={`year-select-${x}`}
                  style={style}
                  fullWidth={Boolean(true)}
                  backgroundColor="#a4c639"
                  onClick={() => this.setYear(x, condition)}
                />
              );
            }
            return (
              <FlatButton
                label={x}
                key={`year-select-${x}`}
                style={style}
                fullWidth={Boolean(true)}
                onClick={() => this.setYear(x, condition)}
              />
            );
          })
        }
      </Dialog>
    ) : null;

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(setting.override)}>
        <div
          className="calendar-2"
          data-automation-id="section-calendar"
          data-automation-design="calendar-1"
          data-automation-section-id={id}
        >
          <div className="row-spacial">
            <div className="col-md-8 flex-md-first flex-sm-last" style={{ paddingRight: '0' }}>{ sectionCalendar }</div>
            <div
              className="col-md-4"
              style={{ display: 'flex', alignItems: 'center', backgroundColor: setting.descripBg }}
            >{ sectionDescrip }</div>
          </div>
          { sectionSelectYear }
        </div>
      </MuiThemeProvider>
    );
  }
}

Calendar2.propTypes = {
  id: PropTypes.number.isRequired,
  editMode: PropTypes.bool,
  setting: PropTypes.object,
  title: PropTypes.string,
  descrip: PropTypes.string,
};

Calendar2.defaultProps = {
  editMode: false,
  setting: {},
  descrip: '',
  title: '',
};

export default Calendar2;
