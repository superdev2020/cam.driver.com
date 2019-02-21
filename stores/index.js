import ApiContext from './ApiContext';
import SettingStore from './SettingStore';
import UserStore from './UserStore';
import NdaStore from './NdaStore';
import MediaStore from './MediaStore';
import LocationStore from './LocationStore';

const apiContext = new ApiContext();

const stores = {
  settingStore: new SettingStore(apiContext),
  userStore: new UserStore(apiContext),
  ndaStore: new NdaStore(apiContext),
  mediaStore: new MediaStore(apiContext),
  locationStore: new LocationStore(apiContext)
}

export default stores;


