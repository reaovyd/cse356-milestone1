import React from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Editor from './Editor';

const GenerateDocument = (setDisplay) => {
    const handleExistingID = (e) => {
        e.preventDefault()
    }
    // TODO connect to /api/connect/:id
    const handleNewDocument = (e) => {
        e.preventDefault()
        setDisplay(<div>
            <Editor/>
        </div>)
    }

  return (
      <div>
        <Form onSubmit={(event) => handleExistingID(event)}>
          <Form.Group className="mb-1" >
            <Form.Label>Document ID</Form.Label>
            <Form.Control type="text" placeholder="Enter document ID" />
          </Form.Group>
          <Button className="mb-1"variant="primary" type="submit">
            Open
          </Button>
        </Form>
          <Button variant="secondary" onClick={(event) => handleNewDocument(event)}>
            Create New Document
          </Button>
      </div>
  );
}

const Homepage = ({setDisplay}) => {
    return GenerateDocument(setDisplay)
}

export default Homepage; 
