/// <reference path="../app.ts"/>
namespace WebBrowser
{
    export class Notfound implements Page
    {
        app: App

        div: HTMLDivElement;
        footer: HTMLDivElement;
        btn: HTMLButtonElement;

        langType: string;

        getLangs() {
            if (this.langType != this.app.langmgr.type) {
                this.langType = this.app.langmgr.type
            }
        }

        constructor(app: App) {
            this.app = app
        }

        start(): void
        {
            this.getLangs()

            this.btn = document.getElementById( "notfound" ) as HTMLButtonElement;
            this.btn.onclick = () =>
            {
                window.location.href = locationtool.getUrl();
            }
            $( ".notfound" ).show();
        }
        close(): void
        {
            $( '.notfound' ).hide();
        }
    }
}