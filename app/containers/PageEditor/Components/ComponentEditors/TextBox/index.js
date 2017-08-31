import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TinyMCE from 'react-tinymce';
import { decode } from '../../../../../utils/html';

import styles from './styles.css';

import { tinyMCETextChange } from '../../../actions';

class Editor extends React.Component { // eslint-disable-line

  shouldComponentUpdate(nextProps) {
    tinymce.EditorManager.get(nextProps.id).setContent(decode(this.emptyVerify(nextProps.children))); // eslint-disable-line
    return false;
  }

  emptyVerify(children) {
    if (children === '') return '<p>This is the initial content of the editor</p>';
    const div = document.createElement('div');
    div.innerHTML = children;
    if (div.children.length === 1 && div.children[0].innerHTML === '&nbsp;') return '<p>This is the initial content of the editor</p>';
    return children;
  }

  render() {
    const { id, children, className, onChange, type, sectionID, sectionGroup } = this.props;
    return (<div key={`text-box-${id}`}>
      <TinyMCE
        id={id}
        content={decode(this.emptyVerify(children))}
        className={`${styles.tinymce} ${className}`}
        config={{
          setup(editor) {
            editor.addButton('alignment', {
              type: 'listbox',
              text: '',
              icon: 'alignleft',
              // icon: false,
              // onselect() {
              //   this.icon(this.settings.values.find((element) => element.value === this.value()).icon);
              //   editor.execCommand(this.value());
              // },
              values: [
                { icon: 'alignleft', value: 'JustifyLeft' },
                { icon: 'alignright', value: 'JustifyRight' },
                { icon: 'aligncenter', value: 'JustifyCenter' },
                { icon: 'alignjustify', value: 'JustifyFull' },
              ],
              onPostRender() {
                  // Select the firts item by default
                this.value('JustifyLeft');
              },
            });
          },
          theme: 'inlite',
          // plugins: 'image table link paste contextmenu textpattern autolink',
          insert_toolbar: 'quickimage quicktable',
          // selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
          selection_toolbar: 'bold italic alignment link forecolor backcolor', //  | bullist numlist outdent
          inline: true,
          paste_data_images: true,
          valid_children: '+div[style]',
          height: 300,
          plugins: [
            'advlist autolink lists link image charmap print preview hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code fullscreen',
            'insertdatetime media nonbreaking save table contextmenu directionality',
            'emoticons template paste textcolor colorpicker textpattern imagetools code ',
          ],
          // skin_url: `${baseUrl}/static/TinyMCESkin/cybera`,
          contextmenu: 'code link image inserttable | cell row column deletetable',
        }}
        // onChange={(e) => {
        //   // tinyMCETextChange
        //   onChange(id, type, sectionID, sectionGroup, e.target.getContent());
        // }}
        onBlur={(e) => {
          onChange(id, type, sectionID, sectionGroup, e.target.getContent());
        }}
      />
    </div>);
  }
}

Editor.propTypes = {
  id: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  sectionID: PropTypes.number.isRequired,
  sectionGroup: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

Editor.defaultProps = {
  children: false,
  className: '',
};

function mapStateToProps(reducer) {
  const state = reducer.get('pageEditor');
  return {
    popup: state.get('popup'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (id, type, sectionID, sectionGroup, content) => dispatch(tinyMCETextChange(id, type, sectionID, sectionGroup, content)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

