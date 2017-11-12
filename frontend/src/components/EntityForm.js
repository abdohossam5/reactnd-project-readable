import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import {connect} from 'react-redux';
import * as ActionTypes from '../actions';
import ReactLoading from 'react-loading';
import uuid4 from 'uuid/v4';



class EntityForm extends Component {

  fieldsForAction = {
    addComment: ['author', 'body'],
    addPost: ['title', 'author', 'body', 'category']
  };

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
    onComplete: null,
    categories: [],
    fields: [],
    isLoading: false,
    id: '' // use to determine if current entity is still in staging area or not so we can clear the form accordingly
  };


  componentWillMount(){
    this.setState({
      fields: this.fieldsForAction[this.props.action],
      showCategory: this.fieldsForAction[this.props.action].indexOf('category') >= 0,
      showAuthor: this.fieldsForAction[this.props.action].indexOf('author') >= 0,
      showTitle: this.fieldsForAction[this.props.action].indexOf('title') >= 0,
      categories: this.props.categories || [],
      id: this.props.id || uuid4()
    });

    this.props.getCategories()
  }

  componentWillReceiveProps(nextProps){
    // check whether the form should be cleared and the onComplete be called or not
    // based on whether the item is in the store staging area or not
    let callonComplete = false;
    let stateUpdate = {};
    if(this.state.isLoading && !nextProps.isLoading && nextProps.stagingItems.indexOf(this.state.id) < 0){
      callonComplete = true;
      stateUpdate = {
        category: '',
        author: '',
        title: '',
        body: '',
        id: uuid4()
      }
    }
    this.setState((prevState, props) => ({
      categories: nextProps.categories || prevState.categories,
      isLoading: nextProps.isLoading,
      ...stateUpdate
    }), () => {
      if(callonComplete){
        if(this.props.onComplete) this.props.onComplete()
      }
    });
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

    for(const field of this.state.fields){
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

    this.props.createEntity(this.state.fields.reduce((data, field)=>{
      return {
        ...data,
        [field]: this.state[field],
        loadingAction: this.props.action,
        parentId: this.props.parentId || '',
        id: this.state.id
      }
    }, {}))
  }

  render(){
    const {
      showCategory, showAuthor, showTitle, categoryValid, authorValid, titleValid, bodyValid,
      category, author, title, body, categories, isLoading
    } = this.state;
    return (
      !isLoading ? (
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
      ) : (
        <div className="Loading-cont">
          <ReactLoading type="spinningBubbles" color='#61DAF9'/>
        </div>
      )
    )
  }
}

EntityForm.propTypes = {
  action: PropTypes.string.isRequired, // addPost, addComment, editPost, editComment
  onComplete: PropTypes.func,
  id: PropTypes.string
};

const mapStateToProps = ({entities, stagingArea} , {action}) => ({
    categories: entities.categories.allIds,
    isLoading: stagingArea.isLoading && stagingArea.loadingAction === action,
    stagingItems: stagingArea.items
});

const mapDispatchToProps = (dispatch) =>({
  getCategories: () => dispatch(ActionTypes.fetchCategories()),
  createEntity: (data) => dispatch(ActionTypes.createEntity(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(EntityForm);