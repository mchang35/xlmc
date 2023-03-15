# xlmc
Website to document the love story of Mandy Chang and Xue Lor!

Ideas:
 - have a gallery for photos
 - use React.js for pages that show photos from trips
 - password protected
 - dynamic -- Xue can add photos and special dates too
 - have a page for special dates... maybe like a vertical timeline with some pictures? dates can also link to photos from trips
 - use Canva to come up with the visuals and how I want it to look

Pages
 - Login page -- this is password protected
 - Trips Together (has a list of all trips we've taken together -- when click on one, we go to Event/Trip page for that trip)
   - can choose to have it in images format, list format, or MAP format!
   - {embed a google map in website}(https://tribulant.com/blog/wordpress/easy-embedding-a-google-map-with-multiple-markers-to-your-site/)
 - Special Dates (vertical timeline with links to each Event/Trip page)
 - Individual Event/Trip Page -- has description and photo gallery for event/trip
 - Business Ideas -- a link to our Google Drive?
 - Photo gallery -- gallery of all photos that we have

Still need to do:
 - Make photo gallery page
    - when you click on an individual photo, you can see it larger (in a popup?) and go to the next/previous photo and see a caption for the photo
 - make individual event/trip page
 - sort the dates so that they always show up in order on the timeline -- implement MergeSort?
 - add interactivity for users to:
    - add photos to photo gallery
    - add events/dates to timeline
    - add locations to wishlist
    - add trips we've been on
    - NOT SURE IF THIS INTERACTIVITY IS POSSIBLE SINCE WE ARE UNABLE TO ACCESS THE FILE SYSTEM WITHOUT NODE.JS
 - titles font (from Google fonts): 
    - Bebas Neue
    - Titan One
    - Gloock
    - Ultra
    - Yeseva One -- CLOSEST ONE 
    - DM Serif Text

Questions and notes:
 - PHOTO GALLERY PAGE:
   - we want captions to show up when you click on a picture. But captions are only found in the trips.json file
   - one option is that we have two copies of each picture: one in the trips.json file and one in a photos.json file (which has all photos just in one long list)
   - another option is to not put the actual photo path and caption in the trips.json file, but instead put an index or pointer or something to the picture in the trips.json file.. this could work
      - in the trips.json file, put just the photo path -- so it's "primary photo": "primary photo path"
      - in the photos.json file, it is literally an object, where you have path: caption
   - this ^ way, we are able to access the caption at all times easily and efficiently

Helpful resources:
 - Asynchronous functions (fetch): https://dmitripavlutin.com/javascript-fetch-async-await/
 - Responsive Vertical timeline: https://codyhouse.co/gem/vertical-timeline/
 - Responsive Vertical timeline (W3Schools): https://www.w3schools.com/howto/howto_css_timeline.asp
 - Making any element sticky: https://www.w3schools.com/howto/howto_css_sticky_element.asp
 - Creating pop-up window (for photo gallery): https://www.w3schools.com/howto/howto_css_modals.asp
 
 