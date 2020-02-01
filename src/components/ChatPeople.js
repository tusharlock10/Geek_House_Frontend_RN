import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import {FONTS, COLORS_LIGHT_THEME} from '../Constants';
import Typing from '../components/Typing';
import {Icon} from 'react-native-elements';
import Image from 'react-native-fast-image';
import TimeAgo from 'react-native-timeago';

getInitials = (name) => {
  if (!name){return null}
  let initials = name.match(/\b\w/g) || [];
  initials = ((initials.shift() || '') + (initials.pop() || '')).toUpperCase();
  return initials
}

const getBadge = (props) => {
  const {COLORS} = props;

  if (props.typing){
    return (
      <View style={{
        position:'absolute', right:0, top:0, justifyContent:'center', alignItems:'center',
        borderColor:COLORS.LIGHT, borderWidth:1, elevation:5,
        height:12 , width:16, borderRadius:6, backgroundColor:COLORS.YELLOW
      }}>
        <Typing size={14}/>
      </View>
    );
  }
  else if (props.online){
    return (
      <View style={{
        position:'absolute', right:2, top:2, borderColor:COLORS.LIGHT, borderWidth:1,elevation:5,
        backgroundColor:'rgb(82, 196, 27)', height:12, width:12, borderRadius:6}}>
      </View>
    );
  }
  else{
    return <View/>
  }
}

const getRecentTime = (time) => {
  return (
    <Text style={{color:COLORS_LIGHT_THEME.THEME1, fontSize:10, 
      fontFamily:FONTS.PRODUCT_SANS_BOLD}}>
      <TimeAgo time={Date.parse(time)} interval={30000}/>
    </Text>
  )
}

const getRecentMessage = (message) => {
  if (message.length>30){
    message = message.substring(0,28) + "..."
  }
  return message
}

const imageUrlCorrector = (image_url, image_adder) => {
  if (image_url.substring(0,4) !== 'http'){
    image_url = image_adder + image_url
  }
  return image_url
}

const getAppropriateAccessory = (props) => {
  const {COLORS, isSelector, isSelected} = props;

  if (!isSelector && props.unread_messages){
    return (
      <View style={{...styles.BadgeViewStyle,
        backgroundColor:(props.theme==='light')?COLORS.RED:COLORS.GREEN}}>
        <Text style={{...styles.BadgeTextStyle, 
          color:COLORS.LIGHT}}>
          {props.unread_messages}
        </Text>
      </View>
    )
  }
  
  if (isSelector){
    return (isSelected)?
    (<Icon type={'feather'} name={'check'} color={COLORS.GREEN} size={20} />):
    null
  }
  return null
}

export default ChatPeople = (props) => {
  const {COLORS, isSelector, isSelected, data} = props;
  let IMAGE_SIZE = (isSelector)?42:56;
  
  return(
    <TouchableOpacity activeOpacity={(isSelector)?0.5:1} onPress={() => {props.onPress(data._id, isSelected)}}>
      <View style={{...styles.ViewStyling, borderColor:COLORS.GRAY, 
        paddingVertical:10, borderWidth:(isSelector)?0:0.5, 
        backgroundColor:COLORS.LIGHT, borderRadius:(isSelector)?0:IMAGE_SIZE/4}}>
        <View style={{justifyContent:'center', flexDirection:'row', alignItems:'center'}}>
          <View>
            <Image
              source={(props.data.image_url)?
                {uri:imageUrlCorrector(props.data.image_url, props.image_adder)}:
                require('../../assets/icons/user.png')}
              style={{height:IMAGE_SIZE, width:IMAGE_SIZE, borderRadius:IMAGE_SIZE/2,
                backgroundColor:COLORS.LIGHT, elevation:5}}
            />
            {getBadge(props)}
          </View>
          
          <View style={{marginHorizontal:10, justifyContent:'center', alignItems:'flex-start'}}>
            <Text style={{...styles.TextStyle, 
              color:COLORS.LESS_DARK}}>
              {props.data.name}
            </Text>
            {(props.data.email)?(
              <Text style={{...styles.InterestStyle, fontSize:12,
              color:(props.theme==='light')?COLORS.LIGHT_GRAY:COLORS.LESS_DARK}}>
                {props.data.email}
              </Text>
            ):null}
            {(props.recentMessage && props.recentActivity)?(
              <Text style={{...styles.InterestStyle, fontSize:14, 
                color:COLORS.DARK_GRAY}}>
                {getRecentMessage(props.recentMessage)}
            </Text>
            ):null}
            {(props.recentMessage && props.recentActivity)?(
              getRecentTime(props.recentActivity)
            ):null}
          </View>
        </View>

        {getAppropriateAccessory(props)}

      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ViewStyling:{
    alignItems:'center',
    flexDirection:'row',
    paddingHorizontal:15,
    width:"90%",
    flex:1,
    justifyContent:'space-between',
    alignSelf:'center',
    overflow:'hidden',
  },
  TextStyle:{
    fontSize:18,
    fontFamily:FONTS.PRODUCT_SANS_BOLD,
  },
  InterestStyle:{
    fontSize:10,
    fontFamily:FONTS.PRODUCT_SANS,
  },
  BadgeTextStyle:{
    fontFamily: FONTS.PRODUCT_SANS_BOLD,
    fontSize:12
  },
  BadgeViewStyle:{
    borderRadius:20,
    justifyContent:'center',
    alignItems:'center',
    padding:3,
    elevation:6,
    minWidth: 28,
    minHeight:28,
  }
})