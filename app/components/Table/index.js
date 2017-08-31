import React from 'react';
import PropTypes from 'prop-types';
import LeftIcon from 'react-icons/lib/md/chevron-left';
import RightIcon from 'react-icons/lib/md/chevron-right';
import ArrowUPIcon from 'react-icons/lib/ti/arrow-sorted-up';
import ArrowDownIcon from 'react-icons/lib/ti/arrow-sorted-down';
import SwipeableViews from 'react-swipeable-views';
import SwipeIndicatorLeft from 'react-icons/lib/fa/chevron-left';
import SwipeIndicatorRight from 'react-icons/lib/fa/chevron-right';
import tableFunctions from './tableFunctions';
import styles from './styles.css';
import Loading from '../Loading';
import { numberWithCommas } from '../../utils';
import excelIcon from './excel.svg';
import csvIcon from './csv.svg';
import { downLoadExcel, downLoadCSV } from '../../utils/excel';
import ErrorPopup from '../ErrorPopup';
// import Dialog from '../Dialog';
import Button from '../Button';

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      sourceUrl: props.dataSource,
      initialSource: props.dataSource,
      allItems: [],
      ItemsShow: [],
      error: false,
      errorMessage: '',
      currentPage: 1,
      itemPerPage: 10,
      totalItem: 0,
      sortKeyword: '',
      sortOrder: '',
      sortMatrix: [],
      searchedsortedItems: [],
      filter: props.filter,
      tableIndexMobile: 0,
      pageForceReload: props.pageForceReload,
    };
  }

  componentDidMount() {
    const self = this;
    self.setState({ loading: true });
    tableFunctions.loadAllItems(this.state.sourceUrl, (response) => {
      if (!response.error) {
        self.setState({
          loading: false,
          allItems: tableFunctions.ItemsConvert(self.props.header, self.props.body, response.Items),
          totalItem: response.Items.length,
        }, () => {
          this.setState({ ItemsShow: self.state.allItems.slice(0, self.state.itemPerPage) });
        });
      } else {
        self.setState({
          loading: false,
          error: true,
          errorMessage: response.error,
        });
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filter !== this.state.filter) {
      this.setState({
        filter: nextProps.filter,
        currentPage: 1,
        tableIndexMobile: 0,
        sortKeyword: '',
        sortOrder: '',
        sortMatrix: [],
      }, () => {
        const searchedData = tableFunctions.searchItem(this.state);
        this.setState({
          searchedsortedItems: searchedData.searchedItems,
          ItemsShow: searchedData.ItemsShow,
          totalItem: searchedData.searchedItems.length,
        });
      });
    }

    if (nextProps.dataSource !== this.state.sourceUrl || nextProps.pageForceReload !== this.state.pageForceReload) {
      this.setState({
        sourceUrl: nextProps.dataSource,
        pageForceReload: nextProps.pageForceReload,
        currentPage: 1,
        tableIndexMobile: 0,
        loading: true,
        sortKeyword: '',
        sortOrder: '',
        sortMatrix: [],
        searchedsortedItems: [],
      }, () => {
        tableFunctions.loadAllItems(this.state.sourceUrl, (response) => {
          if (!response.error) {
            this.setState({
              loading: false,
              allItems: tableFunctions.ItemsConvert(this.props.header, this.props.body, response.Items),
              totalItem: response.Items.length }, () => {
              this.setState({ ItemsShow: this.state.allItems.slice(0, this.state.itemPerPage) });
            });
          } else {
            this.setState({
              loading: false,
              error: true,
              errorMessage: response.error,
            });
          }
        });
      });
    }
  }

  onClear() {
    if (this.props.onClearSearch !== null) this.props.onClearSearch();
  }

  tableIndexChange(index) {
    this.setState({ tableIndexMobile: index });
  }

  render() {
    const popup = [];

    if (this.state.error) {
      popup.push(
        <ErrorPopup
          data-automation-id="error-popup-table-component"
          key="ErrorLoadingPopupWindow"
          error={this.state.errorMessage}
          onClose={() => this.setState({ error: false })}
        />
      );
    }

    const headers = [];
    const tbodys = [];
    const numberofColumns = this.props.downloadBody.length;
    const columnPercentage = Math.floor(100 / numberofColumns);

    this.props.header.forEach((value) => {
      if (value.Name !== 'Hide') {
        headers.push(<th // eslint-disable-line
          key={value.Label}
          id={value.Name}
          style={{ width: `${columnPercentage}%` }}
          className={(value.Label !== 'SortDisable') ? styles.th : ''}
          onClick={(evt) => {
            if (value.Label !== 'SortDisable' && this.state.totalItem > 1) {
              this.setState({
                sortKeyword: evt.target.id,
              }, () => {
                const sortKeyValues = tableFunctions.sortMatrixGen(this.state);
                this.setState({
                  sortOrder: sortKeyValues.sortOrder,
                  sortMatrix: sortKeyValues.sortMatrix,
                }, () => {
                  const sortedData = tableFunctions.sortItem(this.state);
                  this.setState({
                    searchedsortedItems: sortedData.sortedItems,
                    ItemsShow: sortedData.ItemsShow,
                    currentPage: 1,
                  });
                });
              });
            }
          }}
        >{value.Label !== 'SortDisable' && value.Label}&nbsp;
          <div className={(this.state.sortKeyword === value.Name && this.state.totalItem > 1) ? styles.arrowshow : styles.arrowhidden}>
            {((this.state.sortOrder === 'asc') ? <ArrowUPIcon /> : <ArrowDownIcon />)}
          </div>
        </th>);
      }
    });

    if (this.state.ItemsShow.length > 0) {
      let trCount = 0;
      this.state.ItemsShow.forEach((value) => {
        const trs = [];
        let tdCount = 0;
        Object.keys(value).forEach((key) => {
          const textAlign = this.props.header[tdCount].align || 'left';
          const paddingLeft = 0;
          const paddingRight = 0;
          if (this.props.header[tdCount].Name !== 'Hide') {
            trs.push(<td
              style={{ textAlign, paddingLeft, paddingRight, wordWrap: 'break-word', width: `${columnPercentage}%` }}
              className={this.props.header[tdCount].className}
              key={`td_${tdCount}`}
            >{value[key]}</td>);
          }
          tdCount += 1;
        });
        tbodys.push(<tr key={`tr_${trCount += 1}`}>{trs}</tr>);
      });
    }

    const swipeTable = [];
    let itemsCount = 0;
    if (this.state.filter.length > 0) {
      this.state.searchedsortedItems.forEach((value) => {
        let headerIndex = 0;
        const trMobile = [];
        Object.keys(value).forEach((key) => {
          if (this.props.header[headerIndex].Name !== 'Hide') {
            trMobile.push(<tr key={`${this.props.header[headerIndex].Label}${itemsCount}`}>
              <td style={{ wordWrap: 'break-word' }}>
                <b>{this.props.header[headerIndex].Label !== 'SortDisable' && this.props.header[headerIndex].Label}</b>
              </td>
              <td style={{ wordWrap: 'break-word' }}>{value[key]}</td></tr>);
          }
          headerIndex += 1;
        });
        swipeTable.push(
          <div key={`DIV${itemsCount}`}>
            <table key={`TABLE${itemsCount}`} style={{ tableLayout: 'fixed' }}>
              <tbody>{trMobile}</tbody>
            </table>
          </div>
        );
        itemsCount += 1;
      });
    } else {
      this.state.allItems.forEach((value) => {
        let headerIndex = 0;
        const trMobile = [];
        Object.keys(value).forEach((key) => {
          if (this.props.header[headerIndex].Name !== 'Hide') {
            trMobile.push(<tr key={`${this.props.header[headerIndex].Label}${itemsCount}`}>
              <td style={{ wordWrap: 'break-word' }}>
                <b>{this.props.header[headerIndex].Label !== 'SortDisable' && this.props.header[headerIndex].Label}</b>
              </td>
              <td style={{ wordWrap: 'break-word' }}>{value[key]}</td></tr>);
          }
          headerIndex += 1;
        });
        swipeTable.push(
          <div key={`DIV${itemsCount}`}>
            <table key={`TABLE${itemsCount}`} style={{ tableLayout: 'fixed' }}>
              <tbody>{trMobile}</tbody>
            </table>
          </div>
        );
        itemsCount += 1;
      });
    }

    return (
      <div>
        <div className={styles.tableMobileContainer}>
          <SwipeableViews key="Load Tables" onChangeIndex={(index) => { this.tableIndexChange(index); }} index={this.state.tableIndexMobile}>
            {swipeTable}
          </SwipeableViews>
          <button
            className={`${styles.SwipeIndicatorLeft}
            ${(this.state.tableIndexMobile === 0) && styles.disabled}
            ${(this.state.totalItem === 0) && styles.hide}`}
          >
            <SwipeIndicatorLeft size="30" />
          </button>
          <button
            className={`${styles.SwipeIndicatorRight}
            ${(this.state.tableIndexMobile === this.state.totalItem - 1) && styles.disabled}
            ${(this.state.totalItem === 0) && styles.hide}`}
          >
            <SwipeIndicatorRight size="30" />
          </button>
          {
            this.props.dataSource === this.state.initialSource && this.state.filter.length === 0 && !this.state.loading && this.state.allItems.length === 0 &&
            <div style={{ fontSize: '14px', textAlign: 'center', margin: '25px 0' }}><b>No data found</b></div>
          }
          {
            this.props.dataSource === this.state.initialSource && this.state.filter.length > 0 && this.state.searchedsortedItems.length === 0 &&
            <div style={{ fontSize: '14px', textAlign: 'center', margin: '25px 0' }}><b>No result found on your given search criteria</b></div>
          }
          {
            this.props.dataSource !== this.state.initialSource && this.state.filter.length === 0 && this.state.allItems.length === 0 &&
            <div style={{ fontSize: '14px', textAlign: 'center', margin: '25px 0' }}><b>No result found on your given search criteria</b></div>
          }

          {this.state.errorMessage === '' && !this.state.loading && this.state.totalItem > 0 &&
            <div style={{ textAlign: 'right', fontSize: '12px' }}>
              {this.state.tableIndexMobile + 1} of {this.state.totalItem}
            </div>
          }
          {this.state.loading && <Loading />}
        </div>

        <div className={styles.tableContainer}>
          <table style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                {headers}
              </tr>
            </thead>
            <tbody>
              {tbodys}
              {
                this.props.dataSource === this.state.initialSource && this.state.filter.length === 0 && !this.state.loading && this.state.allItems.length === 0 &&
                <tr>
                  <td colSpan="100%" style={{ textAlign: 'center', padding: '20px 0' }}><b>No data found</b></td>
                </tr>
              }
              {
                this.props.dataSource === this.state.initialSource && this.state.filter.length > 0 && this.state.searchedsortedItems.length === 0 &&
                <tr>
                  <td colSpan="100%" style={{ textAlign: 'center', padding: '20px 0' }}><b>No result found on your given search criteria</b></td>
                </tr>
              }
              {
                this.props.dataSource !== this.state.initialSource && this.state.filter.length === 0 && this.state.allItems.length === 0 &&
                <tr>
                  <td colSpan="100%" style={{ textAlign: 'center', padding: '20px 0' }}><b>No result found on your given search criteria</b></td>
                </tr>
              }
            </tbody>
          </table>
          {this.state.loading && <Loading />}
        </div>
        <div className={styles.footerContainer}>
          <div className={styles.downloads}>
            <button
              type="button"
              title="Download Excel"
              onClick={() => {
                const items = ((this.props.filter.length > 0 || this.props.dataSource !== this.state.initialSource) && !this.state.loading) ? this.state.searchedsortedItems : this.state.allItems;
                const wsName = this.props.fileName ? this.props.fileName : 'download';
                const data = tableFunctions.getDownloadData(this.props.header,
                  this.props.downloadBody, items);
                downLoadExcel(data, wsName);
              }}
              className={styles.download}
            >
              <img alt="presentation" width="16" height="16" src={excelIcon} />
            </button>
            <button
              type="button"
              title="Download CSV"
              onClick={() => {
                const items = ((this.props.filter.length > 0 || this.props.dataSource !== this.state.initialSource) && !this.state.loading) ? this.state.searchedsortedItems : this.state.allItems;
                const wsName = this.props.fileName ? this.props.fileName : 'download';
                const data = tableFunctions.getDownloadData(this.props.header,
                  this.props.downloadBody, items);
                downLoadCSV(data, wsName);
              }}
              className={styles.download}
            >
              <img alt="presentation" width="16" height="16" src={csvIcon} />
            </button>
          </div>
          {!this.props.hideDownLoad &&
            <div className={styles.downloadsMobile}>
              <button
                type="button"
                title="Download Excel"
                onClick={() => {
                  const items = ((this.props.filter.length > 0 || this.props.dataSource !== this.state.initialSource) && !this.state.loading) ? this.state.searchedsortedItems : this.state.allItems;
                  const wsName = this.props.fileName ? this.props.fileName : 'download';
                  const data = tableFunctions.getDownloadData(this.props.header,
                    this.props.downloadBody, items);
                  downLoadExcel(data, wsName);
                }}
                className={styles.download}
              >
                <img alt="presentation" width="16" height="16" src={excelIcon} />
              </button>
              <button
                type="button"
                title="Download CSV"
                onClick={() => {
                  const items = ((this.props.filter.length > 0 || this.props.dataSource !== this.state.initialSource) && !this.state.loading) ? this.state.searchedsortedItems : this.state.allItems;
                  const wsName = this.props.fileName ? this.props.fileName : 'download';
                  const data = tableFunctions.getDownloadData(this.props.header,
                    this.props.downloadBody, items);
                  downLoadCSV(data, wsName);
                }}
                className={styles.download}
              >
                <img alt="presentation" width="16" height="16" src={csvIcon} />
              </button>
            </div>
          }
          { (this.props.filter.length > 0 || this.props.dataSource !== this.state.initialSource) && !this.state.loading &&
            <Button className={styles.clearCriteria} onClick={() => this.onClear()}>Clear the Search Criteria</Button>
          }
          <div className={styles.footer}>
            {
              // <div>
              //   Showing {numberWithCommas((this.state.itemPerPage * (this.state.currentPage - 1)) + 1)}
              //   -{numberWithCommas(((this.state.totalItem !== 0) && (this.state.itemPerPage * this.state.currentPage > this.state.totalItem))
              //       ? this.state.totalItem : this.state.itemPerPage * this.state.currentPage)}&nbsp;
              //   of {numberWithCommas(this.state.totalItem)}
              // </div>
            }
            <div>
              Showing {this.state.itemPerPage < this.state.totalItem ? numberWithCommas(this.state.itemPerPage) : numberWithCommas(this.state.totalItem)} of {numberWithCommas(this.state.totalItem)}
              <select
                id="ItemPerPage"
                onChange={(evt) => {
                  this.setState({
                    itemPerPage: evt.target.value,
                    currentPage: 1,
                  }, () => {
                    this.setState({
                      ItemsShow: tableFunctions.pageLoad(this.state),
                    });
                  });
                }}
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div>
              <button
                className={styles.leftRightStyle}
                disabled={this.state.currentPage === 1}
                onClick={() => {
                  this.setState(
                    { currentPage: (this.state.currentPage - 1) },
                    () => {
                      this.setState({
                        ItemsShow: tableFunctions.pageLoad(this.state),
                      });
                    }
                  );
                }}
              >
                <LeftIcon />
              </button>
              <button
                className={styles.leftRightStyle}
                disabled={(this.state.currentPage === Math.ceil(this.state.totalItem / this.state.itemPerPage))
                  || (this.state.totalItem === 0)}
                onClick={() => {
                  this.setState(
                    { currentPage: (this.state.currentPage + 1),
                    },
                    () => {
                      this.setState({
                        ItemsShow: tableFunctions.pageLoad(this.state),
                      });
                    }
                  );
                }}
              >
                <RightIcon />
              </button>
            </div>
          </div>
        </div>
        {popup}
      </div>
    );
  }
}

Table.propTypes = {
  dataSource: PropTypes.string.isRequired,
  header: PropTypes.array.isRequired,
  body: PropTypes.array.isRequired,
  fileName: PropTypes.string.isRequired,
  downloadBody: PropTypes.array.isRequired,
  filter: PropTypes.array.isRequired,
  pageForceReload: PropTypes.number, // eslint-disable-line
  onClearSearch: PropTypes.func,
  hideDownLoad: PropTypes.bool,
};

Table.defaultProps = {
  onClearSearch: null,
  hideDownLoad: false,
};

export default Table;
