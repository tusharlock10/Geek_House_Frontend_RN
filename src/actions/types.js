export const ACTIONS={

    // LOGIN
    LOGIN_DATA: 'login.login_data',
    LOADING_FB: 'login.loading_fb',
    LOADING_GOOGLE: 'login.loading_google',
    LOGIN_ERROR: 'login.login_error',
    LOGIN_SUCCESS: 'login.login_success',
    LOGIN_POLICY: 'login.policy',
    LOGIN_INTERNET_REACHABLE: 'login.internet_reachable',

    // HOME
    LOGOUT: 'home.logout',
    TOGGLE_OVERLAY: 'home.toggle_overlay',
    WELCOME: 'home.welcome',
    HOME_ERROR: 'home.error',
    HOME_LOADING: 'home.loading',
    HOME_CHANGE_CATEGORY: 'home.change_category',

    // SEARCH
    SEARCH_LOADING: 'search.loading',
    DOING_SEARCH_LOADING: 'search.doing.loading',
    POPULAR_SEARCHES_SUCCESS: 'search.popularsearches',
    SEARCH_UPDATE: 'search.update',
    SEARCH_SELECT_CATEGORY: 'search.select_category',
    DO_SEARCH: 'search.do_search',
    SHOW_SEARCH_ALERT: 'search.show_alert',
    CLEAR_SEARCH: 'search.clear_search',

    // ARTICLE_INFO
    GET_ARTICLE_INFO: 'articleInfo.get',
    ARTICLE_INFO_LOADING: 'articleinfo.loading',
    ARTICLE_ADD_COMMENT: 'article.add_comment',
    ARTICLE_BOOKMARK: 'article.bookmark',
    BOOKMARKS_LOADING: 'article.bookmarks_loading',
    GET_BOOKMARKS: 'article.get_bookmarks',
    BOOKMARKS_ERROR: 'article.bookmarks_error',

    // WRITE
    WRITE_LOADING: 'write.loading',
    GET_MY_ARTICLES: 'write.my_articles',
    SET_CONTENTS: 'write.set_contents',
    SET_IMAGE: 'write.set_image',
    PUBLISH_SUCCESS: 'write.publish_success',
    CLEAR_WRITE: 'write.clear',
    WRITE_SHOW_ALERT: 'write.show_alert',
    WRITE_SET_DRAFT: 'write.set_draft',

    // CHAT
    SET_SOCKET: 'chat.socket',
    CHAT_LOADING: 'chat.loading',
    GOT_CHAT_MESSAGE: 'chat.got_message',
    CHECK_MESSAGES_OBJECT: 'chat.check_messages_obj',
    SET_CHAT_USER_DATA: 'chat.set_user_data',
    GET_CHAT_PEOPLE: 'chat.get_people',
    CHAT_MESSAGE_HANDLER: 'chat.message_handler',
    CHAT_TYPING: 'chat.typing',
    CHAT_USER_ONLINE: 'chat.user_online',
    CHAT_CLEAR_OTHER_USER: 'chat.clear_other_user',
    CHAT_SAVE_DATA: 'chat.save_data',
    CHAT_LOAD_DATA: 'chat.load_data',
    CHAT_AUTH_TOKEN_SET:'chat.auth_token.set',
    CHAT_PEOPLE_SEARCH: 'chat.people_search',
    CHAT_SOCKET_CHANGE_CATEGORY: 'chat_socket_change_category',
    CHAT_FIRST_LOGIN: 'chat.first_login',
    CHAT_SETUP_COMPLETE: 'chat.setup_complete',
    CHAT_GET_USER_MESSAGES: 'chat.get_user_messages',
    CHAT_QUICK_REPLIES: 'chat.quick_replies',
    CHAT_COMPOSER_TEXT_CHANGED: 'chat.composer_text_changed',
    CHAT_SCREEN_IMAGE_SELECT: 'chat.image_select',
    CHAT_IMAGE_UPLOADING: 'chat.image_uploading',
    CHAT_GROUP_CREATE: 'chat.group_create',
    CHAT_GROUP_PARTICIPANTS: 'chat.group_participants',
    CHAT_GROUP_INFO_LOADING:  'chat.group_info_loading',
    CHAT_GROUP_MODIFY_ADMINS: 'chat.group_modify_admins',
    CHAT_LEAVE_GROUP: 'chat.leave_group',
    CHAT_ADDED_TO_GROUP: 'chat.added_to_group',
    CHAT_GROUP_CHANGE_DETAILS: 'chat.group_change_details',

    CHAT_INFO_GROUP_DETAILS_UPDATE: 'chat.info_group_details_update',
    CHAT_INFO_GROUP_ICON_UPLOADING: 'chat.info_group_icon_uploading',
    CHAT_ADD_NEW_GROUP_PARTICIPANTS:'chat.add_new_group_participants',

    CHAT_GIFS_LOADING: 'chat.gifs_loading',
    CHAT_GET_GIFS: 'chat.get_gifs',
    CHAT_GIF_SEARCH: 'chat.gif_search',

    // SETTINGS
    SETTINGS_LOADING: 'settings.loading',
    GET_SETTINGS_DATA: 'settings.get_data',
    CHANGE_THEME: 'settings.change_theme',
    SETTINGS_CHANGE_ANIMATION:'settings.change_animation',
    SETTINGS_CHANGE_QUICK_REPLIES: 'settings.change_quick_replies',
    CHANGE_CHAT_BACKGROUND: 'settings.change_chat_background',
    CHANGE_CHAT_BACKGROUND_BLUR: 'settings.change_chat_background_blur',
    SETTINGS_CHANGE_NAME: 'settings.change_name',
    SETTINGS_CHANGE_PROFILE_IMAGE: 'settings.change_profile_image',
    SETTINGS_CHANGE_PROFILE_IMAGE_LOADING: 'settings.change_profile_image_loading'

}