'use strict';

import React from 'react';
import {
    StyleSheet,
    Image,
    View,
    WebView
} from 'react-native';

import Header from '../component/header'
import { log, logWarm, logErr } from '../utils/log'
import { getHeader, getHeaders } from '../utils/request'


export default class extends React.Component {

    constructor(props) {
        super(props);
        let urls = decodeURIComponent(this.props.navigation.state.params.webPath || '');
        if (urls.indexOf('?') > 0) {
            urls += '&t=' + Date.now();
        } else {
            urls += '?t=' + Date.now();
        }
        this.state = {
            webpath: urls,
            title: ''
        }
    }
    render() {
        return <View style={{ flex: 1 }}>
            <Header title={this.state.title} navigation={this.props.navigation} />
            <WebView
                //添加一个引用
                ref="webview"
                //设置浏览地址
                source={{ uri: this.state.webpath }}
                //启用安卓的js功能
                javaScriptEnabled={true}
                //正常的滚动停止速度
                decelerationRate="normal"
                //允许https和http一起使用
                mixedContentMode="always"
                //显示loading动画
                startInLoadingState={true}
                //开启缩放
                scalesPageToFit={true}
                //网页互动消息通知
                onMessage={(t) => this.onMessage(t)}
                onNavigationStateChange={(e) => this.webChange(e)}
                onLoad={(e) => {
                    this.loaded()
                    log('网页加载成功', e.nativeEvent)
                }}
                onError={(e) => {
                    log('网页加载失败', e.nativeEvent)
                }} />
        </View>
    }
    //注入js
    javascript = `
    ;(function(win,undefined){
        var sdk_list=["addCart","openDetail","buy","openCart",
                    "orderPage","login","setTitle","wxpay","alipay","myOrderPage",
                    "orderPage","myOrderDetail","orderDetail",];
        function sdk_fun(name,arr){
            var data=[name].concat(arr);
            window.postMessage(JSON.stringify(data));
        }
        var _sdk=win.SDK||{};
        _sdk.current="${getHeader('platform')}";
        _sdk.xc_role="${getHeader('xcrole')}";
        _sdk.utoken='${getHeader("utoken")}';
        _sdk.uid='${getHeader("uid")}';
        _sdk.header=${JSON.stringify(getHeaders())};
        for(var i=0,j=sdk_list.length;i<j;i++){
            ;(function(){
                var name=sdk_list[i];
                _sdk[name]=function(){
                    var arr=Array.prototype.slice.apply(arguments);
                    sdk_fun.call(SDK,name,arr);
                }
            })()
        }
        win.SDK=_sdk;
        win.title&&_sdk.setShareInfo(win.title,win.desc,null,win.image,win.viewUrl);
        win.Ready&&window.Ready();
        _sdk.emit&&_sdk.emit("ready");
    })(window);`
    //网页加载成功之后
    loaded() {
        this.refs.webview.injectJavaScript(this.javascript);
    }
    //网页回调消息到APP
    onMessage(t) {
        try {
            let data = t.nativeEvent.data;
            if (data) {
                let args = JSON.parse(data);
                let name = args.shift();
                if (this[name]) this[name].call(this, ...args)
            }
        } catch (e) {
            logWarm(e.message)
        }
    }
    //网页跳转
    webChange(event) {
        if (!event || !event.title) return;
        if (event.title.indexOf("http") < 0 && event.title.indexOf("about:") < 0) {
            this.setState({
                title: event.title
            });
        }
    }

    /**
     * 打开详情页
     * @param {*} id 
     */
    openDetail(id) {
        if (/^[0-9]+$/.test(id + '')) {
            this.props.navigation.navigate('Goods', {
                id: id
            });
        } else {
            this.props.navigation.navigate('Goods', {
                sku: id
            });
        }
    }
    setShareInfo(title, desc, shareList, img, viewurl) {
        this.setState({
            title: title,
        });
    }
}