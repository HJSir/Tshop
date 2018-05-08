'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableWithoutFeedback,
    TouchableOpacity,
    ImageBackground,
    Image,
    FlatList,
    Platform,
    Animated
} from 'react-native';
// import { log, logWarm, logErr } from '../utils/log'
import request from '../utils/request'
import px from '../utils/px'
import Swiper from 'react-native-swiper'
import toast from '../utils/toast'
import { Module } from './floor_modules'
import ShareView, { SHARETYPE } from '../component/ShareView'
import { DialogModal } from '../component/ModalView'

const deviceWidth = Dimensions.get('window').width;
const util_cools = {
    spliceNum(price) { // 价格，整数小数字体大小不一样
        let p_int = (price + '').split('.')[0]
        let p_float = ((price * 1 - p_int * 1).toFixed(2) + '').split('.')[1]
        return [p_int, p_float]
    },
}
/**
 * Banner和快捷入口
 */
class MyBanner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            banners: this.props.item.bannerList || [],
            quicks: this.props.item.quickList || [],
            status: false,
        }
    }
    render() {
        return <View style={{ flex: 1 }}>
            {this.state.banners.length === 1 && <TouchableWithoutFeedback
                onPress={() => this.onPressRow(this.state.banners[0])}>
                <Image style={{
                    width: deviceWidth, height: px(480)
                }} source={{ uri: this.state.banners[0].showImg }} resizeMode="contain" resizeMethod="scale" />
            </TouchableWithoutFeedback>}
            {this.state.banners.length > 1 && <View
                style={{ height: px(480) }}>
                <Swiper autoplay={true} >
                    {this.state.banners.map((item, index) => <View key={index}>
                        <Image resizeMode="cover" resizeMethod="scale"
                            source={{ uri: item.showImg }}
                            style={{ width: px(750), height: px(480) }} />
                    </View>)}
                </Swiper>
            </View>}
            {this.state.quicks.length > 0 && <View style={bannerStyle.box}>
                <ImageBackground resizeMode="cover" resizeMethod="scale"
                    style={bannerStyle.container} source={{ uri: require('../images/shop-quick-bottom') }}>
                    {this.state.quicks.map((item, index) => <TouchableWithoutFeedback
                        key={item.quickEntranceId} onPress={() => this.goPage(item)}>
                        <View style={bannerStyle.imgbox}>
                            <Image resizeMode="contain" resizeMethod="scale"
                                source={{ uri: item.showImg }}
                                style={bannerStyle.img} />
                            <Text style={bannerStyle.txt}>{item.title}</Text>
                        </View>
                    </TouchableWithoutFeedback>)}
                </ImageBackground>
            </View>}
        </View>
    }
    //渲染单行
    renderRow = (item) => {
        if (item === undefined) return null
        return <Image resizeMode="contain" resizeMethod="scale"
            source={{ uri: item.showImg }}
            style={{ width: px(750), height: px(480) }} />
    }
    
    /**
     * 点击事件
     * @param {*} e 
     */
    onPressRow(e) {
        this.getDetail(e.contextType, e.context, e.title, e.showImg)
    }
    /**
     * 跳转到其他页面
     * @param {*} type 
     * @param {*} context 
     * @param {*} title 
     * @param {*} shareImg 
     */
    getDetail(type, context, title, shareImg) {
        type == 1 && this.props.navigation.navigate('Goods', {
            sku: context
        });
        type == 3 &&
            this.props.navigation.navigate('Browser', {
                webPath: context,
                img: shareImg
            });
    }
    goPage(item) {
        if (item.contextType == "sku") {
            this.props.navigation.navigate('Goods', {
                id: item.prodId,
                sku: item.context
            });
        }
        if (item.contextType == "h5") {
            this.props.navigation.navigate('Browser', {
                webPath: item.context,
                img: item.showImg
            });
        }
    }
}

const bannerStyle = StyleSheet.create({
    box: {
        position: "relative",
        width: px(750),
        height: px(210),
    },
    container: {
        position: "absolute",
        left: px(10),
        right: px(10),
        top: px(-44),
        bottom: 0,
        height: px(250),
        width: px(730),
        paddingHorizontal: px(37),
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-around',
    },
    imgbox: {
        alignItems: 'center',
        width: px(164),
    },
    img: {
        width: px(164),
        height: px(155)
    },
    txt: {
        marginTop: px(14),
        fontSize: px(22),
        color: "#252426"
    },
})

//单个商品组件
class GoodItem extends React.Component {

    renderLeft(item) {
        return <TouchableOpacity activeOpacity={0.9} onPress={() => this.getDetail(item)}>
            <View style={goodStyles.sGoodL}>
                <View style={goodStyles.sGoodImage}>
                    <Image resizeMethod="scale"
                        source={{ uri: this.props.show ? item.specImage1 : require('../images/img') }}
                        style={goodStyles.sGoodsCover1}
                    />
                    {item.limitStock === 0 &&
                        <View style={goodStyles.goods_img_cover}>
                            <Text allowFontScaling={false} style={goodStyles.goods_img_txt}>抢光了</Text>
                        </View>
                    }
                    <View style={goodStyles.labels}>
                        {item.labelList && item.labelList.length > 0 && item.labelList.map((label) =>
                            <Image key={label.labelId} resizeMode="contain" resizeMethod="scale"
                                style={[goodStyles.labelImg, { width: px(label.width), height: px(label.height) }]}
                                source={{ uri: label.labelLogo }} />
                        )}
                    </View>
                </View>
                <View style={goodStyles.sessionName}>
                    <View style={goodStyles.goodsShowNameBox}>
                        <Text allowFontScaling={false}
                            numberOfLines={1}
                            style={goodStyles.goodsShowName}>
                            {item.goodsShowName}
                        </Text>
                    </View>
                    <View style={goodStyles.goodsShowDesc_}>
                        {
                            (item.isInBond == 1 || item.isForeignSupply == 2) &&
                            <View
                                style={[goodStyles.flag_, item.isInBond == 1 ? goodStyles.flagB : goodStyles.flagZ]}>
                                <Text
                                    style={goodStyles.flagTxt}
                                    allowFontScaling={false}>
                                    {item.isInBond == 1 ? '保税' : item.isForeignSupply == 2 ? '直邮' : ''}
                                </Text>
                            </View>
                        }
                        <Text style={goodStyles.goodsShowDesc} allowFontScaling={false}
                            numberOfLines={2}>
                            {
                                (item.isInBond == 1 || item.isForeignSupply == 2) &&
                                <Text style={goodStyles.flag}
                                    allowFontScaling={false}>{item.isInBond == 1 ? '保税' : '直邮'}    </Text>
                            }
                            {item.goodsShowDesc}
                        </Text>
                    </View>
                    <View style={goodStyles.sessionNoName}>
                        <View style={[goodStyles.sessionPrice, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                            <Text allowFontScaling={false}
                                style={goodStyles.salePrice}>
                                ￥<Text allowFontScaling={false}
                                    style={goodStyles.salePrice_}>
                                    {util_cools.spliceNum(item.salePrice)[0]}
                                </Text>.{util_cools.spliceNum(item.salePrice)[1]}
                            </Text>
                            <Text allowFontScaling={false}
                                style={[goodStyles.marketPrice, { paddingLeft: 0 }]}>
                                ￥{item.marketPrice}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={goodStyles.cartCBorder}
                            activeOpacity={0.8}
                            onPress={() => this.props.addCart(item.id, 1)}>
                            <View style={goodStyles.cartC}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: require('../images/icon-indexCart') }}
                                    style={goodStyles.cart} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={goodStyles.sLine1}></View>
            </View>
        </TouchableOpacity>
    }
    renderRight(item) {
        if (!item) return null;
        return <TouchableOpacity activeOpacity={0.9} onPress={() => this.getDetail(item)}>
            <View style={goodStyles.sGoodR}>
                <View style={goodStyles.sGoodImage}>
                    <Image resizeMethod="scale"
                        source={{ uri: this.props.show ? item.specImage1 : require('../images/img') }}
                        style={goodStyles.sGoodsCover2}
                    />
                    {item.limitStock === 0 &&
                        <View style={goodStyles.goods_img_cover}>
                            <Text allowFontScaling={false} style={goodStyles.goods_img_txt}>抢光了</Text>
                        </View>
                    }
                    <View style={goodStyles.labels}>
                        {item.labelList && item.labelList.length > 0 && item.labelList.map((label) =>
                            <Image key={label.labelId} resizeMode="contain" resizeMethod="scale"
                                style={[goodStyles.labelImg, { width: px(label.width), height: px(label.height) }]}
                                source={{ uri: label.labelLogo }} />
                        )}
                    </View>
                </View>
                <View style={goodStyles.sessionName}>
                    <View style={goodStyles.goodsShowNameBox}>
                        <Text allowFontScaling={false}
                            numberOfLines={1}
                            style={goodStyles.goodsShowName}>
                            {item.goodsShowName}
                        </Text>
                    </View>
                    <View style={goodStyles.goodsShowDesc_}>
                        {
                            (item.isInBond == 1 || item.isForeignSupply == 2) &&
                            <View
                                style={[goodStyles.flag_, item.isInBond == 1 ? goodStyles.flagB : goodStyles.flagZ]}>
                                <Text
                                    style={goodStyles.flagTxt}
                                    allowFontScaling={false}>
                                    {item.isInBond == 1 ? '保税' : item.isForeignSupply == 2 ? '直邮' : ''}
                                </Text>
                            </View>
                        }
                        <Text style={goodStyles.goodsShowDesc} allowFontScaling={false}
                            numberOfLines={2}>
                            {
                                (item.isInBond == 1 || item.isForeignSupply == 2) &&
                                <Text style={goodStyles.flag}
                                    allowFontScaling={false}>{item.isInBond == 1 ? '保税' : '直邮'}    </Text>
                            }
                            {item.goodsShowDesc}
                        </Text>
                    </View>
                    <View style={goodStyles.sessionNoName}>
                        <View style={[goodStyles.sessionPrice, { flexDirection: 'column', alignItems: 'flex-start' }]}>
                            <Text allowFontScaling={false}
                                style={goodStyles.salePrice}>
                                ￥<Text allowFontScaling={false}
                                    style={goodStyles.salePrice_}>
                                    {util_cools.spliceNum(item.salePrice)[0]}
                                </Text>.{util_cools.spliceNum(item.salePrice)[1]}
                            </Text>
                            <Text allowFontScaling={false}
                                style={[goodStyles.marketPrice, { paddingLeft: 0 }]}>
                                ￥{item.marketPrice}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={goodStyles.cartCBorder}
                            activeOpacity={0.8}
                            onPress={() => this.props.addCart(item.id, 1)}>
                            <View style={goodStyles.cartC}>
                                <Image
                                    resizeMode="cover"
                                    source={{ uri: require('../images/icon-indexCart') }}
                                    style={goodStyles.cart} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={goodStyles.sLine2}></View>
            </View>
        </TouchableOpacity>
    }
    renderBig(item) {
        if (!item) return null;
        return <TouchableOpacity activeOpacity={0.9}
            onPress={() => this.getDetail(item)}>
            <View style={goodStyles.bGood}>
                <View style={{ width: deviceWidth, alignItems: 'center', paddingTop: px(20) }}>
                    <View style={goodStyles.imageBox}>
                        <Image
                            resizeMethod="scale"
                            source={{ uri: this.props.show ? item.image : require('../images/img2') }}
                            style={goodStyles.goodsCoverBig} />
                    </View>
                    {item.limitStock === 0 &&
                        <View style={goodStyles.goods_img_coverBig}>
                            <Text allowFontScaling={false} style={goodStyles.goods_img_txt}>抢光了</Text>
                        </View>
                    }
                    <View style={goodStyles.labels2}>
                        {item.labelList && item.labelList.length > 0 && item.labelList.map((label) =>
                            <Image key={label.labelId}
                                resizeMode="contain" resizeMethod="scale"
                                style={[goodStyles.labelImg, { width: px(label.width), height: px(label.height) }]}
                                source={{ uri: label.labelLogo }} />
                        )}
                    </View>
                </View>
                <View style={goodStyles.sessionName}>
                    <View style={goodStyles.goodsShowNameBox}>
                        <Text allowFontScaling={false}
                            numberOfLines={1}
                            style={goodStyles.goodsShowName}>
                            {item.goodsShowName}
                        </Text>
                    </View>
                    <View style={goodStyles.goodsShowDesc_}>
                        {
                            (item.isInBond == 1 || item.isForeignSupply == 2) &&
                            <View
                                style={[goodStyles.flag_, item.isInBond == 1 ? goodStyles.flagB : goodStyles.flagZ]}>
                                <Text
                                    style={goodStyles.flagTxt}
                                    allowFontScaling={false}>
                                    {item.isInBond == 1 ? '保税' : item.isForeignSupply == 2 ? '直邮' : ''}
                                </Text>
                            </View>
                        }
                        <Text style={goodStyles.goodsShowDesc} allowFontScaling={false}
                            numberOfLines={2}>
                            {
                                (item.isInBond == 1 || item.isForeignSupply == 2) &&
                                <Text style={goodStyles.flag}
                                    allowFontScaling={false}>{item.isInBond == 1 ? '保税' : '直邮'}    </Text>

                            }
                            {item.goodsShowDesc}
                        </Text>
                    </View>
                </View>
                <View style={[goodStyles.sessionNoName, goodStyles.sessionNoNameBig, { alignItems: 'center' }]}>
                    <View style={[goodStyles.sessionPrice, { flexDirection: 'row', alignItems: 'flex-end' }]}>
                        <Text allowFontScaling={false}
                            style={goodStyles.salePrice}>
                            ￥<Text allowFontScaling={false}
                                style={goodStyles.salePrice_}>
                                {util_cools.spliceNum(item.salePrice)[0]}
                            </Text>.{util_cools.spliceNum(item.salePrice)[1]}
                        </Text>
                        <Text allowFontScaling={false}
                            style={[goodStyles.marketPrice, { paddingLeft: px(12) }]}>
                            ￥{item.marketPrice}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={goodStyles.cartCBorder}
                        activeOpacity={0.8}
                        onPress={() => this.props.addCart(item.id, 1)}>
                        <View style={goodStyles.cartC}>
                            <Image
                                resizeMode="cover"
                                source={{ uri: require('../images/icon-indexCart') }}
                                style={goodStyles.cart} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    }
    render() {
        const { item } = this.props;
        if (!item) return null;
        if (item.data2 && item.data2.id) {
            return <View onLayout={(e => this.onLayout(e.nativeEvent))} style={[goodStyles.goodsBox1, goodStyles.goodsBox3]}>
                {this.renderLeft(item.data)}
                {this.renderRight(item.data2)}
            </View>
        }
        return <View onLayout={(e => this.onLayout(e.nativeEvent))} style={goodStyles.goodsBox2}>
            {this.renderBig(item.data)}
        </View>
    }
    shouldUpdate = true;
    shouldComponentUpdate() {
        if (!this.shouldUpdate) return false;
        return !(this.shouldUpdate = false);
    }
    onLayout(e) {
        this.props.onLayout && this.props.onLayout(e);
    }
    componentWillReceiveProps(pp) {
        if (pp.show != this.props.show) this.shouldUpdate = true;
    }
    getDetail(goods) {
        this.props.navigation.navigate('DetailPage', {
            id: goods.sku ? '' : goods.id,
            sku: goods.sku
        });
    }
    sharePage(goods) {
        this.props.shareEvent && this.props.shareEvent(goods);
    }
}
const goodStyles = StyleSheet.create({
    goodsBox1: {
        flexDirection: 'row',
        justifyContent: "space-between",
        width: deviceWidth,
        height: px(670),
        overflow: 'hidden',
    },
    goodsBox3: {
        height: px(640),
    },
    goodsBox2: {
        width: deviceWidth,
        height: px(705),
        overflow: 'hidden',
    },
    bGood: {
        width: deviceWidth,
        overflow: 'hidden',
        backgroundColor: '#fff',
        height: px(686)
    },
    sLine1: {
        width: px(367),
        height: px(24),
        backgroundColor: '#fefefe',
        borderBottomRightRadius: px(12),
    },
    sLine2: {
        width: px(367),
        height: px(24),
        backgroundColor: '#fefefe',
        borderBottomLeftRadius: px(12),
    },
    sGoodL: {
        width: px(367),
        borderTopLeftRadius: 0,
        borderTopRightRadius: px(12),
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: px(12),
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                borderColor: "#fff",
            }
        })
    },
    sGoodR: {
        width: px(367),
        borderTopLeftRadius: px(12),
        borderTopRightRadius: 0,
        borderBottomLeftRadius: px(12),
        borderBottomRightRadius: 0,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                borderColor: "#fff",
            }
        })
    },
    sGoodImage: {
        width: px(367),
        height: px(367),
    },
    sGoodsCover1: {
        width: px(367),
        height: px(367),
        overflow: 'hidden',
        borderTopRightRadius: px(12)
    },
    sGoodsCover2: {
        width: px(367),
        height: px(367),
        overflow: 'hidden',
        borderTopLeftRadius: px(12)
    },
    goodsCover: {
        width: px(367),
        height: px(367),
        position: 'relative',
        zIndex: 0,
        overflow: 'hidden'
    },
    goodsCoverBig: {
        width: px(710),
        height: px(440),
        overflow: 'hidden',
        borderRadius: px(12)
    },
    imageBox: {
        width: px(710),
        height: px(440),
        position: 'relative',
        zIndex: 0,
        borderRadius: px(12),
        overflow: 'hidden'
    },
    goods_img_cover: {
        position: 'absolute',
        left: px(94),
        top: px(94),
        zIndex: 1,
        width: px(180),
        height: px(180),
        borderRadius: px(90),
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    goods_img_coverBig: {
        position: 'absolute',
        left: px(285),
        top: px(130),
        zIndex: 1,
        width: px(180),
        height: px(180),
        borderRadius: px(90),
        overflow: 'hidden',
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    goods_img_txt: {
        fontSize: px(36),
        color: '#fff'
    },
    labels: {
        position: 'absolute',
        top: px(8),
        left: px(8),
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    labels2: {
        position: 'absolute',
        top: px(28),
        left: px(28),
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    labelImg: {
        width: px(60),
        height: px(60),
        marginRight: px(8)
    },
    sessionName: {
        paddingLeft: px(20),
        paddingRight: px(20),
        paddingTop: px(20),
        backgroundColor: '#fff',
    },
    goodsShowNameBox: {
        height: px(32),
        marginBottom: px(10)
    },
    goodsShowName: {
        fontSize: px(28)
    },
    goodsShowDesc_: {
        height: px(85),
        position: 'relative'
    },
    flag_: {
        paddingLeft: px(5),
        paddingRight: px(5),
        height: px(27),
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        left: 0,
        ...Platform.select({
            ios: {
                top: px(1),
            },
            android: {
                top: px(4)
            }
        }),
        zIndex: 100,
        borderRadius: px(4),
        overflow: 'hidden'
    },
    flagB: {
        backgroundColor: '#56beec',
    },
    flagZ: {
        backgroundColor: '#6cd972',
    },
    flagTxt: {
        color: '#fff',
        fontSize: px(18),
        includeFontPadding: false,
    },
    goodsShowDesc: {
        fontSize: px(24),
        color: '#858385'
    },
    flag: {
        fontSize: px(18),
        color: '#fff'
    },
    salePrice: {
        fontSize: px(26),
        color: "#d0648f"
    },
    salePrice_: {
        fontSize: px(38)
    },
    sessionPrice: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#fff'
    },
    marketPrice: {
        color: '#858385',
        fontSize: px(24),
        marginLeft: px(20),
        marginBottom: px(5),
        textDecorationLine: 'line-through'
    },
    sessionNoName: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sessionNoNameBig: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: px(20)
    },
    operator: {
        width: px(320),
        height: px(52),
        flexDirection: 'row',
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    operatorBg: {
        width: px(320),
        height: px(52),
        position: 'absolute',
        left: 0
    },
    shareBorder: {
        width: px(252),
        height: px(50),
        paddingLeft: px(18),
        paddingRight: px(18),
    },
    share_: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    goodsActionShareBtn: {
        color: '#fff',
        backgroundColor: 'transparent',
        fontSize: px(24),
    },
    goodsShareIcon: {
        width: px(30),
        height: px(32),
        marginRight: px(8)
    },
    cartBorder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cartC: {
        width: px(60),
        height: px(60),
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    cartCBorder: {
        overflow: 'hidden',
        borderRadius: px(30),
    },
    cart: {
        overflow: 'hidden',
        width: px(39),
        height: px(33)
    },
});

//顶部搜索条组件
class SearchHeader extends React.Component {
    render() {
        return <View style={styleSearchBar.header}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => this.shareTo()}>
                <View style={styleSearchBar.back}>
                    <Image source={{ uri: 'http://img.cdn.daling.com/data/files/mobile/img/dalingjia.jpg' }}
                        style={styleSearchBar.shopLogo} />
                    <Image style={styleSearchBar.headerShareImg}
                        source={{ uri: require("../images/icon-index-share") }} />
                </View>
            </TouchableOpacity>
            <TouchableWithoutFeedback onPress={() => this.goSearch()}>
                <View style={[styleSearchBar.headerSearchBar, {
                    backgroundColor: '#fff'
                }]}>
                    <Image style={styleSearchBar.headerSearchImg}
                        source={{ uri: require("../images/icon-search-gray") }} />
                    <Text allowFontScaling={false} style={styleSearchBar.headerSearchInput}>在<Text allowFontScaling={false} style={{ color: '#d0648f' }}>安心淘</Text>中搜索</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    }
    //跳转搜索页
    goSearch() {
        this.props.navigation.navigate('SearchPage', {});
    }
    //TODO:分享
    shareTo() {
        this.props.share && this.props.share();
    }
}

const styleSearchBar = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-between',
        paddingLeft: px(24),
        paddingRight: px(30),
        paddingTop: Platform.OS === "ios" ? px(40) : px(10),
        height: Platform.OS === "ios" ? px(116) : px(76),
    },
    back: {
        width: px(70),
        height: px(60),
    },
    shopLogo: {
        width: px(56),
        height: px(56),
        borderRadius: px(28),
        overflow: 'hidden',
        borderWidth: px(2),
        borderColor: "#fff"
    },
    headerShareImg: {
        width: px(28),
        height: px(28),
        borderRadius: px(14),
        borderWidth: px(1),
        borderColor: '#efefef',
        overflow: 'hidden',
        position: 'absolute',
        left: px(40),
        top: px(30)
    },
    headerSearchBar: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: px(35),
        justifyContent: "center",
        height: px(56),
        overflow: 'hidden',
        marginLeft: px(10)
    },
    headerSearchImg: {
        marginLeft: px(16),
        width: px(28),
        height: px(28),
        marginRight: px(8)
    },
    headerSearchInput: {
        width: px(570),
        color: "#b2b3b5",
        fontSize: px(26),
    },
    modalHead: {
        alignItems: 'center',
        flexDirection: 'column',
        height: px(169),
        paddingLeft: px(145),
        paddingRight: px(145),
        paddingTop: px(53)
    },
    modalTxt1: {
        fontSize: px(42),
        color: '#d0648f',
        fontWeight: '900'
    },
    modalTxt2: {
        fontSize: px(26),
        color: '#858385',
        textAlign: 'center',
        marginTop: px(10),
        lineHeight: px(30)
    }
});

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadText: "加载中...",
            list: [],
            refreshing: false, //列表刷新用到的变量
            scrollTop: new Animated.Value(0),
            showTop: false
        }
        this.start = 0;
    }

    render() {
        return <View style={{ flex: 1 }}>
            <Animated.View style={[styles.headerView, {
                backgroundColor: this.state.scrollTop.interpolate({
                    inputRange: [-100, 0, 100],
                    outputRange: ['rgba(255,255,255,.5)', 'rgba(255,255,255,0)', 'rgba(255,255,255,1)']
                })
            }]}>
                <SearchHeader share={() => this.share()} navigation={this.props.navigation} />
            </Animated.View>
            <View style={styles.pageView}>
                <FlatList ref="flatlist"
                    refreshing={this.state.refreshing}
                    numColumns={1}//1列
                    onRefresh={() => this.refresh()}//刷新调用的方法
                    onEndReached={() => this.loadNext()}//拉倒底部加载下一页
                    renderItem={({ item, index }) => {
                        if (item.type === 'banner') {
                            return <MyBanner ref='banner' id={this.props.id}
                                item={item}
                                refresh={this.state.refreshing}
                                navigation={this.props.navigation}
                                onChangeF={this.props.onChangeF} />
                        }
                        if (item.type === 'module') {
                            return <Module item={item} index={item.key}
                                ref={"item_" + index}
                                show={item.show}
                                onLayout={e => this.onLayout(e, index)}
                                navigation={this.props.navigation}
                                onChangeF={this.props.onChangeF}
                                goOtherPage={this.goOtherPage.bind(this)} />
                        }
                        if (item.type === 'title') {
                            return <View style={{
                                height: px(100),
                                backgroundColor: '#f2f2f2',
                                paddingLeft: px(20)
                            }}>
                                <Image
                                    style={{ height: px(100), width: px(280) }}
                                    source={{ uri: require('../images/index-title') }}
                                />
                            </View>
                        }
                        if (item.type === 'product') {
                            return <GoodItem
                                ref={"item_" + index}
                                show={item.show}
                                shareEvent={() => { }}
                                index={item.key}
                                item={item}
                                onLayout={e => this.onLayout(e, index)}
                                isLogin={false}
                                refresh={this.state.refreshing}
                                shop={this.props.shop}
                                navigation={this.props.navigation}
                                addCart={(id, num) => this.addCart(id, num)}
                            />
                        }
                    }
                    }
                    ListFooterComponent={<View>
                        <Text style={styles.loading}>{this.state.loadText}</Text>
                    </View>}
                    onScroll={(e) => this._onScroll(e.nativeEvent)}
                    scrollEventThrottle={100}
                    keyExtractor={(goods) => goods.index}
                    data={this.state.list}
                />
            </View>
            {this.state.showTop && <TouchableOpacity onPress={() => this.toTop()}>
                <Image style={styles.toBtn}
                    source={{ uri: require("../images/icon-to-top") }} />
            </TouchableOpacity>}
            <ShareView ref='shareView' types={[SHARETYPE.WEIXIN, SHARETYPE.PENGYOUQUAN, SHARETYPE.LIANJIE, SHARETYPE.ERWEIMA]} />
            <DialogModal ref="dialog" />
        </View>
    }
    async componentDidMount() {
        this.loadBanner();
    }
    //计算模板的高度
    onLayout(e, index) {
        this.layout[index].h = e.layout.height
    }

    step = 0;
    start = 0;
    loading = false;
    totalPages = 2;
    layout = [];
    //加载banner数据,设置类型为banner
    async loadBanner() {
        try {
            let res = await request.get(`/banner/findBannerAndQuickList.do?categoryId=`);
            res.type = "banner";
            res.index = "banner";
            res.tt = Date.now();
            let h = 0;
            //判断是否存在banner
            if (res.bannerList.length > 0) {
                h = px(480);
            }
            //判断是否存在快捷按钮
            if (res.quickList.length > 0) {
                h += px(210)
            }
            //添加高度信息
            this.layout[0] = { h };
            this.setState({ list: [res] });
        } catch (e) {
            // toast(e.message);
        } finally {
            this.step = 1;
            this.loadNext();
        }
    }
    //加载下一页,这里判断到底应该加载哪一块
    async loadNext() {
        if (this.step === 1) this.getModules();
        if (this.step === 2) this.getNextProducts();
    }
    //获取楼层
    async getModules() {
        if (this.loading) return;
        this.loading = true;
        let list = [];
        try {
            let moduleList = await request.get(`/module/findModuleListV2.do?categoryId=`);
            if (moduleList.constructor === Array) {
                moduleList.forEach((item, key) => {
                    item.type = 'module';
                    item.index = 'module_' + item.moduleId;
                    item.key = key;
                    list.push(item);
                    this.layout.push({ h: 0 });
                })
            }
        } catch (e) {
            // toast(e.message);
        } finally {
            this.step = 2;
            this.loading = false;
            const list1 = this.state.list[0];
            //这里加入一个单独的产品头部图片
            const tit = { type: "title", index: "title" };
            list.push(tit);
            this.layout.push({ h: px(100) });
            this.setState({ list: this.state.list.concat(list) });
        }
    }
    productSH = px(654)
    productBH = px(695)

    //加载商品
    async getNextProducts() {
        if (this.start >= this.totalPages) return;
        if (this.loading) return;
        this.loading = true;
        try {
            let res = await request.get(`/goods/list.do?limit=20&start=${this.start}&categoryId=`);
            this.totalPages = res.totalPages;
            let list = [];
            for (let index = 0, j = res.items.length; index < j; index++) {
                const item = res.items[index];
                if (!item) continue;
                let temp = {
                    type: "product",
                    index: "product_" + item.sku + this.start,
                    key: index,
                    show:false
                };
                temp.data = item;
                let h = this.productSH;
                if ((index + 1) % 5 !== 0) {
                    temp.data2 = Object.assign({}, res.items[index + 1]);
                    h = this.productBH;
                    res.items[index + 1] = null;
                }
                this.layout.push({ h });
                list.push(temp);
            }
            this.setState({ list: this.state.list.concat(list) });
            if (res.items.length < 20) this.totalPages = 1;
        } catch (e) {
            // toast(e.message);
        } finally {
            this.start++;
            this.loading = false;
            if (this.start >= this.totalPages) {
                this.setState({ loadText: "别扯啦,到底了..." })
            }
            // if (this.start < 2) {
            //     this.showImage(0);
            // }
        }
    }

    share() {
        this.refs.shareView.open();
    }
    //刷新
    refresh() {
        this.step = 0;
        this.start = 0;
        this.loading = false;
        this.totalPages = 2;
        this.loadBanner();
    }
    //定时器
    timer = null;
    showImage(index) {
        if (this.timer) return;
        this.timer = setTimeout(() => {
            // console.log("延迟显示:当前第" + index + "行");
            let list = this.state.list.filter((item, i) => {
                item.show = i >= index - 2 && i < index + 5;
                return item;
            })
            // this.shouldComponentUpdate = true;
            this.setState({ list })
            if (this.timer) clearTimeout(this.timer);
            this.timer = null;
        }, 200);
    }

    //滚动监听
    _onScroll(e) {
        const y = e.contentOffset.y;
        let index = 0;
        let curr = 0;
        while (y > curr) {
            if (!this.layout[index]) break;
            curr += this.layout[index].h;
            index++;
        }
        // console.log("当前第" + index + "行");
        this.showImage(index);

        if (y < 200) this.state.scrollTop.setValue(y)
        if (y < 500 && this.state.showTop) {
            this.setState({ showTop: false })
        }
        if (y > 500 && !this.state.showTop) {
            this.setState({ showTop: true })
        }
    }
    //回到顶部
    toTop() {
        this.refs.flatlist.scrollToOffset({ offset: 0 })
    }
    //TODO:加入购物车
    addCart() { }
    /**
     * 跳转到其他页面
     * @param {*} item 
     */
    goOtherPage(item) {
        if (item.urlType == "sku" && item.prodId) {
            this.props.navigation.navigate('Goods', {
                id: item.prodId
            });
        }
        if (item.urlType == "h5") {
            this.props.navigation.navigate('Browser', {
                webPath: item.urlTypeValue,
                img: item.imageUrl
            });
        }
    }
}

const styles = StyleSheet.create({
    headerView: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        zIndex: 100,
    },
    pageView: {
        flex: 1,
        width: deviceWidth,
    },
    loading: {
        textAlign: 'center',
        fontSize: px(28),
        color: "#ccc"
    },
    toBtn: {
        width: px(100),
        height: px(100),
        position: "absolute",
        right: 5,
        bottom: 5
    }
})
