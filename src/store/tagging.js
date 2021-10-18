import PouchyStore from 'pouchy-store';
import config from '../config';
import userStore from './user';

class TaggingStore extends PouchyStore {
  get name() {
    return 'master_tagging';
  }

  get urlRemote() {
    return config.couchDBUrl;
  }

  get optionsRemote() {
    return {
      auth: config.couchDBAuth,
    };
  }


  setTagListByUsername(taggingData) {
    let tagList = [];
    const userData = userStore.data;
    const tagListByUsername = taggingData.filter(data => data.username === userData.username);

    if(tagListByUsername.length > 0) {
      const resultTag = tagListByUsername[0];
      tagList = resultTag.tags || [];
    }

    this._tagList = tagList;
  }

  get tagListByUsername() {
    return this._tagList || [];
  }

  async updateTagsByUsername(username, tagList, user) {
    const checkUserTagData = [...this.data].filter((dt) => dt.username === user.username);
    let payload = {};

    try {
      if (checkUserTagData.length) {
        const taggingData = checkUserTagData[0];
        const updatedTags = [
          ...taggingData.tags,
          ...tagList,
        ];
  
        payload = {
          ...taggingData,
          tags: [...new Set(updatedTags)],
        };
  

        await this.editItem(taggingData._id || taggingData.clientId, payload, user);
      } else{
        payload = {
          tags: tagList,
          username
        };


        await this.addItem(payload, user);
      }
    } catch (error) {
      console.log(`error taggingStore`, error);
    }
    
  }
}

export default new TaggingStore();
