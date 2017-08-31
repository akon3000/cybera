import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';

import styles from './styles.css';

import Dialog from '../Dialog';

import {
  hideFileManager,
  chooseFileFromFileManager,
} from '../../actions';

class FileManager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [{
        id: 1,
        url: 'https://images.pexels.com/photos/8500/food-dinner-pasta-spaghetti-8500.jpg?h=350&auto=compress&cs=tinysrgb',
      }, {
        id: 2,
        url: 'https://images.pexels.com/photos/76093/pexels-photo-76093.jpeg?h=350&auto=compress&cs=tinysrgb',
      }, {
        id: 3,
        url: 'https://images.pexels.com/photos/46239/salmon-dish-food-meal-46239.jpeg?h=350&auto=compress&cs=tinysrgb',
      }, {
        id: 4,
        url: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg?h=350&auto=compress&cs=tinysrgb',
      }, {
        id: 5,
        url: 'https://images.pexels.com/photos/2232/vegetables-italian-pizza-restaurant.jpg?h=350&auto=compress&cs=tinysrgb',
      }, {
        id: 6,
        url: 'https://images.pexels.com/photos/111131/meat-vegetables-gemuesepiess-mushrooms-111131.jpeg?h=350&auto=compress&cs=tinysrgb',
      }, {
        id: 7,
        url: 'https://images.pexels.com/photos/65131/pexels-photo-65131.jpeg?h=350&auto=compress&cs=tinysrgb',
      },
      // {
      //   id: 8,
      //   url: 'https://images.pexels.com/photos/36144/pexels-photo.jpg?h=350&auto=compress&cs=tinysrgb',
      // },
      {
        id: 9,
        url: 'http://i36.photobucket.com/albums/e47/nantawatcybera/about-us-5-bg_zpsqtls2bbu.png',
      }, {
        id: 10,
        url: 'http://static.tumblr.com/4c16f45a1380ff91267a976fa411a4b6/a944imq/E70mxea89/tumblr_static_tumblr_static_header.png',
      }, {
        id: 11,
        url: 'http://api.file.cyberatest.com.au/api/file?Id=2',
      }],
    };
  }

  render() {
    const { popup, onClose, onChooseFile } = this.props;
    const { items } = this.state;
    const rows = [];
    for (let i = 0; i < items.length / 4; i += 1) {
      const cols = [];
      for (let j = 0; j < 4 && ((i) * 4) + j < items.length; j += 1) {
        const item = items[((i) * 4) + j];
        cols.push(<Col key={`fileManager-item-${item.id}`} xs={3}>
          <button
            className={styles.items}
            onClick={() => {
              onChooseFile({ url: item.url });
            }}
          >
            <img src={item.url} alt="" />
          </button>
        </Col>);
      }
      rows.push(<Row key={`fileManager-row-${items[((i) * 4)].id}`} className={styles.row} middle="xs">{cols}</Row>);
    }
    return (
      <Dialog
        title="File Manager"
        open={popup === 'showFileManager'}
        onClose={() => onClose()}
        contentStyle={{ width: '928px' }}
      >
        {rows}
      </Dialog>
    );
  }
}

FileManager.propTypes = {
  popup: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
  onClose: PropTypes.func.isRequired,
  onChooseFile: PropTypes.func.isRequired,
};

FileManager.defaultProps = {};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  return {
    popup: state.get('popup'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onClose: () => dispatch(hideFileManager()),
    onChooseFile: (file) => dispatch(chooseFileFromFileManager(file)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
