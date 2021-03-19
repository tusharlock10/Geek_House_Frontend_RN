import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Share,
  Animated,
  TextInput,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import _ from 'lodash';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Feather';
import IconMaterial from 'react-native-vector-icons/MaterialIcons';
import StarRating from 'react-native-star-rating';
import LinearGradient from 'react-native-linear-gradient';
import {
  submitComment,
  getArticleInfo,
  bookmarkArticle,
} from '../actions/ArticleInfoAction';
import {setContents, setImage} from '../actions/WriteAction';
import {
  FONTS,
  COLORS_LIGHT_THEME,
  COLORS_DARK_THEME,
  SCREENS,
  ADS_MANAGER,
  CATEGORY_IMAGES,
} from '../Constants';
import CardView from './CardView';
import Loading from './Loading';
import Overlay from './Overlay';
import NativeAdsComponent from './NativeAdsComponent';
import Avatar from './Avatar';
import moment from 'moment';
import Ripple from './Ripple';
import {getRingColor, changeBarColors, imageUrlCorrector} from '../utilities';

const screenWidth = Dimensions.get('screen').width;
const OVERLAY_WIDTH_PERCENT = 88;
const HEADER_MAX_HEIGHT =
  Math.floor(screenWidth * (OVERLAY_WIDTH_PERCENT / 100)) * 0.75;
const HEADER_MIN_HEIGHT = 70;
const PROFILE_IMAGE_MAX_HEIGHT = 76;
const BORDER_RADIUS = 25; // PROFILE_IMAGE_MAX_HEIGHT/2;
const TOPIC_SMALL_SIZE = 18;

const ArticleInfo = (props) => {
  const [state, setState] = useState({
    scrollY: new Animated.Value(0),
    userCommentRating: -1,
    commentText: '',
    adIndex: 0,
    imageViewerActive: false,
  });

  const {
    userData,
    canShowAdsRemote,
    selectedArticleInfo,
    loading,
    COLORS,
  } = useSelector((state) => ({
    userData: state.login.data,
    canShowAdsRemote: state.home.welcomeData.canShowAdsRemote,
    selectedArticleInfo: state.articleInfo.selectedArticleInfo,
    loading: state.articleInfo.loading,
    COLORS: state.chat.COLORS,
  }));

  const dispatch = useDispatch();

  useEffect(() => {
    const {article_id} = props;

    let preview_article = false;
    if (article_id === -1) {
      preview_article = {
        article_id: -1,
        already_viewed: false,
        topic: topic,
        category: category,
        author: userData.name,
        author_image: userData.image_url,
        cards: preview_contents,
      };
    }

    if (
      article_id &&
      selectedArticleInfo.article_id !== article_id &&
      !loading
    ) {
      dispatch(getArticleInfo(article_id, preview_article));
    }
  }, [props.article_id]);

  function renderCardViews(cards) {
    const {adIndex} = state;

    if (!adIndex && cards) {
      setState({...state, adIndex: _.random(1, cards.length - 1)});
    }

    if (cards) {
      return (
        <View>
          {cards.map((item, i) => {
            return (
              <View key={i.toString()}>
                {i === adIndex && canShowAdsRemote ? (
                  <NativeAdsComponent
                    COLORS={COLORS}
                    adsManager={ADS_MANAGER}
                  />
                ) : null}
                <CardView COLORS={COLORS} cardData={item} />
              </View>
            );
          })}
        </View>
      );
    }
  }

  function getInitials(name) {
    if (!name) {
      return null;
    }
    let initials = name.match(/\b\w/g) || [];
    initials = (
      (initials.shift() || '') + (initials.pop() || '')
    ).toUpperCase();
    return initials;
  }

  function showStarRating() {
    const {userCommentRating} = state;

    if (selectedArticleInfo.cannotComment) {
      return null;
    }

    return (
      <StarRating
        selectedStar={(rating) => {
          setState({...state, userCommentRating: rating});
        }}
        activeOpacity={0.8}
        maxStars={5}
        rating={userCommentRating}
        halfStarEnabled={true}
        emptyStarColor={
          COLORS.THEME === 'light' ? COLORS.LESS_LIGHT : COLORS.GRAY
        }
        halfStarColor={COLORS.STAR_YELLOW}
        fullStarColor={COLORS.STAR_YELLOW}
        starSize={28}
        containerStyle={{marginLeft: 10, marginTop: 5}}
        emptyStar={'star-o'}
        fullStar={'star'}
        halfStar={'star-half-o'}
      />
    );
  }

  function renderCommentBox() {
    const {commentText, userCommentRating} = state;
    const {article_id} = props;

    return (
      <View>
        <View
          style={{
            backgroundColor: COLORS.LESSER_LIGHT,
            padding: 10,
            borderRadius: 10,
            marginBottom: 15,
          }}>
          <TextInput
            value={commentText}
            onChangeText={(text) => {
              setState({...state, commentText: text});
            }}
            textAlignVertical="top"
            keyboardAppearance="light"
            placeholderTextColor={COLORS.GRAY}
            numberOfLines={4}
            maxLength={2048}
            spellCheck={true}
            autoCapitalize="sentences"
            autoCorrect={true}
            multiline={true}
            placeholder={'What are your thoughts on this article...'}
            returnKeyType={'done'}
            style={{fontFamily: FONTS.LATO, fontSize: 16, color: COLORS.DARK}}
          />
          {showStarRating()}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.GREEN,
            alignSelf: 'flex-end',
            padding: 10,
            borderRadius: 30,
            elevation: 7,
            margin: 15,
          }}
          onPress={() => {
            if (userCommentRating !== -1 || commentText) {
              dispatch(
                submitComment(
                  {
                    rating: userCommentRating,
                    comment: commentText,
                    article_id: article_id,
                  },
                  userData.name,
                  userData.image_url,
                ),
              );
            } else {
              timedAlert.showAlert(2000, 'Please provide a rating or comment');
            }
          }}>
          <IconMaterial
            name="send"
            color={COLORS_LIGHT_THEME.LIGHT}
            size={20}
          />
        </TouchableOpacity>
      </View>
    );
  }

  function renderOptions() {
    const {article_id} = props;
    const {
      cards,
      topic,
      category,
      image,
      dynamicLink,
      my_article,
      cannotComment,
      bookmarked,
    } = selectedArticleInfo;

    if (!cards) {
      return null;
    }
    const contents = cards.map((card, index) => {
      return {...card, key: index};
    });

    if (props.article_id === -1) {
      return null;
    }

    if (my_article || cannotComment) {
      return (
        <Ripple
          containerStyle={{
            borderWidth: 1.2,
            backgroundColor: COLORS.LIGHT,
            borderRadius: 7,
            marginTop: 15,
            marginLeft: 15,
            width: 100,
            alignSelf: 'flex-start',
            marginVertical: 10,
            elevation: 4,
            marginBottom: -5,
            borderColor: COLORS.YELLOW,
          }}
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            paddingVertical: 10,
          }}
          onPress={() => {
            // props.getArticleInfo(article_id, false);
            setState({
              ...state,
              scrollY: new Animated.Value(0),
              adIndex: _.random,
            });
            props.onBackdropPress();
            changeBarColors(COLORS.LIGHT, COLORS.IS_LIGHT_THEME);
            dispatch(setContents(contents, topic, category, article_id));
            dispatch(setImage({uri: image}));
            props.navigation.navigate(SCREENS.WriteArticle, {article_id});
          }}>
          <Icon name="edit-2" size={16} color={COLORS.YELLOW} />
          <Text
            style={{
              fontFamily: FONTS.RALEWAY,
              color: COLORS.YELLOW,
              fontSize: 16,
              marginLeft: 7,
            }}>
            Edit
          </Text>
        </Ripple>
      );
    }

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 15,
        }}>
        <Ripple
          containerStyle={{
            borderColor: bookmarked ? COLORS.STAR_YELLOW : COLORS.LESSER_DARK,
            borderWidth: 1.2,
            borderRadius: 7,
            width: 130,
            alignSelf: 'flex-start',
            marginVertical: 10,
            elevation: 4,
            backgroundColor: COLORS.LIGHT,
          }}
          style={{
            paddingVertical: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => {
            dispatch(bookmarkArticle(article_id, bookmarked));
          }}>
          <IconMaterial
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={20}
            color={bookmarked ? COLORS.STAR_YELLOW : COLORS.LESSER_DARK}
          />
          <Text
            style={{
              fontFamily: FONTS.RALEWAY,
              color: bookmarked ? COLORS.STAR_YELLOW : COLORS.LESSER_DARK,
              fontSize: bookmarked ? 10.5 : 13,
              marginLeft: 10,
            }}>
            {bookmarked ? 'Bookmarked' : 'Bookmark'}
          </Text>
        </Ripple>
        <Ripple
          containerStyle={{
            borderRadius: 7,
            alignSelf: 'flex-start',
            width: 132,
            marginVertical: 10,
            marginLeft: 20,
            elevation: 4,
            backgroundColor: COLORS.GREEN,
          }}
          style={{
            justifyContent: 'center',
            paddingVertical: 11,
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => {
            Share.share({
              message: `View this article on ${topic} in Geek House using this link ${dynamicLink}`,
            });
          }}>
          <IconMaterial name="share" size={20} color={COLORS.LIGHT} />
          <Text
            style={{
              fontFamily: FONTS.RALEWAY,
              color: COLORS.LIGHT,
              fontSize: 13,
              marginLeft: 10,
            }}>
            Share
          </Text>
        </Ripple>
      </View>
    );
  }

  function renderComments(comments) {
    const {cannotComment, my_article} = selectedArticleInfo;

    if (cannotComment) {
      return null;
    }
    return (
      <View style={{marginTop: 20}}>
        <Text
          style={{
            fontSize: 32,
            fontFamily: FONTS.GOTHAM_BLACK,
            color: COLORS.LESS_DARK,
            marginLeft: 15,
          }}>
          Comments
        </Text>

        <View
          style={{
            backgroundColor:
              COLORS.THEME === 'light' ? COLORS.LIGHT : COLORS.LESS_LIGHT,
            borderColor: COLORS_DARK_THEME.GRAY,
            borderWidth: 2,
            elevation: 3,
            borderRadius: 15,
            padding: 10,
            margin: 10,
          }}>
          {my_article ? null : renderCommentBox()}

          {comments && comments.length !== 0 ? (
            comments.map((item, index) => {
              if (!item.rating) {
                item.rating = 0;
              }
              return (
                <View key={index.toString()}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Avatar
                      size={48}
                      uri={imageUrlCorrector(item.author_image)}
                    />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'space-evenly',
                        alignItems: 'flex-start',
                        paddingLeft: 12,
                      }}>
                      <Text
                        style={{
                          fontFamily: FONTS.HELVETICA_NEUE,
                          fontSize: 18,
                          color: COLORS.LESSER_DARK,
                        }}>
                        {item.author}
                      </Text>
                      {item.rating ? (
                        <StarRating
                          activeOpacity={0.8}
                          maxStars={item.rating}
                          disabled={true}
                          showRating={true}
                          rating={item.rating}
                          emptyStarColor={
                            COLORS.THEME === 'light'
                              ? COLORS.LESS_LIGHT
                              : COLORS.GRAY
                          }
                          halfStarColor={COLORS.STAR_YELLOW}
                          fullStarColor={COLORS.STAR_YELLOW}
                          starSize={14}
                          emptyStar={'star'}
                          fullStar={'star'}
                          halfStar={'star-half-o'}
                        />
                      ) : null}
                    </View>
                  </View>

                  <Text
                    style={{
                      fontFamily: FONTS.HELVETICA_NEUE,
                      textAlign: 'justify',
                      fontSize: 14,
                      marginTop: 10,
                      marginHorizontal: 10,
                      color: COLORS.LESSER_DARK,
                    }}>
                    {item.comment}
                  </Text>

                  {index === comments.length - 1 ? null : (
                    <View
                      style={{
                        width: '100%',
                        height: 0.5,
                        marginTop: 6,
                        marginBottom: 10,
                        backgroundColor: COLORS.LESS_LIGHT,
                        borderRadius: 1,
                      }}
                    />
                  )}
                </View>
              );
            })
          ) : (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Icon name="message-square" size={18} color={COLORS.LESS_DARK} />
              <Text
                style={{
                  fontFamily: FONTS.LATO,
                  fontSize: 16,
                  margin: 10,
                  color: COLORS.LESS_DARK,
                }}>
                {!my_article ? 'Be the first to comment' : 'No comments yet'}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  }

  function convertTopic(topic) {
    if (topic) {
      if (topic.length < 22) {
        return topic.toUpperCase();
      } else {
        return topic.slice(0, 20).toUpperCase() + '...';
      }
    }
  }

  function renderArticle() {
    const {article_id} = props;
    const {
      author,
      author_image,
      author_userXP,
      cards,
      views,
      category,
      comments,
      rating,
      topic,
      cannotComment,
      date_created,
      image,
    } = selectedArticleInfo;

    const imageSource = image
      ? {uri: imageUrlCorrector(image)}
      : CATEGORY_IMAGES[category];

    const date = moment(date_created);

    const ring_color = getRingColor(author_userXP);

    const headerHeight = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [0, -HEADER_MAX_HEIGHT + HEADER_MIN_HEIGHT],
      extrapolate: 'clamp',
    });
    const imageAnim = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [0, -HEADER_MAX_HEIGHT],
      // extrapolate:'clamp'
    });
    const textAnim = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT],
      outputRange: [0, (HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT) / 2],
      // extrapolate:'clamp'
    });

    const scaleToZero = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [1, 0.4],
      extrapolate: 'clamp',
    });

    const opacityChange = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT * 1.2],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    const bigImageOpacity = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [1, 0.15],
      extrapolate: 'clamp',
    });

    const bigImageScale = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [1, 1.1],
      extrapolate: 'clamp',
    });

    const pictureRotate = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: ['360deg', '120deg'],
      extrapolate: 'clamp',
    });
    const headerTextTranslate = state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [
        HEADER_MAX_HEIGHT,
        HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT / 2 - 10,
      ],
      extrapolate: 'clamp',
    });

    if (loading) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Loading size={128} white={COLORS.THEME !== 'light'} />
        </View>
      );
    }

    return (
      <View style={{flex: 1, width: '100%'}}>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            height: HEADER_MAX_HEIGHT,
            alignItems: 'center',
            transform: [{translateY: headerHeight}],
          }}>
          <LinearGradient
            style={{
              width: '100%',
              height: '100%',
              borderTopLeftRadius: BORDER_RADIUS,
              borderTopRightRadius: BORDER_RADIUS,
              overflow: 'hidden',
            }}
            colors={
              COLORS.THEME === 'light'
                ? ['rgb(20,20,20)', 'rgb(50,50,50)']
                : ['rgb(200,200,200)', 'rgb(240,240,240)']
            }>
            <Animated.Image
              style={{
                transform: [{scale: bigImageScale}],
                opacity: bigImageOpacity,
                height: '100%',
                width: '100%',
              }}
              source={imageSource}
            />
          </LinearGradient>
          <Animated.View
            style={{
              position: 'absolute',
              transform: [{translateY: headerTextTranslate}],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: COLORS.LIGHT,
                fontSize: TOPIC_SMALL_SIZE,
                textAlign: 'center',
                fontFamily: FONTS.NOE_DISPLAY,
              }}>
              {convertTopic(topic)}
            </Text>
          </Animated.View>
          <Animated.View
            onPress={() => setState({...state, imageViewerActive: true})}
            style={{
              top: -PROFILE_IMAGE_MAX_HEIGHT / 2,
              alignSelf: 'flex-start',
              height: PROFILE_IMAGE_MAX_HEIGHT,
              width: PROFILE_IMAGE_MAX_HEIGHT,
              borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
              marginLeft: 16,
              overflow: 'hidden',
              borderWidth: ring_color ? 2 : 0,
              borderColor: ring_color,
              backgroundColor: COLORS.LIGHT,
              elevation: 7,
              transform: [
                {translateX: imageAnim},
                {scaleX: scaleToZero},
                {scaleY: scaleToZero},
              ],
            }}>
            <Animated.Image
              source={{uri: author_image}}
              style={{
                flex: 1,
                transform: [{rotate: pictureRotate}],
              }}
            />
          </Animated.View>
        </Animated.View>

        <Animated.ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          decelerationRate={0.99}
          overScrollMode="always"
          contentContainerStyle={{
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden',
          }}
          style={{flex: 1}}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: state.scrollY}}}],
            {useNativeDriver: true},
          )}>
          <View
            style={{height: HEADER_MAX_HEIGHT + PROFILE_IMAGE_MAX_HEIGHT}}
          />
          <View>
            <Animated.Text
              style={{
                marginLeft: 16,
                marginVertical: 2,
                fontFamily: FONTS.LATO,
                fontSize: 14,
                color: COLORS.GRAY,
                opacity: opacityChange,
                transform: [{translateY: textAnim}],
              }}>
              {'by '}
              <Text style={{fontFamily: FONTS.LATO_BOLD, fontSize: 18}}>
                {author}
              </Text>
            </Animated.Text>
            <Animated.Text
              style={{
                fontSize: 28,
                marginLeft: 15,
                fontFamily: FONTS.NOE_DISPLAY,
                color: COLORS.LESS_DARK,
                opacity: opacityChange,
                transform: [{translateY: textAnim}],
              }}>
              {topic}
            </Animated.Text>
            <Animated.Text
              style={{
                fontFamily: FONTS.HELVETICA_NEUE,
                fontSize: 12,
                marginLeft: 16,
                color: COLORS.GRAY,
                transform: [{translateY: textAnim}],
                opacity: opacityChange,
              }}>
              {`${category}\n${date.format(
                'DD MMM',
              )} (${date.fromNow()})\n${views} View${views !== 1 ? 's' : ''}`}
            </Animated.Text>
            {rating ? (
              <Animated.View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  transform: [{translateY: textAnim}],
                  opacity: opacityChange,
                }}>
                <StarRating
                  activeOpacity={0.8}
                  maxStars={rating}
                  disabled={true}
                  showRating={true}
                  rating={rating}
                  emptyStarColor={
                    COLORS.THEME === 'light' ? COLORS.LESS_LIGHT : COLORS.GRAY
                  }
                  halfStarColor={COLORS.STAR_YELLOW}
                  fullStarColor={COLORS.STAR_YELLOW}
                  starSize={20}
                  containerStyle={{marginLeft: 10, marginTop: 5}}
                  emptyStar={'star'}
                  fullStar={'star'}
                  halfStar={'star-half-o'}
                />
                <Text
                  style={{
                    marginLeft: 10,
                    fontSize: 14,
                    fontFamily: FONTS.HELVETICA_NEUE,
                    color: COLORS.LIGHT_GRAY,
                  }}>
                  {rating}/5
                </Text>
              </Animated.View>
            ) : cannotComment ? null : (
              <Animated.Text
                style={{
                  marginLeft: 16,
                  fontSize: 10,
                  fontFamily: FONTS.HELVETICA_NEUE,
                  transform: [{translateY: textAnim}],
                  opacity: opacityChange,
                  color: COLORS.LIGHT_GRAY,
                }}>
                {article_id !== -1 ? '*Not yet rated' : '*In preview mode'}
              </Animated.Text>
            )}
          </View>
          <View style={{height: 20}} />

          {renderCardViews(cards)}
          {renderOptions()}
          {article_id !== -1 ? (
            renderComments(comments)
          ) : (
            <View style={{width: '100%', margin: 10}}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: 14,
                  fontFamily: FONTS.HELVETICA_NEUE,
                  color: COLORS.GRAY,
                }}>
                *Comments not available in preview
              </Text>
            </View>
          )}
          <View style={{height: 250}} />
        </Animated.ScrollView>
      </View>
    );
  }

  const {isVisible} = props;

  if (!isVisible) {
    return null;
  }

  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={{...styles.OverlayStyle, backgroundColor: COLORS.LIGHT}}
      onModalShow={() =>
        changeBarColors(COLORS.OVERLAY_COLOR, COLORS.IS_LIGHT_THEME)
      }
      onModalHide={() => changeBarColors(COLORS.LIGHT, COLORS.IS_LIGHT_THEME)}
      onBackdropPress={() => {
        // props.getArticleInfo(article_id, false);
        setState({...state, scrollY: new Animated.Value(0), adIndex: _.random});
        props.onBackdropPress();
        changeBarColors(COLORS.LIGHT, COLORS.IS_LIGHT_THEME);
      }}
      width={`${OVERLAY_WIDTH_PERCENT}%`}
      height="90%">
      {renderArticle()}
    </Overlay>
  );
};

export default ArticleInfo;

const styles = StyleSheet.create({
  OverlayStyle: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    marginHorizontal: 25,
    marginBottom: 30,
    marginTop: 20,
    flex: 1,
    elevation: 10,
  },
});
