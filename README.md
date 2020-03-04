# pinus-chat-example-
# pinus chatofpinus-websocket例子
> ### pomelo ts版本聊天例子，居于pinus为框架编写（pinus是pomelo ts版本，修改一些bug，优化了框架）

### windows平台

```
npm-install.bat //安装game-server，web-server模块依赖
```
### linux平台

```
npm-install.sh //安装game-server，web-server模块依赖
```

### 启动
game-server
```
cd game-server
npm start
```
web-server

```
cd web-server
node app
```

### 增加一个RPC接口

```
//game.remote.gameRemote.ts
declare global {
    //UserRpc是固定的，给app.rpc添加自定义的rpc
    interface UserRpc {
        //服务器文件夹名对应路由器，注意：game只能是唯一，你不能再gate服使用game来定义
        game: {
            // 一次性定义一个类自动合并到UserRpc中
            //gameRemote是remote文件夹下的文件名，AuthRemoter 是类名 gameRemote.ts文件里面的类的名字
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
    //私有方法不会加入到RPC提示里
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
｝
```


### 特别说明
##### 项目根据pomelo版本的github.com/NetEase/chatofpomelo-websocket.git编译的TS版本