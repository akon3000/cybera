import _ from 'lodash';
import { apiUrl } from '../../config';
import request from '../../utils/request';

const tableFunctions = {
  loadAllItems(sourceUrl, callback) {
    request.get(`${apiUrl}/${sourceUrl}`, {}, (response) => {
      if (!response.error) {
        callback(response.data);
      } else {
        callback(response);
      }
    });
  },

  ItemsConvert(header, body, items) {
    const resultItems = [];
    items.forEach((value) => {
      const resultEachObject = {};
      let count = 0;
      body.forEach((bodyValue) => {
        resultEachObject[`${header[count].Label}`] = bodyValue(value);
        count += 1;
      });
      resultItems.push(resultEachObject);
    });
    return resultItems;
  },

  pageLoad({ currentPage, itemPerPage, totalItem, allItems, searchedsortedItems }) {
    const items = [];
    if (searchedsortedItems.length > 0) {
      for (let i = itemPerPage * (currentPage - 1); i < ((itemPerPage * currentPage > searchedsortedItems.length) ? searchedsortedItems.length : itemPerPage * currentPage); i += 1) {
        items.push(searchedsortedItems[i]);
      }
    } else {
      for (let i = itemPerPage * (currentPage - 1); i < ((itemPerPage * currentPage > totalItem) ? totalItem : itemPerPage * currentPage); i += 1) {
        items.push(allItems[i]);
      }
    }
    return items;
  },

  getDownloadData(header, downloadBody, items) {
    const data = [];
    let row = [];
    header.forEach((value) => {
      if (value.Name !== 'Hide' && value.Name !== 'SortDisable') {
        row.push(value.Label);
      }
    });
    data.push(row);

    items.forEach((value) => {
      row = [];
      downloadBody.forEach((td) => {
        row.push(td(value));
      });
      data.push(row);
    });

    return data;
  },

  sortMatrixGen({ sortKeyword, sortMatrix }) {
    const sortMatrixCopy = [];
    let sortOrder = 'asc';

    if (sortMatrix.length === 0) {
      sortMatrixCopy.push({ name: sortKeyword, order: 'asc' });
    } else {
      sortMatrix.forEach((value) => {
        sortMatrixCopy.push(value);
      });

      let keywordExist = false;
      for (const value of sortMatrixCopy) { //eslint-disable-line
        if (value.name === sortKeyword) {
          keywordExist = true;
          if (value.order === 'asc') {
            value.order = 'desc';
            sortOrder = 'desc';
          } else {
            value.order = 'asc';
            sortOrder = 'asc';
          }
        }
      }

      if (keywordExist === false) {
        sortMatrixCopy.push({ name: sortKeyword, order: 'asc' });
      }
    }
    return { sortOrder, sortMatrix: sortMatrixCopy };
  },

  sortItem({ sortKeyword, sortOrder, allItems, searchedsortedItems, itemPerPage }) {
    let sortedItems = [];
    let ItemsShow = [];
    if (searchedsortedItems.length === 0) {
      if (sortOrder === 'asc') {
        sortedItems = _.sortBy(allItems, sortKeyword);
      } else {
        sortedItems = _.sortBy(allItems, sortKeyword).reverse();
      }
    } else if (searchedsortedItems.length > 0) {
      if (sortOrder === 'asc') {
        sortedItems = _.sortBy(searchedsortedItems, sortKeyword);
      } else {
        sortedItems = _.sortBy(searchedsortedItems, sortKeyword).reverse();
      }
    }
    ItemsShow = sortedItems.slice(0, itemPerPage);
    return { sortedItems, ItemsShow };
  },

  searchItem({ filter, allItems, itemPerPage }) {
    const searchedData = [];
    const ItemsShow = [];
    allItems.forEach((value) => {
      const insert = [];
      for (let i = 0; i < filter.length; i += 1) {
        let eachKeywordMatch = false;
        const keyword = (filter[i].keywords) ? filter[i].keywords.toLowerCase() : '';
        for (const key in value) { // eslint-disable-line
          if (Object.prototype.hasOwnProperty.call(value, key)) {
            filter[i].Columns.forEach((va) => { //eslint-disable-line
              if (key === va) {
                const valueCompare = (value[key]) ? value[key].toLowerCase() : '';
                if (valueCompare.indexOf(keyword) !== -1) {
                  eachKeywordMatch = true;
                }
              }
            });
          }
        }
        if (eachKeywordMatch === true) {
          insert.push(true);
        }
      }

      if (insert.length === filter.length) {
        searchedData.push(value);
      }
    });

    if (searchedData.length > itemPerPage) {
      for (let i = 0; i < itemPerPage; i += 1) {
        ItemsShow.push(searchedData[i]);
      }
    } else {
      searchedData.forEach((value) => {
        ItemsShow.push(value);
      });
    }
    return { searchedItems: searchedData, ItemsShow };
  },
};

export default tableFunctions;
