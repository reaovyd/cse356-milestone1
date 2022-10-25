import React, {useState}from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Editor from './Editor';

const GenerateDocument = (setDisplay) => {
    // TODO connect to /api/connect/:id
    const [documentId, setDocumentId] = useState('')
    const handleExistingID = (e) => {
        e.preventDefault()
        setDisplay(<Editor documentId={documentId}/>)
    }
    const handleDocumentId = (e) => {
        setDocumentId(e.target.value)
    }

  return (
      <div>
        <form onSubmit={handleExistingID}>
            <label htmlFor="input">
                <p>Document ID</p>
            <Form.Control type="text" value={documentId} onChange={handleDocumentId}placeholder="Enter document ID" />
            </label>
          <Button className="mb-1"variant="primary" type="submit">
            Open
          </Button>
        </form>
      </div>
  );
}

const Homepage = ({setDisplay}) => {
    return GenerateDocument(setDisplay)
}

//<form onSubmit={handleExistingID}>
//  <Form.Group className="mb-1" >
//    <Form.Label>Document ID</Form.Label>
//    <Form.Control type="text" placeholder="Enter document ID" />

//  </Form.Group>
//  <Button className="mb-1"variant="primary" type="submit">
//    Open
//  </Button>
//</form>
export default Homepage; 
