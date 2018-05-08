'use strict';

import React, { PureComponent } from 'react';
import {
    Modal, Text, View, StyleSheet,
    TouchableOpacity, Image,
    TouchableWithoutFeedback, TextInput,
    KeyboardAvoidingView, Dimensions, Animated,
    ScrollView, NativeModules, Platform
} from 'react-native'
import px from '../utils/px'
import toast from '../utils/toast'
import { log, logWarm, logErr } from '../utils/log'

const deviceWidth = Dimensions.get('window').width;
const deviceHeight = Dimensions.get('window').height;

const base = StyleSheet.create({
    /**
     * 一行，居中
     */
    line: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    position: {
        position: 'absolute',
    },
    inline: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inline_between: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text_center: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    flex_middle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bg: {
        flex: 1,
        width: deviceWidth,
        height: deviceHeight,
        zIndex: 1
    },
    alertContainer: {
        flex: 1,
        position: 'absolute',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

/**
 * alert提示
 * @param {*} opt.title 标题
 * @param {*} opt.content<array> 内容
 * @param {*} opt.btns<array> 按钮组
 * @param {*} opt.btns.txt 按钮标题
 * @param {*} opt.btns.click 按钮点击事件
 */
exports.DialogModal = class extends React.Component {
    constructor(props) {
        super(props)
        this.enabledExit = this.props.enabledExit;
        this.state = {
            show: false,
            opt: { title: "", content: [], btns: [] }
        }
    }
    render() {
        let opt = this.state.opt;
        return <Modal
            visible={this.state.show}
            onShow={() => { }}
            onRequestClose={() => { }}
            animationType="none"
            transparent={true}>
            {this.state.show && <View style={[base.flex_middle, { backgroundColor: "rgba(0,0,0,.5)" }]}>
                <TouchableWithoutFeedback onPress={() => {
                    this.enabledExit && this.setState({ show: false })
                }}>
                    <View style={base.bg}></View>
                </TouchableWithoutFeedback>
                <View style={base.alertContainer}>
                    <View style={DialogStyle.alert_box}>
                        <View style={DialogStyle.alert_title}>
                            {opt.title && <Text style={DialogStyle.alert_title_txt}>{opt.title}</Text>}
                        </View>
                        <View style={DialogStyle.alert_body}>
                            {opt.content.map((txt, index) =>
                                <Text key={index} style={DialogStyle.alert_body_txt}>{txt}</Text>
                            )}
                        </View>
                        <View style={DialogStyle.alert_foot}>
                            {opt.btns.map((btn, index) => <TouchableOpacity key={index} onPress={() => {
                                btn.click && btn.click(); this.setState({ show: false })
                            }}><View style={[DialogStyle.alert_foot_btn, { borderLeftWidth: index > 0 ? px(1) : 0 }]} ><Text style={{ color: btn.color }}>{btn.txt}</Text></View></TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>
            </View>}
        </Modal>
    }
    //弹框参数
    open(opt) {
        if (!opt || !opt.content) return logWarm("alert没有传入内容参数");
        if (!opt.btns || opt.btns.length === 0) {
            opt.btns = [{ txt: "确定", click: () => { } }]
        }
        if (opt.btns.length == 1) {
            opt.btns[0].color = "#d0648f";
        }
        if (opt.btns.length == 2) {
            opt.btns[1].color = "#d0648f";
        }
        this.setState({
            show: true, opt
        })
    }
    //重载参数
    _alert(title, content, success, cancel) {
        let opt = {
            title, content,
            btns: []
        }
        if (success) opt.btns.push(success)
        if (cancel) opt.btns.push(cancel)
        this.open(opt);
    }
    /**
    * alert提示
    * @param {*} title 标题
    * @param {*} content<array> 内容
    * @param {*} success<array> 成功
    * @param {*} cancel<array> 取消
    * @param {*} success.txt 按钮标题
    * @param {*} success.click 按钮点击事件
    * 重载,(content<string|array>)
    * 重载,(title<string>,content<string|array>)
    * 重载,(title<string>,content<string|array>,success<string|object>)
    * 重载,(title<string>,content<string|array>,success<string|object>,cancel<string|object>)
    */
    alert(title, content, success, cancel) {
        if (!title) {
            title = null
        }
        if (title && !content) {
            const tmp = content;
            content = title;
            title = tmp;
        }
        if (typeof content === "string") content = [content]
        if (typeof success === "string") success = { txt: success }
        if (typeof cancel === "string") cancel = { txt: cancel }
        this._alert(title, content, success, cancel)
    }
}
const DialogStyle = StyleSheet.create({
    alert_box: {
        width: px(600),
        backgroundColor: "#fff",
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: px(25),
        overflow: "hidden"
    },
    alert_title: {
        paddingTop: px(40),
    },
    alert_title_txt: {
        fontSize: px(34),
    },
    alert_body: {
        paddingHorizontal: px(20),
        paddingTop: px(5),
        paddingBottom: px(30),
        alignItems: 'center',
    },
    alert_body_txt: {
        lineHeight: px(40),
        fontSize: px(26),
    },
    alert_foot: {
        borderTopWidth: px(1),
        borderColor: "#ccc",
        width: px(600),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    alert_foot_btn: {
        width: px(300),
        alignItems: 'center',
        borderColor: "#ccc",
        paddingVertical: px(30)
    }
})

/**
 * 查看大图的弹层
 * props list 图片列表
 */
exports.ImgsModal = class extends React.Component {
    //滚动
    scroll = null
    //当前图片地址
    currentSrc = ''
    //最大高度
    maxH = deviceHeight * 0.95;
    constructor(props) {
        super(props);
        this.height = px(240)
        this.state = {
            showModal: false,
            boxY: new Animated.Value(this.height),
            current: 1,//当前位置
        };
    }
    render() {
        return <Modal
            visible={this.state.showModal}
            onShow={() => { }}
            onRequestClose={() => { }}
            animationType="none"
            transparent={true}>
            <View style={imgsStyles.view}>
                <View style={imgsStyles.imgBox}>
                    <ScrollView ref='scroll'
                        contentContainerStyle={[{ height: deviceHeight }, base.line]}
                        keyboardDismissMode='on-drag'
                        onScroll={() => this.cancel()}
                        onMomentumScrollEnd={(e) => {
                            this.setPage(e.nativeEvent.contentOffset)
                        }}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        directionalLockEnabled={true}
                        scrollEventThrottle={0.5}
                        horizontal={true}>
                        {this.props.list.map((item, index) => <TouchableWithoutFeedback key={index}
                            delayLongPress={1400}
                            onLongPress={() => this.pop(item.image)}
                            onPress={() => this.close()}>
                            <View style={[imgsStyles.imgItem, base.line]}>
                                {this.resizeImg(item)}
                            </View>
                        </TouchableWithoutFeedback>
                        )}
                    </ScrollView>
                </View>
                <View style={[base.position, imgsStyles.pageBox]}>
                    <Text style={imgsStyles.pageTxt}>{this.state.current}/{this.props.list.length}</Text>
                </View>
                <Animated.View style={[imgsStyles.box, {
                    transform: [
                        { translateY: this.state.boxY }
                    ]
                }]}>
                    <TouchableOpacity onPress={() => this.save()} activeOpacity={0.5}>
                        <View style={[base.line, imgsStyles.btn]} >
                            <Text style={imgsStyles.btnSave}>保存图片到相册</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.cancel()} activeOpacity={0.5}>
                        <View style={[base.line, imgsStyles.btn, imgsStyles.cancel]} >
                            <Text style={imgsStyles.btnCancel}>取消</Text>
                        </View>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    }
    timer = null;
    componentWillUnmount() {
        if (this.timer) clearTimeout(this.timer);
    }
    /**
     * 重新计算图片
     * @param {*} w
     * @param {*} h
     */
    resizeImg(item) {
        if (!item) return null;
        let nw = px(Number(item.width));
        let nh = px(Number(item.height));
        //超过宽度
        if (nw != deviceWidth) {
            nh = nh / nw * deviceWidth
            nw = deviceWidth
        }
        if (nh > this.maxH) {
            nw = nw / nh * this.maxH;
            nh = this.maxH;
        }
        return <Image source={{ uri: item.image }} style={{ width: nw, height: nh }} />
    }
    /**
     * 设置页面
     */
    setPage(offset) {
        this.setState({
            current: (offset.x / deviceWidth >> 0) + 1
        })
    }
    /**
     * 取消弹层
     */
    close() {
        this.setState({
            showModal: false
        })
        this.state.boxY.setValue(this.height)
    }
    /**
     * 取消弹出的保存
     */
    cancel() {
        Animated.timing(
            this.state.boxY,
            {
                toValue: this.height,
                duration: 200
            }
        ).start();
    }
    /**
     * 弹出保存
     */
    pop(src) {
        this.currentSrc = src;
        Animated.timing(
            this.state.boxY,
            {
                toValue: 0,
                duration: 200
            }
        ).start();
    }
    /**
     * 保存图片
     */
    async save() {
        if (!this.currentSrc) return;
        //TODO
        this.cancel();
    }
    /**
     * 打开弹层
     * @param {*} key
     */
    Open(key) {
        this.setState({
            showModal: true
        }, () => {
            for (let index = 0; index < this.props.list.length; index++) {
                const item = this.props.list[index];
                if (item.image === key) {
                    this.setState({
                        current: index + 1
                    })
                    Platform.OS === 'ios' && this.refs.scroll.scrollTo({ x: deviceWidth * index, y: 0, animated: false })
                    break;
                }
            }
            if (Platform.OS !== 'ios') {
                this.timer = setTimeout(() => {
                    this.refs.scroll.scrollTo({ x: deviceWidth * (this.state.current - 1), y: 0, animated: false })
                }, 0);
            }
        })
    }
}
const imgsStyles = StyleSheet.create({
    view: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,1)',
        justifyContent: 'center',
    },
    imgBox: {
        width: deviceWidth,
        height: deviceHeight,
    },
    imgItem: {
        width: deviceWidth,
        height: deviceHeight,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        color: '#fff'
    },
    box: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        paddingHorizontal: px(25),
        paddingBottom: px(10)
    },
    btn: {
        paddingVertical: px(25),
        backgroundColor: '#fff',
        borderBottomWidth: px(2),
        borderColor: '#eee',
        height: px(100),
        borderRadius: px(15)
    },
    btnSave: {
        color: '#d0648f'
    },
    cancel: {
        marginTop: px(25),
    },
    btnCancel: {
        color: '#252426'
    },
    pageBox: {
        backgroundColor: 'rgba(0,0,0,.5)',
        alignItems: 'center',
        borderRadius: px(20),
        right: px(30),
        bottom: px(80),
        paddingHorizontal: px(20),
        paddingVertical: px(10)
    },
    pageTxt: {
        color: '#fff'
    }
})
