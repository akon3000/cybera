import React from 'react';
import PropTypes from 'prop-types';
import ReactTinyMCE from 'react-tinymce';

import styles from './styles.css';

const decode = (encodedStr) => {
  const elem = document.createElement('textarea');
  elem.innerHTML = encodedStr;

  return elem.value;
};


class TinyMCE extends React.Component {
  constructor(props) {
    super(props);
    const { input, label, disabled, defaultValue, type, hintText, icon, meta: { touched, error }} = props; // eslint-disable-line
    this.state = { value: input.value };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ value: nextProps.input.value }, () => { // eslint-disable-line
      tinymce.EditorManager.get(this.props.id).setContent(this.state.value); // eslint-disable-line
    });
  }

  // shouldComponentMount(props, nextProps) {
  //   console.log(props, nextProps);
  //   return true;
  // }

  handleEditorChange = (e) => {
    this.setState({ value: e.target.getContent() });
    this.props.meta.dispatch({ // eslint-disable-line
      type: "@@redux-form/CHANGE", // eslint-disable-line
      meta: {
        form: this.props.meta.form, // eslint-disable-line
        field: this.props.input.name, // eslint-disable-line
        touch: this.props.meta.touched, // eslint-disable-line
      },
      payload: e.target.getContent(),
    });
  }

  render() {
    const { id, input, label, disabled, defaultValue, type, hintText, icon, meta: { touched, error }} = this.props; // eslint-disable-line
    return (
      <div className={`${styles.container} ${(touched && error) && styles.error}`} data-automation-id={this.props['data-automation-id']}>
        <label htmlFor={input.name}>{label}</label>
        <div className={styles.tinymce}>
          <ReactTinyMCE
            id={id}
            name={input.name}
            content={decode(this.state.value)}
            onChange={(e) => this.handleEditorChange(e)}
            config={{
              // plugins: 'image table link paste contextmenu textpattern autolink',
              insert_toolbar: 'quickimage quicktable',
              // selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
              selection_toolbar: 'bold italic alignment link forecolor backcolor', //  | bullist numlist outdent
              paste_data_images: true,
              height: 600,
              plugins: [
                'advlist autolink lists link image charmap print preview hr anchor pagebreak',
                'searchreplace wordcount visualblocks visualchars code fullscreen',
                'insertdatetime media nonbreaking save table contextmenu directionality',
                'emoticons template paste textcolor colorpicker textpattern imagetools code ',
              ],
              // skin_url: `${baseUrl}/static/TinyMCESkin/cybera`,
              contextmenu: 'code link image inserttable | cell row column deletetable',
              branding: false,
              elementpath: false,
            }}
          />
        </div>
        {touched && error && <span data-automation-id="error" className={styles.errorMessage}>{error}</span>}
      </div>
    );
  }
}

TinyMCE.propTypes = {
  'data-automation-id': PropTypes.string,
};

TinyMCE.defaultProps = {
  'data-automation-id': '',
};

export default TinyMCE;
