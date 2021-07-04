import React from "react";
import { Modal, Button } from "react-bootstrap";
import HTMLReactParse from "html-react-parser";
import { MODAL_ACTION_CANCEL, MODAL_ACTION_CONFIRM } from "constants/ActionModal";


export default function ConfirmModal(props) {

    const { title, content, show, onAction } = props;

    return (
        <>
        <Modal show={show} onHide={() => onAction(MODAL_ACTION_CANCEL)} keyboard={false} animation={false} >
            <Modal.Header closeButton>
            <Modal.Title className="h5">{HTMLReactParse(title)}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{HTMLReactParse(content)}</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => onAction(MODAL_ACTION_CANCEL)}>
                Cancel
            </Button>
            <Button variant="primary" onClick={() => onAction(MODAL_ACTION_CONFIRM)}>
                Confirm
            </Button>
            </Modal.Footer>
        </Modal>
        </>
    );
}
