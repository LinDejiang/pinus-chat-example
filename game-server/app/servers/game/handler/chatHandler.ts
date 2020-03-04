import { Application, BackendSession, Channel, FrontendSession } from 'pinus';

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
    async entry(msg: any, session: BackendSession) {
        //let a = await this.app.rpc.connector.authRemoter.auth(session,"asas","asasas");
        return { code: 200, msg: 'game server is ok.' };
    }

    /**
     * Publish route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     * @param  {Function} next    next step callback
     * @return {Void}
     */
    async publish(msg: any, session: BackendSession) {
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
    async subscribe(msg: any, session: BackendSession) {
        let result = {
            topic: 'subscribe',
            payload: JSON.stringify({ code: 200, msg: 'subscribe message is ok.' })
        };
        return result;
    }

    async send(msg: any, session: FrontendSession) {
        //console.info("来聊天了", msg)
        let rid = session.get("rid");
        let username = session.uid;
        let channelService = this.app.get("channelService");

        let param = {
            msg: msg.content,
            from: username,
            target: msg.target
        }

        let Channel = channelService.getChannel(rid, false);

        if (msg.target == "*") {
            Channel.pushMessage("onChat", param, {}, function (err) {
                console.log("error", err)
            });
        } else {
            let tuid = msg.target + '*' + rid;;
            let tsid = Channel.getMember(tuid)['sid'];
            channelService.pushMessageByUids('onChat', param, [{
                uid: tuid,
                sid: tsid
            }]);
        }

        return { route: msg.route }
    }

}