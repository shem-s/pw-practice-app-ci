import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase{
   
    readonly formsLayoutMenuItem: Locator
    readonly datepickerMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrPageMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page){
        super(page) 

        this.formsLayoutMenuItem = this.page.getByText("Form Layouts")
        this.datepickerMenuItem = this.page.getByText('Datepicker')
        this.smartTableMenuItem = this.page.getByText("Smart Table")
        this.toastrPageMenuItem = this.page.getByText("Toastr")
        this.tooltipMenuItem = this.page.getByText("Tooltip")
    }

    async formLayoutsPage(){
        await this.selectGroupMenuItem("Forms")
        await this.formsLayoutMenuItem.click()
        await this.waitForNumberOfSeconds(2)
    }

    async datepickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.datepickerMenuItem.click()
    }

    async smartTable(){
        await this.selectGroupMenuItem("Tables & Data")
        await this.smartTableMenuItem.click()
    }

    async toastrPage(){
        await this.selectGroupMenuItem("Modal & Overlays")
        await this.toastrPageMenuItem.click()
    }

    async tooltipPage(){
        await this.selectGroupMenuItem("Modal & Overlays")
        await this.tooltipMenuItem.click()
    }

    private async selectGroupMenuItem(groupItemTitle: string){
        // If the menu item is already selected then reselecting
        // it may colapse the item in the menu hence removing the further 
        // navigation that you intend to carry out. 
        // To solve this you can write a smart function that will check 
        // this state then perform the click on that element if needed
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState === 'false')
        {
            await groupMenuItem.click()
        }
    }
}