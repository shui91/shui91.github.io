/* app.js
 *
 * This is our RSS feed reader application. It uses the Google
 * Feed Reader API to grab RSS feeds as JSON object we can make
 * use of. It also uses the Handlebars templating library and
 * jQuery.
 */

// The names and URLs to all of the feeds we'd like available.
// allFeeds is an array of Objects containing urls and their names
var allFeeds = [
    {
        name: 'Udacity Blog',
        url: 'http://blog.udacity.com/feeds/posts/default?alt=rss'
    }, {
        name: 'CSS Tricks',
        url: 'http://css-tricks.com/feed'
    }, {
        name: 'HTML5 Rocks',
        url: 'http://feeds.feedburner.com/html5rocks'
    }, {
        name: 'Linear Digressions',
        url: 'http://feeds.feedburner.com/udacity-linear-digressions'
    }, {
        name: 'The Economist - Business and Finance',
        url: 'http://www.economist.com/sections/business-finance/rss.xml'
    }, {
        name: 'Tesla Financial Releases',
        url: 'http://apps.shareholder.com/rss/rss.aspx?channels=7196&companyid=ABEA-4CW8X0&sh_auth=465338416%2E0%2E0%2E42206%2E160f0627716b993d7ddad1b60ea8001f'
    }
];

//console.log(allFeeds);
//console.log('original length' + " " + allFeeds.length);


/* This function starts up our application. The Google Feed
 * Reader API is loaded asynchonously and will then call this
 * function when the API is loaded.
 */
function init() {
    // Load the first feed we've defined (index of 0).
    loadFeed(0);
}

/* This function performs everything necessary to load a
 * feed using the Google Feed Reader API. It will then
 * perform all of the DOM operations required to display
 * feed entries on the page. Feeds are referenced by their
 * index position within the allFeeds array.
 * This function all supports a callback as the second parameter
 * which will be called after everything has run successfully.
 */
function loadFeed(id, cb) {
    var feedUrl = allFeeds[id].url,
        feedName = allFeeds[id].name,
        feed = new google.feeds.Feed(feedUrl);
        // updates number of Entries shown on screen
        feed.setNumEntries(5);

    /* Load the feed using the Google Feed Reader API.
     * Once the feed has been loaded, the callback function
     * is executed.
     */
    feed.load(function(result) {
        if (!result.error) {
            /* If loading the feed did not result in an error,
             * get started making the DOM manipulations required
             * to display the feed entries on screen.
             */
            var container = $('.feed'),
                title = $('.header-title'),
                entries = result.feed.entries,
                entriesLen = entries.length,
                entryTemplate = Handlebars.compile($('.tpl-entry').html());

            title.html(feedName);   // Set the header text
            container.empty();      // Empty out all previous entries

            /* Loop through the entries we just loaded via the Google
             * Feed Reader API. We'll then parse that entry against the
             * entryTemplate (created above using Handlebars) and append
             * the resulting HTML to the list of entries on the page.
             */
            entries.forEach(function(entry) {
                container.append(entryTemplate(entry));
            });
        }

        if (cb) {
            cb();
        }
    });
}

function addFeed(name, url){
    allFeeds.push({name: name, url: url});
    //console.log('len after add is ' + allFeeds.length);
    //console.log(allFeeds); 
    //console.log(allFeeds[allFeeds.length -1]); //check if newName and newURL are logged
}

function removeFeed(id){
    allFeeds.splice(id, 1);
    //console.log(allFeeds);
    //console.log('len after remove is ' + allFeeds.length);
    //console.log(allFeeds[allFeeds.length -1]); //check if item is removed and is back to Tesla
}

/* Google API: Loads the Feed Reader API and defines what function
 * to call when the Feed Reader API is done loading.
 */
google.load('feeds', '1');
google.setOnLoadCallback(init);

/* All of this functionality is heavily reliant upon the DOM, so we
 * place our code in the $() function to ensure it doesn't execute
 * until the DOM is ready.
 */
$(function() {
    var container = $('.feed'),
        feedList = $('.feed-list'),
        feedItemTemplate = Handlebars.compile($('.tpl-feed-list-item').html()),
        feedId = 0,
        menuIcon = $('.menu-icon-link');

    /* Loop through all of our feeds, assigning an id property to
     * each of the feeds based upon its index within the array.
     * Then parse that feed against the feedItemTemplate (created
     * above using Handlebars) and append it to the list of all
     * available feeds within the menu.
     */
    allFeeds.forEach(function(feed) {
        feed.id = feedId;
        feedList.append(feedItemTemplate(feed));

        feedId++;
    });

    /* When a link in our feedList is clicked on, we want to hide
     * the menu, load the feed, and prevent the default action
     * (following the link) from occuring.
     */
    feedList.on('click', 'a', function() {
        var item = $(this);

        $('body').addClass('menu-hidden');
        loadFeed(item.data('id'));
        return false;
    });

    /* When the menu icon is clicked on, we need to toggle a class
     * on the body to perform the hiding/showing of our menu.
     */
    menuIcon.on('click', function() {
        $('body').toggleClass('menu-hidden');
    });
}());
