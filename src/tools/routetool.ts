/// <reference path="../app.ts"/>
/// <reference path="../Entitys.ts"/>
namespace WebBrowser
{
    export class Route
    {
        app: App;
        pagelist: Page[] = new Array<Page>();

        constructor(app: App) {
            this.app = app
        }

        start( )
        {
            this.pagelist.push( this.app.indexpage );
            this.pagelist.push( this.app.blocks );
            this.pagelist.push( this.app.block );
            this.pagelist.push( this.app.transactions );
            this.pagelist.push( this.app.transaction );
            this.pagelist.push( this.app.addresses );
            this.pagelist.push( this.app.address );
            this.pagelist.push( this.app.assets );
            this.pagelist.push(this.app.assetinfo);

            this.closePages();

            var hash = location.hash;
            if ( hash == "" )
            {
                this.app.netmgr.change(() => {
                    window.location.hash = "#mainnet"
                })
                return;
            }

            var netType = 1
            let arr = hash.split( '/' ); 
            if ( arr[0] == "#testnet" ) {
                netType = 2
            }

            if (netType == 1) {
                this.app.netWork.changeNetWork( 'mainnet' );
            }
            else {
                this.app.netWork.changeNetWork( 'testnet' );
            }

            
            this.app.netmgr.change(() => {
                

                CoinTool.initAllAsset();
                
                var page = this.render();
                page.start();

            }, netType)
        }

        render(): Page
        {
            var page: string = locationtool.getPage() as string;
            switch (page)
            {
                case "explorer":
                    this.app.navbar.indexBtn.classList.add( "active" );
                    return this.app.indexpage;
                case "blocks":
                    this.app.navbar.blockBtn.classList.add( "active" );
                    return this.app.blocks;
                case "block":
                    this.app.navbar.blockBtn.classList.add( "active" );
                    return this.app.block;
                case "transactions":
                    this.app.navbar.txlistBtn.classList.add( "active" );
                    return this.app.transactions;
                case "transaction":
                    this.app.navbar.txlistBtn.classList.add( "active" );
                    return this.app.transaction;
                case "addresses":
                    this.app.navbar.addrsBtn.classList.add( "active" );
                    return this.app.addresses;
                case "address":
                    this.app.navbar.addrsBtn.classList.add( "active" );
                    return this.app.address;
                case "assets":
                    this.app.navbar.assetBtn.classList.add( "active" );
                    return this.app.assets;
                // case "nnsevent":
                //     this.app.navbar.nnsBtn.classList.add("active");
                //     return this.app.nnses;
                // case "nnsauction":
                //     this.app.navbar.nnsBtn.classList.add("active");
                //     return this.app.nnsbeing;
                // case "nnsrank":
                //     this.app.navbar.nnsBtn.classList.add("active");
                //     return this.app.nnsrank;
                // case "nns":
                //     this.app.navbar.nnsBtn.classList.add("active");
                //     return this.app.nnsinfo;
                case "asset":
                    this.app.navbar.assetBtn.classList.add( "active" );
                    return this.app.assetinfo;
                case "nep5":
                    return this.app.nep5;
                default:
                    return this.app.notfound;
            }
            
        }

        closePages()
        {
             let i: number = 0;
            while ( i < this.pagelist.length )
            {
                this.pagelist[i].close();
                i++;
                this.app.navbar.indexBtn.classList.remove( "active" );
                this.app.navbar.blockBtn.classList.remove( "active" );
                this.app.navbar.txlistBtn.classList.remove( "active" );
                this.app.navbar.addrsBtn.classList.remove( "active" );
                this.app.navbar.assetBtn.classList.remove("active");
                // this.app.navbar.nnsBtn.classList.remove("active");
            }
        }
    }
}