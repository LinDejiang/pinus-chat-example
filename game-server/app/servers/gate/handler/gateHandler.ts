import { Application, FrontendSession } from 'pinus';
import { Session } from 'inspector';

export default function (app: Application) {
    return new Handler(app);
}

export class Handler {
    constructor(private app: Application) {
        this.app = app;
    }


    async queryEntry(msg:any,Session:FrontendSession){
        let uid = msg.uid;

        if(!uid){
            return {code:500}
        }

        let connectors = this.app.getServersByType('connector');

        if(!connectors || connectors.length === 0) {
            return {code:500};
        }

        let res = connectors[0]

        return {code:200,host:res.host,port:res.clientPort}
    }
}