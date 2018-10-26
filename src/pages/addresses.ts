namespace WebBrowser
{
    //地址列表
    export class Addresses implements Page
    {
        app: App
        langType: string;
        constructor(app: App) {
            this.app = app
        }
        
        getLangs() {
            if (this.langType != this.app.langmgr.type) {
                let page_lang = [
                    "addrs_title",
                    "addrs_addr",
                    "addrs_first",
                    "addrs_last",
                    "addrs_txcount",
                ]
                page_lang.forEach(
                    lang => {
                        document.getElementById(lang).textContent = this.app.langmgr.get(lang)
                    }
                )

                this.langType = this.app.langmgr.type
            }
        }
        
        div: HTMLDivElement = document.getElementById('addrs-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        private pageUtil: PageUtil;

        /**
         * addrlistInit
         */
        public async addrlistInit()
        {
            let addrlist: Addr[] = await WWW.getaddrs(this.pageUtil.pageSize, this.pageUtil.currentPage);
            //let newDate: Date = new Date();
            addrlist.map( ( item ) =>
            {
                let firstTime = DateTool.getTime(item.firstuse.blocktime.$date);

                item.firstDate = firstTime;
                let lastTime = DateTool.getTime(item.lastuse.blocktime.$date);

                item.lastDate = lastTime;
            } );
            this.loadView( addrlist );

            let minNum = this.pageUtil.currentPage * this.pageUtil.pageSize - this.pageUtil.pageSize;
            let maxNum = this.pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = this.pageUtil.currentPage * this.pageUtil.pageSize;
            }
            let pageMsg = "Addresses " + (minNum + 1) + " to " + maxNum + " of " + this.pageUtil.totalCount;
            $("#addrs-page").find("#addrs-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#addrs-page-next").removeClass('disabled');
            } else {
                $("#addrs-page-next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#addrs-page-previous").removeClass('disabled');
            } else {
                $("#addrs-page-previous").addClass('disabled');
            }

        }
        /**
         * start
         */
        public async start()
        {
            this.getLangs()

            this.div.hidden = false;
            
            let prom = await WWW.getaddrcount();
            this.pageUtil = new PageUtil(prom, 15);
            await this.addrlistInit();
            //this.addrlistInit();
            $("#addrs-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.addrlistInit();
                }
            });
            $("#addrs-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.addrlistInit();
                }
            });
            this.footer.hidden = false;
        }
        /**
         * loadView
         */
        public loadView( addrlist: Addr[] )
        {
            $( "#addrlist" ).empty();
            addrlist.forEach( item =>
            {
                let href = Url.href_address( item.addr );
                let html = `
                <tr>
                <td><a class="code" target="_self" href="`+ href + `">` + item.addr + `</a></td>
                <td>` + item.firstDate + `</td>
                <td>`+ item.lastDate + `</td>
                <td>` + item.txcount + `</td></tr>`;
                $( '#addrlist' ).append( html );
            } );
        }
    }
}