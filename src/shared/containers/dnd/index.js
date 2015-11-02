import { findDOMNode } from 'react-dom';

export const ListHeaderSource = {
  beginDrag(props) {
    //console.dir(props)
    return {
      query: props.query,
      index: props.index
    };
  }
};

export const ListHeaderTarget = {
  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    //const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    //const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    //const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    //const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    /*if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }*/
    //console.dir(props.query)
    // Time to actually perform the action
    props.moveQueryHeader(dragIndex, hoverIndex, props.query);  // need to return the actual query which moved
  }
}
