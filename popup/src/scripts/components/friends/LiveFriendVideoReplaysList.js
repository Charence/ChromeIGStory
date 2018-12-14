import React, { Component } from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import DownloadIcon from '@material-ui/icons/GetApp';
import ShareIcon from '@material-ui/icons/Share';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import MusicLibraryIcon from '@material-ui/icons/LibraryMusic';
import LiveVideo from '../../../../../utils/LiveVideo';
import {getTimeElapsed} from '../../../../../utils/Utils';
import {setCurrentStoryObject} from '../../utils/PopupUtils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import LiveVideoReplayDownloadDialog from '../../../../../utils/LiveVideoReplayDownloadDialog';

class LiveFriendVideoReplaysList extends Component {
  constructor(props){
    super(props);
    this.state = {
      selectedIndex: -1,
      downloadingIndex: -1,
      isDownloadLiveVideoDialogOpen: false
    }
  }
  
  handleRequestChange (event, index) {
    var selectedStory = this.props.friendStories.post_live.post_live_items[index];
    setCurrentStoryObject('LIVE_REPLAY', {post_live_item: selectedStory});
    this.setState({
      selectedIndex: index,
    });
    AnalyticsUtil.track("Story List Item Clicked", AnalyticsUtil.getStoryObject(selectedStory));
  }
  
  onDownloadStory(index) {
    this.setState({
      isDownloadLiveVideoDialogOpen: true,
      downloadingIndex: index
    });
  }
  
  onShareStory(index) {
    var selectedStory = this.props.friendStories.post_live.post_live_items[index].broadcasts[0];
    AnalyticsUtil.track("Share Story", AnalyticsUtil.getStoryObject(selectedStory));
    window.open('https://watchmatcha.com/user/' + selectedStory.broadcast_owner.username);
  }
  
  renderListItem(index, liveVideoReplay) {
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
    const isPrivate = liveVideoReplay.user.is_private;
    const latestBroadcast = liveVideoReplay.broadcasts[liveVideoReplay.broadcasts.length - 1];
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
              <Avatar src={liveVideoReplay.user.profile_pic_url} />
            </ListItemAvatar>
            <ListItemText
              primary={liveVideoReplay.user.username}
              secondary={getTimeElapsed(latestBroadcast.published_time)}
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
                onClick={() => this.onShareStory(index)}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
            */}
            <Tooltip
              title="Download"
              placement="bottom"
              >
              <IconButton
                onClick={() => this.onDownloadStory(index)}>
                <DownloadIcon />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </ListItem>
    )
  }
  
  render() {
    if(this.props.friendStories.post_live.post_live_items.length === 0) {
      return (<div></div>);
    }
    
    const liveFriendVideoReplaysListData = this.props.friendStories.post_live.post_live_items.map((liveVideoReplay, key) => {
      return this.renderListItem(key, liveVideoReplay);
    });
    
    return (
      <div>
        <List onChange={this.handleRequestChange.bind(this)}>
          <ListSubheader disableSticky>Live Video Replays</ListSubheader>
          {liveFriendVideoReplaysListData}
        </List>
        {this.state.isDownloadLiveVideoDialogOpen &&
          <LiveVideoReplayDownloadDialog
            isOpen={this.state.isDownloadLiveVideoDialogOpen}
            liveVideoReplays={this.props.friendStories.post_live.post_live_items[this.state.downloadingIndex].broadcasts}
            onRequestClose={() => this.setState({isDownloadLiveVideoDialogOpen: false})}
            />
        }
      </div>    
    )
  }
}

export default LiveFriendVideoReplaysList;
