/// <reference path="../lib/neo-ts.d.ts"/>
/// <reference types="jquery" />
/// <reference types="bootstrap" />
/// <reference path="./pages/block.ts" />
/// <reference path="./pages/blocks.ts" />
/// <reference path="./pages/address.ts" />
/// <reference path="./pages/addresses.ts" />
/// <reference path="./pages/asset.ts" />
/// <reference path="./pages/assets.ts" />

/// <reference path="./pages/index.ts"/>
/// <reference path="./pages/transactions.ts"/>
/// <reference path="./pages/transaction.ts"/>
/// <reference path="./pages/nep5.ts"/>

/// <reference path="./pages/404.ts"/>
/// <reference path="./tools/locationtool.ts" />
/// <reference path="./tools/numbertool.ts" />
/// <reference path="./tools/routetool.ts" />
/// <reference path="./tools/cointool.ts" />
/// <reference path="./Util.ts" />
/// <reference path="./Navbar.ts" />
/// <reference path="./Network.ts" />

/// <reference path="./lang/LangMgr.ts" />
/// <reference path="./net/NetMgr.ts" />

namespace WebBrowser
{

    export class App
    {
        langmgr: LangMgr
        netmgr: NetMgr
        ajax: Ajax
        navbar: Navbar
        netWork: NetWork
        block: Block
		blocks: Blocks
        address: Address
        addresses: Addresses
        transaction: Transaction
        transactions: Transactions
        assets: Appchains
        indexpage: Index
        assetinfo: AssetInfo

        notfound: Notfound
        nep5: Nep5page
        routet: Route
        strat()
        {
            this.langmgr = new LangMgr()
            let language = sessionStorage.getItem("language");  
            if (!language) {
                let lang = navigator.language;//常规浏览器语言和IE浏览器
                lang = lang.substr(0, 2);//截取lang前2位字符
                if (lang == 'zh') {
                    this.langmgr.setType("cn")
                    sessionStorage.setItem("language", "cn");
                } else {
                    this.langmgr.setType("en")
                    sessionStorage.setItem("language", "en");
                }
            }
            else {
                this.langmgr.setType(language)
            }

            this.netmgr = new NetMgr( this )

            this.ajax = new Ajax();
            this.navbar = new Navbar(this);
            this.netWork = new NetWork(this);
            this.block = new Block(this);
			this.blocks = new Blocks(this);
            this.address = new Address(this);
            this.addresses = new Addresses(this);
            this.transaction = new Transaction(this);
            this.transactions = new Transactions(this);
            this.assets = new Appchains(this);
            this.indexpage = new Index( this );
            this.assetinfo = new AssetInfo(this);

            this.notfound = new Notfound(this);
            this.nep5 = new Nep5page(this);
            this.routet = new Route(this);


            // CoinTool.initAllAsset();
            this.netWork.start();
            this.navbar.start();
            this.routet.start();

            document.getElementsByTagName("body")[0].onhashchange = () =>
            {
                this.routet.start();
            };

            $("#searchText").focus(() =>
            {
                $("#nel-search").addClass("nel-input");
            })
            $("#searchText").focusout(() =>
            {
                $("#nel-search").removeClass("nel-input");
            });

            
            
        }        

        //区块列表
        async blocksPage()
        {
            //查询区块数量
            let blockCount = await this.ajax.post('getblockcount', [2]);
            //分页查询区块数据
            let pageUtil: PageUtil = new PageUtil(blockCount[0]['indexx'], 15); 
            let block: Blocks = new Blocks(this);
            block.updateBlocks(pageUtil);
            //监听下一页
            $("#blocks-page-next").off("click").click(() =>
            {
                if (pageUtil.currentPage == pageUtil.totalPage)
                {
                    pageUtil.currentPage = pageUtil.totalPage;
                }
                pageUtil.currentPage += 1;
                block.updateBlocks(pageUtil);
            });
            $("#blocks-page-previous").off("click").click(() =>
            {
                if (pageUtil.currentPage <= 1)
                {
                    pageUtil.currentPage = 1;
                }
                pageUtil.currentPage -= 1;
                block.updateBlocks(pageUtil);
            });
        }
    }

    window.onload = () =>
    {
        //WWW.rpc_getURL();
        var app = new App();
        app.strat();
    }
    
}
function txgeneral( obj: HTMLAnchorElement )
{
    var div: HTMLDivElement = obj.parentNode as HTMLDivElement;
    var tran: HTMLDivElement = div.getElementsByClassName( "transaction" )[0] as HTMLDivElement;
    if ( tran.style.display == "" )
    {
        tran.style.display = "none";
        obj.classList.remove( "active" );

    } else
    {
        tran.style.display = "";
        obj.classList.add( "active" );
        var vins = tran.getAttribute( 'vins' );
        var vouts = tran.getAttribute( 'vouts' )
        WebBrowser.Transactions.getTxgeneral( vins, vouts, tran )
    }


}
function txgMsg(obj: HTMLAnchorElement) {
    var div: HTMLDivElement = obj.parentNode as HTMLDivElement;
    var tran: HTMLDivElement = div.getElementsByClassName("transaction")[0] as HTMLDivElement;
    if (tran.style.display == "") {
        tran.style.display = "none";
        obj.classList.remove("active");

    } else {
        tran.style.display = "";
        obj.classList.add("active");
        var vins = tran.getAttribute('vins');
        var vouts = tran.getAttribute('vouts')
        WebBrowser.Address.getTxMsg(vins, vouts, tran);
    }


}