import { observable, action } from 'mobx'

class MenuStore {
    @observable menu

    @observable breadNames

    constructor() {
        this.menu = []
        this.breadNames = []
    }

    @action.bound
    saveMenu(data) {
        this.menu = data
    }

    @action.bound
    saveBreadNames(data) {
        this.breadNames = data
    }
}

const menuStore = new MenuStore()

export { menuStore }
