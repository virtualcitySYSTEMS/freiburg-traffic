class clickInteraction extends vcs.vcm.interaction.AbstractInteraction {
    constructor(callback) {
        super();
        this._defaultActive = vcs.vcm.interaction.EventType.CLICK;
        this._defaultModificationKey = vcs.vcm.interaction.ModificationKeyType.ALL;
        this.setActive();
        this._callback = callback;

    }
    pipe(event) {
        //console.log(event.feature);
        this._callback(event.feature)
        return event;
    }
}

//const clickinteraction = new clickInteraction();
export default clickInteraction;