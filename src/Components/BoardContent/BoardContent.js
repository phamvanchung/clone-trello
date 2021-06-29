import React, { useState, useEffect } from "react";
import "./BoarContent.scss";
import Column from "Components/Column/Column";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import { Container, Draggable } from 'react-smooth-dnd';
import { applyDrag } from 'utils/applyDrag';
import { mapOrder } from "utils/sorts";


export default function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const boardData = initialData.boards.find(
      (board) => board.id === 'board-1'
    );
    if (boardData) {
      setBoard(boardData);
      setColumns(mapOrder(boardData.columns, boardData.columnOrder, 'id'));
    }
  }, []);

  if (isEmpty(board)) {
    return <div className="not-found">Boar NotFound</div>;
  }

  const onColumnDrop = (dropResult) => {
    console.log(dropResult);
  }
  return (
    <div className="board-content">
    <Container
          orientation="horizontal"
          onDrop={onColumnDrop}
          dragHandleSelector=".column-drag-handle"
          getChildPayload={index => columns[index]}
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'columns-drop-preview'
            }}
        >
        {columns.map((column, index) => (
            <Draggable key={index}>
                <Column column={column} />
            </Draggable>
        ))}
      </Container>
    </div>
  );
}
