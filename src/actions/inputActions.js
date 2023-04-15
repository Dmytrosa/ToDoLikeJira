const inputActions = {
    UPDATE_INPUT: 'UPDATE_INPUT',
  
    updateInput: function (value) {
      return {
        type: this.UPDATE_INPUT,
        payload: value,
      };
    },
  };
  
  export default inputActions;
  