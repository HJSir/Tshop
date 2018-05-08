'use strict';

import React from 'react';
import {
    StyleSheet,
    Text,
    Image
} from 'react-native';

//添加路由组件
import Navigation from 'react-navigation';
//添加展示用的首页
import Home from './home/index'
import Products from './home/products'
import Shop_Cart from './home/shop_cart'
import My from './home/my'
import Goods from './detail/goods'
import Browser from './home/browser'
import Setting from './center/setting'

import Login from './account/login'
import Submit from './order/submit'
import AddressList from './center/addressList'
import AddressEdit from './center/addressEdit'
import Success from './order/success'
import OrderList from './order/list'
import OrderDetail from './order/detail'
import Icon from 'react-native-vector-icons/FontAwesome';
import px from "./utils/px";


//创建tab页的顶部样式
const styles = StyleSheet.create({
    tab: {

        height: px(84),
        backgroundColor: '#fbfafc',
        borderTopColor: '#efefef'
    },
    tabIconActive: {
        color:'#d0648f',

    },
    tabIcon: {


    },
    tabLabel: {
        marginBottom: 4
    }
});
//创建首页的tab页
const Tabs = Navigation.TabNavigator({
    'Home': {
        screen: Home,
        navigationOptions: ({ navigation, screenProps }) => {

            return {
                tabBarLabel: '首页',
                tabBarIcon: (opt) => {


                    if (opt.focused) return <Icon name="home" size={px(40)} style={styles.tabIconActive}  />;
                    return <Icon name="home" size={px(40)} style={styles.tabIcon}  />;
                }
            }
        }
    },
    'Products': {
        screen: Products,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: '分类',
                tabBarIcon: (opt) => {
                    if (opt.focused) return <Icon name="align-justify" size={px(40)} style={styles.tabIconActive}  />;
                    return <Icon name="align-justify" size={px(40)} style={styles.tabIcon}  />
                }
            }
        }
    }, 'Shop_Cart': {
        screen: Shop_Cart,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: '购物车',
                tabBarIcon: (opt) => {
                    if (opt.focused) return <Icon name="shopping-cart" size={px(40)} style={styles.tabIconActive}  />;
                    return <Icon name="shopping-cart" size={px(40)} style={styles.tabIcon}  />
                }
            }
        }
    },
    'My': {
        screen: My,
        navigationOptions: ({ navigation, screenProps }) => {
            return {
                tabBarLabel: '我的',
                tabBarIcon: (opt) => {
                    if (opt.focused) return <Icon name="user" size={px(40)} style={styles.tabIconActive}  />;
                    return <Icon name="user" size={px(40)} style={styles.tabIcon}  />
                }
            }
        }
    },


}, {
    //设置tab使用的组件
    tabBarComponent: Navigation.TabBarBottom,
    //点击哪个才加载哪个tab里的页面
    lazy: true,
    //设置tab放在界面的底部
    tabBarPosition: 'bottom',
    //设置tab里面的样式
    tabBarOptions: {
        style: styles.tab,
        labelStyle: styles.tabLabel,
        activeTintColor: '#d0648f'
    }
});
//创建路由
const Pages = Navigation.StackNavigator({
    'Tabs': {
        screen: Tabs
    },
    'Goods': {
        screen: Goods
    },
    'Browser': {
        screen: Browser
    },
    'Setting': {
        screen: Setting
    },

    'Login': {
        screen: Login
    },
    'Submit': {
        screen: Submit
    },
    'AddressList': {
        screen: AddressList
    },
    'AddressEdit':{
        screen: AddressEdit
    },
    'Success':{
        screen: Success
    },
    'OrderList':{
        screen: OrderList
    },
    'OrderDetail':{
        screen: OrderDetail
    }

}, {
    // initialRouteName:'OrderDetail',
    //这里做了一个页面跳转的动画
    transitionConfig: () => ({
        screenInterpolator: sceneProps => {
            const { layout, position, scene } = sceneProps;
            const { index } = scene;
            const translateX = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [layout.initWidth, 0, 0]
            });
            const opacity = position.interpolate({
                inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
                outputRange: [0, 1, 1, 0.3, 0]
            });
            return { opacity, transform: [{ translateX }] };
        }
    }),
    navigationOptions: {
        header: null
    }
});
//创建一个自己的容器,方便以后对路由做一些处理
export default class extends React.Component{
    constructor(props) {
        super(props);
    }

    render() {
        return <Pages onNavigationStateChange={this.listenChange.bind(this)}></Pages>;
    }
    //监听路由的跳转
    listenChange(state1, state2, action) {

    }
}


