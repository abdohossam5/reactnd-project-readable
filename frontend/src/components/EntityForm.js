import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';



class EntityForm extends Component {

  defaultFields = ['body']; // fields that will always show
  state = {
    showCategory: false,
    showAuthor: false,
    showTitle: false,
    categoryValid: null,
    authorValid: null,
    titleValid: null,
    bodyValid: null,
    category: '',
    author: '',
    title: '',
    body: '',
    onSubmit: null,
    categories: []
  };


  componentWillMount(){
    this.setState({
      showCategory: this.props.fields.indexOf('category') >= 0,
      showAuthor: this.props.fields.indexOf('author') >= 0,
      showTitle: this.props.fields.indexOf('title') >= 0,
      categories: this.props.categories || []
    });
  }

  componentWillReceiveProps(nextProps){
    this.setState((prevState, props) => ({
      showCategory: nextProps.fields.indexOf('category') >= 0,
      showAuthor: nextProps.fields.indexOf('author') >= 0,
      showTitle: nextProps.fields.indexOf('title') >= 0,
      categories: nextProps.categories || prevState.categories
    }));
  }

  handleInputChange(target) {
    const name = target.name;
    const value = target.value;

    this.setState({
      [name]: value,
      [`${name}Valid`]: value ? 'success' : 'error'
    });
  }

  isFormValid(){
    let stateUpdate = {};
    let valid = true;

    for(const field of [...this.props.fields, ...this.defaultFields]){
      stateUpdate = {
        ...stateUpdate,
        [`${field}Valid`]: this.state[field] ? 'success' : 'error'
      };
      if(!this.state[field]) valid = false;
    }

    this.setState(stateUpdate);

    return valid;
  }

  handleSubmit(){
    if(!this.isFormValid()) return;

    this.props.onSubmit([...this.props.fields, ...this.defaultFields].reduce((data, field)=>{
      return {
        ...data,
        [field]: this.state[field]
      }
    }, {}))
  }

  render(){
    const {
      showCategory, showAuthor, showTitle, categoryValid, authorValid, titleValid, bodyValid,
      category, author, title, body, categories
    } = this.state;
    return (
      <Form className="Entity-form">

        {showCategory && (
          <FormGroup validationState={categoryValid}>
            <ControlLabel>Category</ControlLabel>
            <FormControl
              componentClass="select"
              name="category"
              id="category"
              value={category}
              onChange={(e) => this.handleInputChange(e.target)} >
              <option value="">Please Select Category</option>
              {categories.map((c) => (<option key={c} value={c}>{c}</option>))}
            </FormControl>
            {categoryValid === 'error' && <HelpBlock>Please Select Category.</HelpBlock>}
          </FormGroup>
        )}

        {showAuthor && (
          <FormGroup validationState={authorValid}>
            <ControlLabel>Author:</ControlLabel>
            <FormControl
              type="text"
              name="author"
              id="author"
              value={author}
              onChange={(e) => this.handleInputChange(e.target)}/>
            {authorValid === 'error' && (<HelpBlock>Please Add Author Name.</HelpBlock>)}
          </FormGroup>
        )}

        {showTitle && (
          <FormGroup  validationState={titleValid}>
            <ControlLabel>Title:</ControlLabel>
            <FormControl
              type="text"
              name="title"
              id="title"
              value={title}
              onChange={(e) => this.handleInputChange(e.target)}/>
            {titleValid === 'error' && (<HelpBlock>Please Add Title.</HelpBlock>)}
          </FormGroup>
        )}


        <FormGroup  validationState={bodyValid}>
          <ControlLabel>Body</ControlLabel>
          <FormControl
            componentClass="textarea"
            name="body"
            id="body"
            value={body}
            onChange={(e) => this.handleInputChange(e.target)}/>
          {bodyValid === 'error' && (<HelpBlock>Please Add Body.</HelpBlock>)}
        </FormGroup>

        <Button className="Submit-btn" onClick={() => this.handleSubmit()}>Submit</Button>
      </Form>
    )
  }
}

EntityForm.propTypes = {
  fields: PropTypes.array.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default EntityForm;