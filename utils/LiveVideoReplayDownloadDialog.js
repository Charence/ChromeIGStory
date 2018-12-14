import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import {getTimeElapsed, getLiveVideoMp4VideoUrls, getLiveVideoMp4AudioUrl} from './Utils';

class LiveVideoReplayDownloadDialog extends Component {
  state = {
    videoUrls: [],
    videoUrlsMenuAnchor: null
  }
  
  handleVideoUrlsMenuClose = () => {
    this.setState({ videoUrlsMenuAnchor: null });
  }
  
  render() {
    const styles = {
      media: {
        height: 0,
        paddingTop: '56.25%', // 1:9
      }
    }

    const liveVideoDownloadCards = this.props.liveVideoReplays.map((liveVideoItem, key) => {
      return (
        <Card style={{margin: '5px auto'}} key={key}>
          <CardHeader
            title={"Published " + getTimeElapsed(liveVideoItem.published_time)}
            subheader={"Expiring " + getTimeElapsed(liveVideoItem.expire_at)}
            avatar={
              <Avatar src={liveVideoItem.broadcast_owner.profile_pic_url}/>
              }
            />
          <CardMedia
            style={styles.media}
            image={liveVideoItem.cover_frame_url}
            />
            

          <CardActions style={{flexDirection: 'row'}}>
            <Button color="primary" onClick={() => {
                var selectedStory = this.props.liveVideoReplays[key];
                getLiveVideoMp4AudioUrl(selectedStory.dash_manifest, (videoUrl) => {
                  window.open(videoUrl);
                });
              }}>
              Open Audio URL
            </Button>
              <Button color="primary" onClick={(event) => {
                  var selectedStory = this.props.liveVideoReplays[key];
                  getLiveVideoMp4VideoUrls(selectedStory.dash_manifest, (videoUrls) => {
                    debugger;
                    this.setState({
                      videoUrls,
                      videoUrlsMenuAnchor: event.currentTarget
                    });
                  });
                }}>
              Open Video URL
              </Button>
              <Menu
                anchorEl={this.state.videoUrlsMenuAnchor}
                open={Boolean(this.state.videoUrlsMenuAnchor)}
                onClose={this.handleVideoUrlsMenuClose}
                >
                {this.state.videoUrls.map((videoUrl, key) => {
                  const width = videoUrl.width;
                  const height = videoUrl.height;
                  return (
                    <MenuItem
                      key={key}
                      onClick={() => window.open(videoUrl.BaseURL)}
                      >
                      {`Open (${width} x ${height}) URL`}
                    </MenuItem>
                  );
                })
              }
              </Menu>
              </CardActions>
            </Card>
          )
        }
      );
      
      return (
        <Dialog
          actionsContainerStyle={{display: 'inline-block'}}
          scroll="paper"
          modal={false}
          open={this.props.isOpen}
          onClose={this.props.onRequestClose}>
          <DialogTitle>Download Live Video Replay</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Instagram Live Videos are streamed from 2 seperate sources: one for audio and one for video.
                <br/><br/>
                You can only download these 2 sources separately. {"You'll"} have to merge them into one file yourself.
                <br/><br/>
                **It may take a while to load the URL if the live video has a long duration due to large file size.
                <br/><br/>
                {liveVideoDownloadCards}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.props.onRequestClose} color="primary">
                Done
              </Button>
            </DialogActions>
        </Dialog>
      )
    }
  }
  
  export default LiveVideoReplayDownloadDialog;