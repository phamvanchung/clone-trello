import React, { useState, useEffect } from "react";
import "./BoarContent.scss";
import Column from "Components/Column/Column";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import { Container, Draggable } from "react-smooth-dnd";
import { mapOrder } from "utils/sorts";
import { applyDrag } from "utils/applyDrag";

export default function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});

  useEffect(() => {
    const boardData = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardData) {
      setBoard(boardData);
      setColumns(mapOrder(boardData.columns, boardData.columnOrder, "id"));
    }
  }, []);

  if (isEmpty(board)) {
    return <div className="not-found">Boar NotFound</div>;
  }

  const onColumnDrop = (dropResult) => {
    let newColumn = [...columns];
    newColumn = applyDrag(newColumn, dropResult);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumn.map((c) => c.id);
    newBoard.columns = newColumn;

    setColumns(newColumn);
    setBoard(newBoard);
  };

  const onCardDrop = (columnId, dropResult) => {
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
        let newColumn = [...columns];
        let currentColumn = newColumn.find(c => c.id === columnId);
        currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
        currentColumn.cardOder = currentColumn.cards.map(i => i.id)
        setColumns(newColumn)
    }
  };

  return (
    <div className="board-content">
      <Container
        orientation="horizontal"
        onDrop={onColumnDrop}
        dragHandleSelector=".column-drag-handle"
        getChildPayload={(index) => columns[index]}
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: "columns-drop-preview",
        }}
      >
        {columns.map((column, index) => (
          <Draggable key={index}>
            <Column column={column} onCardDrop={onCardDrop}/>
          </Draggable>
        ))}
      </Container>
      <div className="add-new-column">
        <i className="fa fa-plus"></i>
        Add another card
      </div>
    </div>
  );
}
