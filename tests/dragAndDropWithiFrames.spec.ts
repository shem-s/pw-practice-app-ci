// import {test, expect} from "@playwright/test";
import {expect} from "@playwright/test";
// NOTE:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
// Now using the globals test obj that was modified and setup
// :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
import {test} from '../test-options'

test("drag and drop with iFrames", async ({page, globalsQaURL}) => {
    await page.goto(globalsQaURL)

    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')
    await frame.locator('li',{hasText:'High Tatras 2'}).dragTo(frame.locator('#trash'))

    // More Precice control
    await frame.locator('li', {hasText:'High Tatras 4'}).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

//     const trashList = await frame.locator('#trash li').all()
// const trashedItems = ['High Tatras 2', 'High Tatras 4']

//     for(const trashItem of trashList){
//         const text = await trashItem.locator('h5').textContent()
//         expect(trashedItems).toContain(text)
//     }
    // OR
    await expect(frame.locator('#trash li h5')).toHaveText(['High Tatras 2','High Tatras 4'])
})