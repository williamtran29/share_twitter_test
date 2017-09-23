import ShareTwitter from '../index'
const longText = `Lorem ipsum dolor sit amet, consectetur adipisicing elit, \n
                   sed do eiusmod tempor incididunt ut labore et dolore magnat aliqua.`

describe("Twitter sharer", () => {

  const testURL = 'http://google.com',
        encodeTestURl = encodeURIComponent(testURL)

  it("must cut the included text to 120 characters", () => {
        const cutText = ShareTwitter.getText(longText, 120)
        expect(cutText.length).toEqual(120)
  })

  it("expect parseText function return encode string", () => {
    expect(ShareTwitter.parseText('Lorem ipsum dolor sit amet'))
    .toEqual("&text=%E2%80%9CLorem%20ipsum%20dolor%20sit%20amet%E2%80%9D")
  })

  it("expect getShareUrl function return string", () => {
    expect(ShareTwitter.getShareUrl(testURL, 'test')).toEqual(`https://twitter.com/intent/tweet?url=${encodeTestURl}&text=%E2%80%9Ctest%E2%80%9D`)
  })

  it("expect selection not exist", () => {
    window.getSelection = jest.fn()
    window.getSelection.mockReturnValue(false)
    expect(ShareTwitter.selectionExists())
    .toBe(false)
  })


  it("expect twitter button include SVG icon", () => {
    expect(ShareTwitter.tweetButton().innerHTML).toContain('svg')
  })

  it("expect when click on twitter button will return false", () => {
    window.focus = false;
    expect(ShareTwitter.tweetButton().onclick()).toBe(false)
  })

})
