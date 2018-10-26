/// <reference types="jquery" />

namespace WebBrowser
{
    export class Blocks implements Page
    {
        app: App
        langType: string;
        constructor(app: App) {
            this.app = app
        }

        getLangs()
        {
            if (this.langType != this.app.langmgr.type) {
                let page_lang = [
                    "blocks_title", "blocks_height", "blocks_size", "blocks_time", "blocks_txcount"
                ]
                page_lang.forEach(
                    lang => {
                        document.getElementById(lang).textContent = this.app.langmgr.get(lang)
                    }
                )
                
                this.langType = this.app.langmgr.type
            }
            
        }
        
        pageUtil: PageUtil;
        div: HTMLDivElement = document.getElementById('blocks-page') as HTMLDivElement;
        footer: HTMLDivElement = document.getElementById('footer-box') as HTMLDivElement;
        async start()
        {
            this.getLangs()
            
            var count = await WWW.api_getHeight();
            this.pageUtil = new PageUtil(count, 15);
            await this.updateBlocks(this.pageUtil);
            this.div.hidden = false;
            this.footer.hidden = false;
            $("#blocks-page-next").off("click").click(() => {
                if (this.pageUtil.currentPage == this.pageUtil.totalPage) {
                    this.pageUtil.currentPage = this.pageUtil.totalPage;
                } else {
                    this.pageUtil.currentPage += 1;
                    this.updateBlocks(this.pageUtil);
                }
            });
            $("#blocks-page-previous").off("click").click(() => {
                if (this.pageUtil.currentPage <= 1) {
                    this.pageUtil.currentPage = 1;
                } else {
                    this.pageUtil.currentPage -= 1;
                    this.updateBlocks(this.pageUtil);
                }
            });
        }
        close(): void
        {
            this.div.hidden = true;
            this.footer.hidden = true;
        }
        public async updateBlocks(pageUtil: PageUtil) {
            let blocks: Block[] = await WWW.getblocks( pageUtil.pageSize, pageUtil.currentPage );
            $("#blocks-page").children("table").children("tbody").empty();
            if (pageUtil.totalPage - pageUtil.currentPage) {
                $("#blocks-page-next").removeClass('disabled');
            } else {
                $("#blocks-page-next").addClass('disabled');
            }
            if (pageUtil.currentPage - 1) {
                $("#blocks-page-previous").removeClass('disabled');
            } else {
                $("#blocks-page-previous").addClass('disabled');
            }

            let minNum = pageUtil.currentPage * pageUtil.pageSize - pageUtil.pageSize;
            let maxNum = pageUtil.totalCount;
            let diffNum = maxNum - minNum;
            if (diffNum > 15) {
                maxNum = pageUtil.currentPage * pageUtil.pageSize;
            }
            let pageMsg = "Blocks " + (minNum + 1) + " to " + maxNum + " of " + pageUtil.totalCount;
            $("#blocks-page-msg").html(pageMsg);
            
            //let newDate = new Date();
            blocks.forEach((item, index, input) => {
                //newDate.setTime(item.time * 1000);
                let time = DateTool.getTime(item.time);
                let txcounts = item.tx.length

                let html = `
                <tr>
                <td><a href="`+ Url.href_block(item.index) + `" target="_self">` + item.index + `</a></td>
                <td>` + item.size + ` bytes</td><td>` + time + `</td>
                <td>` + txcounts + `</td>
                </tr>`;
                $("#blocks-page").find("tbody").append(html);
            });
        }

    }
}