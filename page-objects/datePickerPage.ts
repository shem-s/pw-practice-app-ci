import { expect, Page } from "@playwright/test"
import { HelperBase } from "./helperBase"


export class DatepickerPage extends HelperBase{

    constructor(page:Page){
        super( page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday:number, endDayFromToday:number){
        // const datePickerWithRange = this.page.locator('nb-card',{hasText:'Datepicker With Range'}).getByPlaceholder('Range Picker')
        // OR
        const datePickerWithRange = this.page.getByPlaceholder('Range Picker')
        await datePickerWithRange.click()

        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)

        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`
        await expect(datePickerWithRange).toHaveValue(dateToAssert)
    }
    
    private async selectDateInTheCalendar(numberOfDaysFromToday: number){
        const date = new Date()
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', {month:'short'})
        const expectedMonth = date.toLocaleString('En-US', {month:'long'})
        // const expectedMonth = date.getMonth().toString()
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

        // let currentMonth = await this.page.locator('nb-calendar-view-mode').textContent()
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = ` ${expectedMonth} ${expectedYear} `
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)){
            await this.page.locator('nb-calendar-pageable-navigation .next-month').click()
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }


    // Note: getByText does not match exact but more so uses containts that text and does a partial match
    // so in the below example if you "getByText('1')" then it will get ['1','10','11','12', ...etc]
    // to specify an exact match use the below
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact:true}).click()
        // NOTE: when using multiple classes to find one element place a "." infront of each class with no space
        //       when a space is placed between the classed, playwright will look for another child element with that class name 
        return dateToAssert
    }
}