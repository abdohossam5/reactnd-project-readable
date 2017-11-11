import React, { Component } from 'react';
import './App.css';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Header from '../components/Header'
import PostsList from '../components/PostsList';
import PostDetails from '../components/PostDetails';
import Home from '../components/Home';
import Navigation from '../components/Navigation';
import EntityFrom from '../components/EntityForm'
import {Button, Glyphicon, Modal} from 'react-bootstrap';
import * as ActionTypes from '../actions';



class App extends Component {

  state = {
    showModal: false
  };

  componentDidMount(){
    // load the categories every time component is loaded in case there are newly added ones
    this.props.getCategories();
  }

  openModal(){
    this.setState({
      showModal: true
    })
  }

  closeModal(){
    this.setState({
      showModal: false
    })
  }

  submitPost(data){
    console.log(data);
    this.closeModal()
  }

  render() {

    const {showModal} = this.state;

    const {categories} = this.props;

    return (
      <div className="Root-cont">
        <Header/>
        <div className="App-content">
          <Navigation/>
          <div className="App">
            <Route exact path="/" component={Home}/>

            <Route exact path="/:category" component={PostsList}/>

            <Route path="/:category/:postId" component={PostDetails}/>

            <Button className="Add-post-btn" onClick={() => this.openModal()}><Glyphicon glyph="plus" /></Button>
          </div>
        </div>


        <Modal bsSize="large" aria-labelledby="contained-modal-title-sm"  show={showModal} onHide={() => this.closeModal()}>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">ADD POST</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <EntityFrom
              onSubmit={(data => this.submitPost(data))}
              fields={['author','title', 'category']}
              categories={categories}/>
          </Modal.Body>
        </Modal>

      </div>
    );
  }
}


const mapStateToProps = ({entities}) => (
  {
    categories: entities.categories.allIds
  }
);

const mapDispatchToProps = (dispatch) => ({
  getCategories: () => dispatch(ActionTypes.fetchCategories()),
});

// used withRouter to overcome update blocking
// https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
