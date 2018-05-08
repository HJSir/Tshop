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
import { getHeader } from '../utils/request'
import px from '../utils/px'
import TopHeader from '../component/header'

export default class extends React.Component {
    render() {
        return <View style={{ flex: 1, backgroundColor: '#f5f3f6' }}>
            {/*顶部设置*/}
            <TopHeader title='设置' navigation={this.props.navigation} />
            <View style={{ backgroundColor: '#fff'}}>
                <TouchableWithoutFeedback>
                    <View style={[styles.row, styles.rowBorder]}>
                        <Text allowFontScaling={false} style={styles.rowLabel}>当前版本</Text>
                        <Text>{getHeader('version')}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback>
                    <View style={[styles.row, styles.rowBorder]}>
                        <Text allowFontScaling={false} style={styles.rowLabel}>基带</Text>
                        <Text style={{ textAlign: 'center', color: '#ccc', fontSize: px(28) }}>{getHeader("bundle")}</Text>
                    </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.goDebug()}>
                    <View style={[styles.row, { height: px(90) }]}>
                        <Text allowFontScaling={false} style={styles.rowLabel}>开发者模式</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text>{getHeader("jsversion")}</Text>
                            <Image source={{ uri: require('../images/icon-arrow') }}
                                style={{ width: px(15), height: px(26), marginLeft: px(15) }} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <Text allowFontScaling={false} style={styles.version}>Copyright © 2018达令家 All Rights Reserved </Text>
            <View style={styles.log}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => this.logout()}>
                    <Text allowFontScaling={false} style={styles.logout}>退出登录</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    //跳转日志页
    goDebug() {
        this.props.navigation.navigate('Debugs');
    }
    //退出登录
    logout(){
        this.props.navigation.navigate('Login');
    }
}


const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: px(26),
        paddingBottom: px(26),
        paddingRight: px(30),
        marginBottom: px(1),
        marginLeft: px(30),
    },
    rowBorder: {
        borderBottomWidth: px(1),
        borderBottomColor: '#efefef'
    },
    version: {
        marginTop: px(50),
        color: '#858385',
        fontSize: px(25), width: px(750),
        textAlign: 'center',
    },
    head: {
        height: px(170),
        flexDirection: 'row',
        paddingRight: px(30),
        alignItems: 'center'
    },
    headBorder: {
        borderBottomWidth: px(1),
        borderBottomColor: '#efefef'
    },
    headImg: {
        width: px(120),
        height: px(120),
        borderRadius: px(60)
    },
    headerName: {
        paddingLeft: px(20),
        fontSize: px(30),
        color: '#252426'
    },
    headArrow: {
        width: px(15),
        height: px(26)
    },
    headBox: {
        marginBottom: px(20),
        paddingLeft: px(30),
        backgroundColor: '#fff'
    },
    headEdit: {
        width: px(178),
        color: '#858385',
        fontSize: px(24),
        textAlign: 'center',
    },
    headEditBox: {
        width: px(180),
        height: px(54),
        borderRadius: px(25),
        borderColor: '#b2b3b5',
        borderWidth: px(1),
        overflow: 'hidden',
        paddingTop: px(12)
    },
    address: {
        paddingLeft: px(0),
        marginLeft: px(0)
    },
    logout: {
        width: px(690),
        height: px(80),
        overflow: 'hidden',
        color: '#fff',
        backgroundColor: '#d0648f',
        marginBottom: px(54),
        marginLeft: px(30),
        fontSize: px(30),
        includeFontPadding: false,
        paddingTop: px(22),
        textAlign: 'center',
        borderRadius: px(10),
    },
    log: {
        flex: 1,
        justifyContent: 'flex-end'
    }
});
