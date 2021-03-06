﻿namespace WebBrowser
{
    export class AssetInfo implements Page
    {
        app: App
        langType: string;
        constructor(app: App) {
            this.app = app
        }

        getLangs() {
            if (this.langType != this.app.langmgr.type) {
                let page_lang = [
                    "asset_title",
                    "asset_id",
                    "asset_asset",
                    "asset_type",
                    "asset_ava",
                    "asset_pre",
                    "asset_adm",
    
                    "asset_title2",
                    "asset_rank",
                    "asset_addr",
                    "asset_balance",
    
                    "asset_title3",
                    "asset_txid",
                    "asset_from",
                    "asset_to",
                    "asset_height",
                ]
                page_lang.forEach(
                    lang => {
                        document.getElementById(lang).textContent = this.app.langmgr.get(lang)
                    }
                )

                this.langType = this.app.langmgr.type
            }
            
        }
        
        div: HTMLDivElement = document.getElementById("asset-info") as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        name: HTMLSpanElement;
        type: HTMLSpanElement;
        id: HTMLSpanElement;
        available: HTMLSpanElement;
        precision: HTMLSpanElement;
        admin: HTMLSpanElement;
        rankPageUtil: PageUtil;
        async start()
        {
            this.getLangs()
            
            var assetid = locationtool.getParam();
            let href = locationtool.getUrl() + "/assets";
            let html = '<a href="' + href + '" target="_self">&lt&lt&lt'+this.app.langmgr.get('asset_goallasset')+'</a>';

            $("#goallasset").empty();
            $("#goallasset").append(html);

			this.loadAssetInfoView(assetid);
			
		

            var assetType = locationtool.getType();
            if (assetType == 'nep5') {
                //$(".asset-nep5-warp").show();
                $(".asset-tran-warp").show();
            } else {
                //$(".asset-nep5-warp").hide();
                $(".asset-tran-warp").hide();
            }
            //资产排行
            var rankcount = await WWW.api_getrankbyassetcount(assetid);
            this.rankPageUtil = new PageUtil(rankcount[0].count, 10);
            this.updateAssetBalanceView(assetid, this.rankPageUtil);
            //排行翻页
            $("#assets-balance-next").off("click").click(() => {
                if (this.rankPageUtil.currentPage == this.rankPageUtil.totalPage) {
                    this.rankPageUtil.currentPage = this.rankPageUtil.totalPage;
                } else {
                    this.rankPageUtil.currentPage += 1;
                    this.updateAssetBalanceView(assetid, this.rankPageUtil);
                }
            });
            $("#assets-balance-previous").off("click").click(() => {
                if (this.rankPageUtil.currentPage <= 1) {
                    this.rankPageUtil.currentPage = 1;
                } else {
                    this.rankPageUtil.currentPage -= 1;
                    this.updateAssetBalanceView(assetid, this.rankPageUtil);
                }
            });

            this.div.hidden = false;
            this.footer.hidden = false;
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        loadAssetInfoView(assetid: string)
        {            
            //this.div.innerHTML = pages.asset;
            WWW.api_getasset(assetid).then((data) =>
            {
                var asset = data[0];
                
                asset.names = CoinTool.assetID2name[asset.id];
                $("#name").text(asset.names);
                $("#asset-info-type").text(asset.type);
                $("#id").text(asset.id);
                $("#available").text(asset.available);
                $("#precision").text(asset.precision);
                $("#admin").text(asset.admin);                
            })
        }
        async updateAssetBalanceView(assetid: string, pageUtil: PageUtil) {
            let balanceList = await WWW.getrankbyasset(assetid, pageUtil.pageSize, pageUtil.currentPage);
            $("#assets-balance-list").empty();

            if (balanceList) {
                let rank = (pageUtil.currentPage - 1) * 10 + 1;
                balanceList.forEach((item) => {
                    let href = Url.href_address(item.addr);
                    this.loadAssetBalanceView(rank, href, item.addr, item.balance);
                    rank++;
                });
            }
            else {
                let html = '<tr><td colspan="3" >'+this.app.langmgr.get('no_data')+'</td></tr>';
                
                $("#assets-balance-list").append(html);
                if (pageUtil.currentPage == 1) {
                    $(".asset-balance-page").hide();
                } else {
                    $("#assets-balance-next").addClass('disabled');
                    $(".asset-balance-page").show();
                }
            }
            if (pageUtil.totalCount > 10) {
                if (pageUtil.totalPage - pageUtil.currentPage) {
                    $("#assets-balance-next").removeClass('disabled');
                } else {
                    $("#assets-balance-next").addClass('disabled');
                }
                if (pageUtil.currentPage - 1) {
                    $("#assets-balance-previous").removeClass('disabled');
                } else {
                    $("#assets-balance-previous").addClass('disabled');
                }
                let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
                let maxNum = pageUtil.totalCount;
                let diffNum = maxNum - minNum;
                if (diffNum > 10) {
                    maxNum = pageUtil.currentPage * pageUtil.pageSize;
                }
                let pageMsg = "Banlance Rank " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
                $("#assets-balance-msg").html(pageMsg);
                $(".asset-balance-page").show();
            }
            else {
                $(".asset-balance-page").hide();
            }
        }
        loadAssetBalanceView(rank: number, href: string, address: string, balance: number) {
            let html = `
                    <tr>
                    <td>` + rank + `
                    </td>
                    <td><a target="_self" href="`+ href + `">` + address + `
                    </a></td>
                    <td>` + balance + `</td>
                    </tr>`
            $("#assets-balance-list").append(html);
        }
    }
}