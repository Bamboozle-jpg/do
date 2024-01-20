import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const bruh = [
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
  return(
    <div>
      <DragDropContext>
        <Droppable droppableId='elements'>
          {(provided)=>(
            <ul className='elements' {...provided.droppableProps} ref={provided.innerRef}>
              {bruh.map(({id, name}, index)=>{
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
