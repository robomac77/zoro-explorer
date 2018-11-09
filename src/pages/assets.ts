namespace WebBrowser
{
    //资产页面管理器
    export class Appchains implements Page
    {
        app: App
        langType: string;

        div: HTMLDivElement = document.getElementById("asset-page") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        private pageUtil: PageUtil;
        private assetlist: JQuery<HTMLElement>;
        private appchains: Appchain[];
        private nep5s: nep5Asset[];
        private assetType: string;

        getLangs() {
            if (this.langType != this.app.langmgr.type) {
                let page_lang = [
                    "assets_title",
                    "assets_asset",
                    "assets_id",
                    "assets_type",
                    "assets_ava",
					"assets_pre",
					"assets_val",
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
            
            this.assetlist = $("#asset-page");
            //监听交易列表选择框
            $("#asset-TxType").change(() => {
                this.pageUtil.currentPage = 1;
                this.assetType = <string>$("#asset-TxType").val();
                if (this.assetType == "Assets") {
                    this.pageUtil = new PageUtil(this.appchains.length, 15);
                    this.pageUtil.currentPage = 1;
                    if (this.appchains.length > 15) {
                        this.updateAssets(this.pageUtil);
                        this.assetlist.find(".page").show();
                    } else {
                        this.loadAssetView(this.appchains);
                        let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                } else if (this.assetType == "Nep5") {
                    this.pageUtil = new PageUtil(this.nep5s.length, 15);
                    this.pageUtil.currentPage = 1;
                    if (this.nep5s.length > 15) {
                        this.updateNep5s(this.pageUtil);
                        this.assetlist.find(".page").show();
                    } else {
                        this.loadNep5View(this.nep5s);
                        let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                        $("#asset-page").find("#asset-page-msg").html(pageMsg);
                        this.assetlist.find(".page").hide();
                    }
                }
            });

            $("#asset-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    } else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });
            $("#asset-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    if (this.assetType == "Assets") {
                        this.updateAssets(this.pageUtil);
                    } else if (this.assetType == "Nep5") {
                        this.updateNep5s(this.pageUtil);
                    }
                }
            });

        }
        //更新asset表格
        public async updateAssets(pageUtil: PageUtil) {
            $("#asset-page").find("#asset-page-msg").html("");
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            let arrAsset = new Array();
            for (let i = minNum; i < maxNum;i++) {
                arrAsset.push(this.appchains[i]);
            }
            this.loadAssetView(arrAsset);

            let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#asset-page").find("#asset-page-msg").html(pageMsg);
        }

        //更新asset表格
        public async updateNep5s(pageUtil: PageUtil) {
            $("#asset-page").find("#asset-page-msg").html("");
            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum =  maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            } else {
                maxNum = pageUtil.totalCount;
            }
            let arrNep5s = new Array();
            for (let i = minNum; i < maxNum; i++) {
                arrNep5s.push(this.nep5s[i]);
            }
            this.loadNep5View(arrNep5s);

            let pageMsg = "Assets " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#asset-page").find("#asset-page-msg").html(pageMsg);
            if (this.pageUtil.totalPage - this.pageUtil.currentPage) {
                $("#asset-page-next").removeClass('disabled');
            } else {
                $("#asset-page-next").addClass('disabled');
            }
            if (this.pageUtil.currentPage - 1) {
                $("#asset-page-previous").removeClass('disabled');
            } else {
                $("#asset-page-previous").addClass('disabled');
            }
        }

        async start()
        {
            this.getLangs()
            
            $("#asset-TxType").val("Assets");
            this.assetType = <string>$("#asset-TxType").val();
            this.appchains = await WWW.api_getAllAppchains(); 
            this.pageUtil = new PageUtil(this.appchains.length, 15);
            if (this.appchains.length > 15) {
                this.updateAssets(this.pageUtil);
                this.assetlist.find(".page").show();
            } else {
                this.loadAssetView(this.appchains);
                let pageMsg = "Assets 1 to " + this.pageUtil.totalCount + " of " + this.pageUtil.totalCount;
                $("#asset-page").find("#asset-page-msg").html(pageMsg);
                this.assetlist.find(".page").hide();
            }

            this.nep5s = await WWW.getallnep5asset();

            this.div.hidden = false;
            this.footer.hidden = false;
        }
        
        /**
         * loadView 页面展现
         */
        public loadAssetView(appchains: Appchain[])
        {
            $( "#assets" ).empty();
            appchains.forEach((appchain: Appchain) => {
                let href = Url.href_asset(appchain.hash);
				let chainhash = appchain.hash.substring(2, 6) + '...' + appchain.hash.substring(appchain.hash.length - 4);
				let chainowner = appchain.owner.substring(2, 6) + '...' + appchain.owner.substring(appchain.owner.length - 4);

				let time = DateTool.getTime(appchain.timestamp);
                let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + appchain.name + `</a></td>
                    <td> <a href="`+ href + `" target="_self">` + chainhash + `</a></td>
                    <td>` + chainowner + `</td>
                    <td>` + time + `</td>
                    <td>` + appchain.version + `</td>
         

                    </tr>`;
                $("#assets").append(html);
            });
        }

        public loadNep5View(nep5s: nep5Asset[]) {
            $("#assets").empty();
            nep5s.forEach((nep5s: nep5Asset) => {
                let href = Url.href_nep5(nep5s.assetid);
                let assetId =  nep5s.assetid.substring(2, 6) + '...' + nep5s.assetid.substring(nep5s.assetid.length-4) ;
                let html = `
                    <tr>
                    <td> <a href="`+ href + `" target="_self">` + nep5s.name + `</a></td>
                    <td> <a href="`+ href + `" target="_self">` + assetId + `</a></td>
                    <td> Nep5 </td>
                    <td>` + nep5s.totalsupply + `</td>
                    <td>` + nep5s.decimals + `</td>
                    </tr>`;
                $("#assets").append(html);
            });
        }
    }
}