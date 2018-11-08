/// <reference path="../app.ts"/>
namespace WebBrowser
{
    export class Index implements Page
    {
        app: App
        langType: string;

        close(): void
        {
            this.div.hidden = true;
        }
        div: HTMLDivElement = document.getElementById('index-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        viewtxlist: HTMLAnchorElement = document.getElementById( "i_viewtxlist" ) as HTMLAnchorElement;
		viewblocks: HTMLAnchorElement = document.getElementById("i_viewblocks") as HTMLAnchorElement;
		allblock: HTMLAnchorElement = document.getElementById("i_allblock") as HTMLAnchorElement;
        alltxlist: HTMLAnchorElement = document.getElementById("i_alltxlist") as HTMLAnchorElement;
        cnbtn = document.getElementById("cn-btn");
        enbtn = document.getElementById("en-btn");

        getLangs()
        {
            if (this.langType != this.app.langmgr.type) {
                let page_lang = [
                    "i_summary",
                    "i_lastblock", "i_allblock",
                    "i_totaltrans", "i_alltxlist",
                    "i_walletcreate", "i_alladdress",
                    "i_last10", "i_last10_height", "i_last10_size", "i_last10_ctm", "i_last10_txcount","i_viewblocks",
                    "i_last10t", "i_last10t_txid", "i_last10t_type", "i_last10t_height", "i_last10t_size", "i_viewtxlist",
                    
                ]
                page_lang.forEach(
                    lang => {
                        document.getElementById(lang).textContent = this.app.langmgr.get(lang)
                    }
                )
                this.langType = this.app.langmgr.type
            }
            
        }


        constructor(app: App) {

            this.app = app

            this.cnbtn.onclick = () => {
                
                this.app.langmgr.setType("cn")
                sessionStorage.setItem("language", "cn")
                //window.location.reload()

                this.refreshLangs()
            }
            this.enbtn.onclick = () => {
                // $("#en-btn").attr('href', '/' + location.hash);
                this.app.langmgr.setType("en")
                sessionStorage.setItem("language", "en")
                //window.location.reload()
                
                this.refreshLangs()
            }
        }

        private refreshLangs() {
            
            var page = this.app.routet.render();
            page.getLangs();

            this.app.navbar.getLangs()
            this.app.netWork.getLangs()

            
        }

        async start()
        {
            this.getLangs()

            this.viewtxlist.href = Url.href_transactions();
			this.viewblocks.href = Url.href_blocks();
			this.allblock.href = Url.href_blocks();
            this.alltxlist.href = Url.href_transactions();
            this.div.hidden = false;
            //查询区块高度(区块数量-1)
            let blockHeight = await WWW.api_getHeight();
            //查询交易数量
            let txCount: number = await WWW.gettxcount("");   // 
            //查询地址总数
            let addrCount: number = await WWW.getaddrcount();
            //分页查询区块数据
            let blocks: Block[] = await WWW.getblocks( 10, 1 );
            //分页查询交易记录
         
			let txs: Tx[] = await WWW.getrawtransactions(10, 1, '');
            $( "#blockHeight" ).text( NumberTool.toThousands( blockHeight ) );//显示在页面

            $( "#txcount" ).text( NumberTool.toThousands( txCount ) );//显示在页面

            $( "#addrCount" ).text( NumberTool.toThousands( addrCount ) );

            $( "#index-page" ).find( "#blocks" ).children( "tbody" ).empty();
            $( "#index-page" ).find( "#transactions" ).children( "tbody" ).empty();

            let html_blocks = ``;
            let html_txs = ``;

            blocks.forEach( ( item, index, input ) =>
            {
                //var newDate = new Date();
                //newDate.setTime(item.time * 1000);
                let time = DateTool.getTime(item.time);

                html_blocks += `
                <tr><td>
                <a class="code" target="_self" href ='`+ Url.href_block( item.index ) + `' > 
                `+ item.index + `</a></td>
                <td>` + item.size + ` bytes</td>
                <td>` + time + `</td>
                <td>` + item.tx.length + `</td></tr>`;
            } );

            txs.forEach( ( tx ) =>
            {
                let txid: string = tx.txid;
                let txtype = tx.type.replace( "Transaction", "" );
                txid = txid.replace( '0x', '' );
                txid = txid.substring( 0, 4 ) + '...' + txid.substring( txid.length - 4 );
                html_txs += `
                <tr>
                <td><a class='code' target='_self'
                 href ='`+ Url.href_transaction( tx.txid ) + `' > ` + txid + ` </a>
                </td>
                <td>` + txtype + `
                </td>
                <td> `+ tx.blockindex + `
                </td>
                <td> `+ tx.size + ` bytes
                </td>
                </tr>`;
            } );

            $( "#index-page" ).find( "#blocks" ).children("tbody" ).append( html_blocks );
            $("#index-page").find("#transactions").children("tbody" ).append(html_txs);



            this.footer.hidden = false;
        }
    }
}