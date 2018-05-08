'use strict';

import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    TextInput
} from 'react-native';
import px from '../utils/px'
import TopHeader from '../component/header'
import toast from '../utils/toast'
import { NavigationActions } from 'react-navigation';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            valid: false,
            isRegShow: 0,
            tel: '',
            sent: false
        };
        this.isPass = true;
    }
    render() {
        return <View style={styles.container}>
            {/*顶部组件*/}
            <TopHeader title='登录' navigation={this.props.navigation} />
            {/*Logo*/}
            <Image
                source={{ uri: require('../images/logo_new') }}
                style={{ width: px(220), height: px(130), marginTop: px(170), marginLeft: px(50), marginBottom: px(80) }} />
            {/*手机号输入框*/}
            <View style={[styles.input, { marginBottom: px(12) }]}>
                <TextInput style={styles.inputTxt}
                    placeholder='请输入手机号' placeholderTextColor="#b2b3b5"
                    maxlength={11} keyboardType="numeric"
                    clearButtonMode='while-editing'
                    onChangeText={(v) => this.setState({ tel: v })}
                    underlineColorAndroid="transparent" />
            </View>
            {/*短信验证码*/}
            <View style={[styles.input, { marginBottom: px(62) }]}>
                <TextInput style={styles.inputTxt}
                    placeholder='请输入验证码' placeholderTextColor="#b2b3b5"
                    maxLength={10} keyboardType="numeric"
                    onChangeText={(v) => this.setState({ code: v })}
                    underlineColorAndroid="transparent" />
                <Text allowFontScaling={false} style={this.state.sent ? styles.sent : styles.send}
                    onPress={() => this.sendCode()}>
                    {this.state.sent ?
                        `重新获取${this.state.timeout}S` :
                        `获取验证码`
                    }
                </Text>
            </View>
            {/*登录按钮*/}
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.submit()}>
                <View style={[styles.btn, { backgroundColor: '#d0648f' }]}>
                    <Text allowFontScaling={false} style={{ fontSize: px(30), color: '#fff' }}>
                        登录</Text>
                </View>
            </TouchableOpacity>
            {/*微信登录*/}
            <View style={{ position: 'absolute', bottom: px(80) }}>
                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    activeOpacity={0.8}
                    onPress={() => this.loginWeChat()}>
                    <Image source={{ uri: require('../images/icon-wechat') }} style={{ width: px(38), height: px(38), marginRight: px(13) }} />
                    <Text allowFontScaling={false} style={{ color: '#679d5e', fontSize: px(28) }}>微信登录</Text>
                </TouchableOpacity>
            </View>
        </View>
    }
    //发送验证码
    sendCode() {
        if (this.state.sent) {
            return;
        }
        if (!this.state.tel || this.state.tel.length != 11) {
            toast('请输入正确的手机号');
            return;
        }
        this.startTimer();
    }
    //倒计时
    startTimer() {
        this.setState({
            'sent': Date.now(),
            'timeout': 60
        });
        this.timer = setInterval(() => {
            let elapsed = Math.ceil((Date.now() - this.state.sent) / 1000);
            if (elapsed > 60) {
                this.setState({
                    'sent': null,
                    'timeout': null
                });
                clearInterval(this.timer);
                delete this.timer;
            } else {
                this.setState({
                    'timeout': 60 - elapsed
                });
            }
        }, 100);
    }
    //调起微信登录
    loginWeChat() {

    }
    //短信登录
    submit() {
        toast('登录成功');
        this.goTabPage();
    }
    goTabPage() {
        this.props.navigation.dispatch(NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({ routeName: 'Tabs' })
            ]
        }))
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    'input': {
        width: px(580),
        height: px(80),
        borderBottomWidth: px(1),
        borderBottomColor: '#e5e5e5',
        paddingLeft: px(12),
        paddingRight: px(12),
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center'
    },
    'inputTxt': {
        fontSize: px(26),
        color: '#252426',
        flex: 1
    },
    'send': {
        color: '#d0648f',
        fontSize: px(26),
        marginLeft: px(30)
    },
    'sent': {
        color: '#b2b5b5',
        fontSize: px(26),
        marginLeft: px(30)
    },
    'btn': {
        width: px(580),
        height: px(80),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px(40)
    },
})