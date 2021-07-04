//onKeyDown
export const saveAfterEnter = (e) => {
    if (e.key === 'Enter') {
        e.target.blur();
    }
  }

//select all input value
export const selectAllInlineCheck = (e) => {
    e.target.focus();
    e.target.select(); //or document.execCommand('selectAll',false,null)
  }
