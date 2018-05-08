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

class AddressItem extends React.Component {
    render() {
        const { address } = this.props
        return <View style={styles.addressItem} key={address.id}>
            <TouchableWithoutFeedback onPress={() => this.props.select(address)}>
                <View style={styles.addressInfo}>
                    {address.defaultYn == 'Y' &&
                        <View style={styles.addressCheck}>
                            <Image source={{ uri: require('../images/icon-address-check') }}
                                style={{ width: px(30), height: px(20), marginTop: px(50) }} />
                        </View>
                    }
                    <View style={styles.addressDetail}>
                        <View style={styles.head}>
                            <Text allowFontScaling={false} style={[styles.addressDetail1, {
                                lineHeight: px(35)
                            }]}>{address.name}  {address.phone}</Text>
                            {address.defaultYn == 'Y' && <View style={styles.normalBtn}>
                                <Text allowFontScaling={false} style={styles.normalText}>默认地址</Text>
                            </View>}
                        </View>
                        <View>
                            <Text allowFontScaling={false} style={styles.addressDetail2}>
                                {address.province}-{address.city}-{address.district}
                                {address.detail}
                            </Text>
                        </View>
                        <View>
                            <Text allowFontScaling={false} style={styles.addressDetail2}>{address.cardNo}</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            <View style={styles.addressAction}>
                <TouchableWithoutFeedback onPress={() => this.props.defaultSelect(address.id)}>
                    <View style={styles.radio}>
                        {
                            address.defaultYn == 'Y' && <Image source={{ uri: require('../images/icon-default-address') }}
                                resizeMode='cover'
                                style={{ width: px(34), height: px(34) }} />
                        }
                        {
                            address.defaultYn == 'N' && <Image source={{ uri: require('../images/icon-default-address-un') }}
                                resizeMode='cover'
                                style={{ width: px(34), height: px(34) }} />
                        }
                        <Text allowFontScaling={false} style={styles.radioLabel}>
                            {address.defaultYn == 'Y' ? '默认地址' : '设为默认'}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.props.goEdit(address.id)}>
                    <View style={styles.addressActionBtn}>
                        <Image style={{ width: px(24), height: px(24), marginTop: px(1) }} source={{ uri: require('../images/icon-address-edit') }}></Image>
                        <Text allowFontScaling={false} style={styles.addressActionBtnTxt}>编辑</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.props.delAddress(address.id)}>
                    <View style={styles.addressActionBtn}>
                        <Image style={{ width: px(25), height: px(25) }} source={{ uri: require('../images/icon-address-del') }}></Image>
                        <Text allowFontScaling={false} style={styles.addressActionBtnTxt}>删除</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </View>
    }
}

export default class extends React.Component {
    constructor(props) {
        super(props);
        if (!this.props.navigation.state.params) this.props.navigation.state.params = {}
        this.state = {
            refreshing: false, //是否显示下拉加载菊花
            list: [],
            initSelected: this.props.navigation.state.params.selected,
            callback: this.props.navigation.state.params.callback,
        }
    }
    render() {
        return <View style={styles.container}>
            {/*顶部设置*/}
            <TopHeader title='选择地址' navigation={this.props.navigation} />
            {/*地址列表*/}
            <FlatList
                data={this.state.list}
                refreshing={this.state.refreshing}
                onRefresh={() => this.refresh()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) =>
                    <AddressItem
                        address={item}
                        select={this.select.bind(this)}
                        defaultSelect={this.defaultSelect.bind(this)}
                        goEdit={this.goEdit.bind(this)}
                        delAddress={this.delAddress.bind(this)} />
                }
                onEndReached={() => this.next()}
                ListEmptyComponent={
                    <Text style={styles.emptyList} allowFontScaling={false}>暂无收货地址</Text>
                }
            />
            <TouchableWithoutFeedback onPress={() => this.goCreate()}>
                <View style={styles.footer}>
                    <Text allowFontScaling={false} style={styles.footerTxt}>添加地址</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    }
    componentDidMount() {
        this.refresh();
    }
    //获取第一页
    refresh() {
        let list = [{
            id: "2",
            name: "收货人",
            phone: "15600222222",
            province: "北京",
            city: "北京",
            district: "朝阳区",
            detail: "朝阳大悦城xxx号xxx店"
        }]
        this.setState({ list })
        //真是情况的代码
        // try {
        //     this.start = 1;
        //     let list = request.get('/get/address,do', {
        //         start: this.start
        //     })
        //     if (!list || list.constructor !== Array) return;
        //     this.setState({ list })
        // } catch (e) {
        //     toast(e.message)
        // }
    }
    //加载下一页
    next() {
        //真是情况的代码
        // try {
        //     this.start++;
        //     let list = request.get('/get/address,do', {
        //         start: this.start
        //     })
        //     if (!list || list.constructor !== Array) return;
        //     this.setState({ list })
        // } catch (e) {
        //     toast(e.message)
        // }
    }
    //选中并返回
    select(address) {
        if (this.state.callback) this.state.callback(address);
        this.props.navigation.goBack();
    }
    //设置默认地址
    defaultSelect(id) {
        // try {
        //     request.post("/set/address.do",{id:id})
        //     this.refresh();
        // } catch (e) {
        //     toast(e.message)
        // }
    }
    //删除
    delAddress(id) {
        // try {
        //     request.post("/del/address.do",{id:id})
        //     this.refresh();
        // } catch (e) {
        //     toast(e.message)
        // }
    }
    //跳转编辑
    goEdit(id) {
        this.props.navigation.navigate('AddressEdit', {
            id,
            callback: () => this.refresh()
        });
    }
    //添加新地址
    goCreate() {
        this.props.navigation.navigate('AddressEdit', {
            callback: () => this.refresh()
        });
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f3f6'
    },

    page: {
        flex: 1
    },
    radio: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: px(40)
    },
    radioLabel: {
        position: 'relative',
        top: px(4),
        paddingLeft: px(15),
        fontSize: px(26),
        color: '#858385',
        includeFontPadding: false
    },
    head: {
        flexDirection: 'row',
        alignItems: 'center',
        height: px(69)
    },
    normalBtn: {
        width: px(100),
        height: px(35),
        borderWidth: px(1),
        borderColor: '#d0648f',
        borderRadius: px(6),
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: px(26)
    },
    normalText: {
        fontSize: px(20),
        color: '#d0648f'
    },
    addressItem: {
        backgroundColor: '#fff',
        marginTop: px(24)
    },

    addressInfo: {
        flexDirection: 'row',
        paddingLeft: px(40)
    },

    addressCheck: {
        width: px(60)
    },

    addressDetail: {
        flex: 1
    },

    addressDetail1: {
        color: '#212121',
        fontSize: px(28),
        marginTop: px(22),
        marginBottom: px(12),
        includeFontPadding: false
    },

    addressDetail2: {
        color: '#7a787a',
        fontSize: px(24),
        marginBottom: px(10),
        includeFontPadding: false
    },

    addressAction: {
        borderTopWidth: px(1),
        borderTopColor: '#edeced',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingTop: px(28),
        paddingBottom: px(22),
        paddingRight: px(60)
    },

    addressActionBtn: {
        flexDirection: 'row',
        marginLeft: px(40)
    },

    addressActionBtnTxt: {
        fontSize: px(24),
        marginLeft: px(12),
        includeFontPadding: false
    },

    footer: {
        height: px(90),
        paddingTop: px(30),
        backgroundColor: '#d0648f',
    },

    footerTxt: {
        fontSize: px(30),
        textAlign: 'center',
        color: '#fff',
        includeFontPadding: false
    },

    emptyList: {
        fontSize: px(26),
        marginTop: px(50),
        textAlign: 'center',
        color: '#858385'
    }
})