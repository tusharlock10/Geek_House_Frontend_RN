import React, {Component} from 'react';
import { View, StyleSheet, Text, StatusBar, TouchableOpacity}from 'react-native';
import {connect} from 'react-redux';
import {FONTS, COLORS_LIGHT_THEME} from '../Constants';
import Ripple from '../components/Ripple'
import NetInfo from '@react-native-community/netinfo';
import LinearGradient from 'react-native-linear-gradient';
import {loginGoogle,loginFacebook, checkLogin, internetHandler} from '../actions/LoginAction';
import Loading from '../components/Loading';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import Image from 'react-native-fast-image';
import SplashScreen from 'react-native-splash-screen';
import analytics from '@react-native-firebase/analytics';
import { Actions } from 'react-native-router-flux';

class Login extends Component {

  componentDidMount = async () => {
    this.props.checkLogin();
    SplashScreen.hide()
    analytics().logAppOpen();
    NetInfo.fetch().then(state=>this.props.internetHandler(state.isInternetReachable));
    NetInfo.addEventListener(state=>this.props.internetHandler(state.isInternetReachable));
    }

  renderGoogleButton(){
      if (!this.props.loading){
        if (!this.props.googleLoading){
          return (
            <Ripple rippleContainerBorderRadius={styles.GoogleButtonStyle.borderRadius}
              style={styles.GoogleButtonStyle}
              onPress={() => {
                if (!this.props.facebookLoading && !this.props.googleLoading)
                  this.props.loginGoogle();
                }
              }>
              <Image source={require('../../assets/icons/google.png')}
                style={{height:32, width:32}}/>
              <Text style={styles.GoogleButtonTextStyle}>
                SignIn With Google
              </Text>
            </Ripple>
          );
        }
        else{
          return (
            <View style={{...styles.GoogleButtonStyle, justifyContent:'center', alignItems:'center'}}>
              <Loading size={48}/>
            </View>
          );
        }
      }
      else{
        return null
      }
    }

    renderFacebookButton(){
      if (!this.props.loading){
        if (!this.props.facebookLoading){
          return(
            <Ripple rippleContainerBorderRadius={styles.FacebookButtonStyle.borderRadius}
              style={styles.FacebookButtonStyle}
              onPress={() => {
                if (!this.props.facebookLoading && !this.props.googleLoading)
                  this.props.loginFacebook()
                }}>
              <Image source={require('../../assets/icons/facebook.png')}
                  style={{height:32, width:32}}
                />
              <Text style={styles.FacebookButtonTextStyle}>
                Continue with Facebook
              </Text>
            </Ripple>
          )
        }
        else{
          return (
            <View style={{...styles.FacebookButtonStyle, justifyContent:'center', alignItems:'center'}}>
              <Loading size={48} white/>
            </View>
          );
        }
      }
      else{
        return null
      }
    }

  _renderPolicy(){
    return(
      <TouchableOpacity style={{alignSelf:'center'}}
        onPress={()=>{Actions.jump('policy', {navBar:COLORS_LIGHT_THEME.THEME2})}}>
        <Text style={{fontSize:10, textDecorationLine:'underline',
          fontFamily:FONTS.HELVETICA_NEUE, color:COLORS_LIGHT_THEME.LIGHT}}>
          T&C and Policies
        </Text>
      </TouchableOpacity>
    )
  }

  _renderLogin(){
    return(
      <View style={{flex:1}}>
        <View style={{flex:2, justifyContent:'center', alignItems:'center', flexWrap:'wrap', paddingHorizontal:80}}>
          <Image
            style={{height:200, width:200}}
            source={require('../../assets/images/loginIcon.png')}
          />
          {
            (this.props.loading)?null:
            <Text style={styles.InfoTextStyle}>
              ALL NEW PLATFORM FOR SHARING KNOWLEDGE
            </Text>
          }
        </View>
        <View style={{padding:10, flex:1, justifyContent:'center', alignItems:'center'}}>
          {this.renderGoogleButton()}
          {this.renderFacebookButton()}
          
        </View>
        {this._renderPolicy()}
      </View>
    );
  }

  render() {
    return(
      <LinearGradient
      colors={[COLORS_LIGHT_THEME.THEME1, COLORS_LIGHT_THEME.THEME2]}
      style={{flex:1, justifyContent:'flex-end', alignItems:'center'}}>
        <StatusBar 
          barStyle='light-content' 
          backgroundColor={COLORS_LIGHT_THEME.THEME1}/>
        {changeNavigationBarColor(COLORS_LIGHT_THEME.THEME2, false)}
        {
          (this.props.loading)?
          <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Loading white size={128}/>
          </View>:
          this._renderLogin()
        }
      </LinearGradient>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    googleLoading:state.login.googleLoading,
    facebookLoading:state.login.facebookLoading,
    loading: state.login.loading
  };
}

export default connect(mapStateToProps, {loginGoogle,loginFacebook, checkLogin,
  internetHandler})(Login);


const styles = StyleSheet.create({
  UpdateText: {
    fontFamily: FONTS.RALEWAY,
    fontSize: 14,
    color: COLORS_LIGHT_THEME.LIGHT
  },
  GoogleButtonStyle:{
    borderRadius:12,
    width:250,
    height:50,
    backgroundColor:'white',
    margin:5,
    elevation:7,
    alignItems:'center',
    justifyContent:'space-evenly',
    flexDirection:'row',
    paddingHorizontal:10
  },

  FacebookButtonStyle:{
    borderRadius:12,
    width:250,
    height:50,
    backgroundColor:'rgb(24, 119, 242)',
    margin:5,
    elevation:7,
    alignItems:'center',
    justifyContent:'space-evenly',
    flexDirection:'row',
    paddingHorizontal:10
  },
  
  GoogleButtonTextStyle:{
    color:'rgb(100,100,100)',
    fontFamily:FONTS.PRODUCT_SANS,
    marginHorizontal:5,
    fontSize:18
  },
  FacebookButtonTextStyle:{
    color:'white',
    fontFamily:FONTS.HELVETICA_NEUE,
    marginHorizontal:5,
    fontSize:15
  },
  InfoTextStyle:{
    color:'white',
    fontSize:16,
    fontFamily:FONTS.ROBOTO_BOLD,
    flexWrap:'wrap',
    textAlign:'center'
  }
})