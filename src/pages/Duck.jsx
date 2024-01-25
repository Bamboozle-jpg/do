import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const dnd = [
    {id: 'john',
    name: 'hello'},
    {id: 'will',
    name: 'morning'},
    {id: 'kevin',
    name: 'greeting'},
    {id: 'jimothy',
    name: 'arrivederci'}    
]

const Duck = () => {
  const [names, updateNames] = useState(dnd);
  const handleOnDragEnd = (result) => {
    const items = Array.from(names);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateNames(items);
  }

  return(
    <div>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <Droppable droppableId='elements'>
          {(provided)=>(
            <ul className='elements' {...provided.droppableProps} ref={provided.innerRef}>
              {dnd.map(({id, name}, index)=>{
              return (
                <Draggable  key = {id} draggableId = {id} index = {index}>
                    {(provided) => (
                    <li ref = {provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <p>{ name }</p>
                    </li>
                    )}
                </Draggable>
              )
              })}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  )

}

export default Duck
