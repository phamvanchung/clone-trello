import React, { useState, useEffect, useRef } from 'react';
import Card from 'Components/Card/Card';
import { Container, Draggable } from 'react-smooth-dnd';
import { mapOrder } from 'utils/sorts';
import { Dropdown, Form, Col, Button } from 'react-bootstrap';
import { cloneDeep } from 'lodash';
import ConfirmModal from 'Components/Common/ConfirmModal';
import { MODAL_ACTION_CONFIRM } from 'constants/ActionModal';
import { saveAfterEnter, selectAllInlineCheck } from 'utils/contentEditable';

import './Column.scss';

export default function Column(props) {
  const { column, onCardDrop, onUpdateColumn } = props;
  const cards = mapOrder(column.cards, column.cardOder, 'id');

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const toggleOpenFormModal = () => setShowConfirmModal(!showConfirmModal);
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggleOpenForm = () => setOpenNewCardForm(!openNewCardForm);
  const [newCardTitle, setNewCardTitle] = useState('');

  const newCardInputRef = useRef(null);
  useEffect(() => {
    if (newCardInputRef && newCardInputRef.current) {
      newCardInputRef.current.focus();
      newCardInputRef.current.select();
    }
  }, [openNewCardForm]);

  const [columnTitle, setColumnTitle] = useState('');
  useEffect(() => {
    setColumnTitle(column.title);
  }, [column.title]);
  const handleOnchange = (e) => {
    setColumnTitle(e.target.value);
  };
  const handleOnblur = () => {
    const newColumns = {
      ...column,
      title: columnTitle,
    };
    onUpdateColumn(newColumns);
  };

  const onConfirmAction = (type) => {
    if (type === MODAL_ACTION_CONFIRM) {
      const newColumns = {
        ...column,
        _destroy: true,
      };
      onUpdateColumn(newColumns);
    }
    toggleOpenFormModal();
  };

  const handleOnchangeTextarea = (e) => {
    setNewCardTitle(e.target.value);
  };

  const addNewCard = () => {
    if (!newCardTitle) {
      newCardInputRef.current.focus();
      return;
    }

    const newCardToAdd = {
      id: Math.random().toString(36).substr(2, 5),
      boardId: column.id,
      columnId: column.id,
      title: newCardTitle.trim(),
      cover: null,
    };
    const newColumn = cloneDeep(column); //clone column sau khi nhan enter
    newColumn.cards.push(newCardToAdd);
    newColumn.cardOder.push(newCardToAdd.id);

    onUpdateColumn(newColumn);
    setNewCardTitle('');
    toggleOpenForm();
  };

  return (
    <div className="column">
      <header className="column-drag-handle">
        <div className="drag-title">
          <Form.Control
            size="sm"
            type="text"
            className="input-trello"
            value={columnTitle}
            spellCheck="false"
            onClick={selectAllInlineCheck}
            onChange={handleOnchange}
            onBlur={handleOnblur}
            onKeyDown={saveAfterEnter}
            onMouseDown={(e) => e.preventDefault()}
          />
        </div>
        <div className="drag-dropdowns">
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              size="sm"
              className="dropdown-btn"
            />
            <Dropdown.Menu className="dropdown-menu">
              <div className="dropdown-header">
                Manipulation
                <span className="dropdown-icon">
                  <i className="fa fa-times" />
                </span>
              </div>
              <Dropdown.Item>Add card...</Dropdown.Item>
              <Dropdown.Item onClick={toggleOpenFormModal}>
                Delete list...
              </Dropdown.Item>
              <Dropdown.Item>Copy list...</Dropdown.Item>
              <Dropdown.Item>Move list...</Dropdown.Item>
              <Dropdown.Item>Move all cards in this list...</Dropdown.Item>
              <Dropdown.Item>Archive all cards in this list...</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </header>
      <div className="card-list">
        <Container
          groupName="columns"
          onDrop={(dropResult) => onCardDrop(column.id, dropResult)}
          getChildPayload={(index) => cards[index]}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'card-drop-preview',
          }}
          dropPlaceholderAnimationDuration={200}
        >
          {cards.map((card, index) => (
            <Draggable key={index}>
              <Card card={card} />
            </Draggable>
          ))}
        </Container>
      </div>
      {openNewCardForm && (
        <Col className="enter-new-card">
          <Form.Control
            size="sm"
            as="textarea"
            rows={3}
            placeholder="Enter a title for this card.."
            className="form-control-textarea"
            ref={newCardInputRef}
            value={newCardTitle}
            onChange={handleOnchangeTextarea}
            onKeyDown={(e) => e.key === 'Enter' && addNewCard()}
          />
        </Col>
      )}
      <footer>
        {openNewCardForm && (
          <div className="icon-btn-wrap">
            <Button variant="primary" size="sm" onClick={addNewCard}>
              Add card
            </Button>
            <span className="icon" onClick={toggleOpenForm}>
              <i className="fa fa-times"></i>
            </span>
          </div>
        )}
        {!openNewCardForm && (
          <div className="footer-actions" onClick={toggleOpenForm}>
            <i className="fa fa-plus"></i>
            Add another card
          </div>
        )}
      </footer>
      <ConfirmModal
        show={showConfirmModal}
        onAction={onConfirmAction}
        title="Remove column"
        content={`Are you sure you want to remove <strong>${column.title}</strong>!`}
      />
    </div>
  );
}
