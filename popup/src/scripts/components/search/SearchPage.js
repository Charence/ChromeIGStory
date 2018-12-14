import React, { Component } from 'react';
import {connect} from 'react-redux';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import TextField from '@material-ui/core/TextField';
import ActionSearchIcon from '@material-ui/icons/Search';
import NavigationArrowBackIcon from '@material-ui/icons/ArrowBack';
import NavigationCloseIcon from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import PeopleSearchTab from '../search/PeopleSearchTab';
import HashtagSearchTab from '../search/HashtagSearchTab';
import LocationSearchTab from '../search/LocationSearchTab';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import AnalyticsUtil from '../../../../../utils/AnalyticsUtil';
import {
  TAB_TEXT_COLOR_DARK_GRAY,
  TAB_TEXT_COLOR_LIGHT_GRAY,
  TAB_BACKGROUND_COLOR_WHITE
} from '../../../../../utils/Constants';

const tabNames = ["People", "Tags", "Places"];

class SearchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTabIndex: 0,
      isSearchResultsActive: true,
      isFullPopup: false,
      searchQuery: ''
    }
  }

  componentDidMount() {
    // if(this.props.currentStoryItem != null || this.props.isFullPopup) {
    //   this.setState({isFullPopup: true});
    //   this.props.dispatch({
    //     type: 'SET_IS_FULL_POPUP',
    //     isFullPopup: false
    //   });
    // }
  }

  handleTabChange = (event, value) => {
    this.setState({currentTabIndex: value});
    AnalyticsUtil.track("Search " + tabNames[value] + " Tab Selected", {"query": this.state.searchQuery});
  };

  handleSplashSearchKeyPress(e) {
    var itself = this;
    if(e.key === 'Enter') {
      var searchQuery = this.refs.splashSearchQuery.getValue();
      if(searchQuery.length === 0) {
        return;
      }
      if(searchQuery !== itself.state.searchQuery) {
        AnalyticsUtil.track("Search", {
          type: tabNames[itself.state.currentTabIndex],
          query: searchQuery
        });
      }
      itself.setState({
        isSearchResultsActive: true,
        searchQuery: itself.refs.splashSearchQuery.getValue()
      });
    }
  }

  handleSplashSearch() {
    var searchQuery = this.refs.splashSearchQuery.getValue();
    if(searchQuery.length === 0) {
      return;
    }
    if(searchQuery !== this.state.searchQuery) {
      AnalyticsUtil.track("Search", {
        type: tabNames[this.state.currentTabIndex],
        query: searchQuery
      });
    }
    this.setState({
      isSearchResultsActive: true,
      searchQuery: searchQuery
    });
  }

  handleSearch() {
    var searchQuery = this.refs.searchQuery.getValue();
    if(searchQuery.length === 0) {
      return;
    }
    if(searchQuery !== this.state.searchQuery) {
      AnalyticsUtil.track("Search", {
        type: tabNames[this.state.currentTabIndex],
        query: searchQuery
      });
    }
    this.setState({
      searchQuery: searchQuery
    });
  }

  handleSearchKeyPress(e) {
    if(e.key === 'Enter') {
      var searchQuery = e.target.value;
      if(searchQuery.length === 0) {
        return;
      }
      if(searchQuery !== this.state.searchQuery) {
        AnalyticsUtil.track("Search", {
          type: tabNames[this.state.currentTabIndex],
          query: searchQuery
        });
      }
      this.setState({
        searchQuery
      });
    }
  }
  
  closeSearch() {
    this.props.dispatch({
      type: 'SET_IS_SEARCH_ACTIVE',
      isSearchActive: false
    });
  }

  render() {
    const styles = {
      searchBar: {
        margin: '10px',
        textAlign: 'center',
        display: 'inline-block'
      },
      searchContainer: {
        position: 'absolute',
        top: '50%',
        transform: (this.state.isFullPopup) ? 'translate(50%, -50%)' : 'translate(0%, -50%)'
      },
      searchAppBar: {
        backgroundColor: TAB_BACKGROUND_COLOR_WHITE,
        height: '56px',
        width: this.props.currentStoryObject === null ? '100%' : '55%',
        left: 0,
        boxShadow: 'none'
      },
      splashSearchField: {
        marginLeft: (this.state.isFullPopup) ? '10px' : 'inherit',
        marginRight: (this.state.isFullPopup) ? '10px' : 'inherit'
      },
      searchTabs: {
        boxShadow: 'rgba(0, 0, 0, 0.117647) 0px 1px 6px, rgba(0, 0, 0, 0.117647) 0px 1px 4px',
        zIndex: 1
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

    styles.tab = [];
    styles.tab[0] = styles.activeTab;
    styles.tab[1] = styles.activeTab;
    styles.tab[2] = styles.activeTab;
    styles.tab[this.state.currentTabIndex] = Object.assign({}, styles.tab[this.state.currentTabIndex], styles.defaultTab);

    return (
      <div style={{position: 'absolute', width: this.props.currentStoryObject === null ? '100%' : '55%', zIndex: 1}}>

        {this.state.isSearchResultsActive &&
          <div>
            <AppBar
              style={styles.searchAppBar}
              >
              <Toolbar >
                <IconButton
                  onClick={()=> this.closeSearch()}
                  >
                  <NavigationArrowBackIcon/>
                </IconButton>
              
                <TextField
                  ref="searchQuery"
                  label="Search"
                  onKeyPress={(e) => this.handleSearchKeyPress(e)}
                  style={{width: '100%'}}
                  defaultValue={this.state.searchQuery}
                  />
                
                  <IconButton 
                    >
                    <ActionSearchIcon onClick={()=> this.handleSearch()}/>
                  </IconButton>
              </Toolbar>
            
            </AppBar>

            <Tabs
              value={this.state.currentTabIndex}
              onChange={this.handleTabChange}
              className="tabs-container"
              fullWidth
              >
              <Tab value={0} style={styles.tab[0]} label="People" className="tab"/>
              <Tab value={1} style={styles.tab[1]} label="Tags" className="tab"/>
              <Tab value={2} style={styles.tab[2]} label="Places" className="tab"/>
            </Tabs>
            
            {this.state.currentTabIndex === 0 && (
              <PeopleSearchTab
                searchQuery={this.state.searchQuery}
                isFullPopup={this.state.isFullPopup}
                />
            )
          }
          {this.state.currentTabIndex === 1 && (
            <HashtagSearchTab
              searchQuery={this.state.searchQuery}
              isFullPopup={this.state.isFullPopup}
              />
          )
        }
        {this.state.currentTabIndex === 2 && (
          <LocationSearchTab
            searchQuery={this.state.searchQuery}
            isFullPopup={this.state.isFullPopup}
            />
        )
      }
          </div>
        }

        {!this.state.isSearchResultsActive &&
          <div style={styles.searchContainer}>
            <Paper style={styles.searchBar} zDepth={2}>
              <TextField
                autoFocus
                ref="splashSearchQuery"
                hintText="Username, hashtag, or place"
                style={styles.splashSearchField}
                onKeyPress={(e) => this.handleSplashSearchKeyPress(e)}
                />
              
              <Button
                label="Search"
                secondary={true}
                icon={<ActionSearchIcon/>}
                onClick={(e) => this.handleSplashSearch(e)}
                />
            </Paper>

          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currentStoryObject: state.popup.currentStoryObject,
    isFullPopup: state.popup.isFullPopup
  };
};

export default connect(mapStateToProps)(SearchPage);
