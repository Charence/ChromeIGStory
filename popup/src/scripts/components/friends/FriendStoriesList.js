import React, { Component } from 'react';
import {connect} from 'react-redux';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import DownloadIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import CircularProgress from '@material-ui/core/CircularProgress';
import {fetchStory, getTimeElapsed} from '../../../../../utils/Utils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import InstagramApi from '../../../../../utils/InstagramApi';
import {setCurrentStoryObject} from '../../utils/PopupUtils';

class FriendStoriesList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1,
      downloadingIndex: -1,
      isDownloadingStory: false
    }
  }
  
  handleRequestChange (event, index) {
    var selectedStory = this.props.friendStories.tray[index];
    if(selectedStory.items && selectedStory.items.length > 0) {
      setCurrentStoryObject('USER_STORY', selectedStory);
    } else {
      fetchStory(selectedStory, false, (story) => {
        var friendStories = this.props.friendStories;
        const index = friendStories.tray.findIndex(storyItem => storyItem.id === selectedStory.id);
        friendStories.tray[index].items = story.reel.items;
        this.props.dispatch({
          type: 'SET_FRIEND_STORIES',
          friendStories: friendStories
        });
        setCurrentStoryObject('USER_STORY', story);
      });
    }
    this.setState({
      selectedIndex: index,
    });
    AnalyticsUtil.track("Story List Item Clicked", AnalyticsUtil.getStoryObject(selectedStory));
  }
  
  onDownloadStory(index) {
    if(!this.state.isDownloadingStory) {
      var selectedStory = this.props.friendStories.tray[index];
      this.setState({
        isDownloadingStory: true,
        downloadingIndex: index
      });
      fetchStory(selectedStory, true, () => {
        this.setState({isDownloadingStory: false});
      });
    }
  }
  
  onShareStory(index) {
    var selectedStory = this.props.friendStories.tray[index];
    AnalyticsUtil.track("Share Story", AnalyticsUtil.getStoryObject(selectedStory));
    window.open('https://watchmatcha.com/user/' + selectedStory.user.username);
  }
  
  renderListItem(index, storyItem) {
    const styles = {
      listItem: {
        flex: 1,
        background: 'transparent',
        paddingLeft: '0px',
        paddingRight: '0px',
        minHeight: '48px'
      },
      listItemContent: {
        display: 'flex', 
        flex: 1
      },
      listItemActions: {
        display: 'flex',
        textAlign: 'right'
      }
    }
    
    const { selectedIndex, isDownloadingStory, downloadingIndex } = this.state;
    const user = (storyItem.user) ? storyItem.user : storyItem.owner;
    const name = (user.username) ? user.username : user.name;
    const isPrivate = user.is_private;
    return (
      <ListItem
        key={index}
        button
        selected={selectedIndex === index}
        onClick={event => this.handleRequestChange(event, index)}
        >
        <Toolbar style={styles.listItem}>
          <div style={styles.listItemContent}>
            <ListItemAvatar>
              <Avatar src={user.profile_pic_url} />
            </ListItemAvatar>
            <ListItemText
              primary={name}
              secondary={getTimeElapsed(storyItem.latest_reel_media)}
              />
          </div>
          <div style={styles.listItemActions}>
            {/*
            <Tooltip
              title={(isPrivate) ? "Can't Share Private Story" : "Share"}
              placement="bottom"
              >
              <div>
                <IconButton
                  disabled={isPrivate}
                  onClick={() => this.onShareStory(index)}>
                  <ShareIcon />
                </IconButton>
              </div>
            </Tooltip>
            */}
            <Tooltip
              title="Download"
              placement="bottom"
              >
              <IconButton
                onClick={() => this.onDownloadStory(index)}>
                {(isDownloadingStory && downloadingIndex === index) ? <CircularProgress size={24}/> : <DownloadIcon />}
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </ListItem>
    )
  }
  
  render() {
    const friendStoriesListData = this.props.friendStories.tray.map((friendStory, key) => {
      return this.renderListItem(key, friendStory);
    });
    
    return (
      <List onChange={this.handleRequestChange.bind(this)}>
        <ListSubheader disableSticky>{"Friend's"} Stories</ListSubheader>
        {friendStoriesListData}
      </List>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    friendStories: state.stories.friendStories
  };
};

export default connect(mapStateToProps)(FriendStoriesList);
