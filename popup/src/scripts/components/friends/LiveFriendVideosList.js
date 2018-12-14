import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DownloadIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';

import LiveVideo from '../../../../../utils/LiveVideo';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import {setCurrentStoryObject} from '../../utils/PopupUtils';
import {getStorySlide} from '../../../../../utils/Utils';

class LiveFriendVideosList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1
    }
  }
  
  handleRequestChange (event, index) {
    var selectedStory = this.props.friendStories.broadcasts[index];
    setCurrentStoryObject('LIVE', {broadcast: selectedStory});
    this.setState({
      selectedIndex: index,
    });
    AnalyticsUtil.track("Story List Item Clicked", AnalyticsUtil.getStoryObject(selectedStory));
  }
  
  onShareStory(index) {
    var selectedStory = this.props.friendStories.broadcasts[index];
    AnalyticsUtil.track("Share Story", AnalyticsUtil.getStoryObject(selectedStory));
    window.open('https://watchmatcha.com/user/' + selectedStory.broadcast_owner.username);
  }
  
  renderListItem(index, liveItem) {
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
    
    const { selectedIndex } = this.state;
    const isPrivate = liveItem.broadcast_owner.is_private;
    
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
              <Avatar src={liveItem.broadcast_owner.profile_pic_url} />
            </ListItemAvatar>
            <ListItemText
              primary={liveItem.broadcast_owner.username}
              secondary={liveItem.viewer_count + ' viewers'}
              />
          </div>
          <div style={styles.listItemActions}>
            {/*
            <Tooltip
              title={(isPrivate) ? "Can't Share Private Story" : "Share"}
              placement="bottom"
              >
              <IconButton
                disabled={isPrivate}
                onClick={() => this.onShareStory(key)}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            */}
          </div>
        </Toolbar>
      </ListItem>
    )
  }
  
  render() {
    if(!this.props.friendStories.broadcasts || this.props.friendStories.broadcasts.length === 0) {
      return (<div></div>);
    }
    
    const friendStoriesListData = this.props.friendStories.broadcasts.map((liveItem, key) => {
      return this.renderListItem(key, liveItem);
    });
    
    return (
      <List onChange={this.handleRequestChange.bind(this)}>
        <ListSubheader disableSticky>Live Videos</ListSubheader>
        {friendStoriesListData}
      </List>
    )
  }
}

export default LiveFriendVideosList;
