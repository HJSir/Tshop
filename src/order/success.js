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
    BackHandler
} from 'react-native';
import TopHeader from '../component/header'
import px from '../utils/px'
import request from '../utils/request'
import { pay, isWXAppInstalled } from 'react-native-wechat';
import toast from '../utils/toast';
import {NavigationActions} from 'react-navigation';

export default class extends React.Component {
    constructor(props) {
        super(props)
        if (!this.props.navigation.state.params) this.props.navigation.state.params = {}
        this.state = {
            image: "",
            orderNo: this.props.navigation.state.params.orderNo || "",
            payAmount: "",
            pay: ""
        }
        this.noGoBack = this.noGoBack.bind(this)
    }

    render() {
        return <View style={styles.container}>
            <TopHeader showLeft={false} title='支付结果' navigation={this.props.navigation} />
            <View style={styles.order_info}>
                <Image source={{ uri: this.state.image }}
                    resizeMode='cover'
                    style={{ width: px(150), height: px(150) }} />
                <View style={styles.order_detail}>
                    <View style={styles.order_prop}>
                        <Text allowFontScaling={false} style={styles.key}>订单编号</Text>
                        <Text allowFontScaling={false} style={styles.txt}>{this.state.orderNo}</Text>
                    </View>
                    <View style={styles.order_prop}>
                        <Text allowFontScaling={false} style={styles.key}>已付金额</Text>
                        <Text allowFontScaling={false} style={[styles.amount, styles.txt]}>￥{this.state.payAmount}</Text>
                    </View>
                    <View style={styles.order_prop}>
                        <Text allowFontScaling={false} style={styles.key}>支付方式</Text>
                        <Text allowFontScaling={false} style={styles.txt}>微信支付</Text>
                    </View>
                </View>
            </View>
            {/*支付成功*/}
            {this.state.pay == "1" && <View>
                <Text allowFontScaling={false} style={styles.success_info}>您的订单将闪电发出，敬请期待</Text>
            </View>}
            {this.state.pay == "1" && <View style={styles.btnBox}>
                <TouchableOpacity activeOpacity={0.8} onPress={this.goDetail.bind(this)}>
                    <Text allowFontScaling={false} style={styles.btn}>订单详情</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={this.goHome.bind(this)}>
                    <Text allowFontScaling={false} style={styles.btn}>继续购物</Text>
                </TouchableOpacity>
            </View>}
            {/*支付失败*/}
            {this.state.pay == "0" && <View style={styles.btnBox}>
                <TouchableOpacity activeOpacity={0.8} onPress={this.goHome.bind(this)}>
                    <Text allowFontScaling={false} style={styles.btn}>返回首页</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.8} onPress={this.pay.bind(this)}>
                    <Text allowFontScaling={false} style={styles.btn}>继续支付</Text>
                </TouchableOpacity>
            </View>}
        </View>
    }
    async componentDidMount() {
        this.setState({
            image: "http://imgbeta.daling.com/data/files/mobile/2016/06/08/14653741419171.jpg_710x440.jpg",
            orderNo: "NS2029284774849",
            payAmount: "200.00",
            pay: "1"
        })
        // try {
        //     let data = request.get("/get/order", { orderid: this.state.orderNo })
        // } catch (e) {
        //     toast(e.message)
        // }
    }
    //添加物理返回键的监听
    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.noGoBack);
    }
    //注销监听
    componentWillUnmount() {
        BackHandler.removeEventListener("hardwareBackPress", this.noGoBack);
    }
    //禁止返回
    noGoBack() {
        return true;
    }
    //跳转到订单详情页
    goDetail() {
        this.props.navigation.navigate('OrderDetail', {
            orderNo: this.state.orderNo
        });
    }
    //重置路由到首页
    goHome() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tabs' })
            ]
        }));
    }
    //调用支付
    async pay() {
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
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f3f6'
    },
    order_info: {
        padding: px(30),
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: px(40)
    },
    goods_cover: {
        width: px(150),
        height: 150,
        marginVertical: px(20),
        marginHorizontal: px(30),
        overflow: 'hidden',
        borderRadius: px(8)
    },
    order_detail: {
        width: px(540),
        paddingLeft: px(35)
    },
    order_prop: {
        flexDirection: 'row',
        marginBottom: px(6)
    },
    key: {
        fontSize: px(25),
        marginRight: px(18)
    },
    txt: {
        fontSize: px(25)
    },
    amount: {
        color: '#e5626d'
    },
    success_info: {
        paddingVertical: px(30),
        color: '#b3b4b6',
        textAlign: 'center',
        fontSize: px(24)
    },
    btnBox: {
        flexDirection: 'row'
    },
    btn: {
        width: px(300),
        height: px(70),
        paddingTop: px(18),
        borderWidth: px(1),
        borderColor: '#a9aaac',
        color: '#212121',
        textAlign: 'center',
        backgroundColor: '#fff',
        fontSize: px(26),
        marginLeft: px(50),
        borderRadius: px(8)
    }
})