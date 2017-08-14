import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import cx from 'classnames';
import {connectForm} from 'redux-formalize';
import Button from '../ui/Button';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import GroupsContainer from './GroupsContainer';
import styles from './StackDetail.css';
import {settingsPaneContent} from '../ui/menu/Menu.css';
import {root, textField, firstFields} from '../ui/SaveEntityForm.css';
import {iconClose} from '../ui/Icons.css';
import {stackFormName} from './actions';

export function StackDetail({state, stack, servers, editStack, fields, updateField, submitForm, updateSelectedServers}) {
  const {title, gitPath, selectedServers, diff} = fields;
  const options = Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname}));
  return (
    <div className={styles.root}>
      <span title="Close settings" className={cx(iconClose, styles.iconClose)} onClick={editStack}>Close settings</span>
      <h2>{stack.title || 'New Stack'}</h2>
      <MenuScrollPane width={600}>
        <form className={settingsPaneContent} onSubmit={submitForm} onChange={updateField}>
          <input className={cx(textField, firstFields)} placeholder="Title" name="title" value={title} autoFocus/>
          <input className={cx(textField, firstFields)} placeholder="Git Path" name="gitPath" value={gitPath}/>
          <Select name="servers" instanceId="whitelist" options={options} multi placeholder="Server Whitelist" simpleValue
            className={styles.serversField} value={selectedServers} onChange={updateSelectedServers}/>
          <div className={root}>
            <input className={textField} placeholder="Diff URL" name="diff" value={diff}/>
            <Button type="submit" isLoading={state.isSubmitting}>{stack.id ? 'Save' : 'Add'}</Button>
          </div>
        </form>

        {stack.id && <GroupsContainer/>}
      </MenuScrollPane>
    </div>
  );
}

StackDetail.propTypes = {
  fields: PropTypes.shape({
    title: PropTypes.string.isRequired,
    gitPath: PropTypes.string.isRequired,
    selectedServers: PropTypes.string,
    diff: PropTypes.string
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateSelectedServers: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
  servers: PropTypes.object.isRequired,
  editStack: PropTypes.func.isRequired,
  saveStack: PropTypes.func.isRequired,
  stack: PropTypes.object,
  state: PropTypes.object
};

function onSubmit({fields, stack, saveStack}) {
  const title = fields.title.trim();
  const gitPath = fields.gitPath.trim();
  const diff = fields.diff && fields.diff.trim();
  const selectedServers = fields.selectedServers.split(',');
  if (title && gitPath && selectedServers) saveStack(stack, title, gitPath, selectedServers, diff);
}

const config = {
  initialState({stack}) {
    if (stack) {
      const {title, gitPath, diff, servers: serverIds} = stack;
      return {title, gitPath, diff, selectedServers: serverIds ? serverIds.join(',') : null};
    }
    return {title: '', gitPath: '', diff: '', selectedServers: null};
  },
  handlers: {
    editStack: props => () => props.editStack(null),
    updateSelectedServers({updateForm}) {
      return selectedServers => updateForm(state => ({...state, selectedServers}));
    }
  }
};

export default connectForm(stackFormName, ['title', 'gitPath', 'selectedServers', 'diff'], onSubmit, config)(StackDetail);
