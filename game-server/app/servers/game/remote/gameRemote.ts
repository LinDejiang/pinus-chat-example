import { Application, RemoterClass, FrontendSession } from 'pinus';

export default function (app: Application) {
    return new AuthRemoter(app);
}

// UserRpc的命名空间自动合并
declare global {
    interface UserRpc {
        game: {
            // 一次性定义一个类自动合并到UserRpc中
            gameRemote: RemoterClass<FrontendSession, AuthRemoter>;
        };
    }
}


export class AuthRemoter {
    constructor(private app: Application) {
        this.app = app;
    }

    private channelService = this.app.get("channelService");

    /**
     *
     * @param username
     * @param password
     */
    public async auth(username: string, password: string) {
        return true;
    }

    public async add(uid: string, sid: string, rid: string, flag: boolean) {
        let channale = this.app.get("channelService").getChannel(rid, flag); //如果没有该房间，flag为true则自动创建
        let username = uid.split('*')[0];
        var param = {
            user: username
        }

        channale.pushMessage('onAdd', param);

        if (!!channale)
            channale.add(uid, sid);

        return this.get(rid, flag)
    }

    public async get(name: string, flag: boolean) {
        let users = [];
        let channel = this.channelService.getChannel(name, flag);

        if (!!channel) {
            users = channel.getMembers();
        }

        for (var i = 0; i < users.length; i++) {
            users[i] = users[i].split('*')[0];
        }

        return users;
    }

    public async kick(uid: string, sid: string, name: string) {
        let channel = this.channelService.getChannel(name, false);

        if (!!channel) {
            channel.leave(uid, sid);
        }

        let username = uid.split('*')[0];

        let param = {
            route: "onLeave",
            user: username
        }

        channel.pushMessage("onLeave", param);
    }

    // 私有方法不会加入到RPC提示里
    private async privateMethod(testarg: string, arg2: number) {

    }
}
