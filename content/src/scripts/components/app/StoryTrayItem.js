import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownloadIcon from '@material-ui/icons/GetApp';
import InstagramApi from '../../../../../utils/InstagramApi';
import {downloadStory} from '../../../../../utils/Utils';

class StoryTrayItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRightClickMenuActive: false,
      rightClickMenuAnchor: null,
      isDownloadingStory: false
    }
  }
  
  componentDidMount() {
    // hijack default right click context menu and display custom context menu
    this.refs.TrayItemContainer.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      if(!this.state.isDownloadingStory) {
        this.setState({
          rightClickMenuAnchor: ev.currentTarget,
          isRightClickMenuActive: true
        });
      }
      return true;
    }.bind(this), false);
  }
  
  handleRightClickMenuRequestClose() {
    this.setState({
      isRightClickMenuActive: false,
    });
  };
  
  onDownloadStory() {
    this.handleRightClickMenuRequestClose();
    this.setState({isDownloadingStory: true});
    if(this.props.storyItem.items){
      downloadStory(this.props.storyItem, () => {
        this.setState({isDownloadingStory: false});
      });
    } else {
      InstagramApi.getStory(this.props.storyItem.id).then(function(story) {
        downloadStory(story, () => {
          this.setState({isDownloadingStory: false});
        });
      }.bind(this));  
    }
  }
  
  render() {
    const styles = {
      trayItemContainer: {
        display: 'inline-flex',
        flexDirection: 'column',
        marginLeft: '5px',
        marginRight: '5px',
        marginBottom: '15px',
        marginTop: '15px'
      },
      trayItemUsername: {
        marginTop: '10px',
        fontSize: '14px',
        color: (this.props.storyItem.seen === 0) ? '#262626' : "#999999"
      },
      storyDownloadProgressIndicator: {
        position: 'absolute',
        marginTop: '-3px',
        marginLeft: '3px'
      }
    }  
    
    var seenClass = (this.props.storyItem.seen === 0) ? "unseenStoryItem" : "seenStoryItem";
    var user, name, trayIconImageUrl;
    user = (this.props.storyItem.user) ? this.props.storyItem.user : this.props.storyItem.owner;
    name = (user.username) ? user.username : user.name;
    trayIconImageUrl = user.profile_pic_url;
    
    if(this.props.storyItem.reel_type === 'highlight_reel') {
      name = this.props.storyItem.title;
      trayIconImageUrl = (this.props.storyItem.cover_media) ? this.props.storyItem.cover_media.cropped_image_version.url : this.props.storyItem.user.profile_pic_url;
    }
    
    return (
      <div ref="TrayItemContainer" id={"igs_" + name} style={styles.trayItemContainer} className={(this.props.storyItem.muted) ? "mutedStoryItem" : ""}>
        {this.state.isDownloadingStory && <CircularProgress style={styles.storyDownloadProgressIndicator} thickness={2.0} size={80} />}
        <img className={"trayItemImage " + seenClass} src={trayIconImageUrl} onClick={() => this.props.onViewUserStory(this.props.storyItem)}/>
        <span style={styles.trayItemUsername}>{name.substr(0, 10) + (name.length > 10 ? '…' : '')}</span>
        <Menu
          open={this.state.isRightClickMenuActive}
          anchorEl={this.state.rightClickMenuAnchor}
          onClose={() => this.handleRightClickMenuRequestClose()}>
          <MenuItem
            onClick={() => this.onDownloadStory()}>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            <ListItemText primary="Download" />
          </MenuItem>
        </Menu>
      </div>
    )
  }
}

export default StoryTrayItem;
