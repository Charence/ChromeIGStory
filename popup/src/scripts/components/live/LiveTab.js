import React, {Component} from 'react';
import {connect} from 'react-redux';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import ListSubheader from '@material-ui/core/ListSubheader';
import VisibilityIcon from '@material-ui/icons/Visibility';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import {setCurrentStoryObject} from '../../utils/PopupUtils';
import $ from 'jquery';

import {TAB_CONTAINER_HEIGHT} from '../../../../../utils/Constants';

class LiveTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      liveVideos: [],
      isFullPopup: false
    }
  }
  
  selectLiveVideo(index) {
    var selectedLiveVideo = this.props.topLiveVideos[index];
    setCurrentStoryObject('LIVE', {broadcast: selectedLiveVideo});
    AnalyticsUtil.track("Live Video Item Clicked", AnalyticsUtil.getLiveVideoObject(selectedLiveVideo));
  }
  
  onStoryAuthorUsernameClicked(index) {
    var authorUsername = this.props.topLiveVideos[index].broadcast_owner.username;
    window.open('https://www.instagram.com/' + authorUsername + '/');
    AnalyticsUtil.track("Live Video Author Username Clicked", {username: authorUsername});
  }
  
  render() {
    const styles = {
      root: {
      },
      gridList: {
        flexWrap: 'nowrap',
        overflowY: 'auto',
      },
      viewCountSpan: {
        marginLeft: '5px',
        verticalAlign: 'super',
        fontSize: '14px'
      }
    };
    
    return (
      <div style={styles.root}>
        <ListSubheader disableSticky>Live Videos</ListSubheader>
        <GridList
          cellHeight={230}
          cols={(this.props.isFullPopup) ? 0 : 3.5}
          padding={5}
          style={styles.gridList}>
          {this.props.topLiveVideos.map((tile, index) => (
            <GridListTile key={tile.id}>
              <img src={tile.cover_frame_url} style={{cursor: 'pointer', height: '100%'}} onClick={()=>this.selectLiveVideo(index)} />
              <img src="../img/overlayBottom.png" style={{height: '85px', position: 'absolute', bottom: '0px', left: 0}}/>
              <span className="liveStoryInfoSpan" style={{bottom: '32px', left: 0}}>
                <div>
                  <VisibilityIcon/>
                  <span style={styles.viewCountSpan}>{tile.viewer_count}</span>
                </div>
              </span>
              <span className="liveStoryInfoSpan" style={{bottom: '15px', left: 0, fontSize: '15px', cursor: 'pointer'}} onClick={()=>this.onStoryAuthorUsernameClicked(index)}>{tile.broadcast_owner.username}</span>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    topLiveVideos: state.stories.topLiveVideos,
    currentStoryItem: state.popup.currentStoryItem,
    isFullPopup: state.popup.isFullPopup
  };
};

export default connect(mapStateToProps)(LiveTab);