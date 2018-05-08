'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    TouchableWithoutFeedback,
    Platform,
    Switch
} from 'react-native';
import TopHeader from '../component/header'
import px from '../utils/px'
import request from '../utils/request'
import { pay, isWXAppInstalled } from 'react-native-wechat';
import toast from '../utils/toast';

export default class extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            address: {},
            totalAmount: 0,//商品总额
            payableAmount: 0,//支付金额
            balancePayAmount: 0,//可使用余额
            balanceAmount: 0,   //可用余额
            goods: [],
            useBalance: false,//是否使用余额支付
        }
    }
    render() {
        return <View style={{ flex: 1 }}>
            {/*顶部功能组件*/}
            <TopHeader title='订单确认' navigation={this.props.navigation} />
            {/*订单内容*/}
            <ScrollView>
                {/*选择地址*/}
                <TouchableWithoutFeedback onPress={() => this.selectAddress()}>
                    <View style={styles.address}>
                        <Image style={styles.addressIcon}
                            source={{ uri: require('../images/icon-address') }}>

                        </Image>
                        {!this.state.address.name && <Text allowFontScaling={false} style={styles.addressHint}>选择地址</Text>}
                        {this.state.address.name &&
                            <View style={styles.addressInfo}>
                                <Text
                                    allowFontScaling={false}
                                    style={styles.addressLine1}>{this.state.address.name} {this.state.address.phone}</Text>
                                <Text allowFontScaling={false} style={styles.addressLine2}>
                                    {this.state.address.province}-{this.state.address.city}-{this.state.address.district}
                                    {this.state.address.detail}
                                </Text>
                            </View>
                        }
                        <Image style={styles.addressIconArrow}
                            source={{ uri: require('../images/icon-arrow') }}>
                        </Image>
                    </View>
                </TouchableWithoutFeedback>
                {/*选择地址下面的一条线*/}
                <View style={{ marginBottom: px(20), flexDirection: 'row', width: px(254 * 3) }}>
                    {[...Array(3)].map((i, idx) =>
                        <Image key={idx}
                            source={{ uri: require('../images/bg-address-line') }}
                            style={{ width: px(254), height: px(4) }}
                            resizeMode='contain' />
                    )}
                </View>
                {/*店铺的名称*/}
                <View style={styles.goodsShop}>
                    <Text allowFontScaling={false} style={styles.goodsShopText}>疯狂紫萧的店铺</Text>
                </View>
                {/*商品列表*/}
                {this.state.goods && this.state.goods.map(res =>
                    <View key={res.id} style={{
                        borderBottomWidth: px(2),
                        borderBottomColor: '#FFF'
                    }}>
                        <View style={styles.goods} key={res.id}>
                            <View style={styles.goodsDetail}>
                                <Image style={styles.goodsCover}
                                    source={{
                                        uri: res.image
                                    }}>
                                </Image>
                                <View style={styles.goodsDetailView1}>
                                    <Text allowFontScaling={false} style={styles.goodsName} numberOfLines={2}>
                                        {res.goodsName}
                                    </Text>
                                    <View style={styles.goodsDetailView2}>
                                        <Text allowFontScaling={false} style={styles.goodsPrice}>
                                            ￥{Number(res.salePrice).toFixed(2)}
                                        </Text>
                                        <Text allowFontScaling={false} style={styles.goodsQty}>
                                            x{res.qty}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                )}
                {/*金额*/}
                <View style={styles.summary}>
                    <Text allowFontScaling={false} style={styles.summaryLabel}>
                        商品金额
                        </Text>
                    <Text allowFontScaling={false} style={styles.summaryAmount}>
                        ￥{Number(this.state.totalAmount).toFixed(2)}
                    </Text>
                </View>
                {/*其他优惠手段*/}
                <View style={styles.otherBox}>
                    <View style={{ backgroundColor: '#fff' }}>
                        {
                            this.state.balanceAmount > 0 &&
                            <View style={[styles.coupon, { marginLeft: px(30), paddingLeft: 0 }]}>
                                <Text allowFontScaling={false} style={styles.balanceLabel}>
                                    可用余额￥{this.state.balanceAmount}，本单支付
                                        <Text allowFontScaling={false} style={{ color: '#d0648f' }}>
                                        ￥{this.state.balancePayAmount}
                                    </Text>
                                </Text>
                                {
                                    Platform.OS == 'ios' ? <Switch
                                        onTintColor="#d0648f"
                                        tintColor="#e5e5ea"
                                        style={styles.switchBox}
                                        value={this.state.balanceYn == 0 ? false : true}
                                        onValueChange={this.switchOnChange} /> :
                                        <Switch
                                            onTintColor="#d0648f"
                                            tintColor="#e5e5ea"
                                            thumbTintColor="#ffffff"
                                            style={styles.switchBox}
                                            value={this.state.balanceYn == 0 ? false : true}
                                            onValueChange={this.switchOnChange} />
                                }
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
            {/*支付金额*/}
            <View style={{ borderTopWidth: px(1), borderTopColor: '#ededed' }}>
                <View style={styles.footer}>
                    <View style={styles.footerMain}>
                        <Text allowFontScaling={false} style={styles.footerTxtLabel}>应付金额￥</Text>
                        <Text allowFontScaling={false} style={styles.footerTxtAmount}>
                            {Number(this.state.payableAmount).toFixed(2)}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={this.submit.bind(this)} activeOpacity={0.8}>
                        <View style={styles.footerBuy}>
                            <Text allowFontScaling={false} style={styles.footerBuyTxt}>确定支付</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    }
    componentDidMount() {
        this.getOrderDetail()
        this.getDefaultAddress();
    }

    //获取预下单数据
    getOrderDetail() {
        //使用假数据
        let goods = [{
            benefitMoney: '3.00',
            buyLimitNum: 0,
            can_select: 1,
            goodsName: "MAC/魅可子弹头口红 Dangerous (3g )",
            goodsShowDesc: '[MAC]MAC/魅可子弹头口红 Dangerous (3g )',
            goodsShowName: '美国·抢镜的必备法宝',
            goods_price: '384.00',
            id: '11',
            image: 'http://img4.daling.com/data/files/mobile/2017/11/30/15120349684184.jpg_300x300.jpg',
            isBuyLimit: 0,
            isForeignSupply: 1,
            isInBond: 1,
            limitStock: 400,
            marketPrice: '170.00',
            quantity: 3,
            salePrice: "128.00",
            select_status: 0
        }];
        let address = {};
        let totalAmount = 200;
        let payableAmount = 200;
        let balancePayAmount = 120;
        let balanceAmount = 500;
        let useBalance = false;
        this.setState({
            address, totalAmount, payableAmount, balanceAmount,
            balancePayAmount, goods, useBalance
        })
    }
    //获取默认地址
    getDefaultAddress() {
        let address = {
            id: "1",
            name: "收货人",
            phone: "15600222222",
            province: "北京",
            city: "北京",
            district: "朝阳区",
            detail: "朝阳大悦城xxx号xxx店"
        }
        this.setState({ address })
    }
    //改变余额使用状态
    switchOnChange() {
        if (this.state.balanceAmount <= 0) {
            toast("余额不足"); return;
        }
        this.setState({ useBalance: true });
        //重新获取金额,后端返回具体的数据
        // this.getOrderDetail()
    }
    //选择地址
    selectAddress() {
        this.props.navigation.navigate('AddressList', {
            selected: this.state.address,
            callback: (address) => {
                if (!address) return;
                this.setState({
                    'address': address,
                });
            }
        });
    }
    //确定支付
    async submit() {
        if (!this.state.address.name) {
            toast('请选择地址');
            return;
        }
        let wx_data = {}
        try {
            //向后台发送请求,生成订单并返回调起微信支付所需要的数据
            // wx_data = await request.post('/saleOrderApp/createOrder.do', {
            //     //需要提交的订单数据
            // })
        } catch (e) {
            toast('下单失败');
        }
        let isInstalled = await isWXAppInstalled();
        if (!isInstalled) {
            toast('请安装微信客户端');
            return;
        }
        try {
            let res = await pay(wx_data);
            //微信返回结果
        } catch (e) {
            //微信调起失败/取消
        } finally {
            this.props.navigation.navigate('Success', { orderNo: '' })
        }
    }
}
const styles = StyleSheet.create({
    page: {
        flex: 1,
        backgroundColor: '#f5f3f6'
    },
    address: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: px(35),
        paddingBottom: px(35),
        backgroundColor: '#fff'
    },
    addressIcon: {
        width: px(25),
        height: px(32),
        marginLeft: px(30),
        marginRight: px(20)
    },
    addressIconArrow: {
        width: px(15),
        height: px(26),
        marginRight: px(30),
        marginLeft: px(20)
    },
    addressHint: {
        color: '#222',
        fontSize: px(28),
        paddingTop: px(20),
        paddingBottom: px(20),
        textAlignVertical: 'center',
        flex: 1,
        includeFontPadding: false
    },
    addressInfo: {
        flex: 1
    },
    addressLine1: {
        fontSize: px(27),
        color: '#222',
        includeFontPadding: false
    },
    addressLine2: {
        fontSize: px(27),
        color: '#222',
        includeFontPadding: false
    },
    id_card: {
        height: px(122),
        backgroundColor: '#fff',
        paddingHorizontal: px(30)
    },
    id_card_number: {
        height: px(60),
        paddingHorizontal: 0,
        paddingVertical: px(15),
        lineHeight: px(60),
        fontSize: px(28),
        marginLeft: px(44)
    },
    id_card_txt: {
        fontSize: px(23),
        backgroundColor: '#fcf0f3',
        color: '#d0648f',
        padding: px(10),
        overflow: 'hidden',
        borderRadius: px(10)
    },
    goods: {
        backgroundColor: '#fbfafc',
        padding: px(30),
    },
    goodsShop: {
        height: px(80),
        paddingHorizontal: px(30),
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    goodsShopText: {
        fontSize: px(26),
        color: '#222'
    },
    goodsDetail: {
        flexDirection: 'row'
    },
    goodsDetailView1: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: px(20)
    },
    goodsDetailView2: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    goodsName: {
        width: px(400),
        lineHeight: px(40),
        fontSize: px(24),
        color: '#222',
    },
    goodsCover: {
        width: px(150),
        height: px(150),
        borderRadius: px(8),
    },
    goodsPrice: {
        fontSize: px(22),
        color: '#222',
        marginTop: px(8)
    },
    goodsQty: {
        fontSize: px(22),
        color: '#858385',
        marginTop: px(20)
    },
    summary: {
        height: px(80),
        paddingHorizontal: px(30),
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
    },
    summaryTaxat: {
        flexDirection: 'row',
        alignItems: 'center',
        width: px(750),
        height: px(80),
        paddingHorizontal: px(30),
        backgroundColor: '#fff'
    },
    summaryLabel: {
        flex: 1,
        fontSize: px(25),
        color: '#222'
    },
    summaryAmount: {
        fontSize: px(26),
        width: px(200),
        textAlign: 'right',
        color: '#d0648f'
    },
    summaryBox: {
        height: px(80),
        backgroundColor: '#fff',
        borderTopColor: '#efefef',
        borderTopWidth: px(1)
    },
    paymentMethod: {
        backgroundColor: '#fff',
        marginTop: px(22)
    },
    paymentMethodTitle: {
        borderBottomWidth: px(1),
        borderBottomColor: '#f6f5f7',
        height: px(81),
        justifyContent: 'center',
        paddingHorizontal: px(30)
    },
    paymentMethodTitleTxt: {
        color: "#858385",
        fontSize: px(24)
    },
    paymentMethodList: {
        height: px(100),
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: px(33),
        borderBottomWidth: px(1),
        borderBottomColor: '#f6f5f7'
    },
    paymentMethodListView1: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    payName: {
        marginLeft: px(20)
    },
    paymentMethodListName: {
        fontSize: px(25),
        color: '#252426'
    },
    payNameMain: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    payNameTipBox: {
        marginLeft: px(9),
        backgroundColor: '#d0648f',
        width: px(52),
        height: px(28),
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px(3)
    },
    payNameTip: {
        fontSize: px(18),
        color: '#fff',
    },
    payNameDesc: {
        fontSize: px(20),
        color: '#858385',
        marginTop: px(10)
    },
    footer: {
        height: px(90),
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    footerMain: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    footerTxtLabel: {
        fontSize: px(28),
        backgroundColor: 'transparent',
        includeFontPadding: false,
        color: '#d0648f'
    },
    footerTxtAmount: {
        fontSize: px(38),
        includeFontPadding: false,
        color: '#d0648f',
        marginRight: px(40)
    },
    footerBuy: {
        width: px(250),
        height: px(90),
        paddingTop: px(30),
        backgroundColor: '#d0648f'
    },
    footerBuyTxt: {
        fontSize: px(30),
        color: '#fff',
        textAlign: 'center',
        includeFontPadding: false
    },
    otherBox: {
        marginTop: px(20)
    },
    coupon: {
        height: px(80),
        paddingHorizontal: px(30),
        alignItems: 'center',
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderBottomColor: '#efefef',
        borderBottomWidth: px(1)
    },
    couponCount: {
        flexDirection: 'row',
        flex: 1
    },
    couponName: {
        fontSize: px(26),
        marginTop: px(3)
    },
    couponTip: {
        fontSize: px(24),
        paddingLeft: px(10),
        paddingRight: px(10),
        height: px(34),
        borderWidth: px(1),
        borderRadius: px(3),
        overflow: 'hidden',
        color: '#d0648f',
        borderColor: '#d0648f',
        textAlign: 'center',
        paddingTop: px(3),
        marginLeft: px(14)
    },
    couponMoney: {
        flex: 1,
        textAlign: 'right',
        color: '#d0648f',
        fontSize: px(28),
        paddingRight: px(17)
    },
    balanceLabel: {
        flex: 1,
        fontSize: px(26)
    },
    couponDec: {
        width: px(26),
        height: px(26),
        fontSize: px(20),
        overflow: 'hidden',
        borderRadius: px(13),
        borderColor: '#858385',
        borderWidth: px(1),
        color: '#858385',
        textAlign: 'center',
        marginLeft: px(8),
    },
    operatingBox: {
        width: px(210),
        height: px(68),
        borderColor: '#ddd',
        borderWidth: px(1),
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: px(10),
        overflow: 'hidden'
    },
    reduce: {
        width: px(68),
        height: px(68),
        alignItems: 'center',
        justifyContent: 'center',
        borderRightWidth: px(1),
        borderRightColor: '#ddd',
    },
    plus: {
        width: px(68),
        height: px(68),
        alignItems: 'center',
        justifyContent: 'center'
    },
    btn1: {
        fontSize: px(36),
        textAlign: 'center',
        backgroundColor: 'transparent'
    },
    inpBox: {
        flex: 1,
        borderRightWidth: px(1),
        borderRightColor: '#ddd',
    },
    inp1: {
        flex: 1,
        backgroundColor: 'transparent',
        textAlign: 'center',
        padding: 0,
        fontSize: px(28)
    },
    flag: {
        width: px(45),
        height: px(27),
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        left: px(20),
        top: px(10),
        zIndex: 100,
        borderRadius: px(4),
        overflow: 'hidden'
    },
    flag1: {
        backgroundColor: '#56beec'
    },
    flag2: {
        backgroundColor: '#6cd972'
    },
    flagLen: {
        fontSize: px(17),
        includeFontPadding: false,
        textAlign: 'center',
        textAlignVertical: "center",
        color: '#fbfafc',
    },
    flagBaoShui: {
        includeFontPadding: false,
        color: '#fff',
        fontSize: px(17)
    },
    flagZhiYou: {
        includeFontPadding: false,
        color: '#fff',
        fontSize: px(17)
    },
    notice: {
        backgroundColor: '#ee5168',
        minHeight: px(50),
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center'
    },
    left15: {
        marginLeft: px(30),
    },
    close: {
        color: '#fff',
        fontSize: px(50),
        fontWeight: '200',
        textAlign: 'left',
    },
    actionWrap: {
        marginRight: px(30),
        alignItems: 'center',
        justifyContent: 'center',
    },
    left6: {
        marginLeft: px(15),
    },
    notice_container: {
        flex: 1,
        marginRight: px(15),
        width: 0,
        paddingTop: px(10),
        paddingBottom: px(10)
    },
    content: {
        fontSize: px(24),
        color: '#fff',
        lineHeight: px(28)
    }
})