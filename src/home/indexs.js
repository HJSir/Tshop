'use strict';

import React from 'react';
import Request from '../utils/request'
import {

    ImageBackground,
    Image,
    TouchableWithoutFeedback,
    StyleSheet,
    View,
    Text,
    Dimensions
} from 'react-native';

import Swiper from 'react-native-swiper';
import toast from '../utils/toast';
import request from '../utils/request'
 import px from '../utils/px';

var {deviceHeight, deviceWidth, deviceScale} = Dimensions.get('window');
export default class extends React.Component {


    render() {

        return <View style={{flex: 1, backgroundColor: "#fff"}}>
            <View style={styles.pageView}>

                <Banner></Banner>
            </View>
        </View>
    }
}
const styles = StyleSheet.create({

    pageView: {
        flex: 1,
       width: deviceWidth

    }


})

class Banner extends React.Component {

    /**
     * banners 用来存储 banner 列表，quicks 用来存储快捷入口的列表。
     * @param props
     */
    constructor(props) {
        super(props);
        this.state = {
            banners: [],
            quicks: [],
            status: false
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
                        key={item.quickEntranceId} >
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
    /**
     * 点击事件
     * @param {*} e
     */
    onPressRow(e) {
        // this.getDetail(e.contextType, e.context, e.title, e.showImg)
    }

    componentDidMount() {
        this.refresh();
    }

    /**
     * 刷新列表内容，请求远程接口，将返回数据放入state
     */
    async refresh() {

        try {
            let res = await request.get(`/banner/findBannerAndQuickList.do?categoryId=`);

            if (res) {
                this.setState({

                    banners: res.bannerList || [],
                    quicks: res.quickList || []

                })

            }

        } catch (e) {
            // toast(e.message);
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