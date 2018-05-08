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
} from 'react-native';
import TopHeader from '../component/header'
import px from '../utils/px'
import request from '../utils/request'
import { pay, isWXAppInstalled } from 'react-native-wechat';
import toast from '../utils/toast';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view'
import { DialogModal } from '../component/ModalView'


class ProductItem extends React.Component {
    render() {
        const { items } = this.props;
        return <View style={orderStyles.order}>
            {items.map((item, index) => <View style={styles.expressItem} key={index}>
                <TouchableWithoutFeedback onPress={() => this.props.goDetail}>
                    <View style={[styles.skuItemBase, styles.skuItem]}>
                        <Image style={styles.skuItemImage} source={{ uri: item.prodImg }} />
                        <View style={styles.skuItemInfo}>
                            <Text allowFontScaling={false} style={styles.skuItemFont}>{item.goodsName}</Text>
                        </View>
                        <View style={styles.skuItemPrice}>
                            <Text allowFontScaling={false} style={styles.skuItemFont}>¥{item.prodPrice}</Text>
                            <Text allowFontScaling={false} style={styles.skuItemFontSmall}>x{item.prodQty}</Text>
                            {item.refundQty > 0 &&
                                <Text allowFontScaling={false} style={styles.skuItemFontShow}>已退货:{item.refundQty}</Text>}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            )}
        </View>
    }
}
exports.ProductItem = ProductItem;
//订单列表的一行内容
class OrderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    render() {
        const { order } = this.props;
        return <View style={orderStyles.order}>
            <View>
                {/*订单编号/状态*/}
                <TouchableWithoutFeedback onPress={() => this.goDetail(order.orderNo)}>
                    <View style={orderStyles.orderHeader}>
                        <Text allowFontScaling={false} style={orderStyles.orderNo}>订单编号 {order.orderNo} </Text>
                        <Text allowFontScaling={false} style={orderStyles.orderStatus}>{order.orderStatusNm}</Text>
                    </View>
                </TouchableWithoutFeedback>
                {/*商品列表*/}
                <ProductItem
                    items={order.expressList}
                    order={order}
                    goDetail={() => this.goDetail(order.orderNo)}
                    navigation={this.props.navigation} />
            </View>
            {/*订单金额/操作*/}
            <TouchableWithoutFeedback onPress={() => this.goDetail(order.orderNo)}>
                <View style={orderStyles.orderFooter}>
                    <View style={{ flexDirection: 'column' }}>
                        <Text allowFontScaling={false} style={orderStyles.orderPay}>
                            {order.orderStatus == 0 ? `应付金额￥${order.payableAmount}` : `实付金额￥${order.payAmount}`}
                        </Text>
                        {order.orderStatusNm == '待支付' &&
                            <Text allowFontScaling={false} style={{ fontSize: px(20), color: '#858385' }}>
                                付款剩余时间60:00:00
                            </Text>
                        }
                    </View>
                    {order.orderStatusNm == '待支付' &&
                        <View style={{ flexDirection: 'row' }}>
                            <Text onPress={this.cancel} style={[orderStyles.cBtn, orderStyles.cancelBtn]}
                                allowFontScaling={false}>取消订单</Text>
                            <Text onPress={this.pay} style={[orderStyles.cBtn, orderStyles.payBtn]}
                                allowFontScaling={false}>去支付</Text>
                        </View>}
                    {order.orderStatusNm == '已完成' &&
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ color: '#858385', fontSize: px(24) }}
                                allowFontScaling={false}>{`还有7天佣金可到账`}</Text>
                        </View>
                    }
                </View>
            </TouchableWithoutFeedback>
        </View>
    }
    goDetail(orderNo) {
        this.props.navigation.navigate('OrderDetail', {
            orderNo: orderNo
        });
    }
}

exports.OrderItem = OrderItem;
//订单列表
class OrderList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            list: [],
            empty: ""
        };
    }

    render() {
        return <FlatList style={{ flex: 1 }}
            refreshing={this.state.refreshing}
            data={this.state.list}
            onRefresh={() => this.refresh()}
            keyExtractor={(item) => item.orderNo}
            onEndReached={() => this.next()}
            renderItem={({ item }) =>
                <OrderItem
                    order={item}
                    navigation={this.props.navigation} />
            }
            ListEmptyComponent={
                <Text allowFontScaling={false} style={orderStyles.emptyList}>{this.state.empty}</Text>
            } />
    }
    componentDidMount() {
        this.refresh()
    }
    pageIndex = 0;
    //获取第一页的数据
    refresh() {
        this.pageIndex = 0;
        let list = [];
        try {
            for (let index = 0; index < 10; index++) {
                let expressList = [];
                for (let j = 0; j < 2; j++) {
                    expressList.push({
                        id: j,
                        prodImg: "http://img4.daling.com/data/files/mobile/2017/11/30/15120349684184.jpg_300x300.jpg",
                        goodsName: "MAC/魅可子弹头口红 Dangerous (3g )",
                        prodPrice: "126.00",
                        prodQty: 1,
                        refundQty: j
                    })
                }
                list.push({
                    orderNo: "NO" + index + '210928893289287sw',
                    id: index,
                    orderStatusNm: this.props.tabLabel,
                    payableAmount: (120 + index) + ".00",
                    payAmount: (110 + index) + ".00",
                    expressList: expressList,
                })
            }
        } catch (e) {
            toast(e.message)
        }
        if (list.length === 0) {
            //设置空列表的文字
            this.state.empty = "暂无订单"
        }
        this.setState({ list, empty: this.state.empty })
    }
    //加载下一页可以自己来实现
    next() { }
}
const orderStyles = StyleSheet.create({
    order: {
        backgroundColor: '#fff',
        marginTop: px(20)
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: px(20),
        paddingBottom: px(20),
        paddingLeft: px(30),
        paddingRight: px(30),
        borderBottomWidth: px(1),
        borderColor: '#efefef'
    },
    orderNo: {
        fontSize: px(28),
        color: '#222'
    },
    orderStatus: {
        fontSize: px(26),
    },
    emptyList: {
        flex: 1,
        fontSize: px(26),
        marginTop: px(50),
        textAlign: 'center',
        color: '#858385'
    },
    orderFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        height: px(80),
        paddingLeft: px(30),
        paddingRight: px(30)
    },
    orderPay: {
        fontSize: px(26),
        color: '#222'
    },
    cBtn: {
        fontSize: px(24),
        height: px(48),
        borderWidth: px(1),
        marginLeft: px(14),
        width: px(128),
        borderRadius: px(6),
        overflow: 'hidden',
        textAlign: 'center',
        paddingTop: px(11)
    },
    cancelBtn: {
        color: '#252426',
        borderColor: '#b2b3b5'
    },
    payBtn: {
        color: '#fff',
        backgroundColor: '#d0648f',
        borderColor: '#d0648f'
    }
})
//页面
export default class extends React.Component {
    render() {
        return <View style={{ flex: 1 }}>
            {/*头部组件*/}
            <TopHeader title="订单管理" navigation={this.props.navigation} />
            {/*列表tab*/}
            <ScrollableTabView
                initialPage={0}
                tabBarBackgroundColor="#fff"
                tabBarInactiveTextColor="#858385"
                tabBarActiveTextColor="#252426"
                tabBarUnderlineStyle={{ backgroundColor: '#e86d78', height: px(4) }}
                renderTabBar={() => <DefaultTabBar />}>
                {this.renderList("待支付")}
                {this.renderList("待收货")}
                {this.renderList("已完成")}
                {this.renderList("已退货")}
            </ScrollableTabView>
            <DialogModal ref="dialog" />
        </View>
    }
    renderList(title) {
        return <OrderList tabLabel={title} navigation={this.props.navigation} />
    }

}
const styles = StyleSheet.create({
    expressItem: {
        borderBottomWidth: px(1),
        borderBottomColor: '#e7e7e7'
    },
    skuItemBase: {
        paddingTop: px(20),
        paddingBottom: px(20),
        backgroundColor: '#fbfafc',
        paddingLeft: px(30),
        paddingRight: px(30)
    },
    skuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    skuItemImage: {
        backgroundColor: '#fff',
        width: px(150),
        height: px(150),
        borderRadius: px(10)
    },
    skuItemInfo: {
        width: px(400),
        height: px(150),
    },
    skuItemFont: {
        fontSize: px(26),
        color: '#252426',
        marginBottom: px(10)
    },
    skuItemPrice: {
        alignItems: 'flex-end'
    },

    skuItemFontSmall: {
        color: '#858385',
        fontSize: px(24),
    },
    skuItemFontShow: {
        marginTop: px(10),
        color: '#d0648f',
        fontSize: px(24),
    },
})