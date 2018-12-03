import React, { Component } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import makeSelectable from '@material-ui/core/makeSelectable';
import {Toolbar, ToolbarGroup} from '@material-ui/core/Toolbar';
import Avatar from '@material-ui/core/Avatar';
import IconMenu from '@material-ui/core/IconMenu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Subheader from '@material-ui/core/Subheader';
import MoreVertIcon from '@material-ui/core/svg-icons/navigation/more-vert';
import DownloadIcon from '@material-ui/core/svg-icons/file/file-download';
import ShareIcon from '@material-ui/core/svg-icons/social/share';

import LiveVideo from '../../../../../utils/LiveVideo';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import {setCurrentStoryObject} from '../../utils/PopupUtils';
import {getStorySlide} from '../../../../../utils/Utils';

let SelectableList = makeSelectable(List);

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
  
  render() {
    if(!this.props.friendStories.broadcasts || this.props.friendStories.broadcasts.length === 0) {
      return (<div></div>);
    }
    
    const friendStoriesListData = this.props.friendStories.broadcasts.map((friendStory, key) => {
      const isPrivate = friendStory.broadcast_owner.is_private;
      return (
        <ListItem
          key={key}
          value={key}
          innerDivStyle={{paddingTop: '0px', paddingBottom: '0px'}}>
          <Toolbar style={{paddingTop: '0px', paddingBottom: '0px', background: 'transparent'}}>
            <ToolbarGroup firstChild={true}>
              <ListItem
                disabled
                primaryText={friendStory.broadcast_owner.username}
                secondaryText={friendStory.viewer_count + ' viewers'}
                leftAvatar={<Avatar src={friendStory.broadcast_owner.profile_pic_url} />}
                innerDivStyle={{marginLeft: '-14px'}}
                />
            </ToolbarGroup>
            <ToolbarGroup lastChild={true}>
              <IconButton
                tooltip={(isPrivate) ? "Can't Share Private Live Video" : "Share"}
                disabled={isPrivate}
                onClick={() => this.onShareStory(key)}>
                <ShareIcon />
              </IconButton>
            </ToolbarGroup>
          </Toolbar>
        </ListItem>
      )
    });
      
      return (
        <SelectableList value={this.state.selectedIndex} onChange={this.handleRequestChange.bind(this)}>
          <Subheader>Live Videos</Subheader>
          {friendStoriesListData}
        </SelectableList>
      )
    }
  }

export default LiveFriendVideosList;
