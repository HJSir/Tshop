'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    Linking
} from 'react-native';
import TopHeader from '../component/header'
import px from '../utils/px'
import request from '../utils/request'
import { UserInfo } from '../service/data'
import Icon from 'react-native-vector-icons/FontAwesome';
export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        return <ScrollView style={{ flex: 1 }}>
            {/*顶部功能组件*/}
            <TopHeader title='个人中心'
                boxStyles={{ backgroundColor: "#d0648f", marginBottom: 0 }}
                textStyle={{ color: '#fff' }}
                rightBtn={<TouchableOpacity onPress={() => this.go('Setting')}>

                    <Icon name="cog" size={px(42)}   />


                </TouchableOpacity>}
                showLeft={false} />
            {/*个人简略信息组件*/}
            <TouchableWithoutFeedback>
                <View style={styles.head}>
                    <Image style={styles.headImg}
                        source={{ uri: UserInfo.headImgUrl }} />
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text allowFontScaling={false} style={styles.headerName}>
                            {UserInfo.name}
                        </Text>
                    </View>
                    <Icon
                    name="angle-right" size={px(40) } style={{color:'#fff'}}
                    />
                </View>
            </TouchableWithoutFeedback>
            {/*3个快捷通道*/}
            <View style={styles.link}>
                <TouchableOpacity activeOpacity={0.9} style={styles.linkRow} onPress={() => this.go("OrderList", {})}>
                    <Image
                        style={{ width: px(80), height: px(80) }}
                        source={{ uri: require('../images/icon-myOrder1') }} />
                    <Text allowFontScaling={false} style={[styles.linkRowTxt, styles.linkRowTxt1]}>我的订单</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={styles.linkRow}>
                    <Image
                        style={{ width: px(80), height: px(80) }}
                        source={{ uri: require('../images/icon-gold') }} />
                    <Text
                        allowFontScaling={false} style={[styles.linkRowTxt, styles.linkRowTxt1]}>
                        我的金币
                            </Text>
                    <Text allowFontScaling={false} style={styles.linkRowTxt2}>{UserInfo.stunnerTotalAmount}元</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.9} style={styles.linkRow}>
                    <Image
                        style={{ width: px(80), height: px(80) }}
                        source={{ uri: require('../images/icon-myCoupon1') }} />
                    <Text
                        allowFontScaling={false} style={[styles.linkRowTxt, styles.linkRowTxt1]}>
                        我的代金券
                            </Text>
                    <Text allowFontScaling={false} style={styles.linkRowTxt2}>{UserInfo.couponCount}张</Text>
                </TouchableOpacity>
            </View>
            {/*分享店铺信息*/}
            <TouchableOpacity activeOpacity={0.8} >
                <View style={styles.link2}>
                    <Text allowFontScaling={false} style={styles.linkTxt}>我的店铺</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text allowFontScaling={false} style={styles.shareText}>
                            分享店铺</Text>
                        <Icon
                            name="angle-right" size={px(40) }
                        />
                    </View>
                </View>
            </TouchableOpacity>
            {/*收入等*/}
            <View style={styles.income}>
                <TouchableWithoutFeedback>
                    <View style={styles.incomeItem}>
                        <Text allowFontScaling={false} style={styles.incomeAmount}>
                            {UserInfo.todayAmount}
                        </Text>
                        <Text allowFontScaling={false} style={styles.incomeTxt}>今日收入</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.incomeItem}>
                        <Text allowFontScaling={false} style={styles.incomeAmount}>
                            {UserInfo.todayOrderCount}
                        </Text>
                        <Text allowFontScaling={false} style={styles.incomeTxt}>今日订单</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.incomeItem}>
                        <Text allowFontScaling={false} style={styles.incomeAmount}>
                            {UserInfo.monthSales}
                        </Text>
                        <Text allowFontScaling={false} style={styles.incomeTxt}>本月销售</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {/*其他入口*/}
            <View style={styles.tools}>
                <TouchableWithoutFeedback>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(52) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-shop') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>店铺设置</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.go("OrderList", {})}>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(46) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-order') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>店铺订单</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(46) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-returngoods') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>退货/售后</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(44) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-income') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>资金管理</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(50) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-fans') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>谁看过我</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(50) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-invite') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>福袋销售</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={styles.toolsButton}>
                        <Image style={[styles.toolsButtonImg, { width: px(50) }]}
                            resizeMode='contain'
                            source={{ uri: require('../images/icon-profile-guide') }} />
                        <Text allowFontScaling={false} style={styles.toolsButtonLabel}>店铺指南</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            {/*帮助中心*/}
            <TouchableWithoutFeedback>
                <View style={styles.link2}>
                    <Text allowFontScaling={false} style={styles.linkTxt}>帮助中心</Text>
                    <Image
                        style={styles.headArrow}
                        source={{ uri: require('../images/icon-arrow') }} />
                </View>
            </TouchableWithoutFeedback>
            {/*客服电话*/}
            <TouchableWithoutFeedback onPress={() => Linking.openURL('tell://400-005-5566')}>
                <View style={styles.link2}>
                    <Text allowFontScaling={false} style={styles.linkTxt}>客服电话</Text>
                    <Text allowFontScaling={false} style={{ color: '#44b7ea' }}>400-005-5566</Text>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
    }

    componentDidMount() {

    }

    /**
     * 页面跳转方法
     * @param {*} name 
     * @param {*} data 
     */
    go(name, data) {
        this.props.navigation.navigate(name, data);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#d0648f'
    },
    head: {
        backgroundColor: '#d0648f',
        height: px(160),
        flexDirection: 'row',
        paddingLeft: px(30),
        paddingRight: px(30),
        paddingBottom: px(30),
        alignItems: 'center',
    },
    headImg: {
        width: px(120),
        height: px(120),
        borderRadius: px(60)
    },
    headerName: {
        paddingLeft: px(20),
        fontSize: px(30),
        color: '#fff'
    },
    headArrow: {
        width: px(15),
        height: px(26)
    },
    link: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingTop: px(30),
        paddingBottom: px(30),
        paddingLeft: px(30),
        paddingRight: px(30),
        marginBottom: px(20)
    },
    linkRow: {
        flex: 1,
        alignItems: 'center',
    },
    linkRowTxt: {
        marginTop: px(9),
        fontSize: px(26),
        alignItems: 'center',
    },
    linkRowTxt1: {
        color: "#252426"
    },
    linkRowTxt2: {
        color: "#858385",
        fontSize: px(24),
        marginTop: px(8)
    },
    link2: {
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        paddingTop: px(26),
        paddingBottom: px(26),
        paddingLeft: px(30),
        paddingRight: px(30),
        marginBottom: px(1)
    },
    linkTxt: {
        flex: 1,
        color: '#222',
        fontSize: px(28)
    },
    shareText: {
        fontSize: px(24),
        color: '#858385',
        includeFontPadding: false,
        marginRight: px(13)
    },
    income: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginBottom: px(1)
    },
    incomeItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: px(30),
        paddingBottom: px(30),
    },
    incomeAmount: {
        color: '#e86d78',
        fontSize: px(36),
        marginBottom: px(26),
        includeFontPadding: false
    },
    incomeTxt: {
        color: '#858385',
        fontSize: px(24),
        includeFontPadding: false
    },
    tools: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        height: px(300),
        marginBottom: px(20),
        flexWrap: 'wrap',
        paddingTop: px(10),
    },
    toolsButton: {
        flexDirection: 'column',
        width: px(187),
        height: px(140),
        justifyContent: 'center',
        alignItems: 'center',
    },
    toolsButtonImg: {
        alignSelf: 'center',
        height: px(50),
        marginBottom: px(20)
    },
    toolsButtonLabel: {
        fontSize: px(24),
        color: '#858585',
        includeFontPadding: false
    },
})