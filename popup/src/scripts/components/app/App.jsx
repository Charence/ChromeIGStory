import React, {Component} from 'react';
import {connect} from 'react-redux';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import ActionExploreIcon from '@material-ui/icons/Explore';
import ActionSearchIcon from '@material-ui/icons/Search';
import VisibilityOnIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import PeopleIcon from '@material-ui/icons/People';
import LiveTvIcon from '@material-ui/icons/LiveTv';
import PlaceIcon from '@material-ui/icons/Place';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';

import StoryContainer from './StoryContainer';
import FriendsTab from '../friends/FriendsTab';
import ExploreTab from '../explore/ExploreTab';
import LiveTab from '../live/LiveTab';
import LocationsTab from '../locations/LocationsTab';

import Story from '../../../../../utils/Story';
import LiveVideo from '../../../../../utils/LiveVideo';
import SearchPage from '../search/SearchPage';
import InstagramApi from '../../../../../utils/InstagramApi';
import {renderToolbar, toggleAnonymousStoryViews} from '../../../../../utils/Utils';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import $ from 'jquery';

import "../../../../../node_modules/react-image-gallery/styles/css/image-gallery.css";

import {
  TAB_TEXT_COLOR_DARK_GRAY,
  TAB_TEXT_COLOR_LIGHT_GRAY,
  TAB_BACKGROUND_COLOR_WHITE,
  POPUP_CONTAINER_WIDTH,
  POPUP_CONTAINER_HEIGHT
} from '../../../../../utils/Constants';

const tabNames = ["Friends", "Explore", "Live", "Locations"];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      currentStory: null,
      isFriendsTabLoading: true,
      isExploreTabLoading: true,
      isLiveTabLoading: true,
      isFullPopup: false
    }
  }

  handleTabChange = (event, value) => {
    this.setState({currentTabIndex: value});
    AnalyticsUtil.track(tabNames[value] + " Tab Selected");
  };
  
  setSearchActive() {
    this.props.dispatch({
      type: 'SET_IS_SEARCH_ACTIVE',
      isSearchActive: true
    });
  }

  componentDidMount() {
    if(this.props.isFullPopup) {
      AnalyticsUtil.track("Popout Opened");
      this.setState({isFullPopup: true});
    } else {
      AnalyticsUtil.track("Popup Opened");
    }

    // fetch all the data from the Instagram API and dispatch it to the store
    InstagramApi.getFriendStories((friendStoriesResponse) => this.loadFriendsStoryTray(friendStoriesResponse));
    InstagramApi.getExploreFeed((exploreStoriesResponse) => this.loadExploreStoryTray(InstagramApi.getExploreStories(exploreStoriesResponse)));
    InstagramApi.getTopLiveVideos((topLiveVideosResponse) => this.loadTopLiveVideos(topLiveVideosResponse));
  }
  
  loadFriendsStoryTray(friendStoriesResponse) {
    var unfetchedTrayItemIds = [];
    
    // TODO: implement functionality to fetch all stories which don't have any items
    // friendStoriesResponse.tray.forEach(function(trayItem, index) {
    //   var tempTrayItem = this.props.stories.friendStories.tray.find(tempTrayItem => tempTrayItem.id === trayItem.id);
    //   if(tempTrayItem === undefined) {
    //     unfetchedTrayItemIds.push(trayItem.id.toString());
    //   } else {
    //     if(!tempTrayItem.items) {
    //       unfetchedTrayItemIds.push(tempTrayItem.id.toString());
    //     }
    //   }
    // }.bind(this));  
    
    this.props.dispatch({
      type: 'SET_FRIEND_STORIES',
      friendStories: friendStoriesResponse
    });
    
    // fetch all stories which dont have any items; unused for now
    if(unfetchedTrayItemIds.length > 0) {
      InstagramApi.getReelsMedia(unfetchedTrayItemIds, (stories) => {
        var tempfriendStoriesResponse = friendStoriesResponse;
        tempfriendStoriesResponse.tray = stories.reels_media;
        this.props.dispatch({
          type: 'SET_FRIEND_STORIES',
          friendStories: tempfriendStoriesResponse
        });
      });
    }

    this.setState({isFriendsTabLoading: false});
  }

  loadExploreStoryTray(exploreStoriesResponse) {
    this.props.dispatch({
      type: 'SET_EXPLORE_STORIES',
      exploreStories: exploreStoriesResponse
    });
    this.setState({isExploreTabLoading: false});
  }

  loadTopLiveVideos(topLiveVideosResponse) {
    this.props.dispatch({
      type: 'SET_TOP_LIVE_VIDEOS',
      topLiveVideos: topLiveVideosResponse.broadcasts
    });
    this.setState({isLiveTabLoading: false});
  }
  
  handleSnackbarRequestClose() {
    this.props.dispatch({
      type: 'SET_IS_SNACKBAR_ACTIVE',
      isSnackbarActive: false
    });
  }
  
  getPopupWidth() {
    if(this.state.isFullPopup) {
      return 'inherit';
    } else {
      if(this.props.currentStoryObject === null) {
        return '440px';
      } else {
        return POPUP_CONTAINER_WIDTH + 'px';
      }
    } 
  }

  render() {
    const styles = {
      popupContainer: {
        width: this.getPopupWidth(),
        minWidth: this.getPopupWidth(),
        height: this.state.isFullPopup ? 'inherit' : POPUP_CONTAINER_HEIGHT + 'px',
        minHeight: this.state.isFullPopup ? 'inherit' : POPUP_CONTAINER_HEIGHT + 'px',
        margin: '0px',
        overflow: 'hidden'
      },
      appBar: {
        position: 'fixed',
        width: '55%',
        backgroundColor: TAB_BACKGROUND_COLOR_WHITE,
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        zIndex: 1
      },
      bottomNavigation: {
        width: '55%',
        position: 'absolute',
        bottom: '0px',
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px'
      },
      tabs: {
        marginTop: '5px'
      },
      friendsStoriesList: {
        width: this.props.currentStoryObject === null ? '100%' : '55%',
        minHeight: POPUP_CONTAINER_HEIGHT + 'px',
        float: 'left',
        overflowY: 'auto'
      },
      friendsStoryContainer: {
        minHeight: POPUP_CONTAINER_HEIGHT + 'px',
        marginLeft: '55%'
      },
      loadingIndicator: {
        position: 'sticky',
        display: 'block',
        margin: 'auto auto',
        top: '50%',
        left: '50%',
        transform: 'translate(0%, -50%)'
      },
      disclaimer: {
        fontSize: '0.5em'
      },
      welcomeAvatar: {
        width: 124,
        height: 124,
        margin: 'auto'
      },
      privacyLink: {
        color: 'black'
      },
      defaultTab: {
        backgroundColor: TAB_BACKGROUND_COLOR_WHITE,
        color: TAB_TEXT_COLOR_DARK_GRAY
      },
      activeTab: {
        backgroundColor: TAB_BACKGROUND_COLOR_WHITE,
        color: TAB_TEXT_COLOR_LIGHT_GRAY
      }
    };
    
    const toolbarActionsGroup = (
      <div style={{width: '100%', textAlign: 'right'}}>
        <Tooltip
          title={"Anonymous Viewing " + ((this.props.viewStoriesAnonymously) ? "Enabled" : "Disabled")}
          placement="bottom"
          >
        <IconButton
          onClick={() => toggleAnonymousStoryViews((viewStoriesAnonymously) => {
            this.props.dispatch({
              type: 'SET_VIEW_STORIES_ANONYMOUSLY',
              viewStoriesAnonymously: viewStoriesAnonymously
            });
          })}>
          {(this.props.viewStoriesAnonymously) ? <VisibilityOffIcon /> : <VisibilityOnIcon />}
        </IconButton>
      </Tooltip>
      {!this.props.isSearchActive &&
        <Tooltip
          title="Search"
          placement="bottom"
          >
        <IconButton
          classes={{
            colorInherit: TAB_TEXT_COLOR_DARK_GRAY
          }}
        onClick={()=> {
          this.setSearchActive();
          AnalyticsUtil.track("Search Button Clicked");
        }}>
        <ActionSearchIcon/>
        </IconButton>
      </Tooltip>
      }
      {!this.state.isFullPopup &&
        <Tooltip
          title="Popout"
          placement="bottom"
          >
          <IconButton
            classes={{
              colorInherit: TAB_TEXT_COLOR_DARK_GRAY
            }}
            onClick={()=> {
              this.props.dispatch({type: 'launch-popup'});
              AnalyticsUtil.track("Popout Button Clicked");
            }}>
            <OpenInNewIcon/>
          </IconButton>
        </Tooltip>
      }
    </div>
    );

    var currentTab;
    switch(this.state.currentTabIndex) {
      case 0:
      currentTab = (
        <FriendsTab isLoading={this.state.isFriendsTabLoading}/>
      );
      break;
      case 1:
      currentTab = (
        <ExploreTab isLoading={this.state.isExploreTabLoading}/>
      );
      break;
      case 2:
      currentTab = (
        <LiveTab isLoading={this.state.isLiveTabLoading}/>
      );
      break;
      case 3:
      currentTab = (
        <LocationsTab isLoading={this.state.isLiveTabLoading}/>
      );
      break;
    }
    
    // if(!this.props.isPrivacyDisclaimerAcknowledged) {
    //   const privacyUrl = 'http://chromeigstory.surge.sh/privacy';
    //   return (
    //     <div style={styles.popupContainer}>
    //       {renderToolbar()}
    //       <div className="center-div" style={{width: '100%', fontSize: '22px', textAlign: 'center'}}>
    //         <Avatar
    //           src={chrome.extension.getURL('img/icon-128.png')}
    //           style={styles.welcomeAvatar}
    //           />
    //         <p>Welcome to Chrome IG Story!</p>
    //         <p style={styles.disclaimer}>
    //           By continuing, you agree to our {' '}
    //           <a
    //             style={styles.privacyLink}
    //             href={privacyUrl}
    //             onClick={()=> window.open(privacyUrl)}
    //             >
    //             Privacy and User Data Policy
    //           </a>.
    //         </p>
    //         <Button variant="contained" color="primary" onClick={()=> {
    //             this.props.dispatch({
    //               type: 'SET_PRIVACY_DISCLAIMER_ACKNOWLEDGED',
    //               isPrivacyDisclaimerAcknowledged: true
    //             });
    //           }}>
    //           Get Started
    //         </Button>
    //       </div>
    //     </div>
    //   );
    // }
    
    if(!this.props.isCookiesValid) {
      return (
        <div style={styles.popupContainer}>
          {renderToolbar()}
          <div className="center-div" style={{width: '100%', fontSize: '22px', textAlign: 'center'}}>
            <ErrorIcon style={{width: '48px', height: '48px'}}/>
            <p>There was a problem with your Instagram session.</p>
            <p>Make sure you are signed into Instagram and try again.</p>
            <Button variant="contained" color="primary" onClick={()=> window.open('https://www.instagram.com/')}>
              Open Instagram
            </Button>
          </div>
        </div>
      );
    }
    
    styles.tab = [];
    styles.tab[0] = styles.activeTab;
    styles.tab[1] = styles.activeTab;
    styles.tab[2] = styles.activeTab;
    styles.tab[this.state.currentTabIndex] = Object.assign({}, styles.tab[this.state.currentTabIndex], styles.defaultTab);

    return (
      <div style={styles.popupContainer}>
        <div style={styles.friendsStoriesList}>
          {renderToolbar(toolbarActionsGroup)}
          {this.props.isSearchActive && <SearchPage/>}
          {!this.props.isSearchActive &&
            <Tabs
              value={this.state.currentTabIndex}
              onChange={this.handleTabChange}
              className="tabs-container"
              fullWidth>
              <Tab value={0} style={styles.tab[0]} label="Following" className="tab"/>
              <Tab value={1} style={styles.tab[1]} label="Explore" className="tab"/>
            </Tabs>
          }
          {this.state.currentTabIndex === 0 && <FriendsTab isLoading={this.state.isFriendsTabLoading}/>}
          {this.state.currentTabIndex === 1 && <ExploreTab isLoading={this.state.isExploreTabLoading}/>}
        </div>

        <div style={styles.friendsStoryContainer}>
          {<StoryContainer isSnackbarActive={this.props.isSnackbarActive} />}
          <Snackbar
            open={this.props.isSnackbarActive}
            autoHideDuration={3000}
            onRequestClose={() => this.handleSnackbarRequestClose()}
            message="No story available"/>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    stories: state.stories,
    isFullPopup: state.popup.isFullPopup,
    isSnackbarActive: state.popup.isSnackbarActive,
    isSearchActive: state.popup.isSearchActive,
    viewStoriesAnonymously: state.stories.viewStoriesAnonymously,
    isCookiesValid: state.popup.isCookiesValid,
    isPrivacyDisclaimerAcknowledged: state.popup.isPrivacyDisclaimerAcknowledged,
    currentStoryObject: state.popup.currentStoryObject
  };
};

export default connect(mapStateToProps)(App);
