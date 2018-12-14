import React, { Component } from 'react';
import {connect} from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import StoryContainer from './StoryContainer';
import {closeStoryModal} from '../../utils/ContentUtils';

class StoryModal extends Component {
  handleStoryModalClose = () => {
    closeStoryModal();
  };
  
  render() {
    return (
      <Dialog
        open={this.props.isStoryModalOpen}
        onClose={() => closeStoryModal()}
        bodyStyle={{padding: '0px'}}
        classes={{
          container: 'story-modal-container'
        }}
        >
        <StoryContainer/>
      </Dialog>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isStoryModalOpen: state.content.isStoryModalOpen
  };
};

export default connect(mapStateToProps)(StoryModal);