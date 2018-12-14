import React, { Component } from 'react';
import {connect} from 'react-redux';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import DownloadIcon from '@material-ui/icons/GetApp';
import CircularProgress from '@material-ui/core/CircularProgress';
import InstagramApi from '../../../../../utils/InstagramApi';
import {fetchStory} from '../../../../../utils/Utils';
import {setCurrentStoryObject} from '../../utils/PopupUtils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';

class PeopleSearchList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1,
      downloadingIndex: -1,
      isDownloadingStory: false
    }
  }
  
  handleRequestChange (event, index) {
    var selectedResult = this.props.results[index];
    selectedResult.id = selectedResult.pk;
    fetchStory(selectedResult, false, (story) => {
      setCurrentStoryObject('USER_STORY', story);
    });
    this.setState({
      selectedIndex: index,
    });
    AnalyticsUtil.track("Search List Item Clicked",
    {
      type: "user",
      result: {
        id: selectedResult.pk,
        username: selectedResult.username
      }
    });
  }
  
  getMenuItem(index) {
    return (
      <Tooltip
        title="Download"
        >
        <IconButton
          onClick={() => {
            if(!this.state.isDownloadingStory) {
              var selectedResult = this.props.results[index];
              selectedResult.id = selectedResult.pk;
              this.setState({
                isDownloadingStory: true,
                downloadingIndex: index
              });
              fetchStory(selectedResult, true, (story) => {
                this.setState({isDownloadingStory: false});
                if(!story) {
                  // show 'No Story Available' Snackbar message
                  setCurrentStoryObject(null, null);
                }
              });
            }
          }}>
          {(this.state.isDownloadingStory && this.state.downloadingIndex === index) ? <CircularProgress size={24}/> : <DownloadIcon />}
        </IconButton>
      </Tooltip>
    );
  }
  
  render() {
    const peopleSearchListData = this.props.results.map((user, key) => {
      return (
        <ListItem
          key={key}
          button
          selected={this.state.selectedIndex === key}
          onClick={event => this.handleRequestChange(event, key)}
          >
          <ListItemAvatar>
            <Avatar src={user.profile_pic_url} />
          </ListItemAvatar>
          <ListItemText
            primary={user.username}
            secondary={user.full_name}
            />
          {this.getMenuItem(key)}
        </ListItem>
      )
    });
    
    return (
      <List onChange={this.handleRequestChange.bind(this)}>
        {peopleSearchListData}
      </List>
    )
  }
}

export default PeopleSearchList;
