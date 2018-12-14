import React, { Component } from 'react';
import Popover from '@material-ui/core/Popover';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CircularProgress from '@material-ui/core/CircularProgress';
import VideoLibraryIcon from '@material-ui/icons/VideoLibrary';
import MusicLibraryIcon from '@material-ui/icons/LibraryMusic';
import DownloadIcon from '@material-ui/icons/GetApp';
import {getTimeElapsed, getLiveVideoMp4VideoUrl, getLiveVideoMp4AudioUrl, downloadStory} from '../../../../../utils/Utils';
import {setCurrentStoryObject} from '../../utils/ContentUtils';
import LiveVideoReplayDownloadDialog from '../../../../../utils/LiveVideoReplayDownloadDialog';

class LiveVideoReplayTrayItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLeftClickMenuActive: false,
      leftClickMenuAnchor: null,
      isRightClickMenuActive: false,
      rightClickMenuAnchor: null,
      isDownloadLiveVideoDialogOpen: false,
      isDownloadingStory: false
    }
  }
  
  componentDidMount() {
    // hijack default right click context menu and display custom context menu
    this.refs.TrayItemContainer.addEventListener('contextmenu', function(ev) {
      ev.preventDefault();
      this.setState({
        rightClickMenuAnchor: ev.currentTarget,
        isRightClickMenuActive: true
      });
      return true;
    }.bind(this), false);
  }
  
  handleRightClickMenuRequestClose() {
    this.setState({
      isRightClickMenuActive: false,
    });
  };
  
  handleLeftClickMenuRequestClose() {
    this.setState({
      isLeftClickMenuActive: false,
    });
  };
  
  onViewUserStory() {
    if(this.props.type === 'userProfile') {
      if(this.props.storyItem === null) {
        this.props.onViewLiveVideoReplay();
      } else {
        this.setState({
          leftClickMenuAnchor: this.refs.TrayItemContainer,
          isLeftClickMenuActive: true
        });
      }
    } else {
      setCurrentStoryObject('LIVE_REPLAY', {post_live_item: this.props.liveItem});
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
      trayItemUser: {
        margin: '0 auto'
      },
      trayItemUsername: {
        marginTop: '10px',
        fontSize: '14px',
        color: (this.props.liveItem.last_seen_broadcast_ts === 0) ? '#262626' : "#999999"
      },
      livePulse: {
        position: 'absolute'
      },
    }  
    
    var seenClass = (this.props.liveItem.last_seen_broadcast_ts === 0) ? "unseenStoryItem" : "seenStoryItem";
    var liveVideoReplayIcon = (this.props.liveItem.last_seen_broadcast_ts === 0) ? chrome.extension.getURL('img/icon_post_live.png') : chrome.extension.getURL('img/icon_post_live_seen.png');
    var isUserProfile = this.props.type === 'userProfile';
    
    const liveVideoDownloadCards = this.props.liveItem.broadcasts.map((liveVideoItem, key) => {
      return (
        <Card style={{margin: '5px auto'}}>
          <CardHeader
            style={{display: 'inline-block'}}
            title={"Published " + getTimeElapsed(liveVideoItem.published_time)}
            subtitle={"Expiring " + getTimeElapsed(liveVideoItem.expire_at)}
            avatar={liveVideoItem.broadcast_owner.profile_pic_url}
            />
          <CardMedia>
            <img src={liveVideoItem.cover_frame_url} alt="" style={{height: '250px', objectFit: 'contain'}}/>
          </CardMedia>
          <CardActions>
            <Button label="Open Audio URL" onClick={() => {
                var selectedStory = this.props.liveItem.broadcasts[0];
                getLiveVideoMp4AudioUrl(selectedStory.dash_manifest, (videoUrl) => {
                  window.open(videoUrl);
                });
              }} />
              <Button label="Open Video URL" onClick={() => {
                  var selectedStory = this.props.liveItem.broadcasts[0];
                  getLiveVideoMp4VideoUrl(selectedStory.dash_manifest, (videoUrl) => {
                    window.open(videoUrl);
                  });
                }} />
              </CardActions>
            </Card>
          )});
          
          return (
            <div ref="TrayItemContainer" style={isUserProfile ? styles.trayItemUser : styles.trayItemContainer} onClick={() => this.onViewUserStory()}>
              {this.state.isDownloadingStory && <CircularProgress className="center-div" style={{position: 'absolute'}} size={190} />}
              <div className={((isUserProfile) ? "liveUserItemImage" : "liveTrayItemImage") + " " + seenClass}>
                <img className={((isUserProfile) ? "liveUserItemIcon" : "liveTrayItemIcon") + " " + "center-div"} src={this.props.liveItem.user.profile_pic_url}/>
                <div className={((isUserProfile) ? "liveUserItemBlackCircle" : "liveTrayItemBlackCircle") + " " + "center-div"}></div>
                {this.props.liveItem.last_seen_broadcast_ts === 0 && <span className={((isUserProfile) ? "pulseUserItem" : "pulseTrayItem") + " " + "center-div"} style={styles.livePulse}></span>}
                <img src={liveVideoReplayIcon} className={((isUserProfile) ? "liveVideoReplayIconUser" : "liveVideoReplayIconTray") + " " + "center-div"}/>
              </div>
              
              {!isUserProfile &&
                <span style={styles.trayItemUsername}>{this.props.liveItem.user.username.substr(0, 10) + (this.props.liveItem.user.username.length > 10 ? '…' : '')}</span>
              }
              
              <Menu
                open={this.state.isRightClickMenuActive}
                anchorEl={this.state.rightClickMenuAnchor}
                onClose={() => this.handleRightClickMenuRequestClose()}>
                  {this.props.storyItem !== null && isUserProfile &&
                    <MenuItem
                      onClick={() => {
                        this.handleRightClickMenuRequestClose();
                        this.setState({isDownloadingStory: true});
                        downloadStory(this.props.storyItem, () => {
                          this.setState({isDownloadingStory: false});
                        });
                      }}>
                      <ListItemIcon>
                        <DownloadIcon />
                      </ListItemIcon>
                      <ListItemText primary="Download Story" />
                    </MenuItem>
                  }
                  <MenuItem
                    onClick={() => {
                      this.handleRightClickMenuRequestClose();
                      this.setState({isDownloadLiveVideoDialogOpen: true});
                    }}>
                    <ListItemIcon>
                      <DownloadIcon />
                    </ListItemIcon>
                    <ListItemText primary="Download Live Video" />
                  </MenuItem>
                </Menu>
              
              <Menu
                open={this.state.isLeftClickMenuActive}
                anchorEl={this.state.leftClickMenuAnchor}
                onClose={() => this.handleLeftClickMenuRequestClose()}>
                  <MenuItem
                    onClick={() => {
                      this.handleLeftClickMenuRequestClose();
                      this.props.onViewUserStory(this.props.storyItem);
                    }}>
                    <ListItemText primary="View Story" />
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      this.handleLeftClickMenuRequestClose();
                      this.props.onViewLiveVideoReplay();
                    }}>
                    <ListItemText primary="Watch Live Video" />
                  </MenuItem>
              </Menu>
              
              <LiveVideoReplayDownloadDialog
                isOpen={this.state.isDownloadLiveVideoDialogOpen}
                liveVideoReplays={this.props.liveItem.broadcasts}
                onRequestClose={() => this.setState({isDownloadLiveVideoDialogOpen: false})}
                />
            </div>
          )
        }
      }

export default LiveVideoReplayTrayItem;