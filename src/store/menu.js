import { observable, action } from 'mobx';
import menu from '@/menu';

class MenuStore {
    @observable menu;

    @observable breadNames;

    constructor() {
        this.menu = menu || [];
    }

    @action.bound
    saveMenu(data) {
        this.menu = data;
    }

    @action.bound
    saveBreadNames(data) {
        this.breadNames = data;
    }
}

const menuStore = new MenuStore();

export { menuStore };
