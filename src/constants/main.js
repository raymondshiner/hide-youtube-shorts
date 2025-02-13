// Some temporary work around to prevent the subscriptions page from being completely empty at times
let wasVisitedFirst = false;
let movedAway = false;
function checkContents() {
    if (location.href === 'https://www.youtube.com/feed/subscriptions') {
        if (document.readyState === 'complete') {
            wasVisitedFirst = true;
            setTimeout(() => {
                const contents = document.querySelector('#contents');
                const computedStyles = getComputedStyle(contents);
                if (computedStyles.width === '90%') {
                    if (wasVisitedFirst && movedAway) {
                        location.reload();
                    } else {
                        setTimeout(checkContents, 1000);
                    }
                } else {
                    setTimeout(checkContents, 1000);
                }
            }, 1000);
        } else {
            setTimeout(checkContents, 1000);
        }
    } else {
        if (wasVisitedFirst && location.href !== 'https://www.youtube.com/') movedAway = true;
        setTimeout(checkContents, 1000);
    }
}

checkContents();

function checkStates() {
    // If the extension is unloaded or updated, reload the page to terminate orphaned scripts
    if (!chrome.runtime.id) return location.reload();
    // Get extension toggle states from chrome storage
    return chrome.storage.sync.get([
        'toggleState',
        'toggleNavState',
        'toggleHomeFeedState',
        'toggleHomeFeedStateLives',
        'toggleHomeFeedStatePremieres',
        'toggleSubscriptionFeedState',
        'toggleSubscriptionFeedStateLives',
        'toggleSubscriptionFeedStatePremieres',
        'toggleTrendingFeedState',
        'toggleSearchState',
        'toggleRecommendedState',
        'toggleTabState',
        'toggleHomeTabState',
        'toggleTurboState',
        'toggleRegularState',
        'toggleNotificationState',
    ]);
}

async function hideShorts() {
    // If the extension is unloaded or updated, return
    if (!chrome.runtime.id) return;
    // Get extension toggle states
    const states = await checkStates();
    // If the main state is off, return
    if (!states.toggleState) return;
    // Check if using mobile site
    const isMobile = location.href.includes('https://m.youtube.com/');
    if (states.toggleNavState) hideShortsNavButton(isMobile);
    if (states.toggleHomeFeedState) hideShortsShelfHome(isMobile), hideShortsVideosHomeFeed(isMobile);
    if (states.toggleHomeFeedStateLives) hideLiveVideosHomeFeed(isMobile);
    if (states.toggleHomeFeedStatePremieres) hidePremiereVideosHomeFeed(isMobile);
    if (states.toggleSubscriptionFeedState) hideShortsShelfSubscriptions(isMobile), hideShortsVideosSubscriptionFeed(isMobile);
    if (states.toggleSubscriptionFeedStateLives) hideLiveVideosSubscriptionFeed(isMobile);
    if (states.toggleSubscriptionFeedStatePremieres) hidePremiereVideosSubscriptionFeed(isMobile);
    if (states.toggleTrendingFeedState) hideShortsVideosTrendingFeed(isMobile);
    if (states.toggleSearchState) hideShortsVideosSearchResults(isMobile);
    if (states.toggleRecommendedState) hideShortsVideosRecommendedList(isMobile);
    if (states.toggleTabState) hideShortsTabOnChannel(isMobile);
    if (states.toggleHomeTabState) hideShortsHomeTab(isMobile);
    if (states.toggleRegularState) playAsRegularVideo(isMobile);
    if (states.toggleNotificationState) hideShortsNotificationMenu(isMobile);
}

let navButtonHiddenCount = 0;
let shortsShelfHiddenCount = 0;
let homeFeedShortHiddenCount = 0;
let subFeedShortHiddenCount = 0;
let trendFeedShortHiddenCount = 0;
let searchShortsHiddenCount = 0;
let recommendedShortsHiddenCount = 0;
let channelTabHiddenCount = 0;
let channelShortsHiddenCount = 0;
let shortsPlayedAsRegularCount = 0;

// Hide the shorts button in the navigation menu
function hideShortsNavButton(isMobile) {
    if (!isMobile) {
        const selector = document.querySelector('#endpoint[title="Shorts"]');
        if (selector) {
            const elements = document.querySelectorAll('#endpoint[title="Shorts"]');
            elements.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.removeChild(parent);
                navButtonHiddenCount++;
            });
            // Update stats
            updateStats('navButton', navButtonHiddenCount);
            navButtonHiddenCount = 0;
            return;
        } else {
            // The element has not been found, wait and try again
            setTimeout(function () {
                hideShortsNavButton(isMobile);
            }, 1000);
        }
    } else {
        const elements = document.querySelectorAll('.pivot-shorts');
        elements.forEach(element => {
            const parent = element.parentNode;
            parent.style.display = 'none';
        });
    }
}

// Hide the shorts shelf in home and gaming feeds
function hideShortsShelfHome(isMobile) {
    if (!isMobile) {
        if (location.href === 'https://www.youtube.com/') {
            const elementsHomePage = document.querySelectorAll('.style-scope ytd-rich-shelf-renderer');
            elementsHomePage.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.removeChild(parent);
                shortsShelfHiddenCount++;
            });
            const elementsExplorePages = document.querySelectorAll('.style-scope ytd-reel-shelf-renderer');
            elementsExplorePages.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.removeChild(parent);
                shortsShelfHiddenCount++;
            });
            // Update stats
            updateStats('shortsShelf', shortsShelfHiddenCount);
            shortsShelfHiddenCount = 0;
        }
    } else {
        if (location.href === 'https://m.youtube.com/') {
            const elements = document.querySelectorAll('.reel-shelf-items');
            elements.forEach(element => {
                const parent = element.parentNode.parentNode.parentNode;
                parent.style.display = 'none';
            });
        }
    }
}

// Hide the shorts shelf in home and gaming feeds
function hideShortsShelfSubscriptions(isMobile) {
    if (!isMobile) {
        if (location.href === 'https://www.youtube.com/feed/subscriptions') {
            const elementsHomePage = document.querySelectorAll('.style-scope ytd-rich-shelf-renderer');
            elementsHomePage.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.removeChild(parent);
                shortsShelfHiddenCount++;
            });
            const elementsExplorePages = document.querySelectorAll('.style-scope ytd-reel-shelf-renderer');
            elementsExplorePages.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.removeChild(parent);
                shortsShelfHiddenCount++;
            });
            updateStats('shortsShelf', shortsShelfHiddenCount);
            shortsShelfHiddenCount = 0;
        }
    } else {
        if (location.href === 'https://m.youtube.com/') {
            const elements = document.querySelectorAll('.reel-shelf-items');
            elements.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.parentNode.style.display = 'none';
            });
        }
    }
}

// Hide shorts video elements in the home feed
function hideShortsVideosHomeFeed(isMobile) {
    if (!isMobile) {
        if (location.href === 'https://www.youtube.com/') {
            const elements = document.querySelectorAll('[href^="/shorts/"]');
            elements.forEach(element => {
                // Ignore shorts in the notification menu
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode;
                const grandParent = parent.parentNode.parentNode;
                if (parent.hasAttribute('rich-grid-thumbnail') && grandParent.style.display !== 'none') homeFeedShortHiddenCount++
                if (parent.hasAttribute('rich-grid-thumbnail')) grandParent.style.display = 'none';
            });
            // Update stats
            updateStats('homeFeedShorts', homeFeedShortHiddenCount);
            homeFeedShortHiddenCount = 0;
        }
    } else {
        if (location.href === 'https://m.youtube.com/') {
            const elements = document.querySelectorAll('[href^="/shorts/"]');
            elements.forEach(element => {
                // Ignore shorts in the notification menu
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode.parentNode.parentNode;
                parent.style.display = 'none';
            });
        }
    }
}

// Hide live video elements in the home feed
function hideLiveVideosHomeFeed(isMobile) {
    if (!isMobile) {
        if (location.href === 'https://www.youtube.com/') {
            const elements = document.querySelectorAll('ytd-badge-supported-renderer');
            elements.forEach(element => {
                if (element.innerText.replace(/\s/g, '').replace(/\n/g, '') === 'LIVE') {
                    const grandParent = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (grandParent.classList.contains('ytd-rich-grid-row') || grandParent.classList.contains('ytd-rich-item-renderer')) {
                        grandParent.style.display = 'none';
                    }
                }
            });
        }
    }
}

// Hide premiere video elements in the home feed
function hidePremiereVideosHomeFeed(isMobile) {
    if (!isMobile) {
        if (location.href === 'https://www.youtube.com/') {
            const elements = document.querySelectorAll('ytd-badge-supported-renderer');
            elements.forEach(element => {
                if (element.innerText.replace(/\s/g, '').replace(/\n/g, '') === 'PREMIERE') {
                    const grandParent = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (grandParent.classList.contains('ytd-rich-grid-row') || grandParent.classList.contains('ytd-rich-item-renderer')) {
                        grandParent.style.display = 'none';
                    }
                }
            });
        }
    }
}

// Hide shorts video elements in the subscription feed
function hideShortsVideosSubscriptionFeed(isMobile) {
    if (!isMobile) {
        if (location.href.includes('youtube.com/feed/subscriptions')) {
            const elements = document.querySelectorAll('[href^="/shorts/"]');
            elements.forEach(element => {
                // Ignore shorts in the notification menu
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode.parentNode.parentNode;
                const grandParentGrid = parent.parentNode.parentNode;
                const grandParentList = parent.parentNode.parentNode.parentNode.parentNode.parentNode;

                // Start New UI
                if (grandParentGrid.style.display !== 'none') subFeedShortHiddenCount++;
                if (grandParentGrid.classList.contains('ytd-rich-grid-row') || grandParentGrid.classList.contains('ytd-rich-item-renderer')) {
                    if (grandParentGrid.style.display !== "none") {
                        grandParentGrid.style.display = "none";
                    }
                }
                if (grandParentGrid.classList.contains('ytd-rich-grid-row') || grandParentGrid.classList.contains('ytd-rich-item-renderer')) return;
                // End New UI

                // When the subscription feed is being viewed in gride view
                if (grandParentGrid.nodeName === 'YTD-GRID-VIDEO-RENDERER' || grandParentGrid.classList.contains('ytd-shelf-renderer')) {
                    if (parent.style.display !== 'none') subFeedShortHiddenCount++;
                    parent.style.display = 'none';
                }
                // When the subscription feed is being viewed in list view
                if (grandParentList.nodeName === 'YTD-EXPANDED-SHELF-CONTENTS-RENDERER') {
                    if (parent.style.display !== 'none') subFeedShortHiddenCount++;
                    grandParentList.parentNode.parentNode.style.display = 'none';

                }
            });
            // Update stats
            updateStats('subFeedShorts', subFeedShortHiddenCount);
            subFeedShortHiddenCount = 0;
        }
    } else {
        if (location.href.includes('youtube.com/feed/subscriptions')) {
            const elements = document.querySelectorAll('[href^="/shorts/"]');
            elements.forEach(element => {
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode.parentNode.parentNode;
                parent.style.display = 'none';
            });
        }
    }
}

// Hide live video elements in the subscriptions feed
function hideLiveVideosSubscriptionFeed(isMobile) {
    if (!isMobile) {
        if (location.href.includes('youtube.com/feed/subscriptions')) {
            const elements = document.querySelectorAll('ytd-badge-supported-renderer');
            elements.forEach(element => {
                if (element.innerText.replace(/\s/g, '').replace(/\n/g, '') === 'LIVE') {
                    const grandParentGrid = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    const grandParentList = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (grandParentGrid.classList.contains('ytd-rich-grid-row') || grandParentGrid.classList.contains('ytd-rich-item-renderer')) {
                        grandParentGrid.style.display = 'none';
                    }
                    if (grandParentList.classList.contains('ytd-shelf-renderer')) {
                        grandParentList.style.display = 'none';
                    }
                }
            });
        }
    }
}

// Hide premiere video elements in the subscriptions feed
function hidePremiereVideosSubscriptionFeed(isMobile) {
    if (!isMobile) {
        if (location.href.includes('youtube.com/feed/subscriptions')) {
            const elements = document.querySelectorAll('ytd-badge-supported-renderer');
            elements.forEach(element => {
                if (element.innerText.replace(/\s/g, '').replace(/\n/g, '') === 'PREMIERE') {
                    const grandParentGrid = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    const grandParentList = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                    if (grandParentGrid.classList.contains('ytd-rich-grid-row') || grandParentGrid.classList.contains('ytd-rich-item-renderer')) {
                        grandParentGrid.style.display = 'none';
                    }
                    if (grandParentList.classList.contains('ytd-shelf-renderer')) {
                        grandParentList.style.display = 'none';
                    }
                }
            });
        }
    }
}

// Hide shorts videos elements and shorts shelf elements on the trending feed
function hideShortsVideosTrendingFeed(isMobile) {
    if (!isMobile) {
        if (location.href.includes('youtube.com/feed/trending') || location.href.includes('youtube.com/gaming')) {
            const elementsGroupOne = document.querySelectorAll('[href^="/shorts/"]');
            elementsGroupOne.forEach(element => {
                // Ignore shorts in the notification menu
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode.parentNode.parentNode;
                if (parent.style.display !== 'none') trendFeedShortHiddenCount++;
                parent.style.display = 'none';
            });
            const elementsGroupTwo = document.querySelectorAll('.style-scope ytd-reel-shelf-renderer');
            elementsGroupTwo.forEach(element => {
                const parent = element.parentNode;
                parent.parentNode.removeChild(parent);
                trendFeedShortHiddenCount++
            });
            // Update Stats
            updateStats('trendFeedShorts', trendFeedShortHiddenCount);
            trendFeedShortHiddenCount = 0;
        }
    } else {
        if (location.href.includes('youtube.com/feed/explore') || location.href.includes('youtube.com/gaming')) {
            const elementsGroupOne = document.querySelectorAll('[href^="/shorts/"]');
            elementsGroupOne.forEach(element => {
                const parent = element.parentNode.parentNode.parentNode;
                parent.style.display = 'none';
            });
            const elementsGroupTwo = document.querySelectorAll('.reel-shelf-items');
            elementsGroupTwo.forEach(element => {
                const parent = element.parentNode.parentNode.parentNode;
                parent.style.display = 'none';
            });
        }
    }
}

// Hide shorts video elements in search results
function hideShortsVideosSearchResults(isMobile) {
    if (!isMobile) {
        const searchResultsElement = document.querySelector('.style-scope ytd-two-column-search-results-renderer');
        if (!searchResultsElement) return;
        const elementsGroupOne = document.querySelectorAll('.style-scope yt-horizontal-list-renderer');
        elementsGroupOne.forEach(element => {
            const parent = element.parentNode.parentNode;
            if (parent.style.display !== 'none') searchShortsHiddenCount++;
            parent.style.display = 'none';
        });
        const elementsGroupTwo = document.querySelectorAll('[href^="/shorts/"]');
        elementsGroupTwo.forEach(element => {
            // Ignore shorts in the notification menu
            if (element.classList.contains('ytd-notification-renderer')) return;
            const parent = element.parentNode.parentNode.parentNode;
            if (parent.style.display !== 'none') searchShortsHiddenCount++;
            parent.style.display = 'none';
        });
        // Update Stats
        updateStats('searchResultShorts', searchShortsHiddenCount);
        searchShortsHiddenCount = 0;
    } else {
        const searchResultsElement = document.querySelector('ytm-search');
        if (!searchResultsElement) return;
        const elementsGroupOne = document.querySelectorAll('.reel-shelf-items');
        elementsGroupOne.forEach(element => {
            const parent = element.parentNode;
            parent.style.display = 'none';
        });
        const elementsGroupTwo = document.querySelectorAll('[aria-label="Shorts"]');
        elementsGroupTwo.forEach(element => {
            // Ignore shorts in the notification menu
            if (element.classList.contains('ytd-notification-renderer')) return;
            const parent = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            parent.style.display = 'none';
        });
    }
}

// Hide shorts video elements in the recommended list
function hideShortsVideosRecommendedList(isMobile) {
    if (!isMobile) {
        if (location.href.includes('youtube.com/watch')) {
            const elements = document.querySelectorAll('[href^="/shorts/"]');
            elements.forEach(element => {
                // Ignore shorts in the notification menu
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode.parentNode;
                if (parent.style.display !== 'none') recommendedShortsHiddenCount++;
                parent.style.display = 'none';
            });
            // Update stats
            updateStats('recommendedShorts', recommendedShortsHiddenCount);
            recommendedShortsHiddenCount = 0;
        }
    } else {
        if (location.href.includes('youtube.com/watch')) {
            const elements = document.querySelectorAll('[href^="/shorts/"]');
            elements.forEach(element => {
                // Ignore shorts in the notification menu
                if (element.classList.contains('ytd-notification-renderer')) return;
                const parent = element.parentNode.parentNode;
                parent.style.display = 'none';
            });
        }
    }
}

// Hide the shorts tab on the channel page tab menu
function hideShortsTabOnChannel(isMobile) {
    if (!isMobile) {
        const elements = document.querySelectorAll('.tab-content');
        const filteredElements = Array.from(elements).filter(element => element.textContent.replace(/\s/g, '').replace(/\n/g, '') === 'Shorts');
        filteredElements.forEach(element => {
            const parent = element.parentNode;
            parent.parentNode.removeChild(parent);
            channelTabHiddenCount++
        });
        // Update stats
        updateStats('channelTabs', channelTabHiddenCount);
        channelTabHiddenCount = 0;
    } else {
        const elements = document.querySelectorAll('.scbrr-tab.center');
        const filteredElements = Array.from(elements).filter(element => element.innerText.toLowerCase() === 'shorts');
        filteredElements.forEach(element => {
            const parent = element.parentNode;
            parent.removeChild(element);
        });
    }
}

// Hide shorts video elements in the notification menu
function hideShortsNotificationMenu(isMobile) {
    if (!isMobile) {
        const elements = document.querySelectorAll('[href^="/shorts/"]');
        elements.forEach(element => {
            // Ignore shorts in the notification menu
            if (element.classList.contains('ytd-notification-renderer')) {
                const parent = element.parentNode;
                parent.style.display = 'none';
            }
        });
    }
}

// Hide shorts video elements in the home tab on channel pages
function hideShortsHomeTab(isMobile) {
    if (!isMobile) {
        if (location.href.includes('/channel/') || location.href.includes('@') || location.href.includes('/user/') || location.href.includes('/c/')) {
            const el = document.querySelectorAll('.ytd-c4-tabbed-header-renderer')
            el.forEach(elem => {
                // Don't show shorts when the 'shorts' tab is selected
                if (elem.getAttribute('role') === 'tab' && elem.getAttribute('aria-selected') === 'true' && elem.innerText.toLowerCase() !== 'shorts') {
                    const elements = document.querySelectorAll('[href^="/shorts/"]');
                    elements.forEach(element => {
                        // Ignore shorts in the notification menu
                        if (element.classList.contains('ytd-notification-renderer')) return;
                        const parent = element.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                        if (parent.style.display !== 'none') channelShortsHiddenCount++
                        parent.style.display = 'none';
                    });
                    // Update stats
                    updateStats('channelShorts', channelShortsHiddenCount);
                    channelShortsHiddenCount = 0;
                }
            });
        }
    } else {
        if (location.href.includes('/channel/') || location.href.includes('@') || location.href.includes('/user/') || location.href.includes('/c/')) {
            const elements = document.querySelectorAll('.reel-shelf-items');
            elements.forEach(element => {
                const parent = element.parentNode.parentNode.parentNode;
                parent.style.display = 'none';
            });
            const el = document.querySelectorAll('.scbrr-tab.center')
            el.forEach(elem => {
                // Don't show shorts when the 'shorts' tab is selected
                if (elem.getAttribute('role') === 'tab' && elem.getAttribute('aria-selected') === 'true' && elem.innerText.toLowerCase() !== 'shorts') {
                    const elements = document.querySelectorAll('[href^="/shorts/"]');
                    elements.forEach(element => {
                        // Ignore shorts in the notification menu
                        if (element.classList.contains('ytd-notification-renderer')) return;
                        const parent = element.parentNode;
                        parent.style.display = 'none';
                    });
                }
            });
        }
    }
}

// Play shorts videos on a regular video page
function playAsRegularVideo() {
    function getVideoId(url) {
        const regex = /\/shorts\/([^/]+)/;
        const match = url.match(regex);
        if (match) {
            return match[1];
        }
        return null;
    }
    // Automatically redirect shorts video pages to a regular video watch page
    if (getVideoId(location.href)) {
        location.href = `https://youtube.com/watch?v=${getVideoId(location.href)}`;
        shortsPlayedAsRegularCount++
        // Update stats
        updateStats('playedAsRegular', shortsPlayedAsRegularCount);
        shortsPlayedAsRegularCount = 0;
    }
}

// Update element hidden counts for stats page
async function updateStats(statName, statNewCount) {
    const storageObject = await chrome.storage.sync.get([statName]);
    const currentCount = storageObject[statName] ? storageObject[statName] : 0;
    const newCount = statNewCount / 2;
    const updatedCount = Math.ceil(currentCount + newCount);
    chrome.storage.sync.set({ [statName]: updatedCount });
}

let observer;
let int;
async function waitForElementToDisplay(toggleStateUpdate) {
    // Check if turbo is enabled - turbo mode runs a more resource hungry version
    const states = await checkStates();
    if (!states.toggleState) return;
    const parentElement = document.body;
    if (parentElement != null) {
        // If a toggle state is updated, run function immediately
        if (toggleStateUpdate) hideShorts(true);
        // Run functions once initially - this helps with the delay in the observer
        setTimeout(() => {
            hideShorts(true);
        }, 1500);
        // If turbo state is on, use more agressive method
        if (states.toggleTurboState) {
            int = setInterval(() => {
                hideShorts();
            }, 500);
        } else {
            // Create new mutation observer
            observer = new MutationObserver(throttle(async function (mutations, observer) {
                // Delay to allow pages to finish loading when navigating on site
                setTimeout(() => {
                    hideShorts();
                }, 1500);
            }, 3000));
            observer.observe(parentElement, { childList: true, subtree: true });
            // Limit how many times the observer will run the hideShorts function per mutation
            function throttle(func, limit) {
                let lastFunc;
                let lastRan;
                return function () {
                    const context = this;
                    const args = arguments;
                    if (!lastRan) {
                        func.apply(context, args);
                        lastRan = Date.now();
                    } else {
                        clearTimeout(lastFunc);
                        lastFunc = setTimeout(function () {
                            if ((Date.now() - lastRan) >= limit) {
                                func.apply(context, args);
                                lastRan = Date.now();
                            }
                        }, limit - (Date.now() - lastRan));
                    }
                }
            }
        }
        return;
    } else {
        // The parent element has not been found, wait and try again
        setTimeout(function () {
            waitForElementToDisplay();
        }, 1000);
    }
}

window.addEventListener("load", async function () {
    waitForElementToDisplay();
});

chrome.runtime.onMessage.addListener(async function (message, sender, sendResponse) {
    if (message.checkStates) {
        if (observer) observer.disconnect();
        clearInterval(int);
        waitForElementToDisplay(true);
    }
});