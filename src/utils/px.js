
import {
    Dimensions,
    Platform,
    PixelRatio
} from 'react-native';

const dimen = Dimensions.get('window');
const deviceWidth = dimen.width;

export default function px(size) {
    if (PixelRatio.get() >= 3 && Platform.OS == 'ios' && size == 1) {
        return size;
    }
    return deviceWidth / 750 * size;
}

let _isIphoneX = null;
export function isIphoneX() {
    if (_isIphoneX !== null) return _isIphoneX;
    if (Platform.OS !== 'ios') {
        _isIphoneX = false;
        return _isIphoneX;
    }
    let version = getHeader('version');
    if (version.length < 3) return false;
    if (version != '1.0.6') {
        _isIphoneX = false;
    } else {
        _isIphoneX = !Platform.isPad &&
            !Platform.isTVOS &&
            (dimen.height === 812 || dimen.width === 812);
    }
    return _isIphoneX;
}