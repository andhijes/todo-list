import PouchyStore from 'pouchy-store';
// import config from '@/config';
import config from '../config';

class TodosStore extends PouchyStore {
  get name() {
    return this._name ? this._name.toLowerCase(): this._name;
  }

  setName(userId) {
    this._name = `todos_${userId}`;
  }

  get urlRemote() {
    return config.couchDBUrl;
  }

  get optionsRemote() {
    return {
      auth: config.couchDBAuth,
    };
  }

  ListDataToObject(key) {
    const newListData = [...this.data];
    return newListData.reduce((obj, item) => ((obj[[item[key]]] = item), obj), {});
  }

  apa () {
    return {
      subscribers: this.subscribers,
      dbLocal: this.dbLocal,
      dbMeta: this.dbMeta,
      dbRemote: this.dbRemote,
      data: this.data,
      dataDefault: this.dataDefault,
      single: this.single,
      useRemote: this.isUseRemote,
      isUseData: this.isUseData
      
    };
  }

  sortData(data) {
    data.sort((one, two) => {
      const oneTs = one.createdAt;
      const twoTs = two.createdAt;
      if (oneTs > twoTs) return -1;
      if (oneTs < twoTs) return 1;
      return 0;
    });
  }
}

export default new TodosStore();
