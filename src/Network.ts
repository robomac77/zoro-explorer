namespace WebBrowser {

    export class NetWork {
        app: App;

        getLangs() {
            this.testa.textContent = this.app.langmgr.get("net_testa")
            this.maina.textContent = this.app.langmgr.get("net_maina")
            this.langbtn.textContent = this.app.langmgr.get("net_" + this.app.langmgr.type)

            if (this.app.netmgr.type == 1) {
                this.title.innerText = this.app.langmgr.get("net_maina")
            }
            else if (this.app.netmgr.type == 2) {
                this.title.innerText = this.app.langmgr.get("net_testa")
            }
            
        }

        constructor(app: App) {
            this.app = app
            this.getLangs()
        }

        title = document.getElementById("network") as HTMLSpanElement;
        testbtn = document.getElementById("testnet-btn") as HTMLLIElement;
        testa = document.getElementById("testa") as HTMLAnchorElement;
        mainbtn = document.getElementById("mainnet-btn") as HTMLLIElement;
        maina = document.getElementById("maina") as HTMLAnchorElement;
        css = document.getElementById("netCss") as HTMLLinkElement;

        langbtn = document.getElementById("lanuage-btn")



        start()
        {
            
            this.testa.onclick = () =>
            {
                window.location.hash = "#testnet"

                // var href: string[] = window.location.href.split("#");
                // var net: string = href[1].replace("mainnet", "");
                // net = net.replace("testnet", "");
                // net = "#testnet" + net;
                // window.location.href = href[0] + net;
            }
            this.maina.onclick = () =>
            {
                window.location.hash = "#mainnet"

                // var href: string[] = window.location.href.split("#");
                // var net: string = href[1].replace("mainnet", "");
                // net = net.replace("testnet", "");
                // net = "#mainnet" + net;
                // window.location.href = href[0] + net;
            }
        }

        changeNetWork(net: string) {
            if (net == "testnet") {
                this.testbtn.classList.add("active");
                this.mainbtn.classList.remove("active");

                this.title.innerText = this.app.langmgr.get("net_testa")
                this.css.href = "./css/testnet.css";
            }
            else if (net == "mainnet") {
                this.mainbtn.classList.add("active");
                this.testbtn.classList.remove("active");
                this.title.innerText = this.app.langmgr.get("net_maina")
                this.css.href = "./css/mainnet.css";
            }
        }
    }
}