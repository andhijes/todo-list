import PouchyStore from 'pouchy-store';

class UserStore extends PouchyStore {
  get name() {
    return 'user';
  }

  get isUseRemote() {
    return false;
  }

  get single() {
    return this.name.toLowerCase();
  }


  apa () {
    return {
      subscribers: this.subscribers,
      dbLocal: this.dbLocal,
      dbMeta: this.dbMeta,
      dbRemote: this.dbRemote
    };
  }
}

export default new UserStore();
