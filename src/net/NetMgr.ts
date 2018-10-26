
/// <reference path="../app.ts" />
/// <reference path="./Connector.ts" />

namespace WebBrowser {
    export class NetMgr {

        app: App

        private types: Array<number>; // 网络类型
        private nodes: any; // nel节点

        private default_type: number; // 默认网络，1：主网；2:测试网

        type: number; // 当前网络
        private nodes_server: any; // 当前nelnode_server

        constructor(app: App) {

            this.app = app

            this.types = [1, 2]

            this.nodes = {}
            this.nodes[1] = [
                // 主网nelnode
                ["CN", "http://localhost:59908/api/testnet/", "_1", "http://localhost:86/api/testnet/"],
                // ["CN", "https://nelnode01.9191wyx.com/api/mainnet", "_2"],

                // ["HK", "https://nelnode01.blacat.org/api/mainnet"],
            ]
            this.nodes[2] = [
                // 测试网nelnode
                ["CN", "http://localhost:59908/api/testnet/", "_1", "http://localhost:86/api/testnet/"],
                // ["CN", "https://nelnode03.9191wyx.com/api/testnet", "_2", "https://apiscan03.9191wyx.com/api/testnet"],

                // ["HK", "https://nelnode00.blacat.org/api/testnet"],
            ]

            this.nodes_server = {}
            this.default_type = 1;
        }

        

        // 选择nelnode节点
        private selectNode(callback, type, force = 0) {
            if (force == 0 && this.nodes_server && this.nodes_server.hasOwnProperty(type) && this.nodes_server[type]) {
                WWW.api = this.nodes_server[type];
                WWW.apiaggr = this.getScanHost(WWW.api, type)
                
                console.log("[WebBrowser]", '[NetMgr]', 'selectNode, node_api => ', WWW.api)
                console.log("[WebBrowser]", '[NetMgr]', 'selectNode, node_scan => ', WWW.apiaggr)

                callback()
                return
            }

            this._selectNode(callback, type, force)
        }

        private _selectNode(callback, type, force) {

            var conn = new Connector(this.getHosts(this.nodes[type]), "?jsonrpc=2.0&id=1&method=getblockcount&params=[2]", 'node')
            conn.getOne((res, response) => {
                if (res === false) {
                    // 失败提示
                    alert(this.app.langmgr.get("connect_nodes_error"))
                    return
                }
                
                this.nodes_server[type] = res
                WWW.api = this.nodes_server[type]
                WWW.apiaggr = this.getScanHost(WWW.api, type)

                console.log("[WebBrowser]", '[NetMgr]', '_selectNode, node_api => ', WWW.api)
                console.log("[WebBrowser]", '[NetMgr]', '_selectNode, node_scan => ', WWW.apiaggr)

                callback()
            })
        }

        // 选择/切换网络
        change(callback, type: number = null) {
            if (!type) {
                type = this.default_type;
            }

            console.log("[WebBrowser]", '[NetMgr]', 'change, type => ', type)
            switch (type) {
                case 1: // 主网
                    this.change2Main(callback)
                    break;
                case 2: // 测试网
                    this.change2test(callback)
                    break;
            }

        }
        setDefault(type: number) {
            console.log("[WebBrowser]", '[NetMgr]', 'setDefault, type => ', type)
            this.default_type = type;
        }



        private async change2test(callback) {
            // 节点地址
            this.selectNode(() => {
                // 测试网
                this.type = 2;
                // 回调
                callback()
            }, 2)
        }

        private async change2Main(callback) {
            // 节点地址
            this.selectNode(() => {
                // 主网
                this.type = 1;
                // 回调
                callback()
            }, 1)
        }

        getOtherTypes(): Array<number> {
            var res = new Array()
            for (let k = 0; k < this.types.length; k++) {
                if (this.types[k] !== this.type) {
                    res.push(this.types[k])
                }
            }
            return res;
        }

        private getHosts(hosts) {
            var res = []
            hosts.forEach(
                host => {
                    res.push(host[1])
                }
            )
            return res;
        }

        // 获取当前节点信息，type: clis，nodes
        getCurrNodeInfo(type: string) {
            var info = null
            if (this[type][this.type].length > 0) {
                for (let i = 0; i < this[type][this.type].length; i++) {
                    if (this[type][this.type][i][1] == this[type + "_server"][this.type]) {
                        return this[type][this.type][i]
                    }
                }
            }
            return info
        }

        getNodeLists(type: string) {
            var lists = []
            if (this[type] && this[type][this.type]) {
                return this[type][this.type]
            }
            return lists
        }

        setNode(type, url) {
            this[type + "_server"][this.type] = url
            WWW.api = url
            WWW.apiaggr = this.getScanHost(WWW.api, type)

            console.log("[WebBrowser]", '[NetMgr]', 'setNode, node_api => ', WWW.api)
            console.log("[WebBrowser]", '[NetMgr]', 'setNode, node_scan => ', WWW.apiaggr)
        }

        private getScanHost(apiHost, type) {
            var scan = ""

            for (let i=0; i< this.nodes[type].length; i++) {
                if (this.nodes[type][i][1] == apiHost) {
                    return this.nodes[type][i][3]
                }
            }
            return scan
        }
    }

}