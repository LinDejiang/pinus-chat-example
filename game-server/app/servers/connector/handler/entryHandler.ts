import { Application, FrontendSession } from 'pinus';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {
        this.app = app;
    }

    /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @param  {Function} next    next step callback
     * @return {Void}
     */
    async entry(msg: any, session: FrontendSession) {

        return { code: 200, msg: 'game server is ok.' };
    }

    async enter(msg: any, session: FrontendSession) {
        let self = this;
        let rid = msg.rid;
        let uid = msg.username + "*" + msg.rid
        let sessionService = this.app.get("sessionService");

        if (!!sessionService.getByUid(uid)) {
            return { code: 500, msg: "不存在" }
        }

        session.bind(uid, null);
        session.set('rid', rid)
        session.push('rid', (err) => {
            if (err)
                console.error('set rid for session service failed! error is : %j', err);
        })

        session.on('closed', this.onUserLeave.bind(null, self.app))
        //console.info(self.app.rpc.game.gameRemote)
        let users = await self.app.rpc.game.gameRemote.add(session, uid, self.app.get("serverId"), rid, true);
        
        return { code: 200, users: users };
    }

    /**
     * Publish route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @param  {Function} next    next step callback
     * @return {Void}
     */
    async publish(msg: any, session: FrontendSession) {
        let result = {
            topic: 'publish',
            payload: JSON.stringify({ code: 200, msg: 'publish message is ok.' })
        };
        return result;
    }

    /**
     * Subscribe route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @param  {Function} next    next step callback
     * @return {Void}
     */
    async subscribe(msg: any, session: FrontendSession) {
        let result = {
            topic: 'subscribe',
            payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
        };
        return result;
    }

    async onUserLeave(app: Application, session: FrontendSession) {
        if (!session.uid) {
            return
        }

        await app.rpc.game.gameRemote.kick(session, session.uid, app.get("serverId"), session.get('rid'));
    }

}