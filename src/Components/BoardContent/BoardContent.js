import React, { useState, useEffect, useRef } from "react";
import Column from "Components/Column/Column";
import { initialData } from "actions/initialData";
import { isEmpty } from "lodash";
import { Container, Draggable } from "react-smooth-dnd";
import {
  Container as BtrContainer,
  Row,
  Col,
  Form,
  Button,
} from "react-bootstrap";

import { mapOrder } from "utils/sorts";
import { applyDrag } from "utils/applyDrag";

import "./BoarContent.scss";

export default function BoardContent() {
  const [board, setBoard] = useState({});
  const [columns, setColumns] = useState({});
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const newColumnInputRef = useRef(null);

  useEffect(() => {
    const boardData = initialData.boards.find(
      (board) => board.id === "board-1"
    );
    if (boardData) {
      setBoard(boardData);
      setColumns(mapOrder(boardData.columns, boardData.columnOrder, "id"));
    }
  }, []);

  useEffect(() => {
    if (newColumnInputRef && newColumnInputRef.current) {
      newColumnInputRef.current.focus();
      newColumnInputRef.current.select();
    }
  }, [openNewColumnForm]);

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
      let currentColumn = newColumn.find((c) => c.id === columnId);
      currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
      currentColumn.cardOder = currentColumn.cards.map((i) => i.id);
      setColumns(newColumn);
    }
  };

  const toggleOpenForm = () => setOpenNewColumnForm(!openNewColumnForm);

  const addNewColumn = () => {
    if (!newColumnTitle) {
      newColumnInputRef.current.focus();
      return;
    }
    const newColumnToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: board.id,
      title: newColumnTitle.trim(),
      cardOder: [],
      cards: [],
    };
    const newColumns = [...columns];
    newColumns.push(newColumnToAdd);

    let newBoard = { ...board };
    newBoard.columnOrder = newColumns.map((c) => c.id);
    newBoard.columns = newColumns;

    setColumns(newColumns);
    setBoard(newBoard);
    setNewColumnTitle('');
    toggleOpenForm();
  };

  const handleOnchange = (e) => {
    setNewColumnTitle(e.target.value);
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
            <Column column={column} onCardDrop={onCardDrop} />
          </Draggable>
        ))}
      </Container>

      <BtrContainer className="trello-container">
        {!openNewColumnForm && (
          <Row>
            <Col className="add-new-column" onClick={toggleOpenForm}>
              <i className="fa fa-plus"></i>
              Add another column
            </Col>
          </Row>
        )}
        {openNewColumnForm && (
          <Row>
            <Col className="enter-new-column">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Enter column title..."
                ref={newColumnInputRef}
                value={newColumnTitle}
                onChange={handleOnchange}
                onKeyDown={e => (e.key ==='Enter' && addNewColumn())}
              />
              <Button variant="primary" size="sm" onClick={addNewColumn}>
                Add column
              </Button>
              <span className="icon" onClick={toggleOpenForm}>
                <i className="fa fa-times"></i>
              </span>
            </Col>
          </Row>
        )}
      </BtrContainer>
    </div>
  );
}
