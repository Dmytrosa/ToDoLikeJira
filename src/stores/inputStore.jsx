import { EventEmitter } from 'events';
import dispatcher from '../dispatchers/dispatcher';
import inputActions from '../actions/inputActions';

class InputStore extends EventEmitter {
  constructor() {
    super();
    this.value = 'Enter repo url:';
  }

  getValue() {
    return this.value;
  }

  handleActions(action) {
    switch (action.type) {
      case inputActions.UPDATE_INPUT:
        this.value = action.payload;
        this.emit('change');
        break;
      default:
        break;
    }
  }
}

const inputStore = new InputStore();
dispatcher.register(inputStore.handleActions.bind(inputStore));

export default inputStore;
