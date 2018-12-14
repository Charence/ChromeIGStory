import React, { Component } from 'react';
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
import {setCurrentStoryObject} from '../../utils/PopupUtils';

class SuggestedStoriesList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1,
      downloadingIndex: -1,
      isDownloadingStory: false
    }
  }
  
  handleRequestChange (event, index) {
    var selectedStory = this.props.stories.tray[index];
    fetchStory(selectedStory, false, (story) => {
      setCurrentStoryObject('USER_STORY', story);
    });
    this.setState({
      selectedIndex: index,
    });
    AnalyticsUtil.track("Story List Item Clicked", AnalyticsUtil.getStoryObject(selectedStory));
  }
  
  onDownloadStory(index) {
    if(!this.state.isDownloadingStory) {
      var selectedStory = this.props.stories.tray[index];
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
    var selectedStory = this.props.stories.tray[index];
    AnalyticsUtil.track("Share Story", AnalyticsUtil.getStoryObject(selectedStory));
    if(selectedStory.owner) {
      window.open('https://watchmatcha.com/location/' + selectedStory.location.pk);
    } else {
      window.open('https://watchmatcha.com/user/' + selectedStory.user.username);
    }
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
        textAlign: 'right'
      }
    }
    
    const { selectedIndex, isDownloadingStory, downloadingIndex } = this.state;
    var user, name;
    user = (storyItem.user) ? storyItem.user : storyItem.owner;
    name = (user.username) ? user.username : user.name;
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
              title="Share"
              placement="bottom"
              >
            <IconButton
              onClick={() => this.onShareStory(key)}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          */}
          <Tooltip
            title="Download"
            placement="bottom"
            >
            <IconButton
              onClick={() => this.onDownloadStory(key)}>
              {(this.state.isDownloadingStory && this.state.downloadingIndex === key) ? <CircularProgress size={24}/> : <DownloadIcon />}
            </IconButton>
          </Tooltip>
          </div>
        </Toolbar>
      </ListItem>
    )
  }
  
  render() {
    const friendStoriesListData = this.props.stories.tray.map((storyItem, key) => {
      return this.renderListItem(key, storyItem)
    });
    
    return (
      <List onChange={this.handleRequestChange.bind(this)}>
        <ListSubheader disableSticky>Suggested Stories</ListSubheader>
        {friendStoriesListData}
      </List>
    )
  }
}

export default SuggestedStoriesList;
