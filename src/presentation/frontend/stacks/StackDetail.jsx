import React, {PropTypes} from 'react';
import Select from 'react-select';
import cx from 'classnames';
import configureForm from '../utils/form';
import Button from '../ui/Button';
import MenuScrollPane from '../ui/menu/MenuScrollPane';
import GroupsContainer from './GroupsContainer';
import styles from './StackDetail.css';
import {settingsPaneContent} from '../ui/menu/Menu.css';
import {root, textField, firstFields} from '../ui/SaveEntityForm.css';
import {iconClose} from '../ui/Icons.css';

function onSubmit({form, stack, saveStack}) {
  const title = form.title.trim();
  const gitPath = form.gitPath.trim();
  const diff = form.diff && form.diff.trim();
  const selectedServers = form.selectedServers.split(',');
  if (title && gitPath && selectedServers) saveStack(stack, title, gitPath, selectedServers, diff);
}

function initialState({stack}) {
  if (stack) {
    const {title, gitPath, diff, servers: serverIds} = stack;
    return {title, gitPath, diff, selectedServers: serverIds ? serverIds.join(',') : null};
  }
  return {title: '', gitPath: '', diff: '', selectedServers: null};
}

const form = configureForm(['title', 'gitPath', 'selectedServers', 'diff'], onSubmit, {initialState});

function StackDetail({formState, stack, servers, editStack, form: {title, gitPath, selectedServers, diff},
    submitForm, updateTitle, updateGitPath, updateSelectedServers, updateDiff}) {
  const options = Object.keys(servers).map(id => ({value: id.toString(), label: servers[id].hostname}));
  return (
    <div className={styles.root}>
      <span title="Close settings" className={cx(iconClose, styles.iconClose)} onClick={editStack}>Close settings</span>
      <h2>{stack.title || 'New Stack'}</h2>
      <MenuScrollPane width={600}>
        <form className={settingsPaneContent} onSubmit={submitForm}>
          <input className={cx(textField, firstFields)} placeholder="Title" value={title} onChange={updateTitle} autoFocus/>
          <input className={cx(textField, firstFields)} placeholder="Git Path" value={gitPath} onChange={updateGitPath}/>
          <Select name="servers" instanceId="whitelist" options={options} multi placeholder="Server Whitelist" simpleValue
              className={styles.serversField} value={selectedServers} onChange={updateSelectedServers}/>
          <div className={root}>
            <input className={textField} placeholder="Diff URL" value={diff || ''} onChange={updateDiff}/>
            <Button type="submit" isLoading={formState.isSaving}>{stack.id ? 'Save' : 'Add'}</Button>
          </div>
        </form>

        {stack.id && <GroupsContainer/>}
      </MenuScrollPane>
    </div>
  );
}

StackDetail.propTypes = {
  form: PropTypes.shape({
    title: PropTypes.string.isRequired,
    gitPath: PropTypes.string.isRequired,
    selectedServers: PropTypes.string,
    diff: PropTypes.string
  }).isRequired,
  submitForm: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  updateGitPath: PropTypes.func.isRequired,
  updateSelectedServers: PropTypes.func.isRequired,
  updateDiff: PropTypes.func.isRequired,
  servers: PropTypes.object.isRequired,
  editStack: PropTypes.func.isRequired,
  saveStack: PropTypes.func.isRequired,
  stack: PropTypes.object,
  formState: PropTypes.object
};

export default form(StackDetail);
