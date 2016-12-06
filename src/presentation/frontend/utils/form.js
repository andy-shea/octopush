import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import isFunction from 'lodash.isfunction';

function withWillReceiveProps(willReceiveProps) {
  return BaseComponent => {
    BaseComponent.prototype.componentWillReceiveProps = willReceiveProps;
    return BaseComponent;
  };
}

function defaultShouldResetFormOnProps(props, {formState}) {
  return !formState.isSaving;
}

function configureComponentWillReceiveProps(shouldResetFormOnProps, initialState) {
  return function componentWillReceiveProps(nextProps) {
    if (shouldResetFormOnProps(this.props, nextProps)) {
      this.setState({stateValue: isFunction(initialState) ? initialState(nextProps) : initialState});
    }
  };
}

function capitalise(field) {
  return field.charAt(0).toUpperCase() + field.slice(1);
}

function isEvent(eventOrValue) {
  return (typeof eventOrValue === 'object' && eventOrValue.target);
}

function createHandlers(fields) {
  return fields.reduce((map, field) => {
    map[`update${capitalise(field)}`] = ({updateForm}) => eventOrValue => {
      const value = isEvent(eventOrValue) ? eventOrValue.target.value : eventOrValue;
      updateForm(state => ({...state, [field]: value}));
    };
    return map;
  }, {});
}

function defineInitialState(fields) {
  return fields.reduce((map, field) => {
    map[field] = '';
    return map;
  }, {});
}

function configureForm(fields, onSubmit, {initialState, shouldResetFormOnProps = defaultShouldResetFormOnProps, handlers = {}} = {}) {
  const defaultInitialState = initialState || defineInitialState(fields);
  return compose(
    withWillReceiveProps(configureComponentWillReceiveProps(shouldResetFormOnProps, defaultInitialState)),
    withState('form', 'updateForm', defaultInitialState),
    withHandlers({
      ...createHandlers(fields),
      submitForm: props => event => {
        event.preventDefault();
        onSubmit(props);
      },
      ...handlers
    })
  );
}

export default configureForm;
