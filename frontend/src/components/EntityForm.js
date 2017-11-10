import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, ControlLabel, FormControl } from 'react-bootstrap';



class EntityForm extends Component {

  render(){
    return (
      <Form>
        <FormGroup>
          <ControlLabel htmlFor="title">Title:</ControlLabel>
          <FormControl id="title"/>
        </FormGroup>

        <FormGroup>
          <ControlLabel htmlFor="body">Body</ControlLabel>
          <FormControl type="textarea" name="body" id="body" />
        </FormGroup>

        <Button>Submit</Button>
      </Form>
    )
  }
}

export default EntityForm;